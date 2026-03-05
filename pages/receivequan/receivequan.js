// pages/receivequan/receivequan.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    url: app.globalData.url,

  },
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
  gomycard() {
    wx.navigateTo({
      url: '/pages/mycard/mycard',
    })
  },
  receive_coupon(e) {
    var that = this
    var quanlist = this.data.quanlist
    var index = e.currentTarget.dataset.index
    var quanlist = this.data.quanlist
    if (quanlist[index].is_lingqu >= 1) {
      return
    }
    app.apiPost(app.apiList.getmembercou, {
      coupon_id: quanlist[index].id,
      quan_from: 10,
    }, (res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      if (res.status == 1) {
        quanlist[index].is_lingqu = 1
        that.setData({
          quanlist
        })
      }
      // that.newbuyquan()
    })
  },
  newbuyquan() {
    var that = this
    app.apiPost(app.apiList.newbuyquan, {
      page: this.data.page,
      limit: 20
    }, (res) => {
      if (res.ordercount <= 0) {
        res.data = res.data.filter(item => item.cat_id != 6)
      }
      if (!this.data.isnew) {
        res.data = res.data.filter(item => item.cat_id != 2)
      }
      res.data.forEach(item => {
        if (item.valid_type == 2 && item.is_lingqu >= 1) {
          var date = new Date(item.this_quan_this_user_have_list[0].coupon_end_time * 1000)
          var year = date.getFullYear()
          var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
          var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
          item.end_time_ymd = year + '-' + month + '-' + day
        }
      })
      if (this.data.page == 1) {
        var listlength = 0
        var quanlist = res.data
      } else {
        var listlength = this.data.listlength
        var quanlist = this.data.quanlist.concat(res.data)
      }
      listlength += res.data.length
      this.setData({
        quanlist,
        listlength
      })
    })
  },
  userCenter() {
    var that = this
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.status == 1) {
        var register_time = Number(res.data.register_time) * 1000
        var thistime = new Date().getTime()
        if ((register_time + 7 * 24 * 60 * 60 * 1000) > thistime) {
          var isnew = true
        } else {
          var isnew = false
        }
        var userinfo = res.data
        if (!userinfo.nickname || userinfo.nickname == '微信用户' || !userinfo.phone) {
          wx.showToast({
            title: '请先完善资料',
            icon: 'none',
            success() {
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/setpage/setpage',
                })
              }, 1500)
            }
          })
          return
        }
        that.setData({
          userinfo: res.data,
          isnew
        })
        that.newbuyquan()
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none',
          success() {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }, 1500)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (!wx.getStorageSync('token_new')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success() {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }, 1500)
        }
      })
    }
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
    if (this.data.listlength % 20 == 0) {
      var page = this.data.page + 1
      this.setData({
        page
      })
      this.newbuyquan()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})