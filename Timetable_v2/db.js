require('dotenv').config()
const { Pool } = require('pg')

class DatabaseController {
    constructor() {
        this.pool = new Pool({
            host: process.env.PG_HOST,
            database: process.env.PG_TIMETABLE_DATABASE,
            user: process.env.PG_USER,
            port: process.env.PG_PORT,
            password: process.env.PG_PASSWORD,
        })
    }

    async getGroups() {
        const groups = await this.pool.query('SELECT * FROM groups')
        return groups.rows.map(row => row.group)
    }
}

module.exports = new DatabaseController()
