// pages/category/list/index.js
import Request from '../../../utils/request.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    menuSelectedIndex: 0,  // 导航菜单索引

    categoryPageData: {
      list: [],
      loadStatus: false,
    },
    categorySelectedIndex: 0,   // 分类索引

    projectPageData: {
      list: null,
      loadStatus: false,
    },
    pageNumber: 1,

    navigationBarHeight: (app.globalData.systemInfo.statusBarHeight + 44) + 'px',  // 导航
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {

    await this.getGoodsCategoryList();
    await this.getGoodsList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * @Date:   2020-6-2
   * @Anno:   请求分类列表
   */
  async getGoodsCategoryList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });

    let param = {
      page: this.data.pageNumber,
      limit: Request.pageSize,
    }
    await Request.getCategoryList(param).then(function (res) {
      let categories = res.data;

      that.setData({
        "categoryPageData.list": categories
      });
      wx.hideLoading();
    })
  },

  /**
   * @Date:   2020-6-2
   * @Anno:   请求项目列表
   */
  async getGoodsList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });
    let param = {
      category_id: this.data.categoryPageData.list[this.data.categorySelectedIndex].category_id,
    }
    await Request.getGoodsByCategory(param).then(function (res) {
      that.setData({
        "projectPageData.list": res.data
      });
      wx.hideLoading();
    })
  },

  /** 服务 */
  /**
   * @Date:   2020-6-2
   * @Anno:   请求服务分类列表
   */
  async getServiceCategoryList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });

    let param = {
      page: this.data.pageNumber,
      limit: Request.pageSize,
    }
    await Request.getServiceCategoryList(param).then(function (res) {
      let categories = res.data;

      that.setData({
        "categoryPageData.list": categories
      });
      wx.hideLoading();
    })
  },

  /**
   * @Date:   2020-6-2
   * @Anno:   请求服务列表
   */
  async getServiceList() {
    var that = this;

    wx.showLoading({
      title: '正在加载中',
    });

    let param = {
      category_id: this.data.categoryPageData.list[this.data.categorySelectedIndex].category_id,
      city_code: wx.getStorageSync("coordinate").cityCode
    }
    await Request.getServiceList(param).then(function (res) {

      that.setData({
        "projectPageData.list": res.data
      });
      wx.hideLoading();
    })
  },

  /**
   * @Date:   2020-6-2
   * @Anno:   切换分类
   */
  clickChangeMenu(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      categorySelectedIndex: index
    });

    if (this.data.menuSelectedIndex == 0) {
      this.getGoodsList();  // 商品
    } else {
      this.getServiceList();  // 服务
    }
  },

  /**
   * @Date:   2020-6-3
   * @Anno:   切换导航菜单
   */
  async clickNavMenu(e) {
    this.setData({
      menuSelectedIndex: e.detail.menuSelectedIndex
    });
    if (this.data.menuSelectedIndex == 0) {
      await this.getGoodsCategoryList();
      await this.getGoodsList();
    } else {
      await this.getServiceCategoryList();
      await this.getServiceList();
    }
  },

  /**
   * @Date:   2020-6-2
   * @Anno:   跳转到项目详情
   * @Param:  event:子组件传来的参数
   */
  eventHandle: function (e) {
    let id = e.currentTarget.id;
    let index = e.currentTarget.dataset.index;
    if (this.data.menuSelectedIndex == 0) {
      // 商品
      wx.navigateTo({
        url: '../detail/index?goods_id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '../service_detail/index?service='+ encodeURIComponent(JSON.stringify(this.data.projectPageData.list[index])),
      })
    }
  }
})