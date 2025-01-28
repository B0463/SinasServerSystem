import FrontRouter from './frontRouter';
import Express from 'express';

const server = Express();

new FrontRouter(server);

export default server;