import Express from 'express';
import cache from './cache';
import path from 'path';

function router(server: Express.Application) {
    server.use('/static', Express.static(path.join(__dirname, "../front/static/")));

    server.get("/", async (req, res)=>{
        res.send(await cache.getCache("front/index.html"));
    });
}

export default router;