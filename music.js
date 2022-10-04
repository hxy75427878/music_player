const log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错了, 请仔细检查并且复习三种基本的选择器`
        alert(s)
        return null
    } else {
        return element
    }
}
const es = function(selector) {
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

class Music {
    constructor() {
        this.songs = ['1.mp3', '2.mp3', '3.mp3',
                      'Tonight Tonight.mp3', '僕らまだアンダーグラウンド.mp3',
                      '心予報.mp3', '遊生夢死.mp3',]
        this.singer = ['未知', "未知", "未知", 'EGOIST', 'Eve', 'Eve', 'Eve',]
    }
}


const playToggle = function(audio) {
    let button = e('#id-play')
    let button1 = button.closest('.button')
    button.addEventListener('mousedown', function() {
        button1.classList.add('button-lg')
        if (button.classList.contains('fa-play')) {
            audio.play()
            button.classList.remove('fa-play')
            button.classList.add('fa-pause')
        } else {
            audio.pause()
            button.classList.add('fa-play')
            button.classList.remove('fa-pause')
        }
    })
    deleteLg('#id-play')
}




const starTime = (audio) => {
    let a = audio
    let spanTotalTime = e('.right')
    // let input = e('#id-input-range')
    let m = Math.floor(a.duration / 60)
    let ss = Math.floor((a.duration / 10) % 6)
    let s = Math.floor(a.duration) % 10
    spanTotalTime.innerHTML = `${m}:${ss}${s}`
}

const canplayTime = (audio) => {
    audio.addEventListener('canplay', function() {
        starTime(audio)
    })
}

const changeTime = (audio) => {
    let a = audio
    let input = e('#id-input-range')
    input.addEventListener('change', () => {
        a.currentTime = input.value
    })
}


const totalTime = function(audio) {
    starTime(audio)
    canplayTime(audio)
}

const time = function(audio){
    let a = audio
    let spanTime = e('.left')
    // let input = e('#id-input-range')
    setInterval(function() {
        let m = Math.floor(a.currentTime / 60)
        let ss = Math.floor((a.currentTime / 10) % 6)
        let s = Math.floor(a.currentTime) % 10
        // input.value = a.currentTime
        spanTime.innerHTML = `${m}:${ss}${s}`
    }, 500)
}

const times = (audio) => {
    time(audio)
    totalTime(audio)
    // changeTime(audio)
}


const bindEventsCanplay = function(audio) {
    let a = audio
    let play = e('#id-play')
    a.addEventListener('canplay', function() {
        if (!play.classList.contains('fa-play')) {
            a.play()
        }
    })
}
const clickToggle = function(audio) {
    let a = audio
    let musics = es('.songs')
    for (let i = 0; i < musics.length; i++) {
        let music = musics[i];
        let path = music.dataset.path
        music.addEventListener('click', function() {
            a.src = 'audio/' + path
            bindEventsCanplay(audio)
        })
    }
}

const oneLoop = function(audio) {
    let src = audio.src
    let a = audio
    a.addEventListener('ended', function() {
        a.src = src
        bindEventsCanplay(audio)
    })
}

const toggleSong = function(audio, count = 1) {
    let a = audio
    let music = new Music()
    let songs = music.songs
    let singers = music.singer
    let index = Number(a.dataset.active)
    let name = e('#singName')
    let singer = e('#singer')
    index = (index + count + songs.length) % songs.length
    a.dataset.active = String(index)
    singer.innerHTML = singers[index]
    name.innerHTML = sliceName(songs[index])
    return songs[index]
}

const songsLoop = function(audio) {
    let a = audio
    a.addEventListener('ended', function() {
        a.src = 'audio/' + toggleSong(audio)
        bindEventsCanplay(audio)
    })
}

const sliceName = (str) => {
    for (let i = 0; i < str.length; i++) {
        let a = str[i]
        if (a === '.') {
            let s = str.slice(0, i)
            return s
        }
    }
}

const choice = function(array) {
    let a = Math.random()
    let len = array.length
    a = a * len
    let index = parseInt(a, '10')
    let music = new Music()
    let name = e('#singName')
    let singer = e('#singer')
    name.innerHTML = sliceName(music.songs[index])
    singer.innerHTML = music.singer[index]
    return array[index]
}
// 随机取出下一首歌
const randomNextSong = function(audio) {
    let music = new Music()
    let songs = music.songs
    return choice(songs)
}
// 随机播放
const randomLoop = function(audio) {
    let a = audio
    let name = e('#singName')
    let singer = e('#singer')
    a.addEventListener('ended', function() {
        a.src = 'audio/' + randomNextSong(audio)
        bindEventsCanplay(audio)
    })
}
// 设置循环播放的种类
const bindEventSetup = (audio) => {
    let button = e('#id-i-loop')
    let o = {
        loop: [oneLoop, songsLoop, randomLoop,],
        name: ['fa-repeat', 'fa-recycle', 'fa-random'],
        count: 0,
    }
    oneLoop(audio)
    button.addEventListener('click', () => {
        o.count = o.count + 1
        log('count', o.count)
        let loop = o.count % 3
        for (let i = 0; i < o.loop.length; i++) {
            button.classList.remove(o.name[i])
            if (loop === i) {
                o.loop[i](audio)
                button.classList.add(o.name[i])
            }
        }
    })

}

const deleteLg = (select) => {
    let button = e(select)
    let button1 = button.closest('.button')
    button.addEventListener('mouseup', function() {
        button1.classList.remove('button-lg')
    })
    button.addEventListener('mouseover', function() {
        button1.classList.remove('button-lg')
    })
}

const toggleMusic = (audio, select, count) => {
    let a = audio
    let button = e(select)
    let button1 = button.closest('.button')
    button.addEventListener('mousedown', function() {
        button1.classList.add('button-lg')
        a.src = 'audio/' + toggleSong(audio, count)
        bindEventsCanplay(audio)
    })
    deleteLg(select)
}


// 上一首
const previousSing = (audio) => {
    toggleMusic(audio, '.fa-step-backward', -1)
}
// 下一首
const nextSing = (audio) => {
    toggleMusic(audio, '.fa-step-forward', 1)
}

const loading = (audio) => {
    let total = e('.prog-bar')
    let time = e('.prog-bar-inner')
    // time.style = `animation: timer 10s linear 0.1s`
    let moving = false
    let max = total.offsetWidth
    let o = total.getBoundingClientRect()
    let { left } = o
    // 初始偏移量
    let offset = 0
    total.addEventListener('mousedown', (event) => {
        // event.clientX 是浏览器窗口边缘到鼠标的距离
        // dot.offsetLeft 是 dot 元素左上角到父元素左上角的距离
        // offset 就是父元素距离浏览器窗口边缘的距离, 注意这个值基本上是不变的

        offset = event.clientX - left
        let width = (offset / max)
        let jd = Number(audio.currentTime) / Number(audio.duration) * 100
        time.style = `width:${jd}%`
        audio.currentTime = Number(audio.duration) * width
        moving = true
    })

    document.addEventListener('mouseup', (event) => {
        moving = false
        let jd = Number(audio.currentTime) / Number(audio.duration) * 100
        time.style = `width:${jd}%`
    })

    document.addEventListener('mousemove', (event) => {
        if (moving) {
            // 离浏览器左侧窗口当前距离减去父元素距离浏览器左侧窗口距离就是
            // dot 移动的距离
            // dot 距离有一个范围, 即 0 < x < max
            offset = event.clientX - left
            if (offset > max) {
                offset = max
            }
            if (offset < 0) {
                offset = 0
            }
            let width = (offset / max)
            let jd = Number(audio.currentTime) / Number(audio.duration) * 100
            time.style = `width:${jd}%`
            audio.currentTime = Number(audio.duration) * width
        }
    })
    setInterval(function() {
        let jd = Number(audio.currentTime) / Number(audio.duration) * 100
        time.style = `width:${jd}%`
    }, 500)
}

const repeat = (audio) => {
    let repeatClick = e('.fa-circle-notch')
    repeatClick.addEventListener('click', function (event) {
        log('click')
        audio.currentTime = 0
    })
}

const bindEvents = function() {
    let audio = e('#id-audio-player')
    playToggle(audio)
    times(audio)
    bindEventSetup(audio)
    previousSing(audio)
    nextSing(audio)
    loading(audio)
    repeat(audio)

}
const __main = function() {
    bindEvents()
}

__main()