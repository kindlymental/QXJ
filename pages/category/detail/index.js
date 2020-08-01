// pages/category/detail/index.js
import Request from '../../../utils/request.js';
import {
	sub,	// 浮点型减
	div,	// 浮点型除法
	accAdd,	// 浮点型加法函数
	mul	    // 浮点型乘法
} from '../../../utils/util';
const CONFIG = require('../../../utils/config.js');
var app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		indicatorDots: true,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		projectId: null, // 项目id
		projectList: null, // 推荐项目列表
		goods_id: null, // 项目id
		pageNumber: 1,
		address: null,  // 选择的地址
		show: false,
		projectDetail: {},
		package_info: null,
		spec_info: null,
		install_info: null,
		projectDetailImg: null,
		promotion_id: '',
		promotion_price: '',
		special_id: '',
		special_price: 0,
		install_type: null,
		coupon_info: null,
		coupon_id: '',
		buy_count: 1,
		total_price: null,
		note: '',
		security_id: '',
		security_price: 0,
		spec: '',
		size: '',
		size_index: null
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	async onLoad(options) {
		if (options) {
			this.setData({
				goods_id: options.goods_id
			});
		}
		await this.getProjectDetail(); // 项目详情
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
	 * @Anno:   请求项目详情接口
	 */
	getProjectDetail() {
		var that = this;
		wx.showLoading({
			title: '正在加载中',
		});
		let param = {
			good_id: this.data.goods_id
		}
		Request.getProjectDetail(param)
			.then(function (res) {
				console.log('res', res);
				if (res.data) {
					that.setData({
						projectDetail: res.data.goods,
						install_info: res.data.install_info,
						package_info: res.data.package_info,
						spec_info: res.data.spec_info,
						projectDetailImg: res.data.spec_info.specs[0].cover,
						total_price: res.data.goods.minPrice
					});
					that.getCategoryGoods(res.data.goods.category_id)
				}
				wx.hideLoading();
			});
	},
	onClose () {
		this.setData({
			show: false
		})
	},
	/**
	 * @Date:   2020-6-4
	 * @Anno:   推荐详情
	 */
	recommendEventHandle() {

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
	 * @Anno: 收藏
	 */
	toCollection() {
		let params = {
			goods_id: this.data.goods_id
		}
		Request.postCollectionGoods(params)
			.then(res=>{
				if(res.code == 200) {
					wx.showToast({
						title: '操作成功',
						icon: 'none',
						duration: 1000
					});
				} else {
					wx.showToast({
						title: res.msg,
						icon: 'none',
						duration: 1000
					});
				}
			});
	},

	/**
	 * @Date: 2020-6-4
	 * @Anno: 选择地址
	 */
	chooseAddress() {
		wx.navigateTo({
			url: '/pages/me/address/index',
		});
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
	getCategoryGoods(category_id){
		let params = {
			category_id: category_id,
			page: 1,
			limit: 8
		}
		Request.getCategoryGoods(params)
			.then(res=>{
				console.log('res11', res);
				this.setData({
					projectList: res.data
				})
			})
	},
	chooseOperate(e) {
		let index = e.currentTarget.dataset.index;
		this.setData({
			install_type: index,
		});
	},
	chooseSize(e) {
		let item = e.currentTarget.dataset.item;
		let index = e.currentTarget.dataset.index;
		this.setData({
			size: item,
			size_index: index,
		});
	},
	chooseSpecs(e) {
		let index = e.currentTarget.dataset.index;
		this.setData({
			spec: index,
		});
	},
	choosePromotion(e) {
		let index = e.currentTarget.dataset.index;
		this.setData({
			promotion_id: index,
		});
	},
	chooseSpecialService(e) {
		let { buy_count, security_price, total_price, projectDetail } = this.data;
		let { minPrice } = projectDetail;
		let index = e.currentTarget.dataset.index;
		let price = e.currentTarget.dataset.price;
		let servicePrice = accAdd(price, security_price);
		let singlePrice = mul(buy_count, minPrice);
		total_price = accAdd(singlePrice, servicePrice);
		this.setData({
			special_id: index,
			special_price: price,
			total_price,
		});
	},
	chooseSecurity(e){
		let { buy_count, special_price, total_price, projectDetail } = this.data;
		let { minPrice } = projectDetail;
		let index = e.currentTarget.dataset.index;
		let price = e.currentTarget.dataset.price;
		let servicePrice = accAdd(special_price, price);
		let singlePrice = mul(buy_count, minPrice);
		total_price = accAdd(singlePrice, servicePrice);
		this.setData({
			security_id: index,
			security_price: price,
			total_price,
		});
	},
	/**
	 * @Date:   2020-6-3
	 * @Anno:   去下单
	 */
	toPayment() {
		let self = this;
		let address_id = '';
		if (self.data.address != null) {
			address_id = self.data.address.address_id;
		}
		if (address_id == '') {
			wx.showToast({
				title: '请选择收货地址',
				icon: 'none',
			});
			return false;
		} else {
			self.setData({
				show: true,
			});
		}
	},
	createOrder () {
		let { total_price, coupon_info, coupon_id } = this.data;
		let coupon_price = 0;
		if (coupon_info !=null &&coupon_info.coupon_price) {
			coupon_price = coupon_info.coupon_price;
		}
		total_price = sub(total_price, coupon_price);
		let self = this;
		let address_id = '';
		if (self.data.address != null) {
			address_id = self.data.address.address_id;
		}
		let params = {
			spec: self.data.spec,
			size: self.data.size,
			goods_id: self.data.goods_id,
			address_id: address_id,
			package_info: {
				goods_id: self.data.goods_id,		//商品id
				install_type: Number(self.data.install_type),	//是否需要安装
				promotion_id: self.data.promotion_id,	//促销活动id
				security_id: self.data.security_id,	//服务保障id
				special_id: self.data.special_id		//特色服务id
			},
			note: self.data.note,
			coupon_id: coupon_id,
			buy_count: self.data.buy_count,
			total_price: total_price,
		}
		if (self.data.size == '' || self.data.size == null) {
			wx.showToast({
				title: '请选择尺寸',
				icon: 'none',
			});
			return false;
		}
		if (self.data.spec == '' || self.data.spec == null) {
			wx.showToast({
				title: '请选择颜色',
				icon: 'none',
			});
			return false;
		}
		if (self.data.install_type == null) {
			wx.showToast({
				title: '请选择送装服务',
				icon: 'none',
			});
			return false;
		}
		wx.showLoading({
			itle: '正在加载中',
		});
		Request.createGoodsOrder(params).then(function (res) {
			wx.hideLoading();
			let { data } = res;
			console.log('data', data);
			let goods_order_id = data.goods_order_id;
			let jsondata = {
				order_id: goods_order_id,
				order_type: 0
			}
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
		});
	},
	minCount(e){
		let { buy_count, special_price, security_price, total_price, projectDetail } = this.data;
		let servicePrice = accAdd(special_price, security_price);
		let { minPrice } = projectDetail;
		if (buy_count <= 1) {
			return;
		} else {
			buy_count = buy_count - 1;
			let singlePrice = mul(buy_count, minPrice);
			total_price = accAdd(singlePrice, servicePrice);
			this.setData({
				buy_count,
				total_price
			});
		}
	},
	addCount(e){
		let { buy_count, special_price, security_price, total_price, projectDetail } = this.data;
		let servicePrice = accAdd(special_price, security_price);
		let { minPrice } = projectDetail;
		buy_count = buy_count + 1;
		let singlePrice = mul(buy_count, minPrice);
		total_price = accAdd(singlePrice, servicePrice);
		this.setData({
			buy_count,
			total_price
		});
	},
	changCount(e){
		let { special_price, security_price, total_price, projectDetail } = this.data;
		let servicePrice = accAdd(special_price, security_price);
		let { minPrice } = projectDetail;
		let value = e.detail.value;
		let singlePrice = mul(value, minPrice);
		total_price = accAdd(singlePrice, servicePrice);
		this.setData({
			buy_count: value,
			total_price
		});
	}
});