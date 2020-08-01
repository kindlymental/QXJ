// pages/me/member/member.js
import Request from '../../../utils/request';
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list: [],
		params: {
			page: 1,
			limit: 10
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.log( wx.getSystemInfoSync().windowHeight)
		this.getList();
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
	onPullDownRefresh: function() {
	// 获取活动banner集合
		let { params } = this.data;
		params.page =  1;
		this.setData({
			params: params
		}, ()=>{
			this.getList();
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		let { params } = this.data;
		params.page = params.page + 1;
		this.setData({
			params: params
		}, ()=>{
			this.getList();
		});
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	getList () {
		let { params, list } = this.data;
		let that = this;
		Request.getServicePackageList(params)
			.then(function (res) {
				if (params.page == 1) {
					list = res.data;
				} else {
					list = list.concat(res.data);
				}
				that.setData({
					list: list
				})
			});
	},
	toMemberDetail(e) {
		let index =  e.currentTarget.dataset.index;
		wx.navigateTo({
			url: `member?service_package_id=${index}`,
		})
	},
})