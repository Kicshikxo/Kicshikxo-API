const db = require('monk')(process.env.MONGO_DB_DUTIES)

class DatabaseController {
    async getDuties(group) {
        try {
            const collection = db.get(group)
            return (await collection.find({}, { sort: { 'name.lastName': 1 }, projection: { _id: 0 } })).map(student => ({ name: student.name, dates: student.dates.sort() }))
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }

    async getStudentByName(group, name) {
        try {
            const collection = db.get(group)
            return await collection.findOne({ 'name.firstName': name.firstName, 'name.lastName': name.lastName })
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }

    async addDate(group, student, date) {
        try {
            const collection = db.get(group)
            await collection.update({ name: student.name }, { $set: { dates: [...student.dates, date].sort() } })
            return { success: true }
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }

    async removeDate(group, student, date) {
        try {
            const collection = db.get(group)
            const dateIndex = student.dates.indexOf(date)
            await collection.update({ name: student.name }, { $set: { dates: student.dates.filter((date, index) => index !== dateIndex) } })
            return { success: true }
        } catch (e) {
            return { success: false, error: e.toString() }
        }
    }
}

module.exports = new DatabaseController()
