Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
}

Array.prototype.change = function (oldval, val) {
  var index = this.indexOf(oldval);
  if (index > -1) {
    this[index] = val;
  }
}

Array.prototype.numToString = function(stringArr){
  for(let num of this){
    if(Array.isArray(num)){
      Array.prototype.numToString.call(num, stringArr)
    }else{
      if(num > stringArr.length){
      }else{
        this.change(num, stringArr[num - 1])
      }
    }
  }
}
