import Config from 'config.js';
import Mock from 'mock';
var app = getApp();

/**
 * 网络接口请求
 * @param {服务器IP} ipAddress 
 * @param {url} url 
 * @param {请求方式} method 
 * @param {请求参数} data 
 */
async function request(ipAddress, url, method, data) {

  var _url = ipAddress + url;
  let userInfo = wx.getStorageSync('userInfo');
  let token = '';
  if (userInfo.token) {
    token = userInfo.token;
  }
  return await new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        "Content-Type": 'application/json',
        token: token
      },
      success: function success(request) {
        resolve(request.data);
      },
      fail: function fail(error) {
        reject(error);
        wx.showToast({
          title: (error.data && error.data.msg) ? error.data.msg : '请求失败，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
      }
    });
  });
};
/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(function (value) {
    Promise.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    Promise.resolve(callback()).then(function () {
      throw reason;
    });
  });
};

// 通用的防重复点击事件  bindtap="{{!buttonClicked?'click':''}}"
function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 500)
}

/**
 * @Date:   2020-6-1
 * @Anno:   处理列表数据接口请求到的结果
 */
function loadListData(res, pageNo, list) {
  // 要返回的结果列表数据，默认为原来的list
  let dataList = list;
  if (res.data.code == '200') {
    if (pageNo == 1) {
      if (res.data.data == null) {
        dataList = [];
      } else {
        dataList = res.data.data.list;
      }
    } else {
      if (res.data.data) {
        if (res.data.data.list && res.data.data.list.length != 0) {
          let nextList = list.concat(res.data.data.list);
          dataList = nextList;
        }
      }
    }
    wx.hideLoading();
  } else {
    if (pageNo == 1) {
      dataList = [];
      wx.showToast({
        title: '暂时没有数据',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 1000
      })
    }
  }
  return dataList;
}


function mock() {
  return new Promise(function (resolve, reject) {
    resolve(Mock.orderList);
  });
}

