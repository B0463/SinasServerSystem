import control from './control';
import server from './server';

server.listen(8080, ()=>{
    console.log("running http server on port [8080]");
});