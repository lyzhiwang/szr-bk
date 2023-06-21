const chalk = require('chalk')
var Client = require('ssh2').Client
var conn = new Client()
var fs = require('fs')
const defaultSettings = require('./config')

/**
 * 1.进入目录
 * 2.删除旧的备份项目
 * 3.将原项目名称加上bak标志为备份文件
 * 4.解压缩上传的zip文件并将名称改为项目名称
 * 5.删除zip文件
 * 6.退出
 * @type {string[]}
 */
const uploadShellList = [
  `cd ${defaultSettings.path}\n`,
  `rm -rf ${defaultSettings.title}.bak\n`,
  `mv ${defaultSettings.title} ${defaultSettings.title}.bak\n`,
  `unzip ${defaultSettings.title}.zip\n`,
  `mv dist ${defaultSettings.title}\n`,
  `rm -rf ${defaultSettings.title}.zip\n`,
  `exit\n`
]
const params = { file: `./publish/${defaultSettings.title}.zip`, target: `${defaultSettings.path}/${defaultSettings.title}.zip` }

/**
 * 上传文件
 * @param conn
 * @param params
 * @constructor
 */
function UploadFile(conn, params) {
  const file = params.file
  const target = params.target

  if (!conn) {
    return
  }
  conn.sftp(function(err, sftp) {
    if (err) {
      throw err
    }
    sftp.fastPut(file, target, {}, function(err, result) {
      if (err) {
        console.log(chalk.red(err.message))
        throw err
      }
      Shell(conn)
    })
  })
}

function Ready() {
  conn.on('ready', function() {
    console.log('Client :: ready')
    UploadFile(conn, params)
  }).connect(defaultSettings)
}

/**
 * 上传完成后服务器需要执行的内容
 * 删除本地压缩文件
 * @param conn
 * @constructor
 */
function Shell(conn) {
  conn.shell(function(err, stream) {
    if (err) throw err
    stream.on('close', function() {
      console.log('Stream :: close')
      conn.end()
      fs.unlinkSync(`./publish/${defaultSettings.title}.zip`)
    }).on('data', function(data) {
      console.log('STDOUT: ' + data)
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data)
    })
    stream.end(uploadShellList.join(''))
  })
}

module.exports = function() {
  try {
    Ready()
  } catch (err) {
    console.log(err)
  }
}
