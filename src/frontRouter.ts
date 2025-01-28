import Express from 'express';
import cache from './cache';
import config from './config';
import { FrontRoutes } from './types';
import path from 'path';

class FrontRouter {
    App: Express.Application;

    constructor(server: Express.Application) {
        this.App = server;
    }
    
    public async router() {
        const frontRoutes: FrontRoutes = await config.get('config/frontRoutes.json');
    
        this.App.use(frontRoutes.static.path, Express.static(
            path.join(__dirname, "../", frontRoutes.static.file),
            { maxAge: frontRoutes.static.maxAge}
        ));
    
        frontRoutes.routes.forEach(route => {
            this.App.get(route.path, async (req, res)=>{
                res.send(await cache.get(route.file));
            });
        });
    
        await config.delete('config/frontRoutes.json');
    }
}

export default FrontRouter;