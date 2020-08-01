// pages/home/home.js
var app = getApp();

const CONFIG = require('../../utils/config.js');
const Request = require('../../utils/request.js');
const util = require('../../utils/util.js');

var inputValue = ''; // 输入框文本

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		// 轮播
		activityBannerList: [ 
			{ 'img': '../../assets/image/swiper_1.png' },
			{ 'img': '../../assets/image/swiper_1.png' },
			{ 'img': '../../assets/image/swiper_1.png' },
			{ 'img': '../../assets/image/swiper_1.png' }
		],
		// 轮播属性
		indicatorDots: true,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		userInfo: app.globalData.userInfo,  // 用户个人信息
		serveList: [
			{ 
			'name':'单月套餐',
			'img': '../../assets/image/serve_1.png'
			},
			{ 
			'name':'包月套餐',
			'img': '../../assets/image/serve_1.png'
			},
			{
			'name':'包年套餐',
			'img': '../../assets/image/serve_1.png'
			}
		],
		banners: [],
		goods: [],
		goodsRecommend: [],
		servicesPackage: [],
		noticeList: [],
		page: 1,
		limit: 10
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
	// 获取活动banner集合
		this.getActivityBanner();
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		this.getAllList();
		this.getHomeGoods();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {},
	getAllList() {
	},

	bindKeyInput(e) {
		inputValue = e.detail.value;
	},
	// 搜索
	toSearch() {
		wx.navigateTo({
			url: '../list/projectList/projectList?search=' + inputValue
		});
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
	// 获取活动banner集合
		this.getActivityBanner();
		this.getAllList();
		let { page } = this.data;
		page = 1;
		this.setData({
			page: page
		}, ()=>{
			this.getHomeGoods();
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		let { page } = this.data;
		page = page + 1;
		this.setData({
			page: page
		}, ()=>{
			this.getHomeGoods();
		});
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function(res) {
		return {
			title: '',
			path: 'pages/index/index',
		}
	},
	/**
	 * 活动接口
	 */
	getActivityBanner() {
		var that = this;
	},
	toList(e) {
		let num = e.currentTarget.dataset.index.toString();
		switch (num) {
			case '0':
			wx.navigateTo({
				url: '../list/projectList/projectList'
			});
			break;
			case '1':
			wx.navigateTo({
				url: '../list/craftsmanList/craftsmanList'
			});
			break;
			case '2':
			wx.navigateTo({
				url: '../list/storeList/storeList'
			});
			break;
		}
	},
	scroll() {
	},
	getHomeGoods() {
		let { 
			page, 
			limit, 
			banners,
			goods,
			goodsRecommend,
			servicesPackage,
			noticeList 
		} = this.data;
		var that = this;
		var param = {
			page,
			limit
		}
		Request.getHomeGoodsList(param)
			.then(res=>{
				let result = res.data;
				if (page == 1) {
					banners = result.banners;
					goods = result.goods;
					goodsRecommend = result.goodsRecommend;
					servicesPackage = result.servicesPackage;
					noticeList = result.noticeList;
				}
				else {
					banners = banners.concat(result.banners);
					goods = goods.concat(result.goods);
					goodsRecommend = goodsRecommend.concat(result.goodsRecommend);
					servicesPackage = servicesPackage.concat(result.servicesPackage);
					noticeList = noticeList.concat(result.noticeList);
				}
				this.setData({
					banners,
					goods,
					goodsRecommend,
					servicesPackage,
					noticeList
				});
			});
	},
	godetail(e) {
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: `/pages/category/detail/index?goods_id=${id}`
		})
	}
});