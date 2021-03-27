const methods = ['get', 'post', 'put', 'delete', 'connect', 'options']
const cb = {}
const router = {
	handler(method, url, req, res) {
    if (!cb[method] || !cb[method][url]) {
      res.statusCode = 404
      res.end()
      return
    }
		cb[method][url](req, res)
	}
}

methods.forEach((method) => (cb[method] = {}))
methods.forEach(
	(method) =>
		(router[method] = (url, callback) => {
			cb[method][url] = callback
		})
)

module.exports = router
