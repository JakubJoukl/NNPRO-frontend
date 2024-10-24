const BASE_URI = 'http://localhost:3000';

async function login(username, password) {
    const base64encodedData = btoa(`${username}:${password}`);

    const response = await fetch(`${BASE_URI}/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        //  credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Basic ${base64encodedData}`
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    if (response.status !== 200) {
        if (response.status === 401) {
            throw new Error("unauthorized");
        }
        throw new Error("Unknown error");
    }
    return await response.text();
}

export {
    login,
}