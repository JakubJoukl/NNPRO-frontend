const BASE_URI = 'http://localhost:3000';

async function register(dtoIn) {
    return await callPost(`${BASE_URI}/register`, dtoIn)
}

async function login(username, password, recaptchaToken) {
    const base64encodedData = btoa(`${username}:${password}`);

    const response = await fetch(`${BASE_URI}/login`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        //  credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json", 'Authorization': `Basic ${base64encodedData}`
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({recaptchaToken}), // body data type must match "Content-Type" header
    });
    if (response.status !== 200) {
        if (response.status === 401) {
            throw new Error("unauthorized");
        }
        throw new Error("Unknown error");
    }
    return await response.json();
}

async function callPost(uri, dtoIn, pageInfo, token) {
    const request = {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        //  credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({...dtoIn, pageInfo}), // body data type must match "Content-Type" header
    }
    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(uri, request);
    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server responded with status " + response.status);
    }
    return await response.json();
}

export {
    login, register,
}