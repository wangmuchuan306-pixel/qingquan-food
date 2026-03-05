// pages/vipcenter/vipcenter.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // open: [{
    //   id: 3,
    //   name: '富硒柴鸡蛋年卡',
    //   price: 499,
    //   checked: true,
    //   qystr: '享受全部VIP会员权益，不享受YOU盟会员权益',
    //   type: 'month'
    // }, {
    //   id: 1,
    //   name: '纯散养笨鸡蛋年卡',
    //   price: 880,
    //   checked: false,
    //   qystr: '享受全部VIP会员权益，不享受YOU盟会员权益',
    //   type: 'year'
    // }],
    vipindex: 0,
    buysuccess: false
  },
  successClose() {
    this.setData({
      buysuccess: false
    })
  },
  incdk(e) {
    this.setData({
      cdk: e.detail.value
    })
  },
  getcdkvi() {
    var that = this
    app.apiPost(app.apiList.getcdkvip, {
      cdk: that.data.cdk
    }, (res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        success() {
          if (res.status == 1) {
            that.onClose()
          }
        }
      })
    })
  },
  ishow() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  addPay() {
    var that = this
    if (that.data.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || that.data.nickname == '微信用户' || !that.data.phone) {
      wx.showModal({
        title: '提示',
        content: '请先完善信息',
        complete: (res) => {
          if (res.cancel) {

          }

          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/setpage/setpage',
            })
          }
        }
      })
      return
    }
    app.apiPost(app.apiList.addPayfy, {
      payname: "member",
      // pay_type: that.data.open[that.data.vipindex].type,
      pay_type: that.data.open[that.data.vipindex].id,
      type: 1
    }, (res) => {
      wx.requestPayment({
        nonceStr: res.payinfo.nonceStr,
        package: res.payinfo.package,
        paySign: res.payinfo.paySign,
        timeStamp: res.payinfo.timeStamp,
        signType: res.payinfo.signType,
        success() {
          that.userCenter()
          that.setData({
            buysuccess: true
          })
        }
      })
      // var qr_code = data.payinfo.qr_code
      // wx.openEmbeddedMiniProgram({
      //   appId: 'wxe5ce6113d4048325',
      //   path: '/pages/qrPay/qrPay?t=' + qr_code,
      //   envVersion: 'release',
      // })
    })
  },
  choosevip(e) {
    this.setData({
      vipindex: e.currentTarget.dataset.index
    })
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      this.setData({
        headimg: res.data.headimg,
        nickname: res.data.nickname,
        level: res.data.level,
        end_time: res.data.end_time,
        phone: res.data.phone
      })
    })
  },
  findallvip() {
    app.apiPost(app.apiList.findallvip, {}, (res) => {
      this.setData({
        open: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.findallvip()
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
    this.userCenter()
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
    return {
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid')
    }
  }
})