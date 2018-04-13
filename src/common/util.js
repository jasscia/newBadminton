
const setStorage=function(key,data) {
    wx.setStorage({
      key: key,
      data: data
    });
  }
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  const login=function(){
    return new Promise((resolve,reject)=>{
      // console.log('进入login fn');
      wx.login({
        success:resolve,
        fail:reject
      })
    })
  }
  const getUserInfoWithoutToken=function(){
    return new Promise((resolve,reject)=>{
      // console.log('进入userInfo fn');
      wx.getUserInfo({
        success:resolve,
        fail:reject
      })
    })
  }
  const getUserInfoWithToken=async function(code,nickName,avatarUrl){
    let url=URLList.getTokenURl,
        method="GET",
        data={code:code,
              nick_name:nickName,
              avatar_url:avatarUrl}
    let res=await htr(url,method,data);
    // if(res.status===200 || res.status===206 ||res.status===304){
      return res.data;
      //包含字段{uid,toktn,real_name,nick_name,avatar_url,created_at,updated_at}
    // }else{
    //   console.log('getUserInfo failed');
    // }
  }

const transformStatusAndTimeOfMatchInfo=function(matchInfo){
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
  // console.log('进入formdata fn',time);
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
const htr=function(url,method,data){
  return new Promise((resolve,reject)=>{
    // console.log('进入htr fn');
    wx.request({
      url,
      method,
      data,
      success:resolve,
      fail:reject
    })
  })
}
const URLList={
  getGameInfoURL:"https://kkiqq.cn/api/badminton/game",
  postGameInfoURL:"https://kkiqq.cn/api/badminton/game",
  getGameListMyURL:"https://kkiqq.cn/api/badminton/game",
  getGameListAllURL:"https://kkiqq.cn/api/badminton/gamelist",
  addplayerURL:"https://kkiqq.cn/api/badminton/game/addplayer",
  getTokenURl:'https://kkiqq.cn/api/badminton/qlogin',
  changeRealnameURl:'https://kkiqq.cn/api/badminton/userrename'
};
export {URLList,
        htr,
        formateDate,
        transformStatusAndTimeOfMatchInfo,
        getUserInfoWithToken,
        getUserInfoWithoutToken,
        login,
        formatNumber,
        setStorage}