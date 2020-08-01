// pages/address/list/index.js
var Request = require('../../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 数据源
    pageData: {
      list: null,
      loadStatus: false,
    },
    pageNumber: 1,
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
    this.getAddressList();
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

  /**
   * @Date:   2020-6-4
   * @Anno:   地址列表
   */
  getAddressList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });
    var param = {
      page: this.data.pageNumber,
      limit: Request.pageSize,
    }
    Request.getAddressList(param).then(function (res) {

      var resultList = res.data;

      if (that.data.pageNumber == 1) {
        that.setData({
          "pageData.list": resultList
        });
      } else {
        if (resultList.length == 0) {
          wx.showToast({
            title: '无更多数据',
            icon: 'none'
          })
        } else {
          let nextList = that.data.pageData.list.concat(resultList);
          that.setData({
            "pageData.list": nextList
          });
        }
      }
    }).finally(function () {
      that.setData({
        "pageData.loadStatus": true,
      })
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
  },

  // 选择地址
  subAddress: function(e) {
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面

    beforePage.setData({
      address: this.data.pageData.list[e.currentTarget.dataset.index],
    })
    wx.navigateBack();
  },

  // 单选：默认地址
  radioClick() {

  },

  // 编辑地址
  toEditAddress: function (e) {
    let address = this.data.pageData.list[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/me/address/add?editAddress=' + encodeURIComponent(JSON.stringify(address)),
    })
  },

  // 删除地址
  toDelAddress() {

  },

  // 新增地址
  toNewAddress() {
    wx.navigateTo({
      url: '/pages/me/address/add',
    })
  },

})