import path from 'path';
import cache from './cache';

class Config {
    private rootPath = path.join(__dirname, "../");
    private configMap = new Map<string, object>();

    public async setConfig(file: string) {
        this.configMap.set(file, JSON.parse(await cache.getCache(file)));
    }

    public async getConfig(file: string): Promise<any> {
        if(!this.configMap.has(file)) await this.setConfig(file);
        return this.configMap.get(file);
    }

    public async deleteConfig(file: string) {
        if(this.configMap.has(file)) this.configMap.delete(file);
        cache.deleteCache(file);
    }

    public async clearConfig() {
        this.configMap.clear();
    }

    public async refreshConfig() {
        for(const element of this.configMap.keys()) {
            await this.getConfig(element);
        }
    }
}

const configInstance = new Config();

export default configInstance;