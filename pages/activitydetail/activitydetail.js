// pages/activitydetail/activitydetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.globalData.qiniuUrl,
  },

  getact() {
    let data = {
      id: this.data.act_id
    }
    app.apiPost(app.apiList.getact, data, (res) => {
      if (res.status == 1) {
        var activity = res.data
        // if(activity.is_can_buy == 0){
        //   wx.showModal({
        //     title: '提示',
        //     content: '您未在活动名单中，请联系客服',
        //     showCancel:false,
        //     confirmText:'返回首页',
        //     success (res) {
        //       if (res.confirm) {
        //         wx.reLaunch({
        //           url: '/pages/index/index'
        //         })
        //       }
        //     }
        //   })
        // }
        wx.setNavigationBarTitle({
          title: activity.act_title
        })
        this.setData({
          activity: res.data
        })
        if (res.data.act_goods.length > 0) {
          this.getspecs(res.data.act_goods, 0)
        }
      }
    })
  },
  getspecs(list, index) {
    if (index >= list.length) {
      return
    }
    app.apiPost(app.apiList.getspecs, {
      goods_id: list[index].goods_id
    }, (res) => {
      let activity = this.data.activity
      let goodslist = activity.act_goods
      let gIndex = goodslist.findIndex(v => v.goods_id == list[index].goods_id)
      const specs_pfmoney = Math.min(...res.data.map(item => Number(item['specs_pfmoney'])).filter(price => !isNaN(price)))
      const specs_tgmoney = Math.min(...res.data.map(item => Number(item['specs_tgmoney'])).filter(price => !isNaN(price)))
      const specs_erpmoney = Math.min(...res.data.map(item => Number(item['specs_erpmoney'])).filter(price => !isNaN(price)))
      const specs_vipmoney = Math.min(...res.data.map(item => Number(item['specs_vipmoney'])).filter(price => !isNaN(price)))
      goodslist[gIndex].specs_pfmoney = (specs_pfmoney || 0).toFixed(2)
      goodslist[gIndex].specs_tgmoney = (specs_tgmoney || 0).toFixed(2)
      goodslist[gIndex].specs_vipmoney = (specs_vipmoney || 0).toFixed(2)
      goodslist[gIndex].specs_erpmoney = (specs_erpmoney || 0).toFixed(2)
      const totalStock = res.data.reduce((sum, item) => sum + (Number(item.specs_stock) || 0), 0)
      goodslist[gIndex].all_goodsstock = totalStock
      goodslist[gIndex].number = res.data.reduce((sum, item) => sum + (Number(item.shoppingspecs?.number) || 0), 0)
      goodslist[gIndex].specs = res.data
      activity.act_goods = goodslist
      this.setData({
        activity
      })
      this.getspecs(list, index + 1)
    })
  },
  //商品详情
  toinfo(e) {
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id=' + e.currentTarget.dataset.id + '&active_id=' + this.data.act_id,
    })
  },
  //抢购
  tobuy(e) {
    var that = this
    var userinfo = that.data.userinfo
    if (!userinfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success() {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          })
        }
      })
      return
    }
    if (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone) {
      wx.showModal({
        title: '提示',
        content: '请先完善信息',
        complete: (res) => {
          if (res.cancel) { }
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/setpage/setpage',
            })
          }
        }
      })
      return
    }
    var goods_id = that.data.activity.act_goods[e.currentTarget.dataset.index].goods_id
    wx.navigateTo({
      url: '/pages/addorder/addorder?num=1&goods_id=' + goods_id + '&active_id=' + that.data.act_id,
    })
    return
    app.apiPost(app.apiList.goodsDetail, {
      goods_id
    }, (res) => {
      if (res.data.zttype == 1) {
        that.setData({
          chooseStyle: 1,
          xdistance: 348
        })
      }
      if (res.data.zttype == 2) {
        that.setData({
          chooseStyle: 2,
          xdistance: 0
        })
      }
      that.setData({
        Detail: res.data,
        zttype: res.data.zttype,
        storeLatitude: res.data.store_info.latitude,
        storeLongitude: res.data.store_info.longitude,
        freight_info: res.data.goodsinfo.freight_info,
        commodityshow: true,
        num: 1,
        goods_id,
        coupons: []
      })
      app.apiPost(app.apiList.chanumcou, {
        num: 1,
        goods_id
      }, (data) => {
        that.setData({
          have_quan: data.data.have_quan
        })
      })
      that.getAddressList()
    })
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.status == 1) {
        this.setData({
          userinfo: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var id = options.id
    this.setData({
      act_id: id
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
    if (!wx.getStorageSync('token_new')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }, 1500)
      return
    }
    this.userCenter()
    this.getact()
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