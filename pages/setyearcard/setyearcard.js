// pages/setyearcard/setyearcard.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_vip: 1
  },
  //商品详情
  toinfo(e) {
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id=' + e.currentTarget.dataset.id,
    })
  },
  changevip(e) {
    this.setData({
      goods_vip: e.currentTarget.dataset.type,
    })
    this.nklist()
  },
  nklist() {
    var that = this
    app.apiPost(app.apiList.goodsPage, {
      page: 1,
      limit: 999,
      goods_vip: that.data.goods_vip,
      typeid: 0,
      latitude: 0,
      longitude: 0,
    }, (res) => {
      that.setData({
        goodslist: res.data
      })
      // setTimeout(() => {
      //   const waterfallInstance = that.selectComponent("#waterfall");
      //   waterfallInstance.reflow();
      // }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var windowsinfo = wx.getWindowInfo()
    var pixelRatio = windowsinfo.windowWidth / 750
    this.setData({
      pixelRatio,
      goods_vip: options.typeid,
    })
    this.nklist()
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