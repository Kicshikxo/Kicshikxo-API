require('dotenv').config()
const io = require('socket.io')({ cors: { origin: "*" }, path: '/duties/socket.io' })

const jwt = require('jsonwebtoken')
const dbController = require('./dbController')

const SECRET_KEY = process.env.SECRET_KEY
const AUTH_PASSWORDS = JSON.parse(process.env.AUTH_PASSWORDS || null)
const ADMIN_AUTH_PASSWORDS = JSON.parse(process.env.ADMIN_AUTH_PASSWORDS || null)

function readJWT(token) {
	try {
		return jwt.verify(token, SECRET_KEY)
	} catch (e) {
		return {}
	}
}

function checkJWTPassword(token) {
	const { group, password } = readJWT(token)
	if (group && password) {
		return password == AUTH_PASSWORDS[group] || password == ADMIN_AUTH_PASSWORDS[group]
	} else {
		return false
	}
}

function checkJWTAdminPassword(token) {
	const { group, password } = readJWT(token)
	if (group && password) {
		return password == ADMIN_AUTH_PASSWORDS[group]
	} else {
		return false
	}
}

io.on('connection', async socket => {
	socket.on('login', async (data, callback) => {
		if (!data && !callback) { return }
		if (data.group && data.password) {
			const { group, password } = data

			if (data.password == AUTH_PASSWORDS[group] || data.password == ADMIN_AUTH_PASSWORDS[group]) {
				socket.rooms.forEach(room => socket.leave(room))
				socket.join(group)
				const token = jwt.sign({ group, password }, SECRET_KEY)
				callback({ success: true, token, isAdmin: password == ADMIN_AUTH_PASSWORDS[group] })
			} else {
				callback({ success: false })
			}
		}
	})

	socket.on('checkLogin', async (data, callback) => {
		if (!data && !callback) { return }
		if (data.token && checkJWTPassword(data.token)) {
			const { group } = readJWT(data.token)
			socket.rooms.forEach(room => socket.leave(room))
			socket.join(group)
			callback({ success: true, isAdmin: checkJWTAdminPassword(data.token) })
		} else {
			socket.emit('logout')
			callback({ success: false })
		}
	})

	socket.on('getDatabase', async (data, callback) => {
		if (!data && !callback) { return }
		if (data.token && checkJWTPassword(data.token)) {
			const { group } = readJWT(data.token)
			callback({ success: true, database: await dbController.getDuties(group) })
		} else {
			socket.emit('logout')
			callback({ success: false })
		}
	})

	socket.on('checkForUpdate', function (callback) {
		if (!callback) { return }
		const config = require('./config.json')
		callback({ version: config.version, updateurl: config.updateurl })
	})

	socket.on('getGroupsList', async callback => {
		if (!callback) { return }
		const config = require('./config.json')
		callback({ groupsList: config.groupsList })
	})

	socket.on('addRequest', async (data, callback) => {
		if (!data && !callback) { return }
		if (data.token && checkJWTAdminPassword(data.token)) {
			if (data && data.date) {
				if (data.names.length !== 0) {
					const { group } = readJWT(data.token)

					let needToUpdate = false

					for (const name of data.names) {
						const student = await dbController.getStudentByName(group, name)

						if (student) {
							needToUpdate = true
							await dbController.addDate(group, student, data.date)

							callback({ success: true, message: { title: 'Успешно', text: 'Дежурство добавлено' } })
						} else {
							callback({ success: false, message: { title: 'Не удалось добавить', text: 'Студент не найден' } })
						}
					}

					if (needToUpdate) {
						io.to(group).emit('updateDatabase', { database: await dbController.getDuties(group) })
					}
				} else {
					callback({ success: false, message: { title: 'Не удалось добавить', text: 'Ни один студент не выбран' } })
				}
			} else {
				callback({ success: false, message: { title: 'Не удалось добавить', text: 'Не указана дата' } })
			}
		} else {
			socket.emit('logout')
		}
	})

	socket.on('removeRequest', async (data, callback) => {
		if (!data && !callback) { return }
		if (data.token && checkJWTAdminPassword(data.token)) {
			if (data && data.name && data.date) {
				const { group } = readJWT(data.token)

				const student = await dbController.getStudentByName(group, data.name)

				if (student && student.dates.includes(data.date)) {
					await dbController.removeDate(group, student, data.date)

					callback({ success: true, message: { title: 'Успешно', text: 'Дежурство удалено' } })
					io.to(group).emit('updateDatabase', { database: await dbController.getDuties(group) })
				} else {
					callback({ success: false, message: { title: 'Не удалось удалить', text: 'Студент или дата не найдены' } })
				}
			} else if (!data.name) {
				callback({ success: false, message: { title: 'Не удалось удалить', text: 'Не выбран студент' } })
			} else if (!data.date) {
				callback({ success: false, message: { title: 'Не удалось удалить', text: 'Не выбрана дата' } })
			}
		} else {
			socket.emit('logout')
		}
	})

	socket.on('disconnect', () => {
		// console.log(`Отключился: ${socket.id}`)
	})
})

module.exports = {
	io,
	lister(server) {
		io.listen(server)
	}
}