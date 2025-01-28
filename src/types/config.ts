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