module.exports = {

	// 默认列表请求数量
	pageSize: '10',

	request: request,

	// 处理列表数据
	loadListData: loadListData,

	/** 接口方法 */
	// 登录和注册
	login: function login(data) {
		return request(Config.API_BASE_URL, 'api/login', 'POST', data);
	},

	// 根据权限获取用户信息
	getUserData(data) {
		return request(Config.API_BASE_URL, 'api/getUserData', 'GET', data);
	},

	/** 商品 */
	// 商品分类列表
	getCategoryList: function getCategoryList(data) {
		return request(Config.API_BASE_URL, 'api/goodsCategory', 'GET', data);
	},

	// 搜索商品分类
	searchCategoryList: function searchCategoryList(data) {
		return request(Config.API_BASE_URL, 'api/searchGoodsCategory', 'GET', data);
	},

	// 商品列表
	getProjectList: function getProjectList(data) {
		return request(Config.API_BASE_URL, 'api/goodslist', 'GET', data);
	},

	// 搜索商品
	searchProjectList: function searchProjectList(data) {
		return request(Config.API_BASE_URL, 'api/searchGoods', 'GET', data);
	},

	//根据分类id获取商品
	getGoodsByCategory(data) {
		return request(Config.API_BASE_URL, 'api/categoryGoods', 'GET', data);
	},
	//根据分类id获取商品
	getCategoryGoods(data) {
		return request(Config.API_BASE_URL, 'api/categoryGoods', 'GET', data);
	},
	// 商品收藏
	postCollectionGoods(data) {
		return request(Config.API_BASE_URL, 'api/collectionGoods', 'POST', data);
	},
	// 商品详情
	getProjectDetail: function getProjectDetail(data) {
		return request(Config.API_BASE_URL, 'api/goodsDetail', 'GET', data);
	},

	/** 服务 */
	// 服务分类
	getServiceCategoryList: function getServiceCategoryList(data) {
		return request(Config.API_BASE_URL, 'api/serviceCategory', 'GET', data);
	},
	// 服务列表
	getServiceList: function getServiceList(data) {
		return request(Config.API_BASE_URL, 'api/categoryservices', 'GET', data);
	},
	// 地址列表
	getAddressList: function getAddressList(data) {
		return request(Config.API_BASE_URL, 'api/addresslist', 'GET', data);
	},
	addAddress: function addAddress(data) {
		return request(Config.API_BASE_URL, 'api/addAddress', 'POST', data);
	},
	modifyAddress: function modifyAddress(data) {
		return request(Config.API_BASE_URL, 'api/modifyAddress', 'POST', data);
	},

	// 服务订单列表
	getOrderServeList: function getOrderServeList(data) {
		return request(Config.API_BASE_URL, 'api/orderServicesList', 'GET', data);
	},

	// 微信支付参数
	postWxUnifiedorder: function postWxUnifiedorder(data) {
		return request(Config.API_BASE_URL, 'api/wx_unifiedorder', 'POST', data)
	},
	
	// 取消商品订单
	postOrderGoodsCancel: function postOrderGoodsCancel(data) {
		return request(Config.API_BASE_URL, 'api/orderGoodsCancel', 'POST', data)
	},
	// 取消服务订单
	postCancelOrderService: function postCancelOrderService(data) {
		return request(Config.API_BASE_URL, 'api/cancelOrderService', 'POST', data)
	},
	// 确认收货,订单完成
	postOrderGoodsDone: function postOrderGoodsDone(data) {
		return request(Config.API_BASE_URL, 'api/orderGoodsDone', 'POST', data)
	},
	// 服务订单确认收货,订单完成
	postOrderServiceDone: function postOrderServiceDone(data) {
		return request(Config.API_BASE_URL, 'api/OrderServiceDone', 'POST', data)
	},
	// 服务订单完成售或
	postOrderServiceDisputesDone: function postOrderServiceDisputesDone(data) {
		return request(Config.API_BASE_URL, 'api/OrderServiceDisputesDone', 'POST', data)
	},
	// 商品订单完成售或
	postorderGoodsDisputesDone: function postorderGoodsDisputesDone(data) {
		return request(Config.API_BASE_URL, 'api/orderGoodsDisputesDone', 'POST', data)
	},
	// 服务订单申请售后
	postOrderServiceDisputes: function postOrderServiceDisputes(data) {
		return request(Config.API_BASE_URL, 'api/OrderServiceDisputes', 'POST', data)
	},
	// 商品订单申请售后
	postOrderGoodsDisputes: function postOrderGoodsDisputes(data) {
		return request(Config.API_BASE_URL, 'api/orderGoodsDisputes', 'POST', data)
	},
	// 服务订单详情
	getOrderServiceDetail: function getOrderServiceDetail(data) {
		return request(Config.API_BASE_URL, 'api/orderServicesDetail', 'GET', data);
	},

	// 商品订单列表
	getOrderList: function getOrderList(data) {
		return request(Config.API_BASE_URL, 'api/orderGoodsList', 'GET', data);
	},

	// 商品订单详情
	getOrderGoodsDetail: function getOrderGoodsDetail(data) {
		return request(Config.API_BASE_URL, 'api/orderGoodsDetail', 'GET', data);
	},

	// 创建商品订单
	createGoodsOrder: function createGoodsOrder(data) {
		return request(Config.API_BASE_URL, 'api/createGoodsOrder', 'POST', data);
	},

	// 获取首页商品列表
	getHomeGoodsList(data) {
		return request(Config.API_BASE_URL, 'api/homelist', 'Get', data);
	},

	// 创建服务订单
	createServiceOrder: function createServiceOrder(data) {
		return request(Config.API_BASE_URL, 'api/createOrderServices', 'POST', data);
	},

	// 获取优惠券列表
	getDiscountList(data) {
		return request(Config.API_BASE_URL, 'api/couponList', 'Get', data);
	},

	// 获取收藏列表
	getCollectionList(data) {
		return request(Config.API_BASE_URL, 'api/goodsCollectionList', 'Get', data);
	},

	// 套餐订单列表
	getMealOrderList(data) {
		return request(Config.API_BASE_URL, 'api/getServicePackageOrderList', 'Get', data);
	},

	// 工人获取订单列表
	getWorkerList(data) {
		return request(Config.API_BASE_URL, 'api/getServicePackageOrderList_worker', 'Get', data);
	},
	//获取套餐列表
	getServicePackageList (data) {
		return request(Config.API_BASE_URL, 'api/getServicePackageList', 'GET', data);
	}
}