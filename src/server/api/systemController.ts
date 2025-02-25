import { Request, Response } from 'express';
import Controller from './controller';
import { User } from '../../types';
import controlInstance from '../../control';

class SystemController extends Controller {
    private async verifyPermission(req: Request, status: number, role: number): Promise<any> {
        const userToken: string | undefined = req.cookies.auth_token;
        const user: false | User = await this.verifyToken(userToken);

        if(!user) return { code: 400, obj: { error: 'Invalid token' } };
        if(user.status < status) return { code: 400, obj: { error: 'User cannot use this' } };
        if(user.role < role) return { code: 400, obj: { error: 'User cannot use this' } };

        return { user }
    }

    public async shutdown(req: Request, res: Response): Promise<any> {
        const verification = await this.verifyPermission(req, 2, 1000);
        if(!verification.user) return res.status(verification.code).json(verification.obj);
        const user: User = verification.user;

        try {
            controlInstance.shutdown();
        } catch(e) {
            return res.status(400).json({ error: 'Error executing command' });
        }

        return res.status(200).json({ message: 'Command executed without errors' });
    }

    public async reboot(req: Request, res: Response): Promise<any> {
        const verification = await this.verifyPermission(req, 2, 1000);
        if(!verification.user) return res.status(verification.code).json(verification.obj);
        const user: User = verification.user;

        try {
            controlInstance.reboot();
        } catch(e) {
            return res.status(400).json({ error: 'Error executing command' });
        }

        return res.status(200).json({ message: 'Command executed without errors' });
    }

    public async setHdStandby(req: Request, res: Response): Promise<any> {
        const verification = await this.verifyPermission(req, 2, 1000);
        if(!verification.user) return res.status(verification.code).json(verification.obj);
        const user: User = verification.user;

        const sleepTime = req.body.sleepTime;

        if(!sleepTime) return res.status(400).json({ error: 'sleepTime is required' });

        try {
            controlInstance.setHdStandby(sleepTime);
        } catch(e) {
            return res.status(400).json({ error: 'Error executing command' });
        }

        return res.status(200).json({ message: 'Command executed without errors' });
    }
}

export default SystemController;