import Server from './server';
import database from './database';
import path from 'path';

class Main {
    public async init() {
        await database.init(path.join(__dirname, "../", "DB/Database.sqlite3"));
        const ServerInstance = new Server;
        ServerInstance.start();
    }
}

const MainInstance = new Main();

MainInstance.init();

export default MainInstance;