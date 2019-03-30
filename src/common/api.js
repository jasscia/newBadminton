const host = "https://kkiqq.cn/"
const URLList={
  gameInfo: host + "api/badminton/game",
  gameList: {
    my: host + "api/badminton/game",
    myjoin: host + "api/badminton/signuplist",
    all: host + "api/badminton/gamelist",
  },
  groupList: host + 'api/badminton/group',
  addPlayer: host + "api/badminton/game/addplayer",
  getToken: host + 'api/badminton/qlogin',
  changeRealname: host + 'api/badminton/userrename',
  getPersonalInfo: host + 'api/badminton/personalinfo'
};

//获取token
//show loading
//xhr请求
//hide loading
const api_getToken = async function(code, nickName, avatarUrl){
  let url = URLList.getToken,
      method="GET",
      data={code:code,
            nick_name:nickName,
            avatar_url:avatarUrl}
  let res = await htr(url, method, data);
  return res.token;
}

const api_getMatchInfoList = async function(type, data) {
  let url = urlList.gameList[type];
  let res = await htr(url , 'GET', data);
  return res || []
}

const api_getMatchInfo = async function(gameid) {
  let url = URLList.gameInfo +'\/'+gameid;
  let res = await htr(url, 'GET', data);
//     if(!matchInfo.status&&matchInfo.players&&matchInfo.players.length>=16){
//       matchInfo.status=1
//     }
//     matchInfo.progressData=calcprogress(matchInfo)
//     matchInfo.ifIn=judgeIfIn(matchInfo)
//     matchInfo.groupWithInfo=getGroupListWithPlayerInfo(matchInfo)
//     matchInfo.contorlAttr=calcContorlAttr(matchInfo)
//     matchInfo.limitForLive=calcLimitForLive(matchInfo)
//     return transformStatusAndTimeOfMatchInfo(matchInfo);
  return res || {}
}

const api_updateMatchInfo = async function(gameid) {
  let url = URLList.gameInfo +'\/'+gameid;
  let res = await htr(url, 'PUT', data);
  return res || {}
}

const api_addPlayer=async function(data){
  let url = URLList.addPlayer
  let res = await htr(url, 'POST', data)
  return res || {}
}

const api_changeRealname=async function(data){
  let url=URLList.changeRealname;
  let res = await htr(url, 'POST',data);
//     userInfo.real_name=realName
//     await setStorage('userInfo',userInfo)
  return res || {}
}

const api_createGame = async function(data){
//       data={
//         token:token,
//         gamename:formData.theme,
//         status:0,
//         note:null,
//         address:formData.address,
//         begintime:formData.begintime,
//         auto_signup:formData.auto_signup
//       };
  let url=URLList.gameInfo;
  let res = await htr(url, 'POST',data);
  return res || {}
}

const api_postGroupList = async function(data) {
  let url=URLList.groupList;
  let res = await htr(url, 'POST',data);
  return res || {}
}

const api_getGroupList = async function(data) {
  let url=URLList.groupList;
  let res = await htr(url, 'GET',data);
  return res || {}
}

const api_putGroupInfo = async function(groupid, data){
  let url=URLList.groupList+'\/'+groupid
  let res=await htr(url, 'PUT',data)
  return res || {}
}

const api_getPersonalInfo = async function(){
  let url=URLList.getPersonalInfo
  let res= await htr(url, 'GET',data)
  return res || {}
}
export {
  api_getToken,
  api_getMatchInfoList,
  api_getMatchInfo,
  api_updateMatchInfo,
  api_addPlayer,
  api_changeRealname,
  api_createGame,
  api_postGroupList,
  api_getGroupList,
  api_putGroupInfo,
  api_getPersonalInfo,
}
