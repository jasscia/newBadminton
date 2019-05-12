import {userInfo} from './login'
import {statusList} from './config'

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

const fmtMatchInfo = function(matchInfo){                                                              
  matchInfo.progressData = calcprogress(matchInfo)                                                                           
  matchInfo.ifIn = _judgeIfIn(matchInfo)                                                                                      
  matchInfo.groupWithInfo = _getGroupListWithPlayerInfo(matchInfo)                                                            
  matchInfo.contorlAttr = _calcContorlAttr(matchInfo)                                                                         
  matchInfo.limitForLive = _calcLimitForLive(matchInfo)

  _transStatus(matchInfo)
  _transTime(matchInfo)
  return matchInfo;
}

const formateDate=(time)=>{
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

const formateTime =(date, mark='/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join(mark) + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  //改成两位数
  n = n.toString()
  return n[1] ? n : '0' + n
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
  return {doneNum, totalNum, progress}                                                                             
}   

export {
  formateDate,
  formateTime,
  fmtMatchInfo,
  formatNumber,
  share,
  calcprogress
}

const _judgeIfIn=function(matchInfo){                                                                                    
  let players=matchInfo.players                                                                                       
  let uid=wx.getStorageSync('userInfo').uid                                                                       
  let ifIn=false;                                                                                                     
  if(Array.isArray(players)){                                                                                         
    ifIn=players.some((player)=>{return player.user.uid===uid})                                                       
  }                                                                                                                   
  return ifIn                                                                                                         
}

const _getGroupListWithPlayerInfo=function(matchInfo){                                                                   
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
       groupListWithPlayerInfo[index][key] = _getUserInfoByUid(uid,playersList)                                            
     }                                                                                                                  
   })                                                                                                                   
   return groupListWithPlayerInfo                                                                                       
}

const _calcContorlAttr=function(matchInfo){                                                                                   
  let contorlAttr={}                                                                                                         
  if(!matchInfo){return {}}                                                                                                  
  let userInfo=wx.getStorageSync('userInfo')                                                                                 
  contorlAttr.ifOwner= matchInfo.owner.uid===userInfo.uid                                                               
  contorlAttr.ifDone=matchInfo.status === 3                                                                               
  contorlAttr.ifGoingon=(matchInfo.status === 2)                                                                          
  contorlAttr.ifStarted=(matchInfo.status > 1)                                                                            
  contorlAttr.ifStopSingup=(matchInfo.status >=1 || matchInfo.players.length >= 16 )                                                                        
  contorlAttr.ifOkToStart=(matchInfo.players.length >=4 && contorlAttr.ifOwner && matchInfo.status < 2)                    
  contorlAttr.ifOktoSignup=(!matchInfo.ifIn &&! contorlAttr.ifStopSingup)
  contorlAttr.ifOktoSignout=(matchInfo.ifIn &&! contorlAttr.ifStopSingup)                                               
  contorlAttr.ifOktoShare=contorlAttr.ifStarted
  contorlAttr.ifOktoInviate=!contorlAttr.ifStopSingup                                                                   
  return contorlAttr
}                                                                                                                    
//判断权限                                                                                                              
const _calcLimitForLive=function(matchInfo){                                                                             
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

//修改状态
const _transStatus = function(matchInfo) {
  matchInfo.status = statusList[matchInfo.status || 0]
}

const _transTime = function(matchInfo) {
  matchInfo.begintime=formateDate(new Date(matchInfo.begintime));
  matchInfo.created_at=formateDate(new Date(matchInfo.created_at));
  matchInfo.updated_at=formateDate(new Date(matchInfo.updated_at));
}

const _getUserInfoByUid = function(uid, playersList){                                                                                                                                                                   
  let results = playersList.filter(playerInfo=>{                                                                               
    return playerInfo.userid===uid                                                                                      
  })                                                                                                                         
  if(results.length){                                                                                                        
    let userInfo={...results[0].user}                                                                                        
    userInfo.uid=results[0].userid;                                                                                          
    return userInfo                                                                                                          
  }                                                                                                                          
} 