import { api_getToken } from "./api";
import { setStorage } from "./util";

let userInfo = wx.getStorageSync('userInfo')

//获取登录凭证code
const _login = function(){
  return new Promise((resolve,reject)=>{
    wx.login({
      success: (res) => {
        resolve(res.code)
      },
      fail: reject
    })
  })
}

//获取用户信息（无需登录）
const _getUserInfo = function(){
  return new Promise((resolve,reject)=>{
    wx.getUserInfo({
      success: (res) => {
        resolve(res.userInfo)
      },
      fail: reject
    })
  })
}

const auth = async function() {
  let code = await _login()
  let userInfoWidthToken = await api_getToken(code, userInfo.nickName, userInfo.avatarUrl) || null
  if (userInfoWidthToken.token) {
    userInfo = userInfoWidthToken
    setStorage('userInfo', userInfoWidthToken)
    return true
  }
}

export {
  auth,
  userInfo,
}
