import { Request, Response } from 'express';
import database from '../../database';
import argon2 from 'argon2';
import { User, ApiConfig, Token } from '../../types';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import crypto from 'crypto';

class UserController {
    private jwt_secret: string;
    private apiConfig: ApiConfig;

    public async init(apiConfig: ApiConfig) {
        this.apiConfig = apiConfig;
        this.jwt_secret = apiConfig.jwt_secret;
    }

    public async verifyToken(token): Promise<boolean | User> {
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

    public async register(req: Request, res: Response): Promise<any> {
            
        const verification = await this.verifyUser(req, res);
        if(verification) return res.status(verification.code).json(verification.obj);

        if(!req.body || !req.body.username || !req.body.password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const { username, password } = req.body;

        try {
            const existingUser = await database.getUser("username", username );
            if(existingUser) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            const newUser: User = {
                username: username,
                password: await argon2.hash(password),
            };
    
            await database.createUser(newUser);

            res.status(201).json({ message: 'User created successfully' });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public async login(req: Request, res: Response): Promise<any> {
        
        const verification = await this.verifyUser(req, res);
        if(verification) return res.status(verification.code).json(verification.obj);

        if (!req.body || !req.body.username || !req.body.password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const { username, password } = req.body;

        try {
            const user = await database.getUser("username", username );

            if(!user) {
                return res.status(400).json({ error: 'Username or password are incorrect' });
            }
            
            if(!await argon2.verify(user.password, password)) {
                return res.status(400).json({ error: 'Username or password are incorrect' });
            }

            const sessionToken = crypto.randomBytes(64).toString('hex');
            const payload: Token = {
                id: user.id,
                session_token: sessionToken
            };
            
            const authToken = jwt.sign(payload, this.jwt_secret, { expiresIn: this.apiConfig.expireTime })

            res.cookie('auth_token', authToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: ms(this.apiConfig.expireTime)
            });
            
            database.updateUser(user.id, "session_token", sessionToken);
            database.updateUser(user.id, "last_login", "CURRENT_TIMESTAMP");
            res.status(200).json({ message: 'User logged successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public async logout(req: Request, res: Response): Promise<any> {
        const userToken: string | undefined = req.cookies.auth_token;

        if(userToken) return res.status(400).json({ error: "Token is required" });

        const user: User | boolean = await this.verifyToken(userToken);

        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        
        if(user) database.updateUser((user as User).id, "session_token", null);

        return res.status(200).json({ message: "User loggedout successfully" });
    };
}

export default UserController;