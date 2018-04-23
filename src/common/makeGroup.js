import {htr} from './util';
  //方案1
  function badmin(personNum,roundPre){
    this.personNum=personNum;//参赛人数
    this.roundPre=roundPre;//预设的 每人参赛场数
    this.maxTime=Math.ceil(roundPre/(personNum-1),0);//为了公平，设定的 两人组队teamMeat 在整个过程中 出现的最多次数
    this.maxRepeatTeam=roundPre%(personNum-1)||(personNum-1);//为了公平 设定的 比正常的多打1场的 两人组队的个数，例如4个人没人打5场的时候，就会有2组比别人对打1场
    this.round=personNum*roundPre/4;//总共的场数  四个人算一场
    this.verRound=personNum*roundPre;//虚拟的场数
    this.result={1:[],2:[],3:[],4:[]};//数组用于存放 最终结果
    this.restPerson=[];//计算过程中，每次随机取值，都从这个数组中取值，当某个人打满预设场次的时候，就会从这个数组总剔除
    this.personFlag={};//数组用于存放 每个人在全过程中出现的次数
    this.teamMateFlag={};//数组用于存放 每两个人组队teamMeat 在全过程中出现的次数
    this.start();
  }
  badmin.prototype.start=function(){//从这里开始
  if(0!==this.verRound%4){
    this.result='数据不符合要求，应该能被4整除';
    return}
  if(this.personNum<4){
    this.result='数据不符合要求，人数不能少于4人';
    return}
  if(!this.roundPre){
    this.result='没人场次不能为0';
    return}
  let count=0;
  while(this.result[1].length<this.round){
      this.init();
      this.getRes();
      count++;
      if(count===50){
        if(this.result[1].length<this.round){
          this.result="排阵失败 Try one more time!"
        }
        return;
      }
    }
    // console.log(count);
      let personflags=[],teammateflags=[];
      for(let person of Object.keys(this.personFlag)){
        personflags.push(this.personFlag[person])
      }
      for(let teammeat of Object.keys(this.teamMateFlag)){
        teammateflags.push(this.teamMateFlag[teammeat])
      }
    // console.log('personflags=',personflags,'teammateflags=',teammateflags);
    if(this.result[1].length<this.round){
          this.result="排阵失败 Try one more time!"
        }else{
    // console.table(this.result);
  }
  }
  badmin.prototype.init=function(){
    //这里开始标示 flag的状态，初始的均为0，flag代表出现次数
    //另外是restPerson，当某个人的次数 达到上限时候，就从rest中剔除，restPerson表示随机抽取数据的 数据库
    this.result={1:[],2:[],3:[],4:[]};//初始化结果数组
    for(let i=0;i<this.personNum;i++){
      this.personFlag[i+1]=0;//初始化人员表示数组
      this.restPerson.push(i+1);//初始化 符合条件的人员库 数组
      for(let j=i+1;j<this.personNum;j++){
        let teamMate=[i+1,j+1].join(' ');
        this.teamMateFlag[teamMate]=0;//初始化 teamMate标示库
      }
    }
  }
  badmin.prototype.getRes=function(){
    //随机生成 组队
    let count=0;//计数 随机的次数，为了防止死循环，设置count 结束死循环
    while(this.result[1].length<this.round && count<this.round*1000){//当result的长度等于rount时候，排序完成
      let item=[];//每组随机生成4个数字，放在item中，标示一场中的四个人
      if(this.restPerson.length===4){//当可选库只有四个人的时候，就不随机了，把所有的3中组合列出来，依次判断是否符合要求即可
          this.judge([this.restPerson[0],this.restPerson[1],this.restPerson[2],this.restPerson[3]]);
          this.judge([this.restPerson[0],this.restPerson[2],this.restPerson[1],this.restPerson[3]]);
          this.judge([this.restPerson[0],this.restPerson[3],this.restPerson[1],this.restPerson[2]]);
          return ;     
        }
      for(let i=0;i<2;i++){//当可选库大于有四个人的时候，采用随机的方式
          let index1=rand(0,this.restPerson.length-1);
          let index2=rand(0,this.restPerson.length-1);
          let max=Math.max(this.restPerson[index1],this.restPerson[index2]);
          let min=Math.min(this.restPerson[index1],this.restPerson[index2]);
          item.push(min);
          item.push(max);
      }

      this.judge(item);
      count++;
    }
  }
//判断 已经组队的 是否满足规则
  badmin.prototype.judge=function(item){
// 规则1：同一个人不能出现在同一组中，判断随机生成的item中是否有重复的人员
    let personList=new Set(item);
    if(personList.size!==4){
      return false
    }
// 规则2：每一个人 出现roundPre次
    let flag=false;
    for(let i=0;i<this.personNum;i++){//先剔除已经满场的人员
      if((this.personFlag[i+1]===this.roundPre) && this.restPerson.includes(i+1)){
        this.restPerson.splice(this.restPerson.indexOf(i+1),1);
      }
    }
    for(let i=0;i<4;i++){//如果 随机生成的四个人中，有人不在 人员库中，该item不符合要求
      if(!this.restPerson.includes(item[i])){  
        return false;
      }
    }
// 规则3：同两个人 在所有组队中 出现的次数最多为max
    let teamA=item.slice(0,2).join(' ');
    let teamB=item.slice(2,4).join(' ');
    let maxTeam=Math.max(this.teamMateFlag[teamA],this.teamMateFlag[teamB]);//某一队 超出上限时候，该item不符合要求
    if(maxTeam>=this.maxTime){
      return false
    } 
// 规则4：每一轮结束后，每个人的场次数量相差最多为1；
//这是一条软规则，防止最终结果排阵失败，
let max=0,
    min=this.roundPre;
  for(let i=0;i<this.personNum;i++){
    let verTime=this.personFlag[i+1]+(item.includes(i+1)?1:0);
    max=Math.max(max,verTime);
    min=Math.min(min,verTime);
    if(max-min>1){
      return false
    }
  }
  // 规则5：每一轮结束后，每组队员的场次数量相差最多为1；
//这是一条软规则，防止最终结果排阵失败，
    max=0,
    min=this.maxTime;
  let teamMates=Object.keys(this.teamMateFlag);
  for(let team of teamMates){
    let verTime=this.teamMateFlag[team]+(team===teamA||team===teamB?1:0);
    max=Math.max(max,verTime);
    min=Math.min(min,verTime);
    if(max-min>1){
      return false
    }
  }
//当满足以上四个规则时候，将该item 插入到已排队列中
    this.result[1].push(item[0]);
    this.result[2].push(item[1]);
    this.result[3].push(item[2]);
    this.result[4].push(item[3]);
//依次更新 flag的数据
    this.teamMateFlag[teamA]++;
    this.teamMateFlag[teamB]++;
    this.personFlag[item[0]]++;
    this.personFlag[item[1]]++;
    this.personFlag[item[2]]++;
    this.personFlag[item[3]]++;
  }

function rand(L,R){
    return Math.round(Math.random()*(R-L),0)+L
  }


  //方案2
  const requestTableList = async function(personCount,roundCount) {
    let url = `https://gzbtestsystem.cn/badminton/againsttable?NumberOfPeople=${personCount}&RoundsOfPerson=${roundCount}&format=json`;
    let method = "GET";
    let data={};
    let res=await htr(url,method,data);
    if(res.data.AgainstTable){
      return res.data.AgainstTable
    }
    if(res.data.ResponseStatus){
      // console.log(res.data.ResponseStatus.Message)
      return res.data.ResponseStatus.Message
    }
  }
  export { badmin,requestTableList}