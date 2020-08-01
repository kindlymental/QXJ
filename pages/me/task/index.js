// pages/me/task/index.js
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

    menuList: ['服务订单', '套餐订单'],
    menuSelectedIndex: 0, // 菜单选中的索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList();
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
   * @Date:   2020-6-20
   * @Anno:   选择切换菜单项
   */
  clickChangeMenu(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      menuSelectedIndex: index
    });
    // 请求接口
    this.data.pageNumber = 1;
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    })
    if (this.data.menuSelectedIndex == 0) {
      this.getOrderList();
    } else {
      // this.getMealOrderList();
      this.getOrderList();
    }
  },

  // 服务订单
  getOrderList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });
    var param = {
      page: this.data.pageNumber,
      limit: Request.pageSize,
    }

    Request.getOrderServeList(param).then(function (res) {

      var resultList = res.data;

      if (resultList == null || resultList.length == 0) {
        return;
      }
      // 订单状态
      resultList.forEach(item => {
        switch (item.servicesStatus.toString()) {
          case '0':
            item.statusStr = '待支付'
            break;
          case '1':
            item.statusStr = '待接单'
            break;
          case '2':
            item.statusStr = '待安装'
            break;
          case '3':
            item.statusStr = '修改服务费用'
            break;
          case '4':
            item.statusStr = '已损坏'
            break;
          case '5':
            item.statusStr = '补差价'
            break;
          case '6':
            item.statusStr = '安装完成'
            break;
          case '7':
            item.statusStr = '已完成'
            break;
          case '8':
            item.statusStr = '超时未支付'
            break;
          case '9':
            item.statusStr = '已取消'
            break;
          case '10':
            item.statusStr = '退款中'
            break;
          case '11':
            item.statusStr = '售后中'
            break;
          case '12':
            item.statusStr = '待处理纠纷'
            break;
        }
      });

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

  /**
   * 套餐订单
   */
  getMealOrderList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });
    var param = {
      page: this.data.pageNumber,
      limit: Request.pageSize,
    }
    Request.getMealOrderList(param).then(function (res) {

      var resultList = res.data.data.list;

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

  toOrderDetail() {

  },

  // 分配任务
  toAllocateTask(e) {
    console.log(e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '../worker/index',
    })
  }
})