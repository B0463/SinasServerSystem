import path from 'path';
import cache from './cache';

class Config {
    private rootPath = path.join(__dirname, "../");
    private configMap = new Map<string, object>();

    public async set(file: string) {
        this.configMap.set(file, JSON.parse(await cache.get(file)));
    }

    public async get(file: string): Promise<any> {
        if(!this.configMap.has(file)) await this.set(file);
        return this.configMap.get(file);
    }

    public async delete(file: string) {
        if(this.configMap.has(file)) this.configMap.delete(file);
        cache.delete(file);
    }

    public async clear() {
        this.configMap.clear();
    }

    public async refresh() {
        for(const element of this.configMap.keys()) {
            await this.get(element);
        }
    }
}

const configInstance = new Config();

export default configInstance;