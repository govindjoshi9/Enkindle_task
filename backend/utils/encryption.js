const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

// Check if keys are provided
if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
    throw new Error('ENCRYPTION_KEY and ENCRYPTION_IV must be set in environment variables');
}

/**
 * Encrypts a string using AES-256-CBC.
 * Uses a static IV from environment variables as per requirements.
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text in hex format
 */
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

/**
 * Decrypts a hex string using AES-256-CBC.
 * @param {string} encryptedText - The encrypted text in hex format
 * @returns {string} - The decrypted original text
 */
const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = { encrypt, decrypt };
