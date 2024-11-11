export async function generateElipticKeyPair(){
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

export async function deriveKey(privateKey, publicKey) {
    const sharedSecret = await crypto.subtle.deriveBits(
        {
            name: "ECDH",
            public: publicKey,
        },
        privateKey,
        256, // Length of the derived key in bits
    );

    const aesKey = await crypto.subtle.importKey(
        "raw",
        sharedSecret,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"],
    );

    return aesKey;
}