// pages/myhhr/myhhr.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  },
  tomyyquser() {
    wx.navigateTo({
      url: '/pages/myyquser/myyquser',
    })
  },
  //流水明细
  tomoney() {
    wx.navigateTo({
      url: '/pages/myMoney2/myMoney2',
    })
  },
  //刷新
  Refresh() {
    this.setData({
      page: 1
    })
    this.mydlssp()
    this.mydlsxx()
  },
  //我的代理商信息
  mydlsxx() {
    app.apiPost(app.apiList.mydlsxx, {}, (res) => {
      this.setData({
        yjsmoney: Number(res.data.yjsmoney).toFixed(2),
        djsmoney: Number(res.data.djsmoney).toFixed(2),
        ddzmoney: Number(res.data.ddzmoney).toFixed(2),
        allmoney: (Number(res.data.yjsmoney) + Number(res.data.djsmoney) + Number(res.data.ddzmoney)).toFixed(2),
        zjyq: res.data1.zjyq,
        jjyq: res.data1.jjyq,
        ljcj: res.data1.ljcj,
      })
    })
  },
  mydlssp() {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    var that = this
    app.apiPost(app.apiList.mydlssp, {
      page: that.data.page,
      limit: 20
    }, (res) => {
      var now = new Date()
      var today = new Date(now.setHours(0, 0, 0, 0)).getTime()
      let year = now.getFullYear();
      let month = now.getMonth();
      let day = now.getDate();
      var yesterday = new Date(year, month, day - 1);
      yesterday.setHours(0, 0, 0, 0);
      yesterday = yesterday.getTime();
      if (that.data.page == 1) {
        var orderlist = []
        var listlength = 0
      } else {
        var orderlist = that.data.orderlist
        var listlength = that.data.listlength
      }
      var a = []
      res.data.forEach(v => {
        a.push(v.pay_time2)
      })
      a = new Set(a)
      a.forEach(v => {
        var money = 0
        var b = res.data.filter(item => item.pay_time2 == v)
        console.log(b)
        b.forEach(item => {
          money += Number(item.frmoney)
        })
        orderlist.push({
          time: v,
          goods: b,
          money: money.toFixed(2)
        })
      })
      for (let index = 0; index < orderlist.length; index++) {
        var date = new Date(orderlist[index].time)
        if (date >= today) {
          orderlist[index].time = '今天'
        } else if (date >= yesterday && date < today) {
          orderlist[index].time = '昨天'
        }
        orderlist[index].weekday = date.getDay()
        if (index > 0 && orderlist[index].time == orderlist[index - 1].time) {
          orderlist[index - 1].goods = orderlist[index - 1].goods.concat(orderlist[index].goods)
          orderlist[index - 1].money = (Number(orderlist[index - 1].money) + Number(orderlist[index].goods)).toFixed(2)
          orderlist.splice(index, 1)
        }
      }
      listlength += res.data.length
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
  onLoad(options) {
    this.mydlsxx()
    this.mydlssp()
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
    if (this.data.listlength % 20 == 0) {
      var page = this.data.page + 1
      this.setData({
        page
      })
      this.mydlssp()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid'),
      imageUrl: '/images/logo.jpg',
      title: '冀唐清泉'
    }
  }
})