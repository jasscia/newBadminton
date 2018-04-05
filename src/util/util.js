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

module.exports = {
  formatTime: formatTime
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
