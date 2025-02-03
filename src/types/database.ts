export type User = {
    id?: number,
    username?: string,
    password?: string,
    created_at?: Date,
    last_login?: Date | null,
    session_token?: string,
    status?: number,
    role?: number
}