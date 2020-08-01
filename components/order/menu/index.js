// components/order/menu/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuList: Array,   
  },

  /**
   * 组件的初始数据
   */
  data: {
    menuSelectedIndex: 0, // 菜单选中的索引
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickChangeMenu(e) {
		console.log('e.currentTarget.dataset.index', e.currentTarget.dataset.index)
      this.setData({
        menuSelectedIndex: e.currentTarget.dataset.index
      });
      this.triggerEvent('changeMenu', {
        menuSelectedIndex: e.currentTarget.dataset.id
      })
    }
  }
})
