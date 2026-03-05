// pages/paysuccess/paysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h: '00',
    m: '00',
    s: '00'
  },
  callphone() {
    wx.makePhoneCall({
      phoneNumber: '18833330416',
    })
  },
  settime() {
    var that = this
    var date = new Date()
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    this.setData({
      h,
      m,
      s
    })
    setTimeout(() => {
      that.settime()
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    // setInterval(() => {
    clearTimeout()
    that.settime()
    // }, 1000);
    // var pay_time = Number(options.pay_time)
    var money = options.money
    // var date = new Date(pay_time)
    // var time = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    this.setData({
      money,
      ztdian: options.ztdian,
    })
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
    clearTimeout()
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
})