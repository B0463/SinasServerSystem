"use strict";

async function main() {
    const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
    });
    const data = await response.json();

    if(data.message) {
        if(data.message == "User is logged") window.location.href = "/controlPanel";
    }
}

async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let output = document.getElementById("output");

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if(data.error) {
        output.style.color = "#ff0f0f";
        output.innerHTML = data.error;
        if(data.error == "Invalid token") login();
        if(data.error == "Username and password are required");
    }
    if(data.message) {
        output.style.color = "#1cc238"
        output.innerHTML = data.message;
        if(data.message == "User is logged") window.location.href = "/controlPanel";
        if(data.message == "User logged successfully") window.location.href = "/controlPanel";
    }
}

main()