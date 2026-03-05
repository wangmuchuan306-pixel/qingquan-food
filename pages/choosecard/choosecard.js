// packageB/pages/mycard/mycard.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    veision: app.globalData.veision,
    url: app.globalData.url,
    permissions: 'used',
    couponsList: [],
    usedCouponsList: [],
    goods_id: null,
  },
  //goWebView
  goWebView() {
    wx.navigateTo({
      url: '/pages/webView/webView?id=5',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (options.goodsnum) {
      that.setData({
        goodsnum: options.goodsnum
      })
    }
    let quan_id = null;
    if (options.quan_id != 0) {
      quan_id = options.quan_id;
      console.log(quan_id);
      that.setData({
        again: true,
      })
    }
    if(options.goodsmoney){
      this.setData({
        onemoney:Number(options.goodsmoney),
      })
    }
    this.setData({
      price: options.price,
      goods_id: options.goods_id,
      quan_id,
    })
    //查询我的优惠券
    this.orderQuanList();
  },
  orderQuanList() {
    var that = this;
    let data = {
      price: that.data.price,
      goods_id: that.data.goods_id
    }
    app.apiPost(app.apiList.orderQuanList, data, (res) => {
      if (res.status == 1) {
        let quan_id = that.data.quan_id;
        let couponsList = res.data.yes;
        let usedCouponsList = res.data.no;
        if(quan_id){
          quan_id = quan_id.split(',')
        }else{
          quan_id = []
        }
        couponsList.forEach((item, index) => {
          item['checked'] = false;
          // if (quan_id == item.quan_id) item.checked = true;
          quan_id.forEach(v=>{
            if(item.quan_id == v){
              item.checked = true;
            }
          })
        })
        that.setData({
          couponsList,
          usedCouponsList
        })
      }
    })
  },
  //选择这个优惠券
  choosethis(coupons) {
    console.log(coupons.detail);
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      coupon: coupons.detail,
    })
    wx.navigateBack({
      delta: 1, //想要返回的层级,
      success: (res) => {
        prevPage.zongprice();
      }
    })
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
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid')
    }
  }
})