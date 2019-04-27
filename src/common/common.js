import {formateDate, transformStatusAndTimeOfMatchInfo,
        getUserInfoWithToken, getUserInfoWithoutToken, login, getUserInfo, formatNumber, setStorage} from './util';
import {api_getToken} from './api'

const judgeIfIn = function(matchInfo){
  let players = matchInfo.players
  let uid = wx.getStorageSync('userInfo').uid
  let ifIn = false;
  if(Array.isArray(players)){
    ifIn = players.some((player) => {return player.user.uid === uid})
  }
  return ifIn
}

const initUserInfo = async function(e) {
  let userInfo = wx.getStorageSync('userInfo')//先看是否已经缓存了 用户信息
   
  if(userInfo && userInfo.token){//如果缓存了userinfo 和 token 直接返回
    return userInfo
  }
  if(!userInfo || !userInfo.token){//如果没有缓存，说明用户没有登录 没有授权
    let code = await login();//先登录获取 临时code
    try {
      if (e && e.detail) {
        userInfo = e.detail
      } else {
        userInfo = await getUserInfo();//获取登录后授权使用的 头像 昵称信息
        //这里 由于微信版本更新， wx.getUserInfo 可能会不正常工作
      }
    } catch (e){
      setStorage('userInfo',{})
      return {};
    }
    if(!code || !userInfo){
      setStorage('userInfo',{})
      return {}//若用户中断的登录 授权，直接返回，失败
    }

    //这里是登录的时候拿到的用户信息，用code nickname avatarurl 去换token
    token = await api_getToken(code, userInfo.nickName, userInfo.avatarUrl)

    if(!token){//标示拿到了带有openid的 用户信息
      setStorage('userInfo',{})
      return {}//失败
    }
    userInfo.token = token
    setStorage('userInfo',userInfo)//全部信息拿到后 存储userInfo
    return userInfo
  }
}

const share = function(path){
  return {
      path: path,
      imageUrl: '/image/share.png',
      success: function(res) {
        console.log("转发成功",res,path)
      },
      fail: function(res) {
        console.log("转发失败",res,path)
      }
    }
}

const getPlayersUidList = async function(matchInfo){
  let playersList = matchInfo.players
  let playersUidList=[]
  playersList.forEach(userInfo => {
    playersUidList.push(userInfo.user.uid)
  });
  return playersUidList
}

const getUserInfoByUid = function(uid, playersList){
  let results=playersList.filter(playerInfo=>{
    return playerInfo.userid===uid
  })
  if(results.length){
    let userInfo={...results[0].user}
    userInfo.uid=results[0].userid;
    return userInfo
  }
}

const getGroupListWithPlayerInfo=function(matchInfo){
  let groupListOnlyPlayerUid=[]
  let groupListWithPlayerInfo=[]
  let playersList=[]
   if(matchInfo.players){
     playersList=matchInfo.players
   }else{return []}
   if(matchInfo.group){
     groupListOnlyPlayerUid=matchInfo.group
   }else{return []}

   let uKey=['id_a1','id_a2','id_b1','id_b2']
   groupListOnlyPlayerUid.forEach((groupInfo,index)=>{
    groupListWithPlayerInfo[index]=groupInfo
     for(let key of uKey){
       let uid=groupInfo[key]
       groupListWithPlayerInfo[index][key]=getUserInfoByUid(uid,playersList)
     }
   })
   return groupListWithPlayerInfo
}

const calcprogress=function(matchInfo){
  let doneNum=0
  let totalNum=0
  let progress=0
  let groupList=matchInfo.group
  if(!groupList || !groupList.length){
    return{doneNum,totalNum,progress}
  }
  let doneList=groupList.filter(groupInfo => {
    return groupInfo.status
  });
  doneNum=doneList.length
  totalNum=groupList.length
  if(totalNum){
    progress=Math.round(doneNum/totalNum*100,2)
  }
  return {doneNum,totalNum,progress}
}

const calcContorlAttr=function(matchInfo){
  let contorlAttr={}
  if(!matchInfo){return {}}
  let userInfo=wx.getStorageSync('userInfo')
  contorlAttr.ifOwner= matchInfo.owner.uid===userInfo.uid
  contorlAttr.ifDone=matchInfo.status===3
  contorlAttr.ifGoingon=(matchInfo.status===2)
  contorlAttr.ifStarted=(matchInfo.status>1)
  contorlAttr.ifStopSingup=(matchInfo.status>=1)
  contorlAttr.ifOkToStart=(matchInfo.players.length>=4 && contorlAttr.ifOwner && matchInfo.status<2)
  contorlAttr.ifOktoSignup=(!matchInfo.ifIn&&!contorlAttr.ifStopSingup)
  contorlAttr.ifOktoShare=contorlAttr.ifStarted
  contorlAttr.ifOktoInviate=!contorlAttr.ifStopSingup
  return contorlAttr
}

//判断权限
const calcLimitForLive=function(matchInfo){
let my_uid=wx.getStorageSync('userInfo').uid
if(!my_uid){//
  return 'readOnly'
}
if(matchInfo.owner.uid!==my_uid){
  return'readOnly'
}
if(matchInfo.status===3){
  return'readOnly'
}
if(matchInfo.status===2){
  return'writableOnlyScore'
}
  return'writableAll'
}

export {
  getPlayersUidList,
  judgeIfIn,
  initUserInfo,
  share,
  calcprogress,
}
