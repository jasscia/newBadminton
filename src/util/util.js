const formatTime =(date,mark='/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(mark) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
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
const login=function(){
  return new Promise((resolve,reject)=>{
    console.log('进入login fn');
    wx.login({
      success:resolve,
      fail:reject
    })
  })
}
const getUserInfo=function(){
  return new Promise((resolve,reject)=>{
    console.log('进入userInfo fn');
    wx.getUserInfo({
      success:resolve,
      fail:reject
    })
  })
}
const htr=function(url,method,data){
  return new Promise((resolve,reject)=>{
    console.log('进入htr fn');
    wx.request({
      url,
      method,
      data,
      success:resolve,
      fail:reject
    })
  })
}
module.exports = {
  formatTime: formatTime,
  formateDate:formateDate,
  htr:htr,
  login:login,
  getUserInfo:getUserInfo,
}
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
}
Array.prototype.change = function (oldval,val) {
  var index = this.indexOf(oldval);
  if (index > -1) {
    this[index]=val;
  }
}
Array.prototype.numToString=function(stringArr){
  for(let num of this){
    if(Array.isArray(num)){
      Array.prototype.numToString.call(num,stringArr)
    }else{
      if(num>stringArr.length){
      }else{
        this.change(num, stringArr[num - 1])
        // this[this.indexOf(num)] = stringArr[num - 1]
      }
    }
  }
}
