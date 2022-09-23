require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const dbController = require('./db')

const app = express().use(express.json()).use(express.urlencoded({ extended: false }))

app.get('/groups', async (req, res) => {
    return res.json({ groups: await dbController.getGroups() })
})

module.exports = app

if (require.main === module) {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}