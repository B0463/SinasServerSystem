export type Route = {
    path: string,
    file: string
}

export type FrontRoutes = {
    static: Route,
    routes: Route[]
}

export type ControlConfig = {
    commands: {
        shutdown: string,
        reboot: string,
        hdmgr: string
    },
    drives: string[]
}