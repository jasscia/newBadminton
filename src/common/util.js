
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
      wx.login({
        success:resolve,
        fail:reject
      })
    })
  }
  const getUserInfoWithoutToken=function(){
    return new Promise((resolve,reject)=>{
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
    return res.data;
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
  putGameInfoURL:"https://kkiqq.cn/api/badminton/game",
  postGameInfoURL:"https://kkiqq.cn/api/badminton/game",
  getGameListMyURL:"https://kkiqq.cn/api/badminton/game",
  getGameListMyjoinURL:"https://kkiqq.cn/api/badminton/signuplist",
  getGameListAllURL:"https://kkiqq.cn/api/badminton/gamelist",
  addplayerURL:"https://kkiqq.cn/api/badminton/game/addplayer",
  getTokenURl:'https://kkiqq.cn/api/badminton/qlogin',
  changeRealnameURl:'https://kkiqq.cn/api/badminton/userrename',
  postGroupListURl:'https://kkiqq.cn/api/badminton/group',
  getGroupInfoURl:'https://kkiqq.cn/api/badminton/group',
  putGroupInfoURl:'https://kkiqq.cn/api/badminton/group',
  getMyMatchDataURL:'https://kkiqq.cn/api/badminton/personalinfo'
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