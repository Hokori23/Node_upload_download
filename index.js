const http = require('http')
const { port } = require('./config')
const router = require('./router')
require('./router/upload')

http
	.createServer((req, res) => {

		const { method, url } = req
		router.handler(method.toLowerCase(), url, req, res)
	})
	.listen(port, () => {
		console.log(`Listening port: ${port}`)
	})
