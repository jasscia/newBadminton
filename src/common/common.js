import {URLList,htr,formateDate,transformStatusAndTimeOfMatchInfo,
        getOpenId,getUserInfo,login,formatNumber,setStorage} from './util';

const downLoadMatchList=async function(token){
  let url=URLList.getGameInfoURL,
      data={token},
      method="GET";
  let res=await htr(url,method,data);
  if(res.statusCode >=400){console.log('res.statusCode>=400',res.statusCode);return}
  if([200,206,304].indexOf(res.statusCode)===-1){console.log("res.statusCode not in [200,206,304]",res.status);return}
  if(res.data.data && !res.data.data.length){
    wx.showToast({
      title:'没有比赛',
      duration:1500})
    return
  }
  let matchList=res.data.data;
  for(let match of matchList){
    transformStatusAndTimeOfMatchInfo(match);
  }
  return matchList;
}
const downLoadMatchInfo=async function(gameid){
  let url=URLList.getGameInfoURL+'\/'+gameid,
      method="GET",
      data={};
  let res= await htr(url,method,data);
  let matchInfo=res.data.data;
  if(matchInfo){
    return transformStatusAndTimeOfMatchInfo(matchInfo);
  } 
}
const updateMatchInfo=async function(gameid,originMatchInfo){   
    let newMatchInfo=await downLoadMatchInfo;
    if(newMatchInfo){
      let originMatchInfoKeys=Object.keys(originMatchInfo),
          newMatchInfoKeys=Object.keys(newMatchInfo);
      originMatchInfoKeys.forEach(key=>{
        if(newMatchInfoKeys.includes(key)){
          originMatchInfo[key]=newMatchInfo[key]
        }
      })
      return originMatchInfo
  }
}
 
const initUserInfo=async function() {
  let openId = wx.getStorageSync('openId');
  let userInfo = wx.getStorageSync('userInfo');
  if (!openId) {
    let loginRes=await login();
    let code=loginRes.code;
    let getuserInfoRes= await getUserInfo();
    let {nickName,avatarUrl,gender}=getuserInfoRes.userInfo;
    let userInfo={nickName,avatarUrl,gender};
    setStorage('userInfo',userInfo);
    openId=await getOpenId(code,userInfo.nickName,userInfo.avatarUrl);
    setStorage('openId',openId);
  }
}
const addPlayer=async function(e){
  let url=URLList.addplayerURL,
      method="POST",
      data={
        token:wx.getStorageSync('openId'),
        gameid:e.target.dataset.gameid
      };
  let res=await htr(url,method,data);
  if(res.errMsg==="request:ok"){
    return 'ok';
  }
}
const changeRealname=async function(openId,realName){
  console.log('进入 changeRealname fn');
  if(openId){
    let url=URLList.changeRealnameURl,
        method='POST',
        data={token:openId,
              realName:realName};
      let res=await htr(url,method,data);
      console.log(res,data);
      return res
  }
}
const createGame=async function(formData,openId){
  // formData.token=openId;
  // formData.gamename=formData.theme;
  // formData.status=0;
  // formData.note="";
  // formData.address=formData.address;
  // formData.begintime=formData.time;
  // console.log(formData);
  const success=function(){
    wx.showToast({
      title:'创建成功',
      icon:'success',
      duration:1500
    })
  },
  fail=function(err){
    wx.showModal({
      title:'创建失败',
      content:err.msg
    })
  };
  let url=URLList.getGameInfoURL,
      method="POST",
      data={
        token:openId,
        gamename:formData.theme,
        status:0,
        note:null,
        address:formData.address,
        begintime:formData.time
      };
  htr(url,method,data).then(success,fail)
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
export {downLoadMatchList,
        downLoadMatchInfo,
        updateMatchInfo,
        initUserInfo,
        addPlayer,
        changeRealname,
        createGame,
        formatTime}