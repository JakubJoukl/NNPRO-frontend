export const BASE_ADDRESS = "localhost:8080";
export const BASE_URI = 'http://localhost:8080';

async function login(dtoIn) {
    return await callPost(`${BASE_URI}/login`, dtoIn)
}

async function register(dtoIn) {
    return await callPost(`${BASE_URI}/register`, dtoIn)
}

async function verify2fa(dtoIn) {
    return await callPost(`${BASE_URI}/verify2fa`, dtoIn)
}

async function listUserConversation(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/listUserConversation`, dtoIn, pageInfo, token);
}

async function listContacts(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/listContacts`, dtoIn, pageInfo, token);
}


async function getCurrentUserProfile(dtoIn, pageInfo, token) {
    return await callGet(`${BASE_URI}/getCurrentUserProfile`, dtoIn, token);
}

async function updateUser(dtoIn, pageInfo, token) {
    return await callPut(`${BASE_URI}/updateUser`, dtoIn, pageInfo, token);
}

async function searchUsers(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/searchUsers`, dtoIn, pageInfo, token);
}

async function addContact(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/addContact`, dtoIn, pageInfo, token);
}

async function createConversation(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/createConversation`, dtoIn, pageInfo, token);
}

async function addUserToConversation(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/addUserToConversation`, dtoIn, pageInfo, token);
}

async function getConversation(dtoIn, pageInfo, token) {
    return await callGetWithPathParam(`${BASE_URI}/getConversation`, dtoIn, token);
}

async function sendMessageToConversation(dtoIn, pageInfo, token) {
    return await callGetWithPathParam(`${BASE_URI}/sendMessageToConversation`, dtoIn, token);
}

async function listMessages(dtoIn, pageInfo, token) {
    return await callPost(`${BASE_URI}/listMessages`, dtoIn, pageInfo, token);
}

async function deleteMessage(dtoIn, pageInfo, token) {
    return await callDelete(`${BASE_URI}/deleteMessage`, dtoIn, pageInfo, token);
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

async function callDelete(uri, dtoIn, pageInfo, token) {
    const request = {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
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

async function callPut(uri, dtoIn, pageInfo, token) {
    const request = {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
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

async function callGet(uri, dtoIn, token) {
    if (Object.keys(dtoIn).length > 0) {
        uri += "?";
        for (const key in dtoIn) {
            uri += `${key}=${dtoIn[key]}&&`
        }
        uri = uri.slice(0, uri.length - 2);
    }
    const request = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        //  credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };
    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(uri, request);
    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server responded with status " + response.status);
    }
    return await response.json();
}

async function callGetWithPathParam(uri, pathParam, token) {
    const request = {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        //  credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        }, redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };
    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(`${uri}/${pathParam}`, request);
    if (response.status !== 200 && response.status !== 201) {
        throw new Error("Server responded with status " + response.status);
    }
    return await response.json();
}

export {
    login,
    register,
    verify2fa,
    listUserConversation,
    getCurrentUserProfile,
    updateUser,
    listContacts,
    searchUsers,
    addContact,
    createConversation,
    getConversation,
    listMessages,
    sendMessageToConversation,
    deleteMessage,
    addUserToConversation
}