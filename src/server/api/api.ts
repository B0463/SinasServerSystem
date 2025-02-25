import Express, { Request, Response } from 'express';
import { ApiConfig } from '../../types';
import config from '../../config';
import cookieParser from 'cookie-parser';
import UserController from './userController';
import SystemController from './systemController';

class Api {
    private App: Express.Application;
    private UserControllerInstance: UserController;
    private SystemControllerInstance: SystemController;

    public async init(server: Express.Application) {
        this.App = server;
        this.UserControllerInstance = new UserController;
        this.SystemControllerInstance = new SystemController;
        await this.router();
    }

    private async router() {
        const apiConfig: ApiConfig = await config.get("config/apiConfig.json");

        this.App.use(cookieParser());
        this.App.use(Express.json());
        this.UserControllerInstance.init(apiConfig);
        this.SystemControllerInstance.init(apiConfig);

        this.App.post("/api/register", async (req: Request, res: Response): Promise<any> => this.UserControllerInstance.register(req, res));
        this.App.post("/api/login", async (req: Request, res: Response): Promise<any> => this.UserControllerInstance.login(req, res));
        this.App.post("/api/logout", async (req: Request, res: Response): Promise<any> => this.UserControllerInstance.logout(req, res));
        this.App.post("/api/control/shutdown", async (req: Request, res: Response): Promise<any> => this.SystemControllerInstance.shutdown(req, res));
        this.App.post("/api/control/reboot", async (req: Request, res: Response): Promise<any> => this.SystemControllerInstance.reboot(req, res));
        this.App.post("/api/control/setHdStandby", async (req: Request, res: Response): Promise<any> => this.SystemControllerInstance.setHdStandby(req, res));

        await config.delete("config/apiConfig.json");
    }
}

export default Api;