import {URLList,htr,formateDate,transformStatusAndTimeOfMatchInfo,
        getUserInfoWithToken,getUserInfoWithoutToken,login,formatNumber,setStorage} from './util';
const downLoadMatchInfoList=async function(token,type='my'){
  let url=(type==="my"?URLList.getGameListMyURL:URLList.getGameListAllURL);
  let data={token},
      method="GET";
  let res=await htr(url,method,data);
  if(res.statusCode >=400){
    console.log('res.statusCode>=400',res.statusCode);
    return}
  if([200,206,304].indexOf(res.statusCode)===-1){
    console.log("res.statusCode not in [200,206,304]",res.statusCode);
    return}
  // if(res.data.data && !res.data.data.length){
  //   wx.showToast({
  //     title:'没有比赛',
  //     duration:1500})
  //   return
  // }
  let matchInfoList=res.data.data;
  for(let matchInfo of matchInfoList){
    matchInfo.ifIn=judgeIfIn(matchInfo)
    transformStatusAndTimeOfMatchInfo(matchInfo);
  }
  console.log('download matchinfolist fn',matchInfoList)
  return matchInfoList;
}
const downLoadMatchInfo=async function(gameid){
  let url=URLList.getGameInfoURL+'\/'+gameid,
      method="GET",
      data={};
  let res= await htr(url,method,data);
  let matchInfo=res.data.data;
  if(matchInfo){
    matchInfo.ifIn=judgeIfIn(matchInfo)
  } 
  console.log('download matchinfo fn',matchInfo)
  return transformStatusAndTimeOfMatchInfo(matchInfo);
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
  let url=URLList.putGameInfoURL+'\/'+gameid,
      method="PUT",
      data=options;
  let res=await htr(url,method,data)
}
 
const initUserInfo=async function() {
  let userInfo=wx.getStorageSync('userInfo')
  let token=userInfo.token;
  if(userInfo && token){
    return userInfo
  }
  if(!userInfo || !token){
    let resOfcode=await login();
    let resOfuserInfo=await getUserInfoWithoutToken();
    console.log('when login ,return data=',resOfcode)
    console.log('when get userinfo ,return data=',resOfuserInfo)
    if(resOfcode.errMsg!=='login:ok' || resOfuserInfo.errMsg!=='getUserInfo:ok'){
      return
    }
    let code=resOfcode.code;
    let nickName=resOfuserInfo.userInfo.nickName;
    let avatarUrl=resOfuserInfo.userInfo.avatarUrl//这里是登录的时候拿到的用户信息，下一步根据用户的信息去调 用户唯一识别符
  
    userInfo=await getUserInfoWithToken(code,nickName,avatarUrl)
    console.log('when get userinfo from oppenId ,return data=',userInfo)
    if(!userInfo.token){//标示拿到了带有openid的 用户信息
      return
    }
    setStorage('userInfo',userInfo)
    return userInfo
  }
}
const addPlayer=async function(token,gameid){
  let url=URLList.addplayerURL,
      method="POST",
      data={
        token:token,
        gameid:gameid
      };
  let res=await htr(url,method,data);
  console.log('addPlayer fn,res=',res.data)
  if(res.data.code===1){
    return res.data.data;//其实是matchInfoList,只有gameid 和 user 信息列表
  }
}
const changeRealname=async function(token,realName){
  console.log('进入 changeRealname fn');
  if(token){
    let url=URLList.changeRealnameURl,
        method='POST',
        data={token:token,
              realName:realName};
      let res=await htr(url,method,data);
      console.log(res,data);
      return res
  }
}
const createGame=async function(formData,token){
  let url=URLList.postGameInfoURL,
      method="POST",
      data={
        token:token,
        gamename:formData.theme,
        status:0,
        note:null,
        address:formData.address,
        begintime:formData.begintime
      };
  const success=async function(){
    await wx.showToast({
      title:'创建成功,返回赛事列表',
      icon:'success',
      duration:1500
    })
    wx.navigateBack({delta: 1})
  },
  fail=function(err){
    wx.showModal({
      title:'创建失败',
      content:err.msg
    })
  };
  htr(url,method,data).then(success,fail)
}

const postGroupList=function(token,gameid,list){
  let url=URLList.postGroupListURl,
      method="POST",
      data={
        token:token,
        gameid:gameid,
        list:list
      };
    htr(url,method,data)
}
const getGroupInfo=function(token,gameid){
  let url=URLList.postGroupListURl,
      method="GET",
      data={
        token:token,
        gameid:gameid
      };
    htr(url,method,data)
}
const putGroupInfo=function(token,gameid,groupid,scoreA,scoreB,status){
  let url=URLList.postGroupListURl+'\/'+groupid,
      method="PUT",
      data={
        token:token,
        gameid:gameid,
        score_a:scoreA,
        score_b:scoreB,
        status:status
      };
    htr(url,method,data)
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
      title: 'CGGC羽球赛',
      path: path,
      // imgUrl:'../image/src.jpg',
      success: function(res) {
        console.log("转发成功")
      },
      fail: function(res) {
        console.log("转发失败")
      }
    }
}
export {downLoadMatchInfoList,
        downLoadMatchInfo,
        updateMatchInfo,
        judgeIfIn,
        initUserInfo,
        addPlayer,
        changeRealname,
        createGame,
        formatTime,
        share,
        postGroupList,
        getGroupInfo,
        putGroupInfo}