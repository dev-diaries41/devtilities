import fs from 'fs';
import path from 'path';
import https from 'http';


export function saveFile(data: string | Buffer | Uint8Array, filename: string, encoding?: BufferEncoding)  {
    // Extract the directory from the filename
    const dir = path.dirname(filename);

    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Create the write stream and save the data
    const writeStream = fs.createWriteStream(filename, {encoding});
    writeStream.write(data,);
    writeStream.end();
    writeStream.on('finish', () => {
        console.log('Data saved to', filename);
    });
    writeStream.on('error', (err) => {
        console.error('Error writing to file:', err);
    });
}


export async function readFile(filename: string, encoding:   BufferEncoding = 'utf8' ): Promise<string> {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filename, { encoding });
        let data = '';
        
        readStream.on('data', (chunk) => {
            data += chunk;
        });

        readStream.on('end', () => {
            resolve(data);
        });

        readStream.on('error', (err) => {
            reject(err);
        });
    });
}

export async function downloadFile(url: string, filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
  
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
  
        res.on('error', (err) => {
          reject(`Error downloading file: ${err}`);
        });
  
        fileStream.on('finish', () => {
          resolve(`File downloaded successfully to ${filePath}`);
        });
      });
    });
  }


export function deleteFile(filename: string) {
    fs.unlink(filename, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted:', filename);
        }
    });
}



export function checkPathExist(pathToCheck: string) {
    const directoryPath = path.join(__dirname, pathToCheck);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
    return directoryPath;
}

export function saveBase64Image(base64String: string, fileName: string) {
    try {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        saveFile(buffer, fileName);
    } catch (error) {
        console.error('Error saving base64 image:', error);
        throw error;
    }
}

export function getImageAsBase64(filePath: string) {
    try {
        const imageFile = fs.readFileSync(filePath);
        const base64Image = `data:image/${filePath.split('.').pop()};base64,${imageFile.toString('base64')}`;
        return base64Image;
    } catch (error) {
        console.error('Error reading file or converting to base64:', error);
        throw error;
    }
}
