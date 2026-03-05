// components/marquee.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    marqueePace: 1,//滚动速度
    marqueeDistance: 0, //初始滚动距离
    size: 28,
    orientation: 'left', //滚动方向
    interval: 20
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _scrolling: function() {
      var _this = this;
      var timer = setInterval(()=> {
        // console.log(_this.data.length)
        // console.log(_this.data.marqueeDistance)

        if(-_this.data.marqueeDistance < _this.data.length) {
          _this.setData({
            marqueeDistance: _this.data.marqueeDistance - _this.data.marqueePace
          })
        } else {
          clearInterval(timer);
          _this.setData({
            marqueeDistance: _this.data.windowWidth
          });
          _this._scrolling();
        }
      },_this.data.interval);
    }
  },

  created: function() {
    var _this = this;
    var length = _this.data.title.length * _this.data.size;
    var windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(windowWidth)
    console.log(_this.data.title.length)
    console.log(_this.data.size)

    console.log(length)

    _this.setData({
      length: length,
      windowWidth: windowWidth
    });
    if(_this.data.length > _this.data.windowWidth){
      _this._scrolling();
    }
  }
})