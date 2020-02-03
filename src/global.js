class Global {

  constructor() {
    this._init()
  }

  _init() {
    this._initEvent()
  }

  _initEvent() {
    $(document).on('click', '.button.prev', e=> {
      app.slidePrev()
    })
    $(document).on('click', '.button.next', e=> {
      app.slideNext()
    })
    $(document).on('click', '.button.random', e=> {
      const paths = app.slidePaths
      const getPath = ()=> {
        const path = paths[Math.random() * paths.length | 0]
        if (path === app.path && paths.length !== 1) {
          return getPath()
        } else {
          return path
        }
      }
      const path = getPath()
      app.slideTo(path)
    })
  }

}

export default Global