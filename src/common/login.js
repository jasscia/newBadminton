import { api_getToken } from "./api";

let userInfo = wx.getStorageSync('userInfo')

//获取登录凭证code
const _login = function(){
  return new Promise((resolve, reject = () => {console.log('wx.login fail')}) => {
    wx.login({
      success: (res) => {
        console.log('wx.login success')
        resolve(res.code)
      },
      fail: reject
    })
  })
}

//获取用户信息（无需登录）
// const _getUserInfo = function(){
//   return new Promise((resolve,reject)=>{
//     wx.getUserInfo({
//       success: (res) => {
//         console.log('get user info success')
//         resolve(res.userInfo)
//       },
//       fail: reject
//     })
//   })
// }

const auth = async function(wxUserInfo) {
  let code = await _login()
  let userInfoWidthToken = await api_getToken(code, wxUserInfo.nickName, wxUserInfo.avatarUrl) || null
  if (userInfoWidthToken.token) {
    userInfo = userInfoWidthToken
    wx.setStorage({
      key: 'userInfo',
      data: userInfoWidthToken
    });
    return true
  }
}

export {
  auth,
  userInfo,
}
