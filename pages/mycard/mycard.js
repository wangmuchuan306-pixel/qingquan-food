// packageB/pages/mycard/mycard.js
var app = getApp();
let that = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    veision: app.globalData.veision,
    url: app.globalData.url,
    permissions: 'view',
    couponsList: [], //未使用优惠券列表
    usedCouponsList: [] //已使用优惠券列表
  },
  incdk(e) {
    this.setData({
      cdk: e.detail.value
    })
  },
  getcdkvi() {
    var that = this
    app.apiPost(app.apiList.getcdk, {
      cdk: that.data.cdk
    }, (res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        success() {
          if (res.status == 1) {
            that.onClose()
            that.getCouponList()
          }
        }
      })
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  changetype(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  goCDK() {
    this.setData({
      show: true
    })
    return
    wx.navigateTo({
      url: '/pages/exchangeCDK/exchangeCDK',
    })
  },
  getlqlog() {
    app.apiPost(app.apiList.getlqlog, {}, (res) => {
      var yznum = res.data.length
      this.setData({
        yznum,
      })
    })
  },
  getCouponList() {
    let data = {};
    app.apiPost(app.apiList.getCouponList, data, (res) => {
      if (res.status != 1) {
        that.throwError(that.getCouponList);
        return;
      }
      let couponsList = res.data.yes_use;
      let usedCouponsList = res.data.no_use;
      let dsnum = couponsList.filter(item => item.status === 0)
      dsnum = dsnum.length
      let ysnum = couponsList.filter(item => item.status === 1)
      ysnum = ysnum.length
      let nousenum = usedCouponsList.length
      console.log(couponsList);
      that.setData({
        couponsList,
        usedCouponsList,
        dsnum,
        ysnum,
        nousenum,
      })
    })
  },

  //跳转说明
  goWebView() {
    wx.navigateTo({
      url: '/pages/webView/webView?id=5',
    })
  },
  goWebView1() {
    wx.navigateTo({
      url: '/packageB/pages/mycard1/mycard1?type=' + 2,
    })
  },

  // 报错方法
  throwError(user) {
    console.error('throw error here');
    console.error(user);
    wx.showToast({
      icon: 'none',
      title: '发生错误',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // if(wx.getStorageSync('theme')){
    //   var theme = wx.getStorageSync('theme')
    //   that.setData({
    //     theme
    //   })
    // }else{

    // }
    that.setData({
      theme: 'light'
    })
    app.wxAllchange()
    that.getCouponList();
    that.getlqlog()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    app.wxAllchange()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this
    var username = wx.getStorageSync('userinfo').nickname
    var imgsrc = wx.getStorageSync('userinfo').headimg
    // var quanname =that.datainfo.goods_name
    var quanname = e.target.dataset.name
    if (e.target.dataset.urls == undefined) {
      var urls = '/images/buzz.png'
    } else {
      var urls = e.target.dataset.urls
    }
    var coupon_id = e.target.dataset.id
    var data = {
      coupon_id: coupon_id
    }
    var time = 6
    // return
    app.apiPost(app.apiList.sendcoupon, data, (data) => {
      if (data.status == 1) {
        that.getCouponList()
      }
    })
    var urlss = '/images/cardshare.jpg';
    return {
      // title: username + "赠送您一张" + quanname + "，请在" + time + "小时内领取",
      title: "我送您一张" + quanname + '代金券' + "，请在" + 2 + "小时内领取",
      // desc: '分享页面的内容',
      path: '/pages/reward/receivereward?coupon_id=' + coupon_id + '&username=' + username + '&imgsrc=' + imgsrc + '&fromuid=' + wx.getStorageSync('userinfo').id,
      imageUrl: urlss,
    }
  }
})