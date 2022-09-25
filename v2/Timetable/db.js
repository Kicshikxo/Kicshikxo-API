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

    async getAcademicYears() {
        const academicYears = await this.pool.query('SELECT * FROM academic_years')
        return academicYears.rows.map(row => row.year)
    }

    async getWeeks(limit, offset, group) {
        const weeks = await this.pool.query(`SELECT id as week, date::timestamptz, "index", name, cabinet FROM (SELECT id FROM weeks ORDER BY id DESC LIMIT ${limit || 'NULL'} OFFSET ${offset || 'NULL'}) AS selected_weeks, LATERAL select_lessons_by_week_id(id,'${group}') AS selected_lessons`)
        const result = {}
        for (const lesson of weeks.rows.map(row => Object.assign(row, { date: row.date.toISOString().split('T')[0] }))) {
            if (!result[lesson.week]) result[lesson.week] = []
            result[lesson.week].push({ date: lesson.date, index: lesson.index, name: lesson.name, cabinet: lesson.cabinet })
        }
        // const result = weeks.rows.map(row => Object.assign(row, { date: row.date.toISOString().split('T')[0] })).reduce((weeks, lesson) => Object.assign(weeks, { [lesson.week]: weeks[lesson.week] ? [...weeks[lesson.week], { date: lesson.date, index: lesson.index, name: lesson.name, cabinet: lesson.cabinet }] : [{ date: lesson.date, index: lesson.index, name: lesson.name, cabinet: lesson.cabinet }] }), {})
        return result
    }
}

module.exports = new DatabaseController()
