require('dotenv').config()
const express = require('express')
const monk = require('monk')

const app = express()

const timetable = monk(process.env.MONGO_DB_TIMETABLE)
const weeksCollection = timetable.get('weeks')

app.get('/weeks', async (req, res) => {
    const limit = parseFloat(req.query.limit)
    const index = parseFloat(req.query.index)

    const totalItems = await weeksCollection.count()
    const weeks = await weeksCollection.find({}, { sort: { "days.date": -1 }, skip: index, limit })

    return res.json({ success: true, totalItems, receivedItems: weeks.length, weeks })
})
app.get('/checkPassword', (req, res) => {
    const { password } = req.query
    return res.json({
        success: true,
        valid: password == process.env.TIMETABLE_PASSWORD
    })
})

module.exports = app

if (require.main === module) {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}