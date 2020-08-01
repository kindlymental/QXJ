// pages/order/detail/index.js
var Request = require('../../../utils/request.js');
const CONFIG = require('../../../utils/config.js');
var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		orderNum: null,  // 订单号
		orderType: null,  // 类型： 服务、商品

		orderInfo: null,  // 订单详细信息
		pageNumber: 1,
		timedown: null,
		projectList: null, // 猜你喜欢列表,
		siv: null,
		remaintime: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		if (options) {
			this.setData({
				orderNum: options.orderNum,
				orderType: options.orderType
			});
		}
		if(options.orderType == 0) {
			await this.getOrderGoodsDetail();
		} else {
			await this.getOrderServiceDetail();  // 详情
		}
		await this.getProjectList();  // 猜你喜欢
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
		clearInterval(this.siv);
	},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	onPullDownRefresh: function() {
		let { orderType } = this.data;
		if(orderType == 0) {
			this.getOrderGoodsDetail();
		} else {
			this.getOrderServiceDetail();  // 详情
		}
		this.getProjectList();  // 猜你喜欢
	},

	/**
	 * @Date:   2020-6-9
	 * @Anno:   请求服务订单详情
	 */
	getOrderServiceDetail() {
		var that = this;
		wx.showLoading({
			title: '正在加载中',
		});
		var param = {
			service_order_id: this.data.orderNum
		}
		Request.getOrderServiceDetail(param).then(function (res) {
			let orderInfo = res.data;
			orderInfo.sTime = that.delTime(orderInfo.service_time);
			let timedown = null;
			let remainTime = null;
			if (orderInfo.servicesStatus == 0) {
				timedown = orderInfo.timedown;
				remainTime = that.formatSeconds(timedown);
				that.siv = setInterval(() => {
					timedown = that.data.timedown - 1;
					remainTime = that.formatSeconds(timedown);
					if (timedown == 0) {
						clearInterval(that.siv);
					}
					that.setData({
						timedown: timedown,
						remaintime: remainTime
					});
				}, 1000);
			}
			that.setData({
				orderInfo: orderInfo,
				timedown: timedown,
				remaintime: remainTime
			});
		}).finally(function () {
			wx.hideLoading();
		})
	},

	/**
	 * @Date:   2020-6-9
	 * @Anno:   请求商品订单详情
	 */
	getOrderGoodsDetail() {
		var that = this;
		wx.showLoading({
			title: '正在加载中',
		});
		var param = {
			goods_order_id: this.data.orderNum
		}
		Request.getOrderGoodsDetail(param).then(function (res) {
			var orderInfo = res.data;
			orderInfo.cTime = that.delTime(orderInfo.create_time);
			let timedown = null;
			let remainTime = null;
			if (orderInfo.status == 0) {
				timedown = orderInfo.timedown;
				remainTime = that.formatSeconds(timedown);
				that.siv = setInterval(() => {
					timedown = that.data.timedown - 1;
					remainTime = that.formatSeconds(timedown);
					if (timedown == 0) {
						clearInterval(that.siv);
					}
					that.setData({
						timedown: timedown,
						remaintime: remainTime
					});
				}, 1000);
			}
			that.setData({
				orderInfo: orderInfo,
				timedown: timedown,
				remaintime: remainTime
			});
		}).finally(function () {
			wx.hideLoading();
		})
	},
	formatSeconds(value) {
	    var theTime = parseInt(value);// 秒
	    var middle= 0;// 分
	    var hour= 0;// 小时
	    if(theTime > 60) {
	        middle= parseInt(theTime/60);
	        theTime = parseInt(theTime%60);
	        if(middle> 60) {
	            hour= parseInt(middle/60);
	            middle= parseInt(middle%60);
	        }
	    }
	    var result = ""+parseInt(theTime)+"秒";
	    if(middle > 0) {
	        result = ""+parseInt(middle)+"分"+result;
	    }
	    if(hour> 0) {
	        result = ""+parseInt(hour)+"小时"+result;
	    }
	    return result;
	},
	/**
	 * @Date:   2020-6-9
	 * @Anno:   猜你喜欢
	 */
	getProjectList() {
		var that = this;

		wx.showLoading({
			title: '正在加载中',
		});
		let param = {
			page: this.data.pageNumber,
			limit: Request.pageSize
		}
		Request.getProjectList(param).then(function (res) {
			let goods = res.data;
			console.log('res', res);
			that.setData({
				projectList: goods
			});
			wx.hideLoading();
		})
	},

	/**
	 * 更新状态
	 */
	toUpdateState() {
		wx.navigateTo({
			url: '../update_state/index',
		});
	},

	/**
	 * 去支付
	 */
	toPaymentOrder() {
		let { orderType, orderNum, orderInfo } = this.data;
		let jsondata = {
			order_id: orderNum,
			order_type: Number(orderType)
		}
		wx.showModal({
			title: '提示',
			content: `支付金额${orderInfo.total_price}`,
			success (res) {
				if (res.confirm) {
					Request.postWxUnifiedorder(jsondata).then(json=>{
						wx.requestPayment({
							'timeStamp': json.data.timestamp,
							'nonceStr': json.data.nonceStr,
							'package': json.data.package,
							'signType': json.data.signType,
							'paySign': json.data.paySine,
							success: function (res) {
								let { orderType } = this.data;
								if(orderType == 0) {
									this.getOrderGoodsDetail();
								} else {
									this.getOrderServiceDetail();  // 详情
								}
								this.getProjectList();  // 猜你喜欢
							},
							fail: function (res) {
							}
						});
					});
				} else if (res.cancel) {
				}
			}
		});
		
	},

	/**
	 * 取消订单
	 */
	toCancelOrder() {
		let { orderType, orderNum } = this.data;
		let self = this;
		wx.showModal({
			title: '提示',
			content: '确定要取消订单吗?',
			success (res) {
				if (res.confirm) {
					if (orderType == 0) {
						let param = {
							goods_order_id: orderNum
						}
						Request.postOrderGoodsCancel(param)
							.then(function (res) {
								self.getOrderGoodsDetail();
							});
					} else {
						let param = {
							service_order_id: orderNum
						}
						Request.postCancelOrderService(param)
							.then(function (res) {
								self.getOrderServiceDetail(); 
							});
					}
				} else if (res.cancel) {
				}
			}
		});
	},
	/**
	 * 联系客服
	 */
	concatkefu() {
		wx.makePhoneCall({
			phoneNumber: CONFIG.customerServicePhone
		})
	},
	/**
	 * 确认完工
	 */
	finshOrder() {
		let { orderType, orderNum } = this.data;
		let self = this;
		if (orderType == 0) {
			let param = {
				goods_order_id: orderNum
			}
			Request.postOrderGoodsDone(param)
				.then(function (res) {
					self.getOrderGoodsDetail();
				});
		} else {
		}
	},
	/**
	 * 拨打人工电话
	 */
	conactPersonkefu() {
		wx.makePhoneCall({
			phoneNumber: CONFIG.customerServicePhone
		})
	},
	/**
	 * 申请售后
	 */
	shouhou () {
		let { orderType, orderNum } = this.data;
		let self = this;
		if (orderType == 0) {
			let param = {
				goods_order_id: orderNum
			}
			Request.postOrderGoodsDisputes(param)
				.then(function (res) {
					self.getOrderGoodsDetail();
				});
		} else {
			let param = {
				service_order_id: orderNum
			}
			Request.postOrderServiceDisputes(param)
				.then(function (res) {
					self.getOrderServiceDetail(); 
				});
		}
	},
	delTime (time) {
		let date = new Date(Number(time));
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hour = date.getHours();
		let minutes = date.getMinutes();
		let seconds = date.getSeconds();
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		if (hour < 10) {
			hour = '0' + hour;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		let html = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
		return html;
	},
	/**
	 * 物流
	 */
	toLogistics() {

	},
	/**
	 * 完成售后
	 */
	finishshouhou () {
		let { orderType, orderNum } = this.data;
		wx.showModal({
			title: '提示',
			content: '完成售后?',
			success (res) {
				if (res.confirm) {
					if (orderType == 0) {
						let param = {
							goods_order_id: orderNum
						}
						Request.postorderGoodsDisputesDone(param)
							.then(function (res) {
								self.getOrderGoodsDetail();
							});
					} else {
						let param = {
							service_order_id: orderNum
						}
						Request.postOrderServiceDisputesDone(param)
							.then(function (res) {
								self.getOrderServiceDetail(); 
							});
					}
				} else if (res.cancel) {
				}
			}
		});
	}
})