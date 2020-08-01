// components/nav_header/index.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: app.globalData.systemInfo.statusBarHeight + 'px',   // 状态栏
    navigationBarHeight: (app.globalData.systemInfo.statusBarHeight + 44) + 'px',  // 导航

    text1: '商品',
    text2: '服务',

    menuSelectedIndex: 0  // 索引
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMenu(e) {
      this.setData({
        menuSelectedIndex: e.currentTarget.dataset.index
      });
      this.triggerEvent('clickMenu', {
        menuSelectedIndex: this.data.menuSelectedIndex
      })
    }
  }
})
