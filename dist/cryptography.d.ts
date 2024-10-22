import crypto from 'crypto';
export declare function symmetricEncrypt(message: string, myKey?: null): {
    encryptedMessage: string;
    iv: string;
    tag: string;
    key: string;
};
export declare function rsaEncrypt(publicKey: crypto.RsaPrivateKey | crypto.KeyLike | crypto.RsaPublicKey, data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>): Buffer;
export declare function symmertricDecrypt(encryptedMessage: any, iv: any, tag: any, key: any): string;
export declare function rsaDecrypt(privateKey: crypto.RsaPrivateKey | crypto.KeyLike, encryptedData: NodeJS.ArrayBufferView): string;
export declare function hash(valueToHash: string): string;
export declare function hmacHash(key: any, valueToHash: string): string;
export declare function hashPassword(password: string, salt: any): Buffer;
export declare function genKeyPair(): {
    publicKey: string;
    privateKey: string;
};
export declare function signMessage(privateKey: crypto.KeyLike | crypto.SignKeyObjectInput | crypto.SignPrivateKeyInput, message: crypto.BinaryLike): {
    message: crypto.BinaryLike;
    signature: string;
};
export declare function verifyMessage(publicKey: crypto.KeyLike | crypto.VerifyKeyObjectInput | crypto.VerifyPublicKeyInput | crypto.VerifyJsonWebKeyInput, message: crypto.BinaryLike, signature: string): {
    message: crypto.BinaryLike;
    isVerified: boolean;
};
