const router = require('../router')
const fs = require('fs')
const path = require('path')

const readBody = (content, boundary) => {
	let buffers = []
	let res = []
	const tempContent = content.split('\r\n')
	let boundaryStart = false,
		readStart = false,
		filename = ''
	for (let i = 0; i < tempContent.length; i++) {
		if (tempContent[i] === `--${boundary}`) {
			boundaryStart = true
			continue
		}
		if (tempContent[i] === `--${boundary}--`) {
			res.push({ content: Buffer.concat(buffers), filename })
			buffers = []
			boundaryStart = readStart = false
			continue
		}
		if (tempContent[i].match(/^Content-Disposition/)) {
			filename = tempContent[i].split(';')[2].split('=')[1]
			filename = filename.slice(1, filename.length - 1)
		}
		if (boundaryStart && !readStart && !tempContent[i]) {
			readStart = true
			continue
		}
		if (readStart) {
			buffers.push(Buffer.from(tempContent[i] + '\r\n'))
		}
	}
	return res
}
router.put('/upload', (req, res) => {
	if (req.headers['content-length'] > 10240) {
		res.end(JSON.stringify({ code: 1, message: '不能上传超过10M的文件' }))
	}
	if (req.headers['content-type']) {
		const contentType = req.headers['content-type'].split('; ')
		req.contentType = contentType[0]
		if (req.contentType === 'multipart/form-data') {
			req.boundary = contentType[1].split('=')[1]
		}
	}
	if (!req.contentType || !req.boundary) {
		res.statusCode = 400
		res.end()
	}
	const buffers = []
	req
		.on('data', (trunk) => {
			buffers.push(trunk)
		})
		.on('end', () => {
			const content = Buffer.concat(buffers).toString()
			const files = readBody(content, req.boundary)
			let size = files.length
			let cur = 0
			files.forEach((v) => {
				const stream = fs.createWriteStream(path.resolve('upload', v.filename))
				stream.write(v.content)
				stream.on('end', () => {
					if (++cur === size) {
						res.end(JSON.stringify({ code: 0, message: '上传成功' }))
					}
				})
			})
		})
})
