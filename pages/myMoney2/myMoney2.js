// pages/myMoney/myMoney.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    walletsList: []
  },
  // 获取余额
  userAccount() {
    let that = this;
    app.apiPost(app.apiList.userAccount, {}, (data) => {
      let blance = data.data.blance
      let lockmoney = data.data.lockmoney
      let sign_money = data.data.sign_money
      that.setData({
        blance,
        lockmoney,
        sign_money,
        allmoney: Math.round((Number(blance) + Number(lockmoney)) * 100) / 100
      })
    })
  },
  // 立即消费
  goShopping() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 获取列表
  walletsList() {
    var that = this;
    // 禁止下拉刷新
    wx.stopPullDownRefresh();
    app.apiPost(app.apiList.findhhr_water, {
      page: that.data.page,
      limit: 20
    }, (data) => {
      data.data.forEach(v => {
        v['left_year'] = v.year.toString().slice(0, 4) + '年' + v.year.toString().slice(4) + '月'
        var date = new Date(v.add_time * 1000)
        v['day'] = date.getDate() + '日'
        v['hour_min'] = (date.getHours() > 9 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes())
      })
      let walletsList = data.data
      // var comment_end = false;
      // if (data.count <= 15 || data.data.length < 15) {
      //   comment_end = true;
      // }
      that.setData({
        walletsList: that.data.walletsList.concat(walletsList),
        // walletcount: data.count,
        // comment_end: comment_end
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.userAccount()
    this.walletsList()
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
  onHide() {},

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
    var that = this;
    if (that.data.walletsList.length % 20 == 0) {
      var page = that.data.page
      page++
      that.setData({
        page
      })
      wx.showLoading({
        title: '正在加载中',
      })
      that.walletsList();
    } else {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})