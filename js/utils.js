// 对 console.log 的抽象
const log = console.log.bind(console)
// 绑定某个元素的函数抽象
const e = (selector) => {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        alert(s)
        return null
    } else {
        return element
    }
}
// 绑定所有元素的函数抽象
const es = (selector) => {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        alert(s)
        //
        return []
    } else {
        return elements
    }
}
// 删除包含这个类名的所有元素的抽象
const rs = (selector, className) => {
    let elements = document.querySelectorAll(selector)
    if (elements.length !== 0) {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            element.classList.remove(className)
        }
        return
    }
}

// 测试函数
const ensure = (condition, message) => {
    if (!condition) {
        log('*** 测试失败:', message)
    } else {
        log('测试成功')
    }
}
// 测试函数
const ensureEqual = (conditionA, conditionB, message) => {
    if (conditionA !== conditionB) {
        log('*** 测试失败:', message)
    } else {
        log('测试成功')
    }
}

// 给一个元素绑定事件
const bindEvent = (element, eventName, callback, options) => {
    element.addEventListener(eventName, callback, options)
}

// 给所有同类名的元素绑定事件
const bindAll = (selector, eventName, callback, responseClass) => {
    let element = document.querySelectorAll(selector)
    for (let i = 0; i < element.length; i++) {
        if (responseClass !== undefined) {
            element[i].addEventListener(eventName, (event) => {
                let self = event.target
                if (self.classList.contains(responseClass)) {
                    callback()
                }
            })
        }
        if (responseClass === undefined) {
            element[i].addEventListener(eventName, callback)
        }
    }
}



// 事件委托
const bindEventDelegate = function (element, eventName, callback, responseClass) {
    /*
    element 是一个标签
    eventName 是一个 string, 表示事件的名字
    callback 是一个函数
    responseClass 是一个字符串
    在 element 上绑定一个事件委托
    只会响应拥有 responseClass 类的元素（这个元素是 element 的子元素）
    */

    element.addEventListener(eventName, function (event) {
        let self = event.target
        if (self.classList.contains(responseClass)) {
            callback()
        }
    })
}


// 将元素插入 dom 元素末尾的抽象函数
const appendHtml = (element, html) => {
    element.insertAdjacentHTML('beforeend', html)
}

// 将给所有元素插入 html 元素
const append = (selector, html) => {
    let element = document.querySelectorAll(selector)
    for (let i = 0; i < element.length; i++) {
        let n = element[i]
        appendHtml(n, html)
    }
}
// 生成 a 和 b 之间的随机数, 包含 a 和 b
const randomBetween = (a, b) => {
    a = Math.min(a, b)
    b = Math.max(a, b)
    let r = Math.random()
    r = r * (b - a + 1)
    r = r + a
    r = Math.floor(r)
    return r
    // 10 - 99
    // 0 - 89
}

// find 函数可以查找 element 的所有子元素
const find = (element, selector) => {
    let e = element.querySelector(selector)
    if (e === null) {
        let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
        alert(s)
        return null
    } else {
        return e
    }
}
// 判断是否是数组
const isArray = (o) => {
    return Array.isArray(o)
}
// 判断是否是对象
const isObject = (o) => {
    return Object.prototype.toString.call(o) === '[object Object]'
}
// 判断两个变量是否相等
const equals = function (a, b) {
    // 处理基本类型或者引用相同的情况
    if (a === b) {
        return true
    }

    // 处理数组比较
    if (isArray(a) && isArray(b)) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; i++) {
            if (!equals(a[i], b[i])) {
                return false
            }
        }
        return true
    }

    // 处理对象比较
    if (isObject(a) && isObject(b)) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)

        if (keysA.length !== keysB.length) {
            return false
        }

        for (const key of keysA) {
            if (!keysB.includes(key)) {
                return false
            }
            if (!equals(a[key], b[key])) {
                return false
            }
        }
        return true
    }

    return false
}
// 深拍平
const flatDeep = (l) => {
    // 把数组 array 拍平
    // 注意, 不管 array 嵌套多少层, 最终都返回一维数组

    // 提示
    // 新建一个空数组 l
    // 遍历数组 array 得到元素
    // 如果元素是数组
    //      递归调用 flatDeep 函数把元素作为参数
    //      并且把得到的返回值与 l 拼接在一起
    //      注意, 这一步需要用 concat 方法
    // 如果元素不是数组
    //      直接把元素添加到 l 中
    let a = []
    let array = l
    for (let i = 0; i < array.length; i++) {
        let n = array[i]
        if (isArray(n)) {
            a = a.concat(flatDeep(n))
        } else {
            a.push(n)
        }
    }
    return a
}
// 深拷贝
const deepClone = (value) => {
    if (isObject(value)) {
        let o = {

        }
        let keys = Object.keys(value)
        for (let i = 0; i < keys.length; i += 1) {
            let k = keys[i]
            let v = value[k]
            o[k] = deepClone(v)
        }
        return o
    }
    if (isArray(value)) {
        let l = []
        for (let i = 0; i < value.length; i++) {
            let n = value[i]
            l.push(deepClone(n))
        }
        return l
    }
    return value
}
// 一维数组的洗牌算法
const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        let random = Math.floor(Math.random() * i);
        [array[random], array[i]] = [array[i], array[random]]
    }
    
    return array
}

// 将一维数组转化成 row * col 的二维数组
const transformed = (lines, row, col) => {
    let square = []
    for (let i = 0; i < row; i++) {
        let list = []
        for (let j = 0; j < col; j++) {
            let index = i * col + j
            let e = lines[index]
            list.push(e)
        }
        square.push(list)
    }
    return square
}
// 节流函数
// 节流函数实现:
// 1. 接收一个回调函数 callback 和延迟时间 delay 作为参数
// 2. 维护一个上次执行时间 lastTime,初始为 0
// 3. 返回一个新函数,这个函数可以接收任意参数(...args)
// 4. 每次触发时获取当前时间 currentTime
// 5. 如果 currentTime - lastTime >= delay,说明已经过了延迟时间
// 6. 执行回调函数,使用 apply 绑定 this 并传入参数
// 7. 更新 lastTime 为当前时间
// 这样可以保证回调函数在 delay 时间内最多执行一次
const throttle = (callback, delay) => {
    let lastTime = 0
    return (...args) => {
        const currentTime = Date.now()
        if (currentTime - lastTime >= delay) {
            callback.apply(this, args)
            lastTime = currentTime
        }
    }
}

// 防抖函数
// 防抖函数实现:
// 1. 接收一个回调函数 callback 和延迟时间 delay 作为参数
// 2. 维护一个定时器 ID timerId
// 3. 返回一个新函数,这个函数可以接收任意参数(...arg)
// 4. 每次触发时先清除之前的定时器(如果存在)
// 5. 设置一个新的定时器,延迟 delay 毫秒后执行回调
// 6. 回调执行时使用 apply 绑定 this 并传入参数
// 7. 执行完将 timerId 重置为 null
// 这样可以保证在频繁触发时只执行最后一次回调
const debounce = (callback, delay) => {
    let timerId = null
    return (...arg) => {
        if (timerId !== null) {
            clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
            callback.apply(this, arg)
            timerId = null
        }, delay)
    }
}


// ajax封装函数
const ajax = (method, path, data, responseCallback) => {
    let r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            let response = JSON.parse(r.response)
            responseCallback(response)
        }
    }
    r.send(data)
}
