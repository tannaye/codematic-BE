import CryptServiceInterface from "../../application/services/crypt.js";
import crypto from "crypto";

export default class CryptService extends CryptServiceInterface {
    constructor({ logger, config }) {
        super({ logger, config });
    }

    encrypt(data, channel = "internal") {
        const secret = channel === "internal" ? this.config.encryptionKey : this.config.externalEncryptionKey;
        const str = JSON.stringify(data);
        const key = Buffer.from(secret, "hex");
        const plainText = Buffer.from(str, "utf8");

        // The nonce is a random 12 byte buffer
        const nonce = crypto.randomBytes(12);

        // Since we don't want to save the nonce somewhere else in this case, we add it as a prefix to the encrypted data. The first nonce argument in Seal is the prefix.
        const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce);

        // Encrypt the plain text
        const cipherText = Buffer.concat([cipher.update(plainText), cipher.final()]);

        // Get the authentication tag

        const tag = cipher.getAuthTag();

        // Concatenate the nonce + encrypted data + tag
        return Buffer.concat([nonce, cipherText, tag]).toString("hex");
    }

    decrypt(data, channel = "internal") {
        const secret = channel === "internal" ? this.config.encryptionKey : this.config.externalEncryptionKey;

        const key = Buffer.from(secret, "hex");
        const enc = Buffer.from(data, "hex");

        const nonce = enc.subarray(0, 12); // 12 bytes from the start of the buffer

        // get cipher text which is from 12th byte to the end
        const cipherText = enc.subarray(12, enc.length - 16);

        // Decrypt the data
        const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);

        // Set the auth tag
        decipher.setAuthTag(enc.subarray(enc.length - 16));

        // Decrypt the data
        let decryptedString = decipher.update(cipherText);
        decryptedString += decipher.final("utf8");
        return JSON.parse(decryptedString.toString());
    }
}
