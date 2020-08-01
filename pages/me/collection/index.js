// pages/me/collection/index.js
var app = getApp();

const CONFIG = require('../../../utils/config.js');
const Request = require('../../../utils/request.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageData: {
      list: [],
      loadStatus: false
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
    this.getList()
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
  
  getList() {
    var that = this;
    wx.showLoading({
      title: '正在加载中',
    });
    var param = {}
    Request.getCollectionList(param)
      .then(res => {
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
      })
      .finally(function () {
        that.setData({
          "pageData.loadStatus": true,
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      })
  }
})