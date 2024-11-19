//https://github.com/mdn/dom-examples/blob/main/web-crypto/derive-key/ecdh.js

export async function generateElipticKeyPair() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-521", // You can also use "P-384" or "P-521"
        },
        true,
        ["deriveKey", "deriveBits"],
    );

    return keyPair;
}

// Unencrypted AES key
export async function generateSharedAESKey() {
    // Generate a random AES key (256-bit)
    const aesKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256, // Key size: 256 bits
        },
        true, // Key is extractable (needed to export for sharing)
        ["encrypt", "decrypt"] // Key usages
    );

    const rawKey = await window.crypto.subtle.exportKey("raw", aesKey);

    return {aesKey, rawKey};
}

export async function importPrivateKey(privateKey) {
    const importedPrivateKey = await window.crypto.subtle.importKey(
        "jwk",
        privateKey,
        {
            name: "ECDH",
            namedCurve: "P-521", // You can also use "P-384" or "P-521"
        },
        true,
        privateKey.key_ops ?? [], // Key usages
    );
    return importedPrivateKey;
}

export async function importPublicKey(publicKey) {
    const importedPublicKey = await window.crypto.subtle.importKey(
        "jwk",
        publicKey,
        {
            name: "ECDH",
            namedCurve: "P-521", // You can also use "P-384" or "P-521"
        },
        true,
        publicKey.key_ops ?? [], // Key usages
    );
    return importedPublicKey;
}

/*
Derive an AES key, given:
- our ECDH private key
- their ECDH public key
*/
async function deriveSecretKey(privateKey, publicKey) {
    const importedPrivateKey = await importPrivateKey(privateKey);
    const importedPublicKey = await importPublicKey(publicKey);

    return window.crypto.subtle.deriveKey(
        {
            name: "ECDH",
            public: importedPublicKey,
        },
        importedPrivateKey,
        {
            name: "AES-GCM",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"],
    );
}

export async function encryptDataByElliptic(senderPrivateKey, receiverPublicKey, data) {
    // Alice then generates a secret key using her private key and Bob's public key.
    let aliceSecretKey = await deriveSecretKey(
        senderPrivateKey,
        receiverPublicKey,
    );

    // Alice can then use her copy of the secret key to encrypt a message to Bob.
    return await encrypt(aliceSecretKey, data);
}

export async function encryptAesKey(senderPrivateKey, receiverPublicKey, aesKey) {
    const {encrypted, iv} = await encryptDataByElliptic(senderPrivateKey, receiverPublicKey, aesKey);
    const key = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    return {key, iv};
}

/*
Encrypt the message using the secret key.
Update the "ciphertextValue" box with a representation of part of
the ciphertext.
*/
async function encrypt(secretKey, dataToEncrypt) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        secretKey,
        dataToEncrypt
    );
    return {encrypted, iv};
}

export async function decryptDataByElliptic(receiverPrivateKey, senderPublicKey, data, iv) {
    // Bob generates the same secret key using his private key and Alice's public key.
    let bobsSecretKey = await deriveSecretKey(
        receiverPrivateKey,
        senderPublicKey
    );
    console.log(bobsSecretKey);

    // Alice can then use her copy of the secret key to encrypt a message to Bob.
    return await decrypt(bobsSecretKey, data, iv);
}

export async function decryptAesKey(receiverPrivateKey, senderPublicKey, encryptedAesKey, iv) {
    const encryptedRawKey = _base64ToUint8Array(encryptedAesKey);
    const rawKey = await decryptDataByElliptic(receiverPrivateKey, senderPublicKey, encryptedRawKey, iv);
    const importedKey = await window.crypto.subtle.importKey(
        "raw",               // The format of the key (raw key material)
        rawKey,              // The raw key data (an ArrayBuffer)
        {                    // Algorithm parameters
            name: "AES-GCM", // The encryption algorithm (AES-GCM)
            length: 256      // The key size (256 bits, as specified during generation)
        },
        true,                // Whether the key is extractable
        ["encrypt", "decrypt"] // Key usages (encrypt and decrypt)
    );

    return {importedKey, rawKey};
}

/*
Decrypt the message using the secret key.
If the ciphertext was decrypted successfully,
update the "decryptedValue" box with the decrypted value.
If there was an error decrypting,
update the "decryptedValue" box with an error message.
*/
async function decrypt(secretKey, dataToDecrypt, iv) {
    return await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        secretKey,
        dataToDecrypt
    );
}

export async function encryptDataBySymmetricKey(key, data) {
    const encoder = new TextEncoder();

    // Convert the data to an ArrayBuffer
    const encodedData = encoder.encode(data);

    // Generate a random initialization vector (IV)
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV should be 12 bytes for AES-GCM

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key, // AES-GCM CryptoKey
        encodedData
    );

    return {
        encryptedData: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
        iv: iv // Include the IV so it can be used during decryption
    };
}

export async function decryptDataBySymetricKey(key, encryptedData, iv) {
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv // Use the same IV that was used for encryption
        },
        key, // AES-GCM CryptoKey
        _base64ToUint8Array(encryptedData) // Encrypted data as ArrayBuffer
    );

    // Convert the decrypted data back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

// Function to convert a Base64 string back to a Uint8Array
function _base64ToUint8Array(base64String) {
    // Decode the Base64 string back into a regular string
    const decodedString = atob(base64String);

    // Create a new Uint8Array of the same length as the decoded string
    const uint8Array = new Uint8Array(decodedString.length);

    // Fill the Uint8Array with the character codes from the decoded string
    for (let i = 0; i < decodedString.length; i++) {
        uint8Array[i] = decodedString.charCodeAt(i);
    }

    return uint8Array;
}
