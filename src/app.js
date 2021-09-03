const config = require('@/config')
const manifest = require('@/manifest')

import Router from '@/utils/router'


class App {

  constructor(conf) {
    const _conf = {
      duration: 350,
      direction: 'vertical',
      initialPath: 'home',
      allowTouchMove: true
    }
    this.conf = Object.assign(_conf, conf)
    this._init()
  }

  _init() {
    this._initDom()
    this._initSlide()
    this._initAsset()
    this._initRouter()
    this._initSlideEl()
    this._initEvent()
  }

  _initEvent() {
    const touch = !!("ontouchstart" in window)
    const touchBegan = touch ? 'touchstart' : 'mousedown'
    const touchMoved = touch ? 'touchmove' : 'mousemove'
    const touchEnded = touch ? 'touchend' : 'mouseup'
    this._touchBeganHanlder = this._onTouchBegan.bind(this)
    this._touchMovedHanlder = this._onTouchMoved.bind(this)
    this._touchEndedHanlder = this._onTouchEnded.bind(this)
    this.el.addEventListener(touchBegan, this._touchBeganHanlder)
    this.el.addEventListener(touchMoved, this._touchMovedHanlder)
    this.el.addEventListener(touchEnded, this._touchEndedHanlder)
    this.event = { touch, touchBegan, touchMoved, touchEnded }
  }

  _onTouchBegan(e) {
    const conf = this.conf
    if (conf.allowTouchMove) {
      this.posX = this.event.touch ? e.changedTouches[0].pageX : e.pageX
      this.posY = this.event.touch ? e.changedTouches[0].pageY : e.pageY
      this.canTouch = true
    }
  }

  _onTouchMoved(e) {
    if (this.canTouch) {
      e.preventDefault = true
    }
  }

  _onTouchEnded(e) {
    const x = this.event.touch ? e.changedTouches[0].pageX : e.pageX
    const y = this.event.touch ? e.changedTouches[0].pageY : e.pageY
    const dx = x - this.posX
    const dy = y - this.posY
    this._changeSlide(dx, dy)
    this.canTouch = false
  }

  _changeSlide(dx, dy) {
    const conf = this.conf
    if (conf.direction === 'vertical') {
      if (Math.abs(dy) > 20) {
        dy < 0 ? this.slideNext() : this.slidePrev()
      }
    } else {
      if (Math.abs(dx) > 20) {
        dx < 0 ? this.slideNext() : this.slidePrev()
      }
    }
  }

  _beginSlideChange(nexIndex) {
    if (!this.changing) {
      const actIndex = this.slidePaths.indexOf(this.path)
      const nexSlide = this.slides[nexIndex]
      this.prevSlide = this.slides[actIndex]
  
      //optimize dom manipulation
      if (nexSlide.path !== this.nexSlide.path) {
        this.nexEl.innerHTML = nexSlide.el
      }
      //reset next slide
      this.nexSlide = this.prevSlide
      
      this.actEl.style.animationDuration = `${this.conf.duration}ms`
      this.actEl.classList.add('slide-fade-out')

      //trigger init event
      nexSlide.js.el = this.nexEl.firstChild
      nexSlide.js.init && nexSlide.js.init()

      //set current path
      this.path = nexSlide.path
      this.router.go(this.path)

      this._id = setTimeout(this._onTransitionEnd.bind(this), this.conf.duration)
      this.changing = true
    }
  }

  _onTransitionEnd() {
    //trigger destroy event 
    this.prevSlide.js.destroy && this.prevSlide.js.destroy() 

    this.actEl.classList.remove('slide-active', 'slide-fade-out')
    this.actEl.classList.add('slide-next')
    this.nexEl.classList.add('slide-active')
    this.nextEl.classList.remove('slide-next')
    const tmpEl = this.actEl
    this.actEl = this.nexEl
    this.nexEl = tmpEl
    this.changing = false
  }

  slideNext() {
    const actIndex = this.slidePaths.indexOf(this.path)
    const nexIndex = actIndex + 1 > this.slides.length - 1 ? 0 : actIndex + 1
    if (actIndex !== nexIndex) {
      this._beginSlideChange(nexIndex)
    }
  }

  slidePrev() {
    const actIndex = this.slidePaths.indexOf(this.path)
    const nexIndex = actIndex - 1 < 0 ? this.slides.length - 1 : actIndex - 1
    if (actIndex !== nexIndex) {
      this._beginSlideChange(nexIndex)
    }
  }

  slideTo(path) {
    if (path === this.path) return
    const nexIndex = this.slidePaths.indexOf(path)
    if (nexIndex !== -1) {
      this._beginSlideChange(nexIndex)
    }
  }

  _initSlideEl() {
    const path = this.router.path.split('/')[0] || this.conf.initialPath
    const actIndex = this.slidePaths.indexOf(path)
    const nexIndex = actIndex + 1 > this.slides.length - 1 ? 0 : actIndex + 1
    const actSlide = this.slides[actIndex]
    const nexSlide = this.slides[nexIndex]
    this.actEl.innerHTML = actSlide.el
    this.nexEl.innerHTML = nexSlide.el

    //set path
    this.router.go(path)
    this.path = path

    //trigger init event
    actSlide.js.el = this.actEl.firstChild
    actSlide.js.init && actSlide.js.init()

    this.actSlide = actSlide
    this.nexSlide = nexSlide
  }

  _initDom() {
    const el = document.querySelector(this.conf.el)
    this._initActEl(el)
    this._initNexEl(el)
    this.el = el
  }

  _initActEl(el) {
    const actEl = document.createElement('div')
    actEl.classList.add('slide', 'slide-active')
    el.appendChild(actEl)
    this.actEl = actEl
  }

  _initNexEl(el) {
    const nexEl = document.createElement('div')
    nexEl.classList.add('slide', 'slide-next') 
    if (config.pages.length > 1) {
      el.appendChild(nexEl)
    }
    this.nexEl = nexEl
  }

  _initRouter() {
    const router = new Router({
      mode: config.hash ? 'hash' : ''
    })
    router.add(':path', (path)=> {
      const index = this.slidePaths.indexOf(path)
    })
    router.listen()
    this.router = router
  }

  _initSlide() {
    this.slides = []
    this.slidePaths = []
    const pages = config.pages
    pages.forEach(page => {
      const js = require(`@/${page}/index.js`).default
      const el = require(`@/${page}/index.html`)
      this._initPageAsset(js, page)
      const path = page.split('/')[1]
      this.slidePaths.push(path)
      this.slides.push({ path, js, el })
      js.app = this
      js.path = path
    })
  }

  _initPageAsset(slide, path) {
    let page = path.split('/')[1]
    let assets = []
    for (let item of manifest) {
      if (typeof(item) === 'object') {
        if (Object.keys(item)[0] === page) {
          this._getAsset(Object.values(item)[0], assets)
        }
      }
    }
    slide.assets = assets
  }

  _initAsset() {
    this.assets = []
    this._getAsset(manifest, this.assets)
  }

  _getAsset(arr, assets) {
    arr.forEach((item) => {
      if (typeof(item) === 'string') {
        assets.push(`${item}?v=${config.version}`)
      } else {
        this._getAsset(Object.values(item)[0], assets)
      }
    })
  }

}

export default App 