const express = require('express')
const cors = require('cors')
const http = require('http')

const moobotCommands = require('./Moobot-commands/index')
const timetable = require('./Timetable/index')
const duties = require('./Duties/index')

const app = express()
app.use(express.json())
app.use(cors())

const server = http.createServer(app)

app.use('/moobot-commands', moobotCommands)
app.use('/timetable', timetable)
duties.listen(server)

app.get('/*', (req, res) => {
    res.json({
        success: true
    })
})

module.exports = server

if (require.main === module) {
    const PORT = process.env.PORT || 3000
    server.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
}