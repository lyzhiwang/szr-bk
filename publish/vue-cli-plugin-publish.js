const config = require('./config')
const fs = require('fs')
const archiver = require('archiver')

module.exports = (api, projectOptions) => {
  api.registerCommand('publish', {
    description: '自动构建部署',
    usage: 'vue-cli-service publish',
    options: {

    }
  }, (args) => {
    // 输出传入的参数
    (function() {
      // console.log(chalk.cyan('  Zip files.\n'))
      console.time('key')
      var output = fs.createWriteStream(`publish/${config.title}.zip`)
      var archive = archiver('zip')
      console.log('in zip ~~~~~~~~~~~~')

      output.on('close', function() {
        // console.log(chalk.cyan('  Zip files.\n'))
        // console.timeEnd('key')
        console.log('compress completed...ready upload')
        require('./publish')()
      })

      output.on('end', function() {
      })

      archive.on('error', function(err) {
        throw err
      })

      archive.pipe(output)
      // archive.glob('./dist' + '/**')
      archive.directory('dist/', 'dist')
      archive.finalize()
    })()
  })
}
