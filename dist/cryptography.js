"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.symmetricEncrypt = symmetricEncrypt;
exports.rsaEncrypt = rsaEncrypt;
exports.symmertricDecrypt = symmertricDecrypt;
exports.rsaDecrypt = rsaDecrypt;
exports.hash = hash;
exports.hmacHash = hmacHash;
exports.hashPassword = hashPassword;
exports.genKeyPair = genKeyPair;
exports.signMessage = signMessage;
exports.verifyMessage = verifyMessage;
const crypto_1 = __importDefault(require("crypto"));
// Symmetric encryption
function symmetricEncrypt(message, myKey = null) {
    const key = myKey || crypto_1.default.randomBytes(32);
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv('aes-256-gcm', key, iv);
    const encryptedMessage = cipher.update(message, 'utf-8', 'hex') + cipher.final('hex');
    const tag = cipher.getAuthTag();
    return {
        encryptedMessage,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        key: key.toString('hex')
    };
}
// Asymmetric encryption
function rsaEncrypt(publicKey, data) {
    return crypto_1.default.publicEncrypt(publicKey, Buffer.from(data));
}
// Symmetric decryption
function symmertricDecrypt(encryptedMessage, iv, tag, key) {
    const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    const decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf-8') + decipher.final('utf-8');
    return decryptedMessage;
}
// Asymmetric decryption
function rsaDecrypt(privateKey, encryptedData) {
    return crypto_1.default.privateDecrypt(privateKey, encryptedData).toString('utf-8');
}
// General purpose hasing
function hash(valueToHash) {
    return crypto_1.default.createHash('sha512').update(valueToHash).digest('hex');
}
function hmacHash(key, valueToHash) {
    return crypto_1.default.createHmac('sha512', key).update(valueToHash).digest('hex');
}
// For secure password hashing
function hashPassword(password, salt) {
    const hashedPassword = crypto_1.default.scryptSync(password, salt, 64);
    return hashedPassword;
}
function genKeyPair() {
    const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            // cipher: 'aes-256-cbc',
            // passphrase: passphrase 
        }
    });
    return { publicKey, privateKey };
}
function signMessage(privateKey, message) {
    const signer = crypto_1.default.createSign('rsa-sha256');
    signer.update(message);
    const signature = signer.sign(privateKey, 'hex');
    return { message, signature };
}
function verifyMessage(publicKey, message, signature) {
    const verifier = crypto_1.default.createVerify('rsa-sha256');
    verifier.update(message);
    const isVerified = verifier.verify(publicKey, signature, 'hex');
    return { message, isVerified };
}
