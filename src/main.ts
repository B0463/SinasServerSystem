import control from './control';
import Express from 'express';

const App = new Express();

App.get("/", (req, res)=>{
    res.status(200).send("running ok.");
});

App.listen(8080, ()=>{
    console.log("running http server on port [8080]");
});