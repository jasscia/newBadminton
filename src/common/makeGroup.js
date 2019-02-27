import {htr} from './util';
  //方案1-Badmin结束
  function Badmin(personNum,roundPer){
    this.personNum = personNum;//参赛人数
    this.roundPer = roundPer;//预设的 每人参赛场数
    this.maxTime = Math.ceil(roundPer / (personNum - 1), 0);//为了公平，设定的 两人组队teamMeat 在整个过程中 出现的最多次数
    this.minTime = Math.floor(roundPer / (personNum - 1),0);//为了公平，设定的 两人组队teamMeat 在整个过程中 出现的最少次数
    this.maxRepeatTeam = 0;
    this.round = personNum * roundPer / 4;//总共的场数  四个人算一场
    this.result = {};//数组用于存放 最终结果
    this.personList=[];
    this.personFlag = [];//数组用于存放 每个人在全过程中出现的次数
    this.teamMateList=[];
    this.teamMateFlag = [];//数组用于存放 每两个人组队teamMeat 在全过程中出现的次数

    for (let i = 0; i < this.personNum; i++) {
      this.personList.push(i+1);
      for (let j = i + 1; j < this.personNum; j++) {
        let teamMate = [i + 1, j + 1].join(' ');
        this.teamMateList.push(teamMate);//初始化 teamMate标示库
      }
    }
    this.maxRepeatTeam=this.round*2-this.minTime*this.teamMateList.length;
    this.personFlag.length=this.personList.length;
    this.teamMateFlag.length=this.teamMateList.length;

    this.start();
  }
  Badmin.prototype.start = function () {//从这里开始
      if (0 !== this.personNum * this.roundPer % 4) {
        this.result = '数据不符合要求，应该能被4整除';
        return
      }
      if (this.personNum < 4) {
        this.result = '数据不符合要求，人数不能少于4人';
        return
      }
      this.getRes();
      if (this.result.length < this.round) {
        this.result = "排阵失败 Try one more time!";
        // console.log('personflags=', this.personFlag, '\nteammateflags=', this.teamMateFlag);
        return
      }
      // console.log('第',tryTimes_1,'次 计算出结果');
      console.log('personflags=', this.personFlag, '\nteammateflags=', this.teamMateFlag);
    }
    Badmin.prototype.init = function () {
      this.result = {1:[],2:[],3:[],4:[]};//初始化结果数组
      this.personFlag.fill(0)
      this.teamMateFlag.fill(0)
    }
    Badmin.prototype.getRes=function(){
      let tryTimes_1 = 0;//标示整体的尝试次数
      do{
        this.init();
        for(let round=0;round<this.round;round++){
          let item=[];
          let ifOk=true
          for(let i=0;i<4 && ifOk;i++){
            let tryTimes_2=0;//标示某一个位置的尝试次数
            do{//找到一个随机数，使他能被放在 item 中
              ifOk=false
              let index_person=random(0,this.personNum-1)
              if(this.personFlag[index_person]<this.roundPer && !item.includes(this.personList[index_person])){//随机生成的的数字不能是已经达到上限 且 不能与item其他成员重复
                if(i%2){
                  let biger=Math.max(item[i-1],this.personList[index_person]);
                  let smaller=Math.min(item[i-1],this.personList[index_person]);
                  let team=[smaller,biger].join(' ');
                  let index_teamMate=this.teamMateList.indexOf(team);
                  let limit=this.maxTime
                  let verTeamMateFlag=this.teamMateFlag.slice()
                  verTeamMateFlag[index_teamMate]++
                  let upToLimit=verTeamMateFlag.filter(value=>{
                    return value>=this.maxTime
                  })
                  if(upToLimit.length>=this.maxRepeatTeam){
                    limit=this.minTime;
                  }
                  if(verTeamMateFlag[index_teamMate]<=limit){
                  // if(this.teamMateFlag[index_teamMate]<limit){
                    ifOk=true
                  }
                }else{
                  ifOk=true
                }
              }
              if(ifOk){
                item.push(this.personList[index_person])
              }
              tryTimes_2++
            }while(!ifOk && tryTimes_2<this.personNum*4)
          }
          if(item.length===4){
            if(item[0]>item[1]){
              swip(item,0,1)
            }
            if(item[2]>item[3]){
              swip(item,2,3)
            }
            this.update(item)
          }
        }
        tryTimes_1++
      } while (this.result[1].length<this.round && tryTimes_1<this.round*4)
    }
    Badmin.prototype.update=function(item){
      let teamA=[item[0],item[1]].join(' ');
      let teamB=[item[2],item[3]].join(' ');
      this.teamMateFlag[this.teamMateList.indexOf(teamA)]++
      this.teamMateFlag[this.teamMateList.indexOf(teamB)]++
      for(let i=0;i<4;i++){
        this.personFlag[this.personList.indexOf(item[i])]++
      }
      // this.result.push(item)
      for(let i=0;i<4;i++){
        this.result[i+1].push(item[i]);
      }
    }
    function swip(arr,i,j){
      let temp=arr[i];
          arr[i]=arr[j];
          arr[j]=temp;
    }
    function random(L, R) {
      return parseInt(Math.random() * (R - L+1)) + L
    }
  //方案1-Badmin结束
   //方案1-badmin
    function badmin(personNum, roundPer) {
      this.personNum = personNum;//参赛人数
      this.roundPer = roundPer;//预设的 每人参赛场数
      this.maxTime = Math.ceil(roundPer / (personNum - 1), 0);//为了公平，设定的 两人组队teamMeat 在整个过程中 出现的最多次数
      this.round = personNum * roundPer / 4;//总共的场数  四个人算一场
      this.result = {};//数组用于存放 最终结果
      this.restPerson = [];//计算过程中，每次随机取值，都从这个数组中取值，当某个人打满预设场次的时候，就会从这个数组总剔除
      this.personFlag = {};//数组用于存放 每个人在全过程中出现的次数
      this.teamMateFlag = {};//数组用于存放 每两个人组队teamMeat 在全过程中出现的次数
      this.currentItem,
      this.nextItem,
      this.start();
    }
    badmin.prototype.start = function () {//从这里开始
      if (0 !== this.personNum * this.roundPer % 4) {
        this.result = '数据不符合要求，应该能被4整除';
        return
      }
      if (this.personNum < 4) {
        this.result = '数据不符合要求，人数不能少于4人';
        return
      }
      this.getRes();
      if (this.result[1].length < this.round) {
        this.result = "排阵失败 Try one more time!";
        // console.log('personflags=', this.personFlag, '\nteammateflags=', this.teamMateFlag);
        return
      }
      // console.log('第',tryTimes_1,'次 计算出结果');
      console.log('personflags=', this.personFlag, '\nteammateflags=', this.teamMateFlag);
    }
    badmin.prototype.init = function () {
      //这里开始标示 *flag的状态，初始的均为0，*flag代表出现次数
      //另外是restPerson，当某个人的次数 达到上限时候，就从rest中剔除，restPerson表示随机抽取数据的 数据库
      this.result = { 1: [], 2: [], 3: [], 4: [] };//初始化结果数组
      this.restPerson=[];
      this.personFlag={};
      this.teamMateFlag={};
      for (let i = 0; i < this.personNum; i++) {
        this.personFlag[i + 1] = 0;//初始化人员表示数组
        this.restPerson.push(i + 1);//初始化 符合条件的人员库 数组
        for (let j = i + 1; j < this.personNum; j++) {
          teamMate = [i + 1, j + 1].join(' ');
          this.teamMateFlag[teamMate] = 0;//初始化 teamMate标示库
        }
      }
    }
    badmin.prototype.getRes = function () {
      this.init();
      let flag;
      do{
        flag=false;
        let len=this.restPerson.length;
        // console.log('第'+(this.result[1].length+1)+'场试排：','共需要完成'+this.round+'场')
        // console.log('此时剩余人数为'+len,'they are'+this.restPerson)
          for(let i=0;i<len-1 && !flag;i++){//item[0]
            for (let j=len-1;j>i && !flag;j--){//item[1]
              for(let k=0;k<len-1 && !flag;k++){//item[2]
                if(k!==i && k !==j){
                  for(let l=len-1;l>k && !flag;l--){//item[3]
                  if(l!==i && l!==j){
                    let item;
                    if(this.nextItem){
                      item=this.nextItem;
                      flag=this.judge(item);
                    }
                    if(!flag){
                      item=[this.restPerson[i],this.restPerson[j],this.restPerson[k],this.restPerson[l]]
                      flag=this.judge(item)
                    }
                    if(flag){
                      this.update()
                    }
                  }
                }
              }
            }
          }
        }
      }while(this.result[1].length < this.round && flag)
    }
    //判断 已经组队的 是否满足规则
    badmin.prototype.judge = function (item) {
      // 规则2：同两个人 在所有组队中 出现的次数最多为max
      let teamA = item.slice(0, 2).join(' ');
      let teamB = item.slice(2, 4).join(' ');
      if (Math.max(this.teamMateFlag[teamA], this.teamMateFlag[teamB])+1 > this.maxTime) {
        return false
      }
      // 规则3：每一轮结束后，每个人的场次数量相差最多为1；这是一条软规则，防止最终结果排阵失败
      let verPersonFlag=Object.assign({},this.personFlag)
      for(let i=0;i<4;i++){
        verPersonFlag[item[i]]++
      }
      let verPersonFlag_arr=Object.values(verPersonFlag)
      if(Math.max(...verPersonFlag_arr)-Math.min(...verPersonFlag_arr)>1){
        return false
      }
      // 规则4：每一轮结束后，每组队员的场次数量相差最多为1；这是一条软规则，防止最终结果排阵失败，
      let verTeamMateFlag=Object.assign({},this.teamMateFlag)
      verTeamMateFlag[teamA]++;
      verTeamMateFlag[teamB]++;
      let verTeamMateFlag_arr=Object.values(verTeamMateFlag);
      let max=Math.max(...verTeamMateFlag_arr);
      let min=Math.min(...verTeamMateFlag_arr)
      if(max-min>1){
        return false
      }
      //规则5：当试排后 personFlag标示 只有4个人可选的时候，看下一下这4的人是否能够组队 如果不能组队，则试排失败
      let minFlag=Math.min(...Object.values(verPersonFlag))
      let optPerson=[];
      for(let key in verPersonFlag){
        if(verPersonFlag[key]==minFlag){
          optPerson.push(parseInt(key))
        }
      }
      if(optPerson.length===4){
        this.nextItem=null;
        for(let i=1;i<4;i++){//第1位和其他三位均尝试组合
          let j,k;
          for(let m=1;m<4;m++){//找出剩余的2位
            if(m!==i){
              if(!j){
                j=m
              }else if(!k){
                k=m
              }
            }
          }
          let a1=optPerson[0],a2=optPerson[i],b1=optPerson[j],b2=optPerson[k];
          let verTeamA=[a1,a2].join(' ');
          let verTeamB=[b1,b2].join(' ');
          if(Math.max(verTeamMateFlag[verTeamA],verTeamMateFlag[verTeamB])==min){
            i=4
            this.nextItem=[a1,a2,b1,b2]
          }
        }
        if(!this.nextItem){
          return false
        }
      }
      this.currentItem=item
      return true
    }
    badmin.prototype.update=function(){
      //当满足以上4个规则时候，跟新数据状态
      for(let i=0;i<4;i++){
        this.result[i+1].push(this.currentItem[i]);//更新result
        this.personFlag[this.currentItem[i]]++;//更新personFlag
        if ((this.personFlag[this.currentItem[i]] == this.roundPer)) {//更新restPerson的数据
          let index=this.restPerson.indexOf(this.currentItem[i]);
          this.restPerson.splice(index, 1);
        }
      }
      //依次更新 teamMateflag的数据
      let teamA = this.currentItem.slice(0, 2).join(' ');
      let teamB = this.currentItem.slice(2, 4).join(' ');
      this.teamMateFlag[teamA]++;
      this.teamMateFlag[teamB]++;
      // return true
    }
  //方案1-badmin结束

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
    //方案结束

  export { Badmin,badmin,requestTableList}
