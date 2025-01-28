export type Route = {
    path: string,
    file: string
}

export type FrontRoutes = {
    static: Route,
    routes: Route[]
}