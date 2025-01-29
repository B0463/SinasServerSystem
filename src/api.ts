import Express, { Request, Response } from 'express';
import database from './database';
import argon2 from 'argon2';
import { User, ApiConfig } from './types';
import jwt from 'jsonwebtoken';
import config from './config';
import ms from 'ms';

class Api {
    App: Express.Application;

    constructor(server: Express.Application) {
        this.App = server;
        this.router();
    }

    public async router() {
        const apiConfig: ApiConfig = await config.get("config/apiConfig.json");

        this.App.use(Express.json());

        this.App.post("/api/register", async (req: Request, res: Response):Promise<any> => {
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
        });

        this.App.post("/api/login", async (req: Request, res: Response):Promise<any> => {
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

                const authToken = jwt.sign({
                    id: user.id,
                    username: user.username,
                    password: user.password
                }, apiConfig.jwt_secret, { expiresIn: apiConfig.expireTime })

                res.cookie('auth_token', authToken, {
                    httpOnly: true,
                    secure: false,
                    maxAge: ms(apiConfig.expireTime)
                })

                res.status(201).json({ message: 'User logged successfully' });
        
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}

export default Api;