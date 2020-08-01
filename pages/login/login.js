// pages/login/login.js
import Request from '../../utils/request.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: false,  // 是否展示授权弹窗
    userInfo: null,  // 用户个人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    
  },

  closeText() {
    var that = this;
    that.setData({
      error: false,
    })
  },

  /**
   * 拉取用户信息
   * userInfo:
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/t94kZDdZIZJfBrtMQaIDFBTaAl5Kbk3g8RDDz1ib1UD5qR1U0MxGGh8JzhDWiabE100ia8ZsXuyEibLzSBc19dZ83w/132"
      city: "Shijiazhuang"
      country: "China"
      gender: 2
      language: "zh_CN"
      nickName: "兜里没糖"
      province: "Hebei"
   */
  getUserInfo: function(e) {
    var that = this;
    if (e.detail.userInfo) {
      // 将获取的用户信息赋值给全局 userInfo 变量
      app.globalData.userInfo = e.detail.userInfo; 
      // 获取微信code
      wx.login({
        success: res => {
          // 发送 res.code 登录
          that.registOrLogin(res.code);
        }
      });
    }else{
      this.setData({
        error: true
      })
    }
  },

  // 注册或登录
  registOrLogin(code) {

    // 昵称特殊字符替换
    var replaceStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

    wx.showLoading({
      title: '加载中',
    })
    let registerData = {
      nickName: app.globalData.userInfo.nickName.replace(replaceStr, "**"),
      gender: app.globalData.userInfo.gender.toString(),
      avatarUrl: app.globalData.userInfo.avatarUrl,
      city: app.globalData.userInfo.city,
      province: app.globalData.userInfo.province,
      country: app.globalData.userInfo.country,
      code: code
    }
    Request.login(registerData).then(function (res) {
      if (res.data != null) {
        let userData = res.data;
        Object.assign(app.globalData.userInfo, {
          openId: userData.openId,
          token: userData.token,
          user_id: userData.user_id,
          level: userData.level
        });
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      wx.hideLoading();
    });
  }
})
