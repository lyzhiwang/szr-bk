/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 有前缀的url
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

// 没有前缀的url
export function validateHalfURL(textval) {
  const urlregex = /^([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

// 小写字母
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

// 大写字母
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

// 大小写字母
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 中文
export function validatChinese(str) {
  const reg = /^[\u4E00-\u9FA5]+$/
  return reg.test(str)
}

// 用户名只能包含中文、英文、数字、下划线
export function validatMixRegular(str) {
  const reg = /^[0-9a-zA-Z\u4E00-\u9FA5_]+$/
  return reg.test(str)
}

// 用户名只能包含英文、数字、下划线
export function validatEnRegular(str) {
  const reg = /^[0-9a-zA-Z_-]+$/
  return reg.test(str)
}

// 数字和字母，长度8-16
export function validatPwdEasy(str) {
  const reg = /^(?=.*[a-zA-z])(?=.*\d)[^]{8,16}$/
  return reg.test(str)
}

// 数字大小写字母，长度8-16
export function validatPwdHard(str) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
  return reg.test(str)
}

// 顶级权限请以/开头后跟随字母，非顶级权限只能包含字母
export function validatePartURL(str) {
  const reg = /^(\/)?[A-Za-z0-9]+$/
  return reg.test(str)
}

// 权限管理重定向
export function validateRedirectURL(str) {
  const reg = /^(\/)[A-Za-z\/0-9]+$/
  return reg.test(str)
}

// 排序必须为数字值
export function validateNumber(str) {
  // const reg = /^[0-9]*[1-9][0-9]*$/
  const reg = /^([1-9]\d*|[0]{1,1})$/
  return reg.test(str)
}

// 正整数
export function validatePositiveInteger(str) {
  const reg = /^[1-9]\d*$/
  return reg.test(Number(str))
}

// 钱：两位小数
export function validateMoney(money) {
  // 此正则不能识别0、0.0
  const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
  const m = Number(money)
  if (m === 0) {
    return false
  } else {
    return reg.test(m)
  }
}

// 校验手机号
export function validatePhone(str) {
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
  return reg.test(str)
}

// 400电话 固话 手机号码
export function validatTel(str) {
  const reg = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3456789]\d{9})$)|(^(400)-(\d{3})-(\d{4})(.)(\d{1,4})$)|(^(400)-(\d{3})-(\d{4}$))/
  return reg.test(str)
}

// 校验富文本框
export function validateEdit(str) {
  // '红包, '转发','分享', '朋友圈'  ['\u7ea2\u5305', '\u8f6c\u53d1','\u5206\u4eab','\u670b\u53cb\u5708'],
  const reg = /(\u7ea2\u5305)|(\u8f6c\u53d1)|(\u5206\u4eab)|(\u670b\u53cb\u5708)+/
  return reg.test(str)
}
