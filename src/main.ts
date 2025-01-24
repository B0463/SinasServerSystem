import control from './control';
import cache from './cache';
import path from 'path';
import Express from 'express';

const App = Express();

App.use('/static', Express.static(path.join(__dirname, "../front/static/")));

App.get("/", (req, res)=>{
    res.send(cache.cacheMap.get("front/index.html"));
});

App.listen(8080, ()=>{
    console.log("running http server on port [8080]");
});