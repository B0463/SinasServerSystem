import { exec } from "child_process";
import { ControlConfig } from "./types";
import config from "./config";

class Control {
    private async runCommand(command: string) {
        exec(command, async (error, stdout, stderr) => {
            if(error) {
                console.error(`An error running command "${command}": ${error.message}`);
                return;
            }
            if(stderr) {
                console.error(`Error on command "${command}": ${stderr}`);
                return;
            }
            if(stdout) {
                console.log(`Command "${command}": ${stdout}`);
            }
        });
    }

    public async shutdown() {
        const controlConfig: ControlConfig = await config.get("config/controlConfig.json");
        await this.runCommand(controlConfig.commands.shutdown);
    }

    public async reboot() {
        const controlConfig: ControlConfig = await config.get("config/controlConfig.json");
        await this.runCommand(controlConfig.commands.reboot);
    }

    public async setHdStandby(time: number) {
        const controlConfig: ControlConfig = await config.get("config/controlConfig.json");

        for(const drive of controlConfig.drives) {
            await this.runCommand(`sudo hdparm -S ${time} ${drive}`);
        }
        
        if(time == 0) return;
        for(const drive of controlConfig.drives) {
            await this.runCommand(`sudo hdparm -Y ${drive}`);
        }
    }
}

const controlInstance = new Control();

export default controlInstance;