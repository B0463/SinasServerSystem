import sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import { User } from './types';

class Database {
    private db: SQLiteDatabase;

    public async init(dbFile: string) {
        this.db = await open({
            filename: dbFile,
            driver: sqlite3.Database,
        });
        await this.createTable();
    }

    private async createTable() {
        const usersTableSchema = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME,
                status INTEGER DEFAULT 1,
                role INTEGER DEFAULT 0
            );
        `;
        this.db.exec(usersTableSchema);
    }

    public async createUser(user: User) {
        const query = `
            INSERT INTO users (username, password)
            VALUES (?, ?);
        `;

        await this.db.run(query, [
            user.username,
            user.password,
        ]);
    }

    public async getUser(by: keyof User, value: string | number): Promise<User | null> {
        const query = `
            SELECT * FROM users WHERE ${by} = ?;
        `;
    
        const user: User = await this.db.get(query, [value]);

        if(!user) return null;

        user.created_at = new Date(user.created_at);
        user.last_login = user.last_login ? new Date(user.last_login) : null;

        return user;
    }

    public async updateUser(id: Number, field: keyof User, value: string | number) {
        const query = `
            UPDATE users 
            SET ${field} = ?
            WHERE id = ?;
        `;
        await this.db.run(query, [value, id]);
    }

    public async deleteUser(id: Number) {
        const query = `DELETE FROM users WHERE id = ?`;
        await this.db.run(query, [id]);
    }

    public async close() {
        await this.db.close();
    }
}

const DatabaseInstance = new Database();

export default DatabaseInstance;