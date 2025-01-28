import path from 'path';
import fs from 'fs/promises';

class Cache {
    private rootPath = path.join(__dirname, "../");
    private cacheMap = new Map<string, string>();

    public async setCache(file: string) {
        try {
            this.cacheMap.set(file, await fs.readFile(path.join(this.rootPath, file), 'utf-8'));
        } catch(err) {
            console.error(`Error loading ${file}: ${err}`);
        }
    }

    public async getCache(file: string): Promise<string> {
        if(!this.cacheMap.has(file)) await this.setCache(file);
        return this.cacheMap.get(file);
    }

    public async deleteCache(file: string) {
        if(this.cacheMap.has(file)) this.cacheMap.delete(file);
    }

    public async clearCache() {
        this.cacheMap.clear();
    }

    public async refreshCache() {
        Array.from(this.cacheMap.keys()).forEach(async (element) => {
            await this.getCache(element);
        });
    }
}

const cacheInstance = new Cache();

export default cacheInstance;