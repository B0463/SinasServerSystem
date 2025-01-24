import { exec } from "child_process";

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
        await this.runCommand("sudo poweroff now");
    }
    public async reboot() {
        await this.runCommand("sudo reboot now");
    }
    public async setHdStandby(time: number) {
        const drives = ['/dev/sdb', '/dev/sdc', '/dev/sdd'];

        for(const drive of drives) {
            await this.runCommand(`sudo hdparm -S ${time} ${drive}`);
        }
        
        if(time == 0) return;
        for(const drive of drives) {
            await this.runCommand(`sudo hdparm -Y ${drive}`);
        }
    }
}
const controlInstance = new Control();
export default controlInstance;