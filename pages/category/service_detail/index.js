// pages/category/service_detail/index.js
import Request from '../../../utils/request.js';
const CONFIG = require('../../../utils/config.js');
var util = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.js');
import {
	sub,	// 浮点型减
	div,	// 浮点型除法
	accAdd,	// 浮点型加法函数
	mul	    // 浮点型乘法
} from '../../../utils/util';
var app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		service: null, // 服务信息

		projectList: null, // 推荐项目列表

		pageNumber: 1,

		address: null, // 选择的地址
		coupon_info: null,
		coupon_id: '',
		// 时间选择器
		datePicker: false,
		minDate: new Date().getTime(),
		currentDate: new Date().getTime(),
		showTime: null,
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`;
			} else if (type === 'month') {
				return `${value}月`;
			}
			return value;
		},
		// sizedata: ['300nm坑距', '400nm坑距', '500nm坑距', '400nm坑距', '500nm坑距'],
		// maskHidden: false, //支付遮罩层是否隐藏
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {

		const data = JSON.parse(decodeURIComponent(options.service));
		Object.assign(data, {
			'pics': [data.cover]
		});
		this.setData({
			service: data,
			showTime: this.delTime(this.data.currentDate)
		});

		await this.getServiceList(); // 推荐列表
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
	 * @Date:   2020-6-3
	 * @Anno:   获取服务列表
	 */
	getServiceList() {
		var that = this;

		wx.showLoading({
			title: '正在加载中',
		});
		let param = {
			category_id: this.data.service.category_id,
			city_code: wx.getStorageSync("coordinate").cityCode
		}
		Request.getServiceList(param).then(function (res) {
			let goods = res.data;
			that.setData({
				projectList: goods
			});
			wx.hideLoading();
		})
	},

	/**
	 * @Date:   2020-6-3
	 * @Anno:   去下单
	 */
	toPayment() {
		if (this.data.address == null) {
		wx.showToast({
			title: '请选择地址',
			icon: 'none'
		})
		return;
		}

		// 下单
		this.createOrder();

		// this.setData({
		//   maskHidden: true
		// });
	},

	/**
	 * @Date:   2020-6-4
	 * @Anno:   推荐详情
	 */
	recommendEventHandle() {

	},

	/**
	 * 选择上门时间
	 */
	chooseDatePicker() {
		this.setData({
			datePicker: true
		});
	},

	/**
	 * 时间选择器
	 * @param {事件} event 
	 */
	confirmDatePicker(event) {
		console.log('event', event);
		this.setData({
			currentDate: event.detail,
			showTime: this.delTime(event.detail),
			datePicker: false
		});
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
		let html = `${year}-${month}-${day}`;
		return html;
	},
	// 格式化时间
	getLocalTime(nS) {
		var timestamp = new Date(nS);
		let time = timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8);
		console.log(time);
		return time;
	},
	cancelDatePicker() {
		this.setData({
			datePicker: false
		});
	},

	/**
	 * @Date:   2020-6-4
	 * @Anno:   客服
	 */
	toCustomer() {
		wx.makePhoneCall({
			phoneNumber: CONFIG.customerServicePhone
		})
	},

	/**
	 * @Date: 2020-6-4
	 * @Anno: 选择地址
	 */
	chooseAddress() {
		wx.navigateTo({
			url: '/pages/me/address/index',
		})
	},


	/**
	 * @Date: 2020-6-4
	 * @Anno: 选择服务
	 */
	chooseService() {
		wx.navigateTo({
			url: '/pages/me/discount/index',
		});
	},

	/**
	 * 分享
	 */
	toShare() {

	},

	createOrder() {
		var that = this;
		this.setData({
			maskHidden: false
		});
		wx.showLoading({
			title: '正在加载中',
		});
		let { coupon_info, coupon_id, service } = this.data;
		let coupon_price = 0;
		let total_price = 0;
		if (coupon_info !=null &&coupon_info.coupon_price) {
			coupon_price = coupon_info.coupon_price;
		}
		total_price = sub(service.service_price, coupon_price);
		let param = {
			address_id: this.data.address.address_id,
			note: '',
			service_time: this.data.currentDate,  // 服务时间
			coupon_id: coupon_id,
			total_price: total_price, // 总费用
			service_count: '1', // 安装个数
			service_id: this.data.service.service_id,
			city_code: wx.getStorageSync("coordinate").cityCode.slice(3),
			servicesStatus: '0',  // 服务状态 0: 待支付 1: 支付完成,待接单 2: 待安装 3: 修改服务费用 4: 已损坏 5: 补差价 6: 安装完成 7: 已完成 8: 超时未支付 9: 订单被取消 10: 退款中 11: 发生纠纷,申请平台介入 12: 待处理纠纷
		}
		Request.createServiceOrder(param).then(function (res) {
			console.log('res', res);
			let service_order_id = res.data.service_order_id;
			let jsondata = {
				order_id: service_order_id,
				order_type: 1
			}
			wx.hideLoading();
			wx.showModal({
				title: '提示',
				content: `支付金额${total_price}`,
				success (res) {
					if (res.confirm) {
						Request.postWxUnifiedorder(jsondata).then(json=>{
							console.log('json', json)
							wx.requestPayment({
								'timeStamp': json.data.timestamp,
								'nonceStr': json.data.nonceStr,
								'package': json.data.package,
								'signType': json.data.signType,
								'paySign': json.data.paySine,
								success: function (res) {
									wx.switchTab({
										url: "/pages/order/list/index"
									});
								},
								fail: function (res) {
									wx.switchTab({
										url: "/pages/order/list/index"
									});
								}
							});
						});
					} else if (res.cancel) {
					}
				}
			});
		// 调起微信
			// that.wxPay();
		});
	},

	// 微信支付
	wxPay: function (id) {
		var that = this;
		let nonceStr = md5.md5('longway');
		let timestamp = new Date().getTime().toString();
		let mdData = {
			'appId': CONFIG.appid,
			'timeStamp': timestamp,
			'nonceStr': nonceStr,
			'package': 'prepay_id=' + id,
			'signType': 'MD5',
		}
		let payObject = util.objKeySort(mdData);
		let packData = '';
		for (let x in payObject) {
			packData = packData + x + "=" + payObject[x] + '&';
		}
		packData = packData + 'key=' + CONFIG.payKey;
		packData = md5.md5(packData).toUpperCase();
		wx.requestPayment({
			'timeStamp': timestamp,
			'nonceStr': nonceStr,
			'package': 'prepay_id=' + id,
			'signType': 'MD5',
			'paySign': packData,
			'success': function (res) {
				
			},
			'fail': function (res) {
				console.log(res);
				wx.showToast({
				title: res.errMsg,
				icon: 'none'
				})
			},
			'complete': function (res) {

			}
		})
	},

	//遮罩层点击 
	// maskClick() {
	//   var flage = this.data.maskHidden;
	//   if (!this.data.maskHidden) {
	//     // 用that取代this，防止不必要的情况发生 
	//     var that = this;
	//     // 创建一个动画实例 
	//     var animation = wx.createAnimation({
	//       // 动画持续时间 
	//       duration: 200,
	//       // 定义动画效果，当前是匀速 
	//       timingFunction: 'ease-in-out'
	//     })
	//     // 将该变量赋值给当前动画 
	//     that.animation = animation
	//     // 先在y轴偏移，然后用step()完成一个动画 
	//     animation.translateY(1000).step()
	//     // 用setData改变当前动画 
	//     that.setData({
	//       maskHidden: true,
	//       // 通过export()方法导出数据 
	//       animationData: animation.export(),
	//       // 改变view里面的Wx：if 
	//       chooseSize: true
	//     })
	//     // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动 滑动时间 
	//     animation.translateY(0).step()
	//     that.setData({
	//       animationData: animation.export(),
	//     });
	//   } else {
	//     var that = this;
	//     var animation = wx.createAnimation({
	//       duration: 200,
	//       timingFunction: 'ease-in-out'
	//     });
	//     that.animation = animation;
	//     animation.translateY(500).step();
	//     that.setData({
	//       animationData: animation.export()
	//     });
	//     setTimeout(function () {
	//       animation.translateY(0).step();
	//       that.setData({
	//         maskHidden: false,
	//         isAuthoClick: false,
	//       });
	//     }, 200);
	//   }
	// }
})