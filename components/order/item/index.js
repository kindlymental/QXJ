// components/order/item/index.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		item: Object,
		orderType: Number
	},
	options: {
		addGlobalClass: true
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		// 详情
		toOrderDetail(e) {
			this.triggerEvent('toOrderDetail', {
				orderItem: this.properties.item,
				orderType: this.properties.orderType
			})
		},
		// 物流
		toLogistics(e) {
			this.triggerEvent('toLogistics', {
				orderItem: this.properties.item,
				orderType: this.properties.orderType
			});
		},
		// 收货
		toConfirm(e) {
			this.triggerEvent('toConfirm', {
				orderItem: this.properties.item,
				orderType: this.properties.orderType
			});
		}
	}
})
