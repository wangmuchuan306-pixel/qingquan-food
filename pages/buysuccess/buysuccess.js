// pages/buysuccess/buysuccess.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  lookorder() {
    wx.reLaunch({
      url: '/pages/orderlist/orderlist',
    })
  },
  goback(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  userOrderDetail() {
    app.apiPost(app.apiList.userOrderDetail, {
      orderno: this.data.orderno
    }, (res) => {
      this.setData({
        pay_real_money: res.data[0].pay_real_money
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pay_real_money: options.pay_real_money
    })
    // this.userOrderDetail()
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