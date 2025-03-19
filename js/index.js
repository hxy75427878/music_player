class MusicPlayer {
    constructor(MusicData, audio) {
        this.musics = MusicData // 音乐数据
        this.audio = audio // 音频对象
        this.activeMusicIndex = 0 // 当前播放音乐索引
        this.activeMusic = this.musics[this.activeMusicIndex] // 当前播放音乐
        this.musicsCount = this.musics.length // 音乐总数
        this.playModes = ['order', 'random', 'single'] // 新增播放模式状态
        this.currentMode = 0 // 当前模式索引
        this.isDragging = false // 是否正在拖动进度条
        this.hideTimer = null // 隐藏进度条计时器
        this.showTimer = null // 显示进度条计时器
    }
    // 绑定音乐可以开始播放后执行的事件
    bindEventCanPlay(audio) {
        let play = e('#id-play')
        let icon = play.querySelector('.fas')
        let progBarInner = e('#id-prog-bar-inner')
        bindEvent(audio, 'canplay', () => {
            progBarInner.style.width = '0%'
            if (icon.classList.contains('fa-pause')) {
                audio.play()
            }
        }, { once: true })
    }
    // 播放音乐
    bindEventPlayMusic(audio) {
        let play = e('#id-play')
        let icon = play.querySelector('.fas')
        bindEvent(play, 'click', () => {
            if (audio.paused) {
                audio.play()
                this.playing = true
            } else {
                this.playing = false
                audio.pause()
            }
            icon.classList.toggle('fa-play')
            icon.classList.toggle('fa-pause')
        })


    }
    // 切换按钮样式
    bindEventToggleButtonCss() {
        let buttons = es('.button')
        buttons.forEach(button => {
            bindEvent(button, 'mousedown', (event) => {
                event.preventDefault()
                button.classList.add('button-lg')
            })
            bindEvent(button, 'mouseup', () => {
                button.classList.remove('button-lg')
            })
            bindEvent(button, 'mouseleave', () => {
                button.classList.remove('button-lg')
            })
        })
    }

    // 处理播放顺序的逻辑, 切换音乐时调用, index 是切换的音乐索引
    handlePlayOrder(audio, index) {
        this.activeMusicIndex = index
        let singerName = e('#id-singer')
        let singName = e('#id-singName')
        let art = e('.art')
        const { path, name, singer, cover } = this.musics[this.activeMusicIndex]
        audio.src = path
        art.src = cover
        singName.textContent = name
        singerName.textContent = singer
    }
    // 歌曲切换后需要执行的逻辑
    updateActiveSong(audio, index) {
        // 处理播放顺序的逻辑
        this.handlePlayOrder(audio, index)
        // 更新当前播放歌曲样式的方法
        this.updateActiveSongCss(index)
        // 绑定音乐可以开始播放后执行的事件
        this.bindEventCanPlay(audio)
    }
    // 处理播放模式改变后点击切换音乐的逻辑, index 是点击的是上一首还是下一首, -1 是上一首, 1 是下一首
    handleModeChange(index) {
        let modeHandlers = {
            0: () => {
                let next = this.activeMusicIndex + index + this.musicsCount
                return next % this.musicsCount
            }, // 顺序播放
            1: () => {
                return Math.floor(Math.random() * this.musicsCount)
            }, // 随机播放
            2: () => {
                return this.activeMusicIndex
            }, // 单曲循环
        }
        return modeHandlers[this.currentMode]()
    }
    // 播放上一首音乐
    bindEventPlayLastMusic(audio) {
        let button = e('#id-previous')
        bindEvent(button, 'click', () => {
            let index = this.handleModeChange(-1)
            this.updateActiveSong(audio, index)
        })
    }
    // 播放下一首音乐
    bindEventPlayNextMusic(audio) {
        let button = e('#id-next')
        bindEvent(button, 'click', () => {
            let index = this.handleModeChange(1)
            this.updateActiveSong(audio, index)
        })
    }
    // 音乐更新时,显示当前播放时间,并更新进度条
    bindEventShowCurrentTime(audio) {
        let currentTime = e('#id-current-time')
        let inner = e('#id-prog-bar-inner')
        bindEvent(audio, 'timeupdate', () => {
            let m = Math.floor(audio.currentTime / 60).toString()
            let s = Math.floor(audio.currentTime % 60).toString()
            currentTime.textContent = `${m}:${s.padStart(2, '0')}`
            if (!this.isDragging) {
                let innerWidth = `${audio.currentTime / audio.duration * 100}%`
                inner.style.width = innerWidth
            }
        })
    }
    // 音乐加载完成后显示总时间
    bindEventShowTotalTime(audio) {
        let totalTime = e('#id-total-time')
        bindEvent(audio, 'loadedmetadata', () => {
            let duration = audio.duration
            let m = Math.floor(duration / 60).toString()
            let s = Math.floor(duration % 60).toString()
            totalTime.textContent = `${m}:${s.padStart(2, '0')}`
        })
    }
    // 随机播放
    randomPlay(audio) {
        let randomIndex = Math.floor(Math.random() * this.musicsCount)
        this.updateActiveSong(audio, randomIndex)
    }
    // 顺序播放
    orderPlay(audio) {
        let index = (this.activeMusicIndex + 1) % this.musicsCount
        this.updateActiveSong(audio, index)
    }
    // 单曲循环
    singleLoop(audio) {
        let index = this.activeMusicIndex
        this.updateActiveSong(audio, index)
    }
    // 切换播放顺序图标
    bindEventToggleIcon() {
        let button = e('#id-play-order')
        let icon = button.querySelector('.fas')
        const modes = {
            order: { class: 'fa-list-ol', data: 'order' },
            random: { class: 'fa-random', data: 'random' },
            single: { class: 'fa-repeat', data: 'single' }
        }
        bindEvent(button, 'click', () => {
            this.currentMode = (this.currentMode + 1) % this.playModes.length
            let currentMode = this.playModes[this.currentMode]
            log(currentMode)
            icon.className = `fas ${modes[currentMode].class}`
        })
    }
    // 切换播放顺序
    bindEventTogglePlayOrder(audio) {
        let button = e('#id-play-order')
        let modes = {
            order: () => {
                this.orderPlay(audio)
            },
            random: () => {
                this.randomPlay(audio)
            },
            single: () => {
                this.singleLoop(audio)
            }
        }
        bindEvent(audio, 'ended', () => {
            let mode = this.playModes[this.currentMode]
            if (modes[mode] !== undefined) {
                modes[mode](audio)
            }
        })
    }
    // 拖动进度条
    bindEventProgressBar(audio) {
        let progBar = e('#id-prog-bar')
        let progBarInner = e('#id-prog-bar-inner')
        let max = progBar.offsetWidth
        let offsetX = 0
        const handleDrag = (event) => {
            event.preventDefault()
            let x = event.clientX - offsetX
            x = Math.max(0, Math.min(x, max))
            let width = (x / max) * 100
            progBarInner.style.width = `${width}%`
            if (event.type === 'mouseup') {
                audio.currentTime = (x / max) * audio.duration
            }
        }

        bindEvent(progBar, 'mousedown', (event) => {
            event.preventDefault()
            offsetX = progBar.getBoundingClientRect().left
            this.isDragging = true
        })

        bindEvent(document, 'mouseup', (event) => {
            if (this.isDragging) {
                handleDrag(event)
            }
            this.isDragging = false
        })

        bindEvent(document, 'mousemove', (event) => {
            if (this.isDragging) {
                handleDrag(event)
            }
        })
    }
    // 拖动音量条
    bindEventDragVolumeBar() {
        let bar = e('#id-volume-bar')
        let fill = e('#id-volume-fill')
        let volumeValue = e('#id-volume-value')
        let max = bar.offsetHeight
        let offsetY = 0
        let isDragging = false

        // 处理拖动音量条的通用逻辑
        const handleDrag = (event) => {
            let y = event.clientY - offsetY
            y = Math.max(0, Math.min(y, max))
            let height = (y / max) * 100
            volumeValue.textContent = `${Math.floor(100 - height)}`
            fill.style.height = `${100 - height}%`
            this.audio.volume = 1 - (height / 100)
        }

        // 绑定鼠标按下事件
        bindEvent(bar, 'mousedown', (event) => {
            event.preventDefault()
            offsetY = bar.getBoundingClientRect().top
            fill.classList.add('flash')
            handleDrag(event)
            isDragging = true
        })

        bindEvent(document, 'mouseup', (event) => {
            fill.classList.remove('flash')
            isDragging = false
        })

        bindEvent(document, 'mousemove', (event) => {
            if (isDragging) {
                handleDrag(event)
            }
        })
    }
    // 显示音量条
    bindEventShowVolumeBar() {
        let button = e('#id-volume')
        let volumePanel = e('#id-volume-panel')
        let volumeBar = e('#id-volume-bar')
        const handleAnime = () => {
            clearTimeout(this.hideTimer)
            clearTimeout(this.showTimer)
            this.showTimer = setTimeout(() => {
                volumePanel.classList.add('hide')
            }, 2700)
            this.hideTimer = setTimeout(() => {
                volumePanel.classList.remove('show')
                volumePanel.classList.remove('hide')
            }, 3000)
        }

        bindEvent(button, 'click', () => {
            volumePanel.classList.add('show')
            handleAnime()
        })

        bindEvent(volumeBar, 'mousedown', () => {
            clearTimeout(this.hideTimer)
            clearTimeout(this.showTimer)
            volumePanel.classList.remove('hide')
            volumePanel.classList.add('show')
        })

        bindEvent(volumePanel, 'mouseup', () => {
            handleAnime()
        })
    }
    // 显示播放列表
    bindEventShowList() {
        let button = e('#id-list')
        bindEvent(button, 'click', () => {
            let playList = e('.playlist')
            playList.classList.toggle('show')
        })
    }
    // 生成播放列表的数据
    generatePlaylist() {
        const list = e('#id-song-list')
        const count = e('#id-song-count')
        let html = this.musics.map((music, index) => `
            <li class="song-item" data-index="${index}">
                <span class="song-index">${music.id + 1}</span>
                <div class="song-info">
                    <div class="song-title">${music.name}</div>
                    <div class="song-artist">${music.singer}</div>
                </div>
            </li>
        `)
        list.innerHTML = html.join('')
        count.textContent = `${this.musicsCount} 首歌曲`
    }
    // 点击播放列表切换歌曲
    bindEventPlaylist(audio) {
        const list = e('#id-song-list')
        bindEvent(list, 'click', (event) => {
            const self = event.target
            let item = self.closest('.song-item')
            if (item !== null) {
                const index = parseInt(item.dataset.index)
                this.updateActiveSong(audio, index)
            }
        })
    }
    // 更新当前播放歌曲样式的方法, index 是当前播放歌曲的索引
    updateActiveSongCss(index) {
        let items = es('.song-item')
        rs('.song-item', 'active')
        items[index].classList.add('active')
    }
    // 绑定音乐播放器的事件
    bindEvents() {
        let audio = this.audio
        // 切换按钮样式
        this.bindEventToggleButtonCss()
        // 切换播放顺序图标
        this.bindEventToggleIcon()
        // 绑定音乐可以开始播放后执行的事件
        this.bindEventCanPlay(audio)
        // 播放音乐
        this.bindEventPlayMusic(audio)
        // 播放上一首音乐
        this.bindEventPlayLastMusic(audio)
        // 播放下一首音乐
        this.bindEventPlayNextMusic(audio)
        // 音乐更新时,显示当前播放时间,并更新进度条
        this.bindEventShowCurrentTime(audio)
        // 音乐加载完成后显示总时间
        this.bindEventShowTotalTime(audio)
        // 切换播放顺序
        this.bindEventTogglePlayOrder(audio)
        // 拖动进度条
        this.bindEventProgressBar(audio)
        // 显示音量条
        this.bindEventShowVolumeBar(audio)
        // 拖动音量条
        this.bindEventDragVolumeBar(audio)
        // 显示播放列表
        this.bindEventShowList()
        // 生成播放列表数据
        this.generatePlaylist()
        // 点击播放列表切换歌曲
        this.bindEventPlaylist(audio)
    }
    // 初始化音乐播放器
    init() {
        let audio = this.audio
        let art = e('.art')
        let singName = e('#id-singName')
        let singerName = e('#id-singer')
        let volumeFill = e('#id-volume-fill')
        let volumeValue = e('#id-volume-value')
        audio.volume = 0.2
        audio.src = this.musics[0].path
        art.src = this.musics[0].cover
        singName.textContent = this.musics[0].name
        singerName.textContent = this.musics[0].singer
        volumeFill.style.height = `${Math.floor(100 * this.audio.volume)}%`
        volumeValue.textContent = `${Math.floor(100 * this.audio.volume)}`
    }
}


const __main = () => {
    const audio = e('audio')
    const musicPlayer = new MusicPlayer(MusicData, audio)
    musicPlayer.init()
    musicPlayer.bindEvents()
}

__main()