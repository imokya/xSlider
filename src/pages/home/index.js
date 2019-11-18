import './index.styl'

export default {

  async init() {
    console.log('init')
    const res = await this._countDown()
    console.log(res)
  },

  _countDown() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('success')
      }, 1000)
    })
  },

  destroy() {
    console.log('destroy')
  }

}