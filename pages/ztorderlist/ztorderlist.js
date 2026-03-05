// pages/ztorderlist/ztorderlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_status: 0,
    page: 1
  },
  //退款
  cancelOrderfy(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认退款',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          app.apiPost(app.apiList.cancelOrderfy, {
            orderno: e.currentTarget.dataset.id
          }, (res) => {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            if (res.status == 1) {
              var orderlist = that.data.orderlist
              orderlist.splice(e.currentTarget.dataset.index, 1)
              // order[e.currentTarget.dataset.index].order_status = 9
              // order[e.currentTarget.dataset.index].sta_txt = '已取消'
              that.setData({
                orderlist
              })
            }
          })
        }
      }
    })
  },
  //取消搜索
  nosearch() {
    this.setData({
      search_str: '',
      page: 1
    })
    this.getztdiangoods()
  },
  //搜索输入
  insearch(e) {
    this.setData({
      search_str: e.detail.value
    })
  },
  //搜索订单
  tosearch() {
    this.setData({
      page: 1
    })
    this.getztdiangoods()
  },
  //扫码核销
  scanCode() {
    var that = this
    wx.scanCode({
      success(res) {
        console.log(res)
        var result = res.result
        var orderno = result.slice(0, result.indexOf('&'))
        app.apiPost(app.apiList.zitiReceiving, {
          orderno,
          zitiid: that.data.zt_id,
          ok_type: 4
        }, (res) => {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          if (res.status == 1) {
            var orderlist = that.data.orderlist
            orderlist.forEach(v => {
              if (v.orderno == orderno) {
                v.order_status = 4
              }
            })
            that.setData({
              orderlist
            })
          }
        })
      }
    })
  },
  //收起、展开
  changeshow(e) {
    var orderlist = this.data.orderlist
    var index = e.currentTarget.dataset.index
    orderlist[index].open = !orderlist[index].open
    this.setData({
      orderlist
    })
  },
  //确认发货
  pifahuo(e) {
    var that = this
    var orderno = e.currentTarget.dataset.orderno
    app.apiPost(app.apiList.pifahuo, {
      orderno
    }, (res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      var index = e.currentTarget.dataset.index
      var orderlist = that.data.orderlist
      orderlist[index].order_status = 2
      that.setData({
        orderlist
      })
    })
  },
  //确认接货
  zitijiehuo(e) {
    var that = this
    var orderno = e.currentTarget.dataset.orderno
    app.apiPost(app.apiList.zitijiehuo, {
      orderno,
      zitiid: that.data.zt_id
    }, (res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      var index = e.currentTarget.dataset.index
      var orderlist = that.data.orderlist
      orderlist[index].order_status = 100
      orderlist.splice(index, 1)
      that.setData({
        orderlist
      })
    })
  },
  //更改订单状态
  changestatus(e) {
    this.setData({
      order_status: e.currentTarget.dataset.status,
      page: 1,
    })
    this.getztdiangoods()
  },
  //查询自提点商品
  getztdiangoods() {
    var that = this
    app.apiPost(app.apiList.getztdiangoods, {
      zt_id: that.data.zt_id,
      page: that.data.page,
      limit: 10,
      order_status: that.data.order_status,
      search_str: that.data.search_str
    }, (res) => {
      if (that.data.page == 1) {
        var orderlist = []
      } else {
        var orderlist = that.data.orderlist
      }
      for (let i in res.data) {
        orderlist = orderlist.concat(res.data[i].goods)
      }
      that.setData({
        orderlist
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      zt_id: options.zt_id,
      order_status: options.order_status
    })
    this.getztdiangoods()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})