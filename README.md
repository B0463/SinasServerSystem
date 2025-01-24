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
sudo rm -r .git/ .gitignore README.md rsconfig.json src/
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
mkdir dist
~~~

### Compile and Run

To compile and run the system, use these commands:

~~~bash
npx tsc
node dist/main.js
~~~

### Push

To push your code, you can create a fork and use the debug branch.
