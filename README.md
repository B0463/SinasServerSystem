# Sinas Server System

This system is designed to control and manage a home server. It is currently under development, and while it is not yet fully operational, you can explore its architecture below to better understand its features and potential.

## Architecture

### Control

The `Control` class provides several utilities for managing the home server:

- **shutdown**: Powers off the server.
- **reboot**: Restarts the server.
- **stop backup HDs**: Stops the backup hard drives to improve energy efficiency and extend their lifespan.

### HTTP Server

The `HTTP Server` provides an endpoint to control the home server. It also includes the following components:

- #### API

  An HTTP API for controlling the system, provided by the `HTTP Server`. It is used by the `Frontend` and employs a token-based system for user authentication.

- #### Frontend

  The `Frontend` is simple (for now), built using vanilla HTML, CSS, and JavaScript.

## Setup to Use

### Setup

This system is not ready for full use yet! However, if you want to try it out, there isn't an installation script, but you can set it up yourself by following these steps:

1. Install Node.js. If you don't have it installed, you can use [asdf](https://github.com/asdf-vm/asdf) or install it directly from [here](https://nodejs.org/).

2. Run the following commands:

~~~bash
git clone https://github.com/B0463/SinasServerSystem.git
cd SinasServerSystem
npm install --production
mkdir dist
npx tsc
mv _config config
sudo rm -r .git/ .gitignore README.md tsconfig.json src/
mkdir config/ssl
~~~

### Run

To run the system, use the following command:

~~~bash
node dist/main.js
~~~

## Setup for Development

### Setup

To start developing the system, follow these steps:

1. Install Node.js. If you don't have it installed, you can use [asdf](https://github.com/asdf-vm/asdf) or install it directly from [here](https://nodejs.org/).

2. Run the following commands:

~~~bash
git clone https://github.com/B0463/SinasServerSystem.git
cd SinasServerSystem
npm install
cp _config config
mkdir dist
mkdir config/ssl
~~~

### Compile and Run

To compile and run the system, use these commands:

~~~bash
npx tsc
node dist/main.js
~~~

### Push

To push your code, you can create a fork and use the debug branch.

## Configuration

You can configure all your server settings in the `config/` directory, using the following files:

### `serverConfig.json`

This file contains configuration for the server:

~~~json
{
    "useHttps": false, 
    "forceHttps": false, 
    "httpPort": 8080, 
    "httpsPort": 8443, 
    "ssl": {
        "key": "config/ssl/key.pem", 
        "cert": "config/ssl/cert.pem", 
        "ca": "config/ssl/ca.pem" 
    }
}
~~~

- **useHttps**: Set to `true` to use the HTTPS server.
- **forceHttps**: Set to `true` to redirect HTTP traffic to HTTPS.
- **httpPort**: The port for the HTTP server (should be above `1024`).
- **httpsPort**: The port for the HTTPS server (should be above `1024`).
- **ssl**: SSL configuration (optional). If using HTTPS, this section is required:
  - **key**: Path to the SSL key file.
  - **cert**: Path to the SSL certificate file.
  - **ca**: Path to the SSL certificate authority file (optional).

### `frontRoutes.json`

This file contains the front-end routing and static file configurations:

~~~json
{
    "static": {
        "path": "/static", 
        "file": "front/static/", 
        "maxAge": "1d"
    },
    "routes": [
        {"path": "/", "file": "front/index.html"}
        {"path": "/controlPanel", "file": "front/controlPanel.html"},
        {"path": "/login", "file": "front/login.html"}
    ]
}
~~~

- **static**: Defines settings for static files.
  - **path**: URL path to access static files.
  - **file**: Local path to the static files.
  - **maxAge**: Specifies the cache duration for static files in the user's browser (can use either seconds or an ISO date format).
- **routes**: Defines frontend route mappings.
  - **path**: The URL path to map.
  - **file**: The path to the frontend HTML file to serve.

### `controlConfig.json`

This file sets up control commands and drive management:

~~~json
{
    "commands": {
        "shutdown": "sudo poweroff now",
        "reboot": "sudo reboot now",
        "hdmgr": "sudo hdparm"
    },
    "drives": [
        "/dev/sdb",
        "/dev/sdc",
        "/dev/sdd"
    ]
}
~~~

- **commands**: Defines the control commands that the system can execute.
  - **shutdown**: The command to shut down the server.
  - **reboot**: The command to reboot the server.
  - **hdmgr**: The command to manage the hard drives.
- **drives**: Lists the drives to stop for energy efficiency (optional).

With these steps, your server system will be set up for both use and development. Let me know if you need any further help!
