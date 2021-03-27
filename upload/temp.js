// class myPromise {
// 	static pending = 'pending'
// 	static fulfilled = 'fulfilled'
// 	static rejected = 'rejected'

// 	constructor(executor) {
// 		this.status = myPromise.pending
// 		this.value = undefined
// 		this.reason = undefined
// 		this.callbacks = []
// 		executor(this._resolve, this._reject)
// 	}
// 	_resolve(value) {
// 		this.value = value
// 		this.status = myPromise.fulfilled
// 		this.callbacks.forEach((cb) => this._handler(cb))
// 	}
// 	_reject(reason) {
// 		this.reason = reason
// 		this.status = myPromise.rejected
// 		this.callbacks.forEach((cb) => this._handler(cb))
// 	}
// 	then(onFulfilled, onRejected) {
// 		return new myPromise((nextResolve, nextReject) => {
// 			this._handler({
// 				nextResolve,
// 				nextReject,
// 				onFulfilled,
// 				onRejected
// 			})
// 		})
// 	}
// 	_handler(cb) {
// 		const { onFulfilled, onRejected, nextResolve, nextReject } = cb
// 		if (this.status === myPromise.pending) {
// 			this.callbacks.push(cb)
// 			return
// 		}
// 		if (this.status === myPromise.fulfilled) {
// 			const nextValue = onFulfilled ? onFulfilled(this.value) : undefined
// 			nextResolve(nextValue)
// 			return
// 		}
// 		if (this.status === myPromise.rejected) {
// 			const nextReason = onRejected ? onRejected(this.reason) : undefined
// 			nextReject(nextReason)
// 		}
// 	}
// }

class myPromise {
	static pending = 'pending'
	static fulfilled = 'fulfilled'
	static rejected = 'rejected'
	constructor(executor) {
		this.status = myPromise.pending
		this.value = undefined
		this.reason = undefined
		this.callbacks = []
		executor(this._resolve.bind(this), this._reject.bind(this))
	}
	_resolve(value) {
		this.value = value
		if (this.status === 'pending') {
			this.status = myPromise.fulfilled
		}
		this.callbacks.forEach((cb) => this._handler(cb))
	}
	_reject(reason) {
		this.reason = reason
		if (this.status === 'pending') {
			this.status = myPromise.rejected
		}
		this.callbacks.forEach((cb) => this._handler(cb))
	}
	then(onFulfilled, onRejected) {
		return new myPromise((nextResolve, nextReject) => {
			this.callbacks.push({
				onFulfilled,
				onRejected,
				nextResolve,
				nextReject
			})
		})
	}
	_handler(cb) {
		const { onFulfilled, onRejected, nextResolve, nextReject } = cb
		if (this.status === myPromise.pending) {
			this.callbacks.push(cb)
			return
		}
		if (this.status === myPromise.fulfilled) {
			const nextValue =
				onFulfilled !== undefined ? onFulfilled(this.value) : undefined
			nextResolve(nextValue)
			return
		}
		if (this.status === myPromise.rejected) {
			const nextReason =
				onRejected !== undefined ? onRejected(this.reason) : undefined
			nextReject(nextReason)
		}
	}
}

function Child() {
	this.age = 21
}
function Parent() {}
Parent.prototype.name = 'Parent'
Parent.prototype.value = 'value'

Child.prototype = new Parent()
Child.prototype.constructor = Child
// console.log(Child.prototype);
let child = new Child()
Object.keys(child).forEach(k => console.log(k))
// for (let i in child) {
// 	if (child.hasOwnProperty(i)) {
// 		console.log(i);
// 	}
// }
