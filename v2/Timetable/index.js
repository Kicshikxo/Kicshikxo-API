require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const dbController = require('./db')

const axios = require('axios')

const app = express().use(express.json()).use(express.urlencoded({ extended: false }))

app.get('/groups', async (req, res) => {
    return res.json({ groups: await dbController.getGroups() })
})

app.get('/academic-years', async (req, res) => {
    return res.json({ academicYears: await dbController.getAcademicYears() })
})

function tokenAuthMiddleware(req, res, next) {
    req.token = { group: 'ПКС-4.2 2022-2023' }
    next()
}

app.get('/weeks', tokenAuthMiddleware, async (req, res) => {
    const { group } = req.token
    console.log(group)
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset)
    return res.json({ success: true, weeks: await dbController.getWeeks(limit, offset, group) })
})

module.exports = app

if (require.main === module) {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}