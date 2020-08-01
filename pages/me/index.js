// pages/me/info/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    pageList: [
      {
        name:'优惠券',
        code:'discount',
        img:'../../assets/icon/me_discount.png'
      },
      {
        name:'收藏',
        code:'collection',
        img:'../../assets/icon/me_collection.png'
      },
      {
        name:'我的地址',
        code:'address',
        img:'../../assets/icon/me_address.png'
      },
      // {
      //   name:'个人信息',
      //   code:'info',
      //   img:'../../assets/icon/me_info.png'
      // },
      {
        name:'分配任务',
        code:'task',
        img:'../../assets/icon/me_task.png'
      },
      // {
      //   name:'绑定手机号',
      //   code:'phone',
      //   img:'../../assets/icon/me_phone.png'
      // },
      {
        name:'商务合作',
        code:'business',
        img:'../../assets/icon/me_business.png'
      },
      {
        name:'意见投诉',
        code:'opinion',
        img:'../../assets/icon/me_opinion.png'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      user: wx.getStorageSync("userInfo")
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 开通会员
  toMember() {
    wx.navigateTo({
      url: 'member/list',
    })
  },

  toLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  toPage(e) {
    console.log(this.data.user)
    if(this.data.user) {
      const route = e.currentTarget.dataset.code +'/index'
      wx.navigateTo({
        url: route,
      })
    }else{
      this.toLogin()
    }
  },
  logoutClick() {

  }
})