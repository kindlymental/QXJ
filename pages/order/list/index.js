// pages/order/list/index.js
var Request = require('../../../utils/request.js');
var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		navSelectedIndex: 0,  // 导航索引
		
		// 数据源
		pageData: {
			list: null,
			loadStatus: false,
		},
		pageNumber: 1,

		menuSelectedIndex: 0,  // 菜单索引
		status: -1,
		// 导航高度
		navigationBarHeight: (app.globalData.systemInfo.statusBarHeight + 44) + 'px',  // 导航

		menuTitleList: [
			{
				name: '全部',
				id: -1,
			},
			{
				name: '待支付',
				id: 0,
			},
			{
				name: '待发货',
				id: 1,
			},
			{
				name: '待收货',
				id: 2,
			},
			{
				name: '已取消',
				id: 5,
			},
			{
				name: '售后',
				id: 8,
			},
		]  // 菜单
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
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	onPullDownRefresh: function() {
		let { pageNumber, navSelectedIndex } = this.data;
		pageNumber = 1;
		this.setData({
			pageNumber: pageNumber
		}, ()=>{
			if (navSelectedIndex == 0) {
				this.getOrderList();
			} else {
				this.getOrderServeList();
			}
		});
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		let { pageNumber, navSelectedIndex } = this.data;
		pageNumber = pageNumber + 1;
		this.setData({
			pageNumber: pageNumber
		}, ()=>{
			if (navSelectedIndex == 0) {
				this.getOrderList();
			} else {
				this.getOrderServeList();
			}
		});
	},
	/**
	 * @Date:   2020-6-3
	 * @Anno:   请求全部商品订单
	 */
	getOrderList() {
		var that = this;
		const index = this.data.menuSelectedIndex;
		let status = this.data.status // 支付状态
		// 0: 待支付 1: 支付完成,待发货 2: 已发货 3: 已完成 4: 超时未支付 5: 订单被取消 6: 退款中 7: 超时未发货 8: 发生纠纷,申请平台介入 9: 待处理纠纷
		wx.showLoading({
			title: '正在加载中',
		});
		var param = {
			page: this.data.pageNumber,
			limit: Request.pageSize,
		}
		if(status!=-1) {
			Object.assign(param, {
				'status': status,
			});
		}
		Request.getOrderList(param).then(function (res) {
			var resultList = res.data;
			if (resultList == null || resultList.length == 0) {
				return;
			}
			// 订单状态
			resultList.forEach(item => {
				switch (item.status.toString()) {
				case '0':
					item.statusStr = '待支付'
					break;
				case '1':
					item.statusStr = '待发货'
					break;
				case '2':
					item.statusStr = '已发货'
					break;
				case '3':
					item.statusStr = '已完成'
					break;
				case '4':
					item.statusStr = '超时未支付'
					break;
				case '5':
					item.statusStr = '已取消'
					break;
				case '6':
					item.statusStr = '退款中'
					break;
				case '7':
					item.statusStr = '超时未发货'
					break;
				case '8':
					item.statusStr = '售后中'
					break;
				case '9':
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
				"pageData.loadStatus": true,
			})
			wx.stopPullDownRefresh();
			wx.hideLoading();
		})
	},

	/**
	 * @Date:   2020-6-3
	 * @Anno:   请求全部服务订单
	 */
	getOrderServeList() {
		var that = this;
		const index = this.data.menuSelectedIndex;
		let status = this.data.status // 支付状态
		console.log('status', status);
		// 0: 待支付 1: 支付完成,待接单 2: 待安装 3: 修改服务费用 4: 已损坏 5: 补差价 6: 安装完成 7: 已完成 8: 超时未支付 9: 订单被取消 10: 退款中 11: 发生纠纷,申请平台介入 12: 待处理纠纷
		wx.showLoading({
			title: '正在加载中',
		});
		var param = {
			page: this.data.pageNumber,
			limit: Request.pageSize,
		}
		if (status != -1) {
			Object.assign(param, {
				'orderStatus': status
			})
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
	 * @Date:   2020-6-3
	 * @Anno:   选择切换菜单项
	 */
	clickChangeMenu(e) {
		let index = e.detail.menuSelectedIndex;
		this.setData({
			menuSelectedIndex: index,
			status: index,
			"pageData.list": []
		});
		// 请求接口
		this.data.pageNumber = 1;
		wx.pageScrollTo({
			scrollTop: 0,
			duration: 100
		})

		if (this.data.navSelectedIndex == 0) {
			this.getOrderList();
		} else {
			this.getOrderServeList();
		}
	},

	/**
	 * @Date:   2020-6-3
	 * @Anno:   切换导航菜单
	 */
	clickNavMenu(e) {

		let index = e.detail.menuSelectedIndex;   
		if (index == this.data.navSelectedIndex) {
			return;
		}
		this.setData({
			navSelectedIndex: index,
		});
		
		// 菜单
		if (index == 0) {
			this.setData({
				menuTitleList: [
					{
						name: '全部',
						id: -1,
					},
					{
						name: '待支付',
						id: 0,
					},
					{
						name: '待发货',
						id: 1,
					},
					{
						name: '待收货',
						id: 2,
					},
					{
						name: '已取消',
						id: 5,
					},
					{
						name: '售后',
						id: 8,
					},
				],
				status: -1
			});
		} else {
			this.setData({
				menuTitleList: [
					{
						name: '全部',
						id: -1,
					},
					{
						name: '待支付',
						id: 0,
					},
					{
						name: '待服务',
						id: 2,
					},
					{
						name: '待确认',
						id: 5,
					},
					{
						name: '已完成',
						id: 6,
					},
					{
						name: '售后',
						id: 11,
					},
				],
				status: -1
			});
		}

		// 请求接口
		this.data.pageNumber = 1;
		wx.pageScrollTo({
			scrollTop: 0,
			duration: 100
		})
		
		if (this.data.navSelectedIndex == 0) {
			this.getOrderList();
		} else {
			this.getOrderServeList();
		}
	},

	/**
	 * @Date:   2020-6-9
	 * @Anno:   订单详情
	 */
	toOrderDetail(e) {
		let {
			orderItem,
			orderType
		} = e.detail;
		console.log('orderItem', orderItem);
		console.log('orderType', orderType);
		if(orderType == 1) {
			let service_order_id = orderItem.service_order_id;
			wx.navigateTo({
				url: `../detail/index?orderNum=${service_order_id}&orderType=1`,
			});
		} else {
			let goods_order_id = orderItem.goods_order_id;
			wx.navigateTo({
				url: `../detail/index?orderNum=${goods_order_id}&orderType=0`,
			});
		}
	},
	toLogistics(e){
		console.log(11)
	},
	toConfirm(e){
		let {
			orderItem,
			orderType
		} = e.detail;
		wx.showModal({
			title: '提示',
			content: `确认收货`,
			success (res) {
				if (res.confirm) {
					if(orderType == 1) {
						let service_order_id = orderItem.service_order_id;
						let params ={
							service_order_id: service_order_id
						}
						Request.postOrderServiceDone(params)
							.then(res=>{
								let { pageNumber, navSelectedIndex } = this.data;
									pageNumber = 1;
									this.setData({
										pageNumber: pageNumber
									}, ()=>{
										if (navSelectedIndex == 0) {
											this.getOrderList();
										} else {
											this.getOrderServeList();
										}
									});
							});
					} else {
						let goods_order_id = orderItem.goods_order_id;
						let params ={
							goods_order_id: goods_order_id
						}
						Request.postOrderGoodsDone(params)
							.then(res=>{
								let { pageNumber, navSelectedIndex } = this.data;
								pageNumber = 1;
								this.setData({
									pageNumber: pageNumber
								}, ()=>{
									if (navSelectedIndex == 0) {
										this.getOrderList();
									} else {
										this.getOrderServeList();
									}
								});
							});
					}
				} else if (res.cancel) {
				}
			}
		});
		
	}
})