//app.js
const regeneratorRuntime = require("./utils/regenerator-runtime/runtime.js");
const QQMapWX = require('./utils/qqmap/qqmap-wx-jssdk.js');
const CONFIG = require('./utils/config.js');
var qqmapsdk;

App({
  globalData: {
    // 个人信息  {"avatarUrl":"","city":"","province":"","nickName":"小猪猪","country":"","gender":1,"openId":null,"level":3,"user_id":"542789","token":"eyJ0eXAiOiJqd3RfdG9rZW4iLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNTQyNzg5IiwiZXhwIjoyNDE5MjAwMDAwMDAwMDB9.QaniVMZMCL7Dj_KhWaLry9NwrF93ups_QrSuvsIUwnY"}
    userInfo: null,
    // 系统信息 {errMsg: "getSystemInfo:ok", model: "iPhone 6/7/8 Plus", pixelRatio: 3, windowWidth: 414, windowHeight: 672, …}
    systemInfo: null,
    // 地理位置信息 {lat: 39.95933, lng: 116.29845, city: "北京市", cityCode: "156110000"}
    coordinate: null, 
  },

  onLaunch: function () {
    // 系统信息
    wx.getSystemInfo({
      complete: (res) => {
        this.globalData.systemInfo = res;
      },
    })
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: CONFIG.qqmapsdkKey
    });
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          // 未授权地理位置权限
          return;
        } 
        // 已经授权过
        this.getLocationAddress();
      }
    });
  },

  /**
   * 获取定位地址并反解析地址
   */
  getLocationAddress() {
    var that = this;
    wx.getLocation({
      'type': 'wgs84',
      success: function(res) {
        let coordinate = {
          "lat": res.latitude,
          "lng": res.longitude
        };
        that.globalData.coordinate = coordinate;

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.ad_info.city;
            var cityCode = addressRes.result.ad_info.city_code;

            Object.assign(that.globalData.coordinate, {
              city: address,
              cityCode: cityCode
            });
            wx.setStorageSync("coordinate", that.globalData.coordinate);
          }
        })
      },
      cancel: function(res) {
        // 判断是没有开启手机小程序定位权限还是手机定位权限
      }
    })
  },
})