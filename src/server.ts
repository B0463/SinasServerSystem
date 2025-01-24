import frontRouter from './frontRouter';
import Express from 'express';

const server = Express();

frontRouter(server);

export default server;