const path = require('path')

module.exports = {

  resolve: (_path) => {
    return path.resolve(__dirname, _path)
  } 

}