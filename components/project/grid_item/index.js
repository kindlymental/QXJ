// components/project/grid_item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    project: Object,
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
    onTap: function (e) {
      this.triggerEvent('toDetail', {
        projectId: this.properties.project.id
      })
    }
  }
})
