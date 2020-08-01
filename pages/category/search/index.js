// pages/category/list/index.js
import Request from '../../../utils/request.js';
var app = getApp();
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		projectPageData: [],
		pageNumber: 1,
		showresult: false,
		searchList: ['开锁服务', '家用马桶', '修下水道', '房屋渗水', '卫生打扫', '换灯泡'],
		keyword: '',
		page: 1,
		limit: 20,
		active: 0
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {
	},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {
	},
	onSearch() {
		console.log('keyword', this.data.keyword);
		let self = this;
		let params = {
			keyword: self.data.keyword,
			limit: self.data.limit,
			page: self.data.page
		}
		Request.searchProjectList(params)
			.then(function (res) {
				console.log('res', res);
				if (res.code == 200) {
					self.setData({
						projectPageData: res.data,
						showresult: true,
					});
				}
			});
	},
	onCancel() {},
	onChange(e) {
		this.setData({
			keyword: e.detail,
		});
	},
	onChangeTab(event) {
		this.setData({
			active: event.detail.name
		});
	},
	quicksearch (e) {
		let name = e.currentTarget.dataset.name;
		let self = this;
		let params = {
			keyword: name,
			limit: self.data.limit,
			page: self.data.page
		}
		let { projectPageData } = self.data;
		Request.searchProjectList(params)
			.then(function (res) {
				console.log('res', res);
				if (res.code == 200) {
					if (self.data.page == 1) {
						projectPageData = res.data
					}
					else {
						projectPageData = projectPageData.concat(res.data)
					}
					self.setData({
						projectPageData: projectPageData,
						showresult: true,
					});
				}
			});
	},
	eventHandle: function (e) {
		console.log('e', e)
		let id = e.currentTarget.id;
		let index = e.currentTarget.dataset.index;
		if (this.data.menuSelectedIndex == 0) {
			// 商品
			wx.navigateTo({
				url: '../detail/index?goods_id=' + id,
			})
		} else {
			wx.navigateTo({
				url: '../service_detail/index?service='+ encodeURIComponent(JSON.stringify(this.data.projectPageData[index])),
			})
		}
	},
	onPullDownRefresh: function() {
		let { page } = this.data;
		page = 1;
		this.setData({
			page: page
		}, ()=>{
			this.quicksearch();
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
			this.quicksearch();
		});
	},
});