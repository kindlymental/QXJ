// pages/address/add/index.js
var Request = require('../../../utils/request.js');
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		addressData: {
		is_default: false,
		contact: null,
		telephone: null,
		street: null
		},

		city: null, // 定位地址
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (options && options.editAddress) {
			// 编辑
			this.setData({
				addressData: JSON.parse(decodeURIComponent(options.editAddress))
			});
		}
		this.setData({
			city: wx.getStorageSync('coordinate').city
		});
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
	 * 所在地区
	 */
	chooseAddress() {

	},

	/**
	 * 切换开关
	 */
	onChangeSwitch({ detail }) {
		// 状态进行更新 : 是否是默认 false true
		this.setData({
			['addressData.is_default']: detail
		});
	},

	onChangeName(e) {
		this.setData({
			['addressData.contact']: e.detail,
		})
	},

	onChangeTel(e) {
		this.setData({
			['addressData.telephone']: e.detail,
		})
	},

	onChangeStreet(e) {
		this.setData({
			['addressData.street']: e.detail,
		})
	},

	formSubmit: function (e) {
		wx.showLoading({
			title: '正在加载中',
		});
		var param = {
			contact: this.data.addressData.contact,
			telephone: this.data.addressData.telephone,
			city_code: wx.getStorageSync('coordinate').cityCode, // 城市code
			addrname: this.data.city, // 省市区
			street: this.data.addressData.street, // 街道
			is_default: this.data.addressData.is_default
		}
		// 编辑
		if (this.data.addressData.address_id) {
			Object.assign(param, {
				address_id: this.data.addressData.address_id
			});
			Request.modifyAddress(param).then(function (res) {
				wx.showToast({
				icon: 'none',
				title: '添加成功',
				})
				wx.navigateBack({
				complete: (res) => {},
				})
			}).finally(function () {
				wx.hideLoading();
			})
		} else {
			Request.addAddress(param).then(function (res) {
				wx.showToast({
				icon: 'none',
				title: '添加成功',
				})
				wx.navigateBack({
				complete: (res) => {},
				})
			}).finally(function () {
				wx.hideLoading();
			})
		}
		console.log('param', param);
	}
})