"use strict";

async function login() {
    let username = document.getElementById("username");
    let password = document.getElementById("password");

    const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if(data.error) {
        if(data.error == "Invalid token") login();
        if(data.error == "Username and password are required");
    }
    if(data.message) {
        if(data.message == "User is logged") windows.location.href = "/controlPanel";
    }
}