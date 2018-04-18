import {URLList,htr,formateDate,transformStatusAndTimeOfMatchInfo,
        getUserInfoWithToken,getUserInfoWithoutToken,login,formatNumber,setStorage} from './util';
const downLoadMatchInfoList=async function(type='my'){
  let url=(type==="my"?URLList.getGameListMyURL:URLList.getGameListAllURL);
  let token;
  let data={};
  if(type==="my"){
    let userInfo=await initUserInfo()
    if(!userInfo || !userInfo.token){
      return []
    }
    token=userInfo.token
    data={token:token}
  }
  let  method="GET";
  let res=await htr(url,method,data);
  if(res.data.code===1){
    let matchInfoList=res.data.data;
    for(let matchInfo of matchInfoList){
      matchInfo.ifIn=judgeIfIn(matchInfo)
      transformStatusAndTimeOfMatchInfo(matchInfo);
    }
    console.log('matchinfolist fn=',matchInfoList)
    return matchInfoList
  }else{
    return []
  }  
}
const downLoadMatchInfo=async function(gameid){
  let url=URLList.getGameInfoURL+'\/'+gameid,
      method="GET",
      data={};
  let res= await htr(url,method,data);
  let matchInfo=res.data.data;
  if(matchInfo){
    matchInfo.ifIn=judgeIfIn(matchInfo)
    // console.log('download matchinfo fn',matchInfo)
    return transformStatusAndTimeOfMatchInfo(matchInfo);
  }else{
    return {}
  }
}

const judgeIfIn=function(matchInfo){
    let players=matchInfo.players
    let uid=wx.getStorageSync('userInfo').uid
    let ifIn=false;
    if(Array.isArray(players)){ 
      ifIn=players.some((player)=>{return player.user.uid===uid})
    }
    return ifIn
  }
const updateMatchInfo =async function(gameid,options){
  let userInfo=await initUserInfo()
    if(!userInfo || !userInfo.token){
      return {}
    }
  let token=userInfo.token;
  let url=URLList.putGameInfoURL+'\/'+gameid,
      method="PUT",
      data=options;
  data.token=token;
  let res=await htr(url,method,data)
  if(res.data.code===1){
    return res.data.datai
  }
}
const getPlayersUidList=async function(gameid){
  let matchInfo=await downLoadMatchInfo(gameid)
  if(!matchInfo){
    return []
  }
  let playersList=matchInfo.players
  let playersUidList=[]
  playersList.forEach(userInfo => {
    playersUidList.push(userInfo.user.uid)
  });
  return playersUidList
}
 
