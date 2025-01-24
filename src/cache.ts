import path from 'path';
import fs from 'fs';

class Cache {
    private rootPath = path.join(__dirname, "../");
    public cacheMap = new Map<string, string>();
    public setCache(file: string) {
        fs.readFile(path.join(this.rootPath, file), (err, data)=>{
            if(err) {
                console.error(`Error loading ${file}: ${err}`)
            }
            this.cacheMap.set(file, data.toString());
        });
    }
}

const cacheInstance = new Cache();
cacheInstance.setCache("front/index.html");

export default cacheInstance;