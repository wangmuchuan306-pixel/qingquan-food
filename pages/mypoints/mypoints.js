// pages/mypoints/mypoints.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    walletsList: [],
    text: ['', '邀请好友奖励', '本人下单奖励', '下级下单奖励', '商品下单抵扣', '助力成功奖励']
  },
  // // 获取余额
  // userAccount() {
  //   let that = this;
  //   app.apiPost(app.apiList.userAccount, {}, (data) => {
  //     let blance = data.data.blance
  //     let lockmoney = data.data.lockmoney
  //     let sign_money = data.data.sign_money
  //     that.setData({
  //       blance,
  //       lockmoney,
  //       sign_money,
  //       allmoney:Math.round((Number(blance)+Number(lockmoney))*100)/100
  //     })
  //   })
  // },
  gotojianjie() {
    wx.navigateTo({
      url: '/pages/jianjie/jianjie?id=3',
    })
  },
  // 立即消费
  goShopping() {
    wx.navigateTo({
      url: '/pages/prizeDraw/prizeDraw',
    })
  },
  // 获取列表
  walletsList() {
    var that = this;
    // 禁止下拉刷新
    wx.stopPullDownRefresh();
    app.apiPost(app.apiList.integral_list, {
      page: that.data.page
    }, (data) => {
      let walletsList = data.data.list
      var comment_end = false;
      if (data.count <= 15 || data.data.length < 15) {
        comment_end = true;
      }
      that.setData({
        blance: data.data.integral,
        walletsList: that.data.walletsList.concat(walletsList),
        walletcount: data.count,
        comment_end: comment_end
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
  onHide() { },

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
    if (that.data.comment_end) {
      wx.showToast({
        title: '已经到底了！',
        icon: 'none'
      })
      return;
    } else {
      var page = that.data.page
      page++
      that.setData({
        page
      })
      wx.showLoading({
        title: '正在加载中',
      })
      that.walletsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})