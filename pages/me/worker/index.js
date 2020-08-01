// pages/me/worker/index.js
var Request = require('../../../utils/request.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.getWorkerList();
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
    this.data.pageNumber = 1;
    this.getWorkerList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.pageNumber = this.data.pageNumber + 1;
    this.getWorkerList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 工人列表
  getWorkerList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });
    var param = {
      page: this.data.pageNumber,
      limit: Request.pageSize,
      level: Number(0),    // 99: 最高权限 3: 管理 2: 工人 1: 客服 0: 普通用户
    }

    Request.getUserData(param).then(function (res) {

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
        "pageData.loadStatus": true
      })
      wx.stopPullDownRefresh();
      wx.hideLoading();
    })
  },
})