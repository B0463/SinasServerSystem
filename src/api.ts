import Express from 'express';
import path from 'path';

class Api {
    App: Express.Application;

    constructor(server: Express.Application) {
        this.App = server;
        this.router();
    }
    
    public async router() {
        
    }
}

export default Api;