const setStorage = function(key,data) {
  wx.setStorage({
    key: key,
    data: data
  });
}

const login = function(){
  return new Promise((resolve,reject)=>{
    wx.login({
      success: (res) => {resolve(res.code)},
      fail: reject
    })
  })
}

const getUserInfo = function(){
  return new Promise((resolve,reject)=>{
    wx.getUserInfo({
      success: (res) => {resolve(res.userInfo)},
      fail: reject
    })
  })
}

const transformStatusAndTimeOfMatchInfo = function(matchInfo){
  let status=['报名中','报名结束','正在比赛','比赛结束'];
  if(status[matchInfo.status]){
    matchInfo.status=status[matchInfo.status]
  };
  matchInfo.begintime=formateDate(new Date(matchInfo.begintime));
  matchInfo.created_at=formateDate(new Date(matchInfo.created_at));
  matchInfo.updated_at=formateDate(new Date(matchInfo.updated_at));
  return matchInfo;
}

const formateDate=(time)=>{
  const days=['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
  const day = days[time.getDay()]
  const month = time.getMonth() + 1
  const date = time.getDate()
  const hour = formatNumber(time.getHours())
  const minute = formatNumber(time.getMinutes())
  const joincode=[' ','月','日 ',':','']
  return [day,month,date,hour,minute].reduce((string,curValue,curKey)=>{
    return string+joincode[curKey-1]+curValue
  })
}

const formatTime =(date, mark='/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(mark) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  //改成两位数
  n = n.toString()
  return n[1] ? n : '0' + n
}

const htr = function(url , method, data){
  wx.showLoading({})
  return new Promise((resolve, reject = () => {
    console.error(...arguments)
    wx.hideLoading({})
  }) => {
    wx.request({
      url,
      method,
      data,
      success: (res) => {
        let code = res.statusCode
        let data = res.data
        if (code >= 200 && code < 300 || code == 304) {
          if (data && data.code == 1) {
            wx.hideLoading({})
            resolve(data.data)
          } else {
            reject()
          }
        } else if (code == 401) {
          login().then(() => {htr(url, method, data)}, reject)
          reject()
        } else {
          reject()
        }
      },
      fail: reject
    })
  })
}

export {
  htr,
  formateDate,
  formateTime,
  transformStatusAndTimeOfMatchInfo,
  getUserInfo,
  login,
  formatNumber,
  setStorage
}
