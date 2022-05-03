require('dotenv').config()
const express = require('express')
const monk = require('monk')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const AUTH_PASSWORDS = JSON.parse(process.env.TIMETABLE_PASSWORDS || null)

const groups = [
    {
        id: 'PKS-3.2',
        name: 'ПКС-3.2',
    }
]

const timetable = monk(process.env.MONGO_DB_TIMETABLE)
const weeksCollection = timetable.get('weeks')

app.get('/groups', async (req, res) => {
    return res.json({ groups })
})

app.get('/weeks', async (req, res) => {
    const limit = parseInt(req.query.limit)
    const index = parseInt(req.query.index)

    const totalItems = await weeksCollection.count()
    const weeks = await weeksCollection.find({}, { sort: { "days.date": -1 }, skip: index, limit })

    return res.json({ success: true, totalItems, receivedItems: weeks.length, weeks })
})

app.post('/login', async (req, res) => {
    const { groupId, password } = req.body

    if (!AUTH_PASSWORDS[groupId]) {
        return res.status(400).json({ success: false, message: 'Такой группы не существует' })
    }

    if (password) {
        if (AUTH_PASSWORDS[groupId] == password) {
            const token = jwt.sign({ groupId, password }, process.env.SECRET_KEY)
            return res.json({ success: true, token, isAdmin: true })
        } else {
            return res.status(401).json({ success: false, message: 'Ошибка авторизации' })
        }
    } else {
        const token = jwt.sign({ groupId, isAdmin: false }, process.env.SECRET_KEY)
        return res.json({ success: true, token })
    }
})

app.post('/check-login', async (req, res) => {
    const { token } = req.body

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if (!decoded.password || AUTH_PASSWORDS[decoded.groupId] === decoded.password) {
            return res.json({ success: true })
        } else {
            return res.status(401).json({ success: false, message: 'Ошибка авторизации' })
        }
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Ошибка авторизации' })
    }
})

module.exports = app

if (require.main === module) {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}