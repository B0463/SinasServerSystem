import Express from 'express';
import cache from './cache';
import config from './config';
import { FrontRoutes } from './types';
import path from 'path';

async function router(server: Express.Application) {
    const frontRoutes: FrontRoutes = await config.getConfig('config/frontRoutes.json');

    server.use(frontRoutes.static.path, Express.static(
        path.join(__dirname, "../", frontRoutes.static.file),
        { maxAge: '1d'}
    ));

    frontRoutes.routes.forEach(route => {
        server.get(route.path, async (req, res)=>{
            res.send(await cache.getCache(route.file));
        });
    });

    await config.deleteConfig('config/frontRoutes.json');
}

export default router;