export type FrontRoutes = {
    static: {
        path: string,
        file: string,
        maxAge: string | number
    },
    routes: {
        path: string,
        file: string
    }[]
}

export type ControlConfig = {
    commands: {
        shutdown: string,
        reboot: string,
        hdmgr: string
    },
    drives: string[]
}

export type ServerConfig = {
    useHttps: boolean,
    forceHttps: boolean,
    httpPort: number,
    httpsPort: number,
    ssl?: {
        key: string,
        cert: string,
        ca?: string
    }
}

export type ApiConfig = {
    jwt_secret: string,
    expireTime: number | string;
}