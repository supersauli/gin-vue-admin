// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
// eslint-disable-next-line no-extend-native
Date.prototype.Format = function(fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  const reg = /(y+)/
  if (reg.test(fmt)) {
    const t = reg.exec(fmt)[1]
    fmt = fmt.replace(
      t,
      (this.getFullYear() + '').substring(4 - t.length)
    )
  }
  for (let k in o) {
    const regx = new RegExp('(' + k + ')')
    if (regx.test(fmt)) {
      const t = regx.exec(fmt)[1]
      fmt = fmt.replace(
        t,
        t.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function formatTimeToStr(times, pattern) {
  let d = new Date(times).Format('yyyy-MM-dd hh:mm:ss')
  if (pattern) {
    d = new Date(times).Format(pattern)
  }
  return d.toLocaleString()
}
  // 使用原生 JS 处理
export function formatSqlTimeToStr(row, column, cellValue) {
    if (!cellValue) return '';
    
    // 1. 将字符串转为 Date 对象
    const date = new Date(cellValue);
    
    // 2. 调整时区偏移（如果需要本地时间，通常直接转换即可）
    // 这里简单处理为 YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }