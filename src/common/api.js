import {userInfo} from './login'
import {fmtMatchInfo} from './util'

const host = "https://kkiqq.cn/"
const urlList={
  gameInfo: host + "api/badminton/game",
  gameList: {
    mycreate: host + "api/badminton/game",
    myjoin: host + "api/badminton/signuplist",
    all: host + "api/badminton/gamelist",
  },
  groupList: host + 'api/badminton/group',
  addPlayer: host + "api/badminton/game/addplayer",
  cancelPlayer: host + "api/badminton/game/cancel",
  deletePlayer: host + "api/badminton/player",
  getToken: host + 'api/badminton/qlogin',
  changeRealname: host + 'api/badminton/userrename',
  getPersonalInfo: host + 'api/badminton/personalinfo'
};

const htr = function(url , method, data){
  console.log('htr=', ...arguments)
  wx.showLoading({})
  return new Promise((resolve, reject = () => {
    console.error(...arguments)
    wx.hideLoading({})
  }) => {
    wx.request({
      url,
      method,
      data: Object.assign(data || {}, {token: data && data.token || userInfo.token}),
      success: (res) => {
        let statusCode = res.statusCode
        let data = res.data
        console.log(statusCode, data)
        if (statusCode >= 200 && statusCode < 300 || statusCode == 304) {
          if (url == urlList.getToken && data.token) {
            wx.hideLoading({})
            resolve(data)
          } else if (data && data.code == 1) {
            wx.hideLoading({})
            resolve(data.data || data.message)
          } else if (data && data.code == 401) {
            wx.navigateTo({
              url: '/pages/auth/auth',
            })
          } else {
            reject()
          }
        } else {
          reject()
        }
      },
      fail: reject
    })
  })
}
//获取token
//show loading
//xhr请求
//hide loading
const api_getToken = async function(code, nickName, avatarUrl){
  let url = urlList.getToken,
      method="GET",
      data={code: code,
            nick_name: nickName,
            avatar_url: avatarUrl}
  let res = await htr(url, method, data);
  return res;
}

const api_getMatchInfoList = async function(type, data) {
  let url = urlList.gameList[type];
  let res = await htr(url , 'GET', data);
  res = res || []
  res.map((matchInfo) => {
    return fmtMatchInfo(matchInfo)
  })
  return res || []
}

const api_getMatchInfo = async function(gameid, data) {
  let url = urlList.gameInfo +'\/'+gameid;
  let res = await htr(url, 'GET', data);
  res = fmtMatchInfo(res)
  return res || {}
}

const api_updateMatchInfo = async function(gameid, data) {
  let url = urlList.gameInfo +'\/'+gameid;
  let res = await htr(url, 'PUT', data);
  return res || {}
}

const api_addPlayer=async function(data){
  let url = urlList.addPlayer
  let res = await htr(url, 'POST', data)
  return res || {}
}

const api_cancelPlayer=async function(data){
  let url = urlList.cancelPlayer
  let res = await htr(url, 'DELETE', data)
  return res || {}
}

const api_deletePlayer=async function(data){
  let url = urlList.deletePlayer
  let res = await htr(url, 'DELETE', data)
  return res || {}
}

const api_changeRealname=async function(data){
  let url = urlList.changeRealname;
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
  let url = urlList.gameInfo;
  let res = await htr(url, 'POST',data);
  return res || {}
}

const api_postGroupList = async function(data) {
  let url = urlList.groupList;
  let res = await htr(url, 'POST',data);
  return res || {}
}

const api_getGroupList = async function(data) {
  let url = urlList.groupList;
  let res = await htr(url, 'GET',data);
  return res || {}
}

const api_putGroupInfo = async function(groupid, data){
  let url = urlList.groupList+'\/'+groupid
  let res=await htr(url, 'PUT',data)
  return res || {}
}

const api_getPersonalInfo = async function(){
  let url = urlList.getPersonalInfo
  let res= await htr(url, 'GET',data)
  return res || {}
}
export {
  api_getToken,
  api_getMatchInfoList,
  api_getMatchInfo,
  api_updateMatchInfo,
  api_addPlayer,
  api_cancelPlayer,
  api_deletePlayer,
  api_changeRealname,
  api_createGame,
  api_postGroupList,
  api_getGroupList,
  api_putGroupInfo,
  api_getPersonalInfo,
}
