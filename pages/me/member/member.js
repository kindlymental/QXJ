// pages/me/member/member.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 有效期限
		startTime: '2020-06-24',
		endTime: '2020-07-24',
		// 地址信息
		address: null,
		// 支付金额
		payAmount: 8.00 * 2,
		// 服务次数
		serviceTimes: ['两次','三次','四次','五次','六次','七次'],
		chooseServiceTimesIndex: 0,
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

	// 选择地址
	chooseAddress() {
		wx.navigateTo({
			url: '/pages/me/address/index',
		});
	},

	// 选择服务次数
	chooseServiceTime(e) {
		let index = e.currentTarget.dataset.index;
		this.setData({
			chooseServiceTimesIndex: index,
			payAmount: 8 * (index+2)
		});
	}
})