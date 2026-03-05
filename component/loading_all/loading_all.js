// component/loading_all/loading_all.js
var app = getApp()
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
  },
  pageLifetimes: {
    show: function () {
      var that = this
      console.log('show')
      // 页面被展示
      if(app.get('theme')){
        var theme = app.get('theme')
        console.log(theme)
        that.setData({
          theme
        })
      }else{
        that.setData({
          theme:'dark'
        })
      }
      // app.wxAllchange()
    },
  },
  ready() {
    var that = this;
    // if (app.get('userinfo')) {
    //   that.setData({
    //     headimg: app.get('userinfo').headimg
    //   })
    // }
    if(app.get('theme')){
      var theme = app.get('theme')
      that.setData({
        theme
      })
    }else{
      that.setData({
        theme:'dark'
      })
    }
    // app.wxAllchange()
  },
	

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
