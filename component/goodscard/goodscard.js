// component/goodscard/goodscard.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 这里定义了commodity属性，属性值可以在组件使用时指定
    myProperty: Object,
  },



  /**
   * 组件的初始数据
   */
  data: {
    url: app.globalData.url,
    veision:app.globalData.veision,
  },

  pageLifetimes: {
    show: function () {
      var that = this
      console.log('show')
      // 页面被展示
      that.setData({
        theme:'light'
      })
    },
  }, 
   ready() {
    var that = this
    console.log('show')
    // 页面被展示
    that.setData({
      theme:'light'
    })
   },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
