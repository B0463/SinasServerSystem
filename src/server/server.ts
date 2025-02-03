import Express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import config from '../config';
import FrontRouter from './frontRouter';
import Api from './api/api';
import { ServerConfig } from '../types';

class Server {
    private App: Express.Application;
    private RouterInstance: FrontRouter;
    private ApiInstance: Api;
    private RedirectRoute;

    public async init() {
        this.App = Express();
        this.RouterInstance = new FrontRouter;
        this.ApiInstance = new Api;
        this.RedirectRoute = (req, res) => {
            res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
            res.end();
        }
    }

    private async listen(): Promise<number> {
        const serverConfig: ServerConfig = await config.get("config/serverConfig.json");

        if(serverConfig.useHttps) {
            if(!serverConfig.ssl) {
                console.error("SSL options are required when 'useHttps' is enabled, but 'ssl' is missing in serverConfig.json.");
                return 1;
            }

            const sslOptions =  {
                key: fs.readFileSync(serverConfig.ssl?.key || ''),
                cert: fs.readFileSync(serverConfig.ssl?.cert || ''),
                ca: serverConfig.ssl?.ca ? fs.readFileSync(serverConfig.ssl?.ca) : undefined
            };
            
            try {
                https.createServer(sslOptions, this.App).listen(serverConfig.httpsPort, async ()=>{
                    console.log(`Running HTTPS server on port [${serverConfig.httpsPort}].`);
                });
            } catch(e) {
                console.error(`Cannot start HTTPS server on port [${serverConfig.httpsPort}]: ${e}`);
                return 1;
            }
        }

        try {
            http.createServer(serverConfig.forceHttps ? this.RedirectRoute : this.App).listen(serverConfig.httpPort, async ()=>{
                console.log(`Running HTTP server on port [${serverConfig.httpPort}].`);
            });
        } catch(e) {
            console.error(`Cannot start HTTP server on port [${serverConfig.httpPort}]: ${e}`);
            return 1;
        }

        await config.delete("config/serverConfig.json");
        return 0;
    }

    public async start() {
        await this.ApiInstance.init(this.App);
        await this.RouterInstance.init(this.App);
        if(await this.listen()) {
            console.error("Cannot start SinasServerSystem.");
            process.exit(1);
        }
    }
}

export default Server;