const initUserInfo=async function() {
  let userInfo=wx.getStorageSync('userInfo')//先看是否已经缓存了 用户信息
  let token=userInfo.token;
  if(userInfo && token){//如果缓存了userinfo 和 token 直接返回
    return userInfo
  }
  if(!userInfo || !token){//如果没有缓存，说明用户没有登录 没有授权
    let resOfcode=await login();//先登录获取 临时code
    let resOfuserInfo=await getUserInfoWithoutToken();//获取登录后授权使用的 头像 昵称信息
    if(resOfcode.errMsg!=='login:ok' || resOfuserInfo.errMsg!=='getUserInfo:ok'){
      setStorage('userInfo',{})
      return {}//若用户中断的登录 授权，直接返回，失败
    }
    let code=resOfcode.code;
    let nickName=resOfuserInfo.userInfo.nickName;
    let avatarUrl=resOfuserInfo.userInfo.avatarUrl
    //这里是登录的时候拿到的用户信息，用code nickname avatarurl 去换token
    userInfo=await getUserInfoWithToken(code,nickName,avatarUrl)
    if(!userInfo.token){//标示拿到了带有openid的 用户信息
      setStorage('userInfo',{})
      return {}//失败
    }
    setStorage('userInfo',userInfo)//全部信息拿到后 存储userInfo
    return userInfo
  }
}
const addPlayer=async function(gameid){
  let userInfo=await initUserInfo()
  if(!userInfo || !userInfo.token){
    return {}
  }
  let token=userInfo.token;
  let url=URLList.addplayerURL,
      method="POST",
      data={
        token:token,
        gameid:gameid
      };
  let res=await htr(url,method,data);
  if(res.data.code===1){
    return res.data.data;//其实是matchInfoList,只有gameid 和 user 信息列表
  }else{
    return {}
  }
}
const changeRealname=async function(realName){
  let userInfo=await initUserInfo()
  if(!userInfo || !userInfo.token){
    return {}
  }
  let token=userInfo.token;
  let url=URLList.changeRealnameURl,
      method='POST',
      data={token:token,
            real_name:realName};
  let res=await htr(url,method,data);
  if(res.data.code===1){
    userInfo.real_name=realName
    await setStorage('userInfo',userInfo)
    return res.data.data //包含昵称和真是姓名的对象
  }else{
    return {}
  }
}
const createGame=async function(formData){
  let userInfo=await initUserInfo()
  if(!userInfo || !userInfo.token){
    return {}
  }
  let token=userInfo.token;
  let url=URLList.postGameInfoURL,
      method="POST",
      data={
        token:token,
        gamename:formData.theme,
        status:0,
        note:null,
        address:formData.address,
        begintime:formData.begintime,
        auto_signup:formData.auto_signup
      };
  let res=await htr(url,method,data)
  if(res.data.code===1){
    return res.data.data
  }else{
    return {}
  }
}
const postGroupList=async function(gameid,list){
  let userInfo=await initUserInfo()
  if(!userInfo || !userInfo.token){
    return {}
  }
  let token=userInfo.token;
  let url=URLList.postGroupListURl,
      method="POST",
      data={
        token:token,
        gameid:gameid,
        list:list
      };
   let res=await htr(url,method,data)
   if(res.data.code===1){
     return res.data.data
   }else{
     return {}
   }
}
const getGroupInfo=async function(gameid){
  let userInfo=await initUserInfo()
  let token=userInfo.token;
  let url=URLList.getGroupInfoURl,
      method="GET",
      data={
        token:token,
        gameid:gameid
      };
  let res=await htr(url,method,data)
  console.log('getGroupInfo',res)
  if(res.data.code===1){
    return res.data.data
  }else{
    return {}
  }
}
const putGroupInfo=async function(groupid,options){
  console.log('options--------',options)
  let userInfo=await initUserInfo()
  if(!userInfo || !userInfo.token){
    return {}
  }
  let token=userInfo.token;
  let url=URLList.postGroupListURl+'\/'+groupid,
      method="PUT",
      data=options;
  data.token=token;
  let res=await htr(url,method,data)
  console.log('putGroupInfo res=',res)
  if(res.data.code===1){
    return res.data.data
  }else{
    return {}
  }
}
const formatTime =(date,mark='/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(mark) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const share=function(path){
  return {
      path: path,
      success: function(res) {
        console.log("转发成功")
      },
      fail: function(res) {
        console.log("转发失败")
      }
    }
}
const transGroupListToGroupListWithPlayerInfo=function(groupList,playersList){
  let uKey=['id_a1','id_a2','id_b1','id_b2']
  groupList.forEach(groupInfo=>{
    for(let key of uKey){
      let uid=groupInfo[key]
      groupInfo[key]=getUserInfoByUid(uid,playersList)
    }
  })
  return groupList
}
const getUserInfoByUid=function(uid,playersList){
  let results=playersList.filter(playerInfo=>{
    return playerInfo.userid===uid
  })
  if(results.length){
    let userInfo={...results[0].user}
    userInfo.uid=results[0].userid;
    return userInfo
  }
}
export {downLoadMatchInfoList,
        downLoadMatchInfo,
        updateMatchInfo,
        getPlayersUidList,
        judgeIfIn,
        initUserInfo,
        addPlayer,
        changeRealname,
        createGame,
        formatTime,
        share,
        postGroupList,
        getGroupInfo,
        putGroupInfo,
        transGroupListToGroupListWithPlayerInfo}