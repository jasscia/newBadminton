function wxLogin(){
  return new Promise((resolve,reject)=>{
    wx.login({
      success:resolve,
      fail:reject
    })
  })
}

async function serverLogin(){
  try{
    let loginResult = wxLogin()
  }catch(e){

  }
}
