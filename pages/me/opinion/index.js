const qiniuUploader = require("../../../utils/qiniuUploader");
Page({
  didPressChooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        qiniuUploader.upload(filePath, (res) => {
          that.setData({
            'imageURL': res.imageURL,
          });
        }, (error) => {
          console.log('error: ' + error);
        }, {
          uploadURL: 'https://up-z1.qiniup.com',
          domain: 'bzkdlkaf.bkt.clouddn.com',
          uptokenURL: 'https://sosogo.site/mall/api/qiniuToken',
        })
      }
    })
  }
})