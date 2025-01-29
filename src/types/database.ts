export type User = {
    id?: number,
    username?: string,
    password?: string,
    created_at?: Date,
    last_login?: Date | null,
    status?: number,
    role?: number
}