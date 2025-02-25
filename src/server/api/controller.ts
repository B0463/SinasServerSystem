import { Request, Response } from 'express';
import database from '../../database';
import { User, ApiConfig, Token } from '../../types';
import jwt from 'jsonwebtoken';

class Controller {
    public jwt_secret: string;
    public apiConfig: ApiConfig;

    public async init(apiConfig: ApiConfig) {
        this.apiConfig = apiConfig;
        this.jwt_secret = apiConfig.jwt_secret;
    }

    public async verifyToken(token): Promise<false | User> {
        try {
            const decoded: Token = jwt.verify(token, this.jwt_secret);
            const user: User = await database.getUser("id", decoded.id);
            if(user === null) return false;
            if(user.session_token != decoded.session_token) return false;
            return user;
        } catch (e) {
            return false;
        }
    }

    public async verifyUser(req: Request, res: Response): Promise<any | undefined> {
        const userToken: string | undefined = req.cookies.auth_token;

        if(userToken) {
            if(await this.verifyToken(userToken)) return { code: 200, obj: { message: 'User is logged' } };
            res.clearCookie('auth_token', {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });

            return { code: 400, obj: { error: 'Invalid token' } };
        }

        return undefined;
    }
}

export default Controller;