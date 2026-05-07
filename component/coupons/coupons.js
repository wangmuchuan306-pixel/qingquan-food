// component/coupons/coupons.js
let app = getApp();
Component({

  properties: {
    couponsList: Array, //view 查看  used 使用
    permissions: String, //可用
    usedCouponsList: Array, //不可用/已用
    again: {
      value: false,
      type: Boolean
    },
    goodsnum: String,
    type: String
  },
  /**
   * 页面的初始数据
   */
  data: {
    veision: app.globalData.veision,
    url: app.globalData.url,
  },
  pageLifetimes: {
    show: function () {
      var that = this
      console.log('show')
      // 页面被展示
      that.setData({
        theme: 'light'
      })
      app.wxAllchange()
      that.getlqlog()
    },
  },
  ready() {
    var that = this;
    if (app.get('userinfo')) {
      that.setData({
        headimg: app.get('userinfo').headimg
      })
    }
    that.setData({
      theme: 'light'
    })
    app.wxAllchange()
  },

  methods: {
    //优惠券使用说明
    showcontent(e) {
      this.setData({
        quanindex: e.currentTarget.dataset.index,
        show: true
      })
    },
    onClose() {
      this.setData({
        show: false
      })
    },
    //转增记录
    getlqlog() {
      app.apiPost(app.apiList.getlqlog, {}, (res) => {
        this.setData({
          zzlist: res.data
        })
      })
    },
    sendtreasure(e) {
      app.apiPost(app.apiList.sendtreasure, {
        id: e.currentTarget.dataset.id
      }, (res) => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      })
    },
    useCoupon(e) {
      let that = this;
      let couponId = e.currentTarget.dataset.couponid;
      let couponsList = that.data.couponsList;
      var index = e.currentTarget.dataset.index
      console.log(index)
      var checknum = that.data.checknum ? that.data.checknum : 0
      if (couponsList[index].checked) {
        couponsList[index].checked = !couponsList[index].checked
        checknum--
        that.setData({
          couponsList,
          checknum
        })
      } else {
        console.log(checknum)
        console.log(that.properties)
        if (checknum == that.properties.goodsnum) {
          wx.showToast({
            title: '最多可以使用' + that.properties.goodsnum + '张优惠券',
            icon: 'none'
          })
          couponsList[index].checked = false
          that.setData({
            couponsList
          })
          return
        } else {
          console.log(111)
          couponsList[index].checked = !couponsList[index].checked
          checknum++
          that.setData({
            couponsList,
            checknum
          })
        }
      }
      // couponsList.forEach((item, index) => {
      //   if (item.quan_id == couponId) {
      //     item.checked = !item.checked;
      //     if (item.checked == true) that.triggerEvent("choosethis", item);
      //     if (item.checked == false) that.triggerEvent("choosethis", null);
      //   } else {
      //     item.checked = false;
      //   }
      // })
      // console.log(that.data.again);
    },
    //立即使用卡券
    usequan() {
      var that = this
      var couponsList = that.data.couponsList
      var checknum = that.data.checknum
      if (checknum == 0) {
        wx.navigateBack()
      } else {
        var coupons = []
        couponsList.forEach(v => {
          if (v.checked) {
            coupons.push(v)
          }
        })
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          coupons
        })
        wx.navigateBack({
          delta: 1, //想要返回的层级,
          success: (res) => {
            prevPage.zongprice();
          }
        })
      }
    },
    tousecoupon(e) {
      var that = this
      var couponsList = that.data.couponsList
      var index = e.currentTarget.dataset.index
      var item = couponsList[index]
      if (item.face_type == 1) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        // var coupon = JSON.stringify(item)
        // console.log(coupon)
        wx.setStorageSync('goodscoupon', item)
        wx.redirectTo({
          url: '/pages/goodsinfo/goodsinfo?id=' + item.quan_goods_id 
          // + '&coupon=' + coupon,
        })
      }
    },
    xufei() {
      wx.navigateTo({
        url: '/pages/memberPage_bk/memberPage_bk',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      theme: 'light'
    })
    app.wxAllchange()
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
    var that = this;
    that.setData({
      theme: 'light'
    })
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
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid')
    }
  }
})