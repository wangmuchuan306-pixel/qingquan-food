// pages/myztdian/myztdian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  },
  //扫码核销
  scanCode() {
    var that = this
    wx.scanCode({
      success(res) {
        console.log(res)
        var result = res.result
        var orderno = result.slice(0, result.indexOf('&'))
        app.apiPost(app.apiList.zitiReceiving, {
          orderno,
          zitiid: that.data.ztinfo.id,
          ok_type: 4
        }, (res) => {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          if (res.status = 1) {
            var orderlist = that.data.orderlist
            orderlist.forEach(v => {
              v.goods.forEach(item => {
                if (item.orderno == orderno) {
                  item.order_status = 4
                }
              })
            })
            that.setData({
              orderlist
            })
          }
        })
      }
    })
  },
  //待发货清单
  todeliveryGoods() {
    wx.navigateTo({
      url: '/pages/deliveryGoods/deliveryGoods?zitidian=' + this.data.ztinfo.id,
    })
  },
  //查看流水明细
  tomoney() {
    wx.navigateTo({
      url: '/pages/myMoney1/myMoney1',
    })
  },
  //查看全部订单
  toztorderlist(e) {
    wx.navigateTo({
      url: '/pages/ztorderlist/ztorderlist?zt_id=' + this.data.ztinfo.id + '&order_status=' + e.currentTarget.dataset.status,
    })
  },
  //查询我的自提点
  myztdian() {
    wx.showLoading({
      title: '数据加载中',
    })
    app.apiPost(app.apiList.myztdian, {}, (res) => {
      var ztinfo = res.data
      wx.setNavigationBarTitle({
        title: ztinfo.zt_name,
      })
      ztinfo.data.ddzmoney = ztinfo.data.ddzmoney ? ztinfo.data.ddzmoney : 0
      ztinfo.data.djsmoney = ztinfo.data.djsmoney ? ztinfo.data.djsmoney : 0
      ztinfo.data.yjsmoney = ztinfo.data.yjsmoney ? ztinfo.data.yjsmoney : 0
      ztinfo.allmoney = (Number(ztinfo.data.ddzmoney) + Number(ztinfo.data.djsmoney) + Number(ztinfo.data.yjsmoney)).toFixed(2)
      this.setData({
        ztinfo,
        page: 1
      })
      this.getztdiangoods()
    })
  },
  //查询自提点商品
  getztdiangoods() {
    var that = this
    app.apiPost(app.apiList.getztdiangoods, {
      zt_id: that.data.ztinfo.id,
      page: that.data.page,
      limit: 10,
    }, (res) => {
      var now = new Date()
      var today = new Date(now.setHours(0, 0, 0, 0)).getTime()
      let year = now.getFullYear();
      let month = now.getMonth();
      let day = now.getDate();
      var yesterday = new Date(year, month, day - 1);
      yesterday.setHours(0, 0, 0, 0);
      yesterday = yesterday.getTime();
      // var list = Object.values(res.data)
      if (that.data.page == 1) {
        var orderlist = []
        var listlength = 0
      } else {
        var orderlist = that.data.orderlist
        var listlength = that.data.listlength
      }
      for (let i in res.data) {
        var data = {
          time: i,
          goods: res.data[i].goods,
          money: res.data[i].money
        }
        var date = new Date(data.time)
        if (date >= today) {
          data.time = '今天'
        } else if (date >= yesterday && date < today) {
          data.time = '昨天'
        }
        data.weekday = date.getDay()
        orderlist.push(data)
        listlength += res.data[i].goods.length
      }
      that.setData({
        orderlist,
        listlength
      })
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.myztdian()
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
    if (this.data.listlength % 10 == 0) {
      this.setData({
        page: this.data.page + 1
      })
      this.getztdiangoods()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})