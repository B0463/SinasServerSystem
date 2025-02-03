import Express, { Request, Response } from 'express';
import { User, ApiConfig, Token } from '../../types';
import config from '../../config';
import cookieParser from 'cookie-parser';
import UserController from './userController';

class Api {
    private App: Express.Application;
    private UserControllerInstance: UserController;

    public async init(server: Express.Application) {
        this.App = server;
        this.UserControllerInstance = new UserController;
        await this.router();
    }

    private async router() {
        const apiConfig: ApiConfig = await config.get("config/apiConfig.json");

        this.App.use(cookieParser());
        this.App.use(Express.json());
        this.UserControllerInstance.init(apiConfig);

        this.App.post("/api/register", async (req: Request, res: Response): Promise<any> => this.UserControllerInstance.register(req, res));
        this.App.post("/api/login", async (req: Request, res: Response): Promise<any> => this.UserControllerInstance.login(req, res));
        this.App.post("/api/logout", async (req: Request, res: Response): Promise<any> => this.UserControllerInstance.logout(req, res));
        await config.delete("config/apiConfig.json");
    }
}

export default Api;