import { exec } from "child_process";

class Control {
    private runCommand(command: string) {
        exec(command, (error, stdout, stderr) => {
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
    public shutdown() {
        this.runCommand("sudo poweroff now");
    }
    public reboot() {
        this.runCommand("sudo reboot now");
    }
    public setHdStandby(time: number) {
        const drives = ['/dev/sdb', '/dev/sdc', '/dev/sdd'];
        drives.forEach(drive => {
            this.runCommand(`sudo hdparm -S ${time} ${drive}`);
        });
        if(time == 0) return;
        drives.forEach(drive => {
            this.runCommand(`sudo hdparm -Y ${drive}`);
        });
    }
}
const controlInstance = new Control();
export default controlInstance;