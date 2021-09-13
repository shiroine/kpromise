function isUndefined(value) {
    return typeof value === 'undefined' ? true : false
}

function isFunction(f) {
    return typeof f === 'function' ? true : false
}

function KPromise(executor) {
    this.resolve = function (value) {
        setTimeout(() => {
            if (isFunction(this.onFulfilled)) {
                ret = this.onFulfilled(value)
                if (!isUndefined(this.next)) {
                    this.next.resolve(ret)
                }
            }
        }, 0);
    }
    this.reject = function (error) {
        setTimeout(() => {
            if (!isUndefined(this.next)) {
                if (isFunction(this.onRejected)) {
                    this.onRejected(error)
                }
                this.next.reject(error)
            }
            else {
                if (isFunction(this.onRejected)) {
                    this.onRejected(error)
                }
                else {
                    throw('Unhandled KPromise exception!')
                }
            }
        }, 0);
    }
    executor(this.resolve.bind(this), this.reject.bind(this))
}

KPromise.prototype.then = function(onFulfilled, onRejected) {
    let next = new KPromise(() => { })
    if (isFunction(onFulfilled)) {
        next.onFulfilled = onFulfilled
    }
    if (isFunction(onRejected)) {
        next.onRejected = onRejected
    }
    this.next = next
    return next
}

KPromise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected)
}

exports.KPromise = KPromise
