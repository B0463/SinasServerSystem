"use strict";

async function verifyUserLogin() {
    const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();

    if(data.error) {
        window.location.href = "/login";
    }
}

verifyUserLogin();