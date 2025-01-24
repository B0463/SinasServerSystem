import cache from './cache';
import path from 'path';
import Express from 'express';

const server = Express();

server.use('/static', Express.static(path.join(__dirname, "../front/static/")));

server.get("/", (req, res)=>{
    res.send(cache.cacheMap.get("front/index.html"));
});

export default server;