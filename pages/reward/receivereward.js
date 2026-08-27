// pages/reward/receivereward.js
var app = getApp();

var timer = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,
    h: '00',
    m: '00',
    s: '00',
    bg: 'f60'
  },
  //查看商品
  go1(e) {
    console.log(e.currentTarget.dataset.histoty_cou_id)
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.apiPost(app.apiList.getIndexSet, {}, (res) => {
      var procedure = res.data
      that.setData({
        procedure: procedure
      })
    })
    // console.log('user_id')
    // console.log(user_id)
    // wx.setStorageSync('uid', 4864)
    var username = options.username
    var imgsrc = options.imgsrc
    console.log('username')
    console.log(options)
    var coupon_id = options.coupon_id
    // var coupon_id = 4206
    that.setData({
      coupon_id: coupon_id
    })
    console.log(imgsrc)
    if(options.fromuid){
      app.captureReferrer(options.fromuid)
    }
    that.setData({
      username: username,
      imgsrc,
      coupon_id,
      fromuid: options.fromuid,
      thisTime: new Date().getTime()
    })
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.status == 1) {
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
        this.setData({
          userinfo: res.data,
          user_id: res.data.user_id
        })
      }
    })
  },
  //立即使用
  tousecoupon(e) {
    var that = this
    var item = that.data.commodity
    if (that.data.treasurelog_type != 2) {
      return
    }
    if (item.face_type == 1) {
      // wx.switchTab({
      //    url: '/pages/index/index',
      // })
      wx.reLaunch({
        url: '/pages/lotgoodslist/lotgoodslist',
      })
    } else {
      // var coupon = JSON.stringify(item)
      // console.log(coupon)
      wx.setStorageSync('goodscoupon', item)
      wx.reLaunch({
        url: '/pages/goodsinfo/goodsinfo?id=' + item.quan_goods_id
        // + '&coupon=' + coupon,
      })
    }
  },
  //券的
  quanDetail() {
    var that = this
    var data = {
      // treasurelog_id: 
      coupon_id: that.data.coupon_id
      // coupon_id: 4278
    }
    // treasurelog_type   0正常  1已发送  2 已领取的
    //coupon_status:1已使用0已领取未使用2已过期3待领取4不可使用(丢回奖池)
    app.apiPost(app.apiList.coupon_one, data, data => {
      console.log(data)
      console.log('status:' + data.data.coupon_status)
      if (data.status == 1) {
        //coupon_status == 3是可以转增的 
        var send_time = data.data.send_time
        if (data.data.coupon_status == 3) {
          if (send_time * 1000 + 2 * 60 * 60 * 1000 - that.data.thisTime <= 1) {
            var treasurelog_type = 3
          } else {
            that.countdown(send_time * 1000)
            var treasurelog_type = 1
          }
          that.setData({
            commodity: data.data,
            treasurelog_type
          })
        } else if (data.data.coupon_status == 0) {
          var create_time = data.data.get_time
          console.log(send_time, create_time)
          var leftTime = send_time * 1000 + 2 * 60 * 60 * 1000 - create_time * 1000;
          var Hour = Math.floor(leftTime / 3600 / 1000); //小时
          var Minute = Math.floor((leftTime - Hour * 3600 * 1000) / 60 / 1000); //分钟
          var Second = Math.floor((leftTime - Hour * 3600 * 1000 - Minute * 60 * 1000) / 1000); //秒数
          that.setData({
            h: Hour < 10 ? '0' + Hour : Hour,
            m: Minute < 10 ? '0' + Minute : Minute,
            s: Second < 10 ? '0' + Second : Second,
            commodity: data.data,
            treasurelog_type: 2
          })
          // var send_time = data.data.send_time
          // var create_time = data.data.create_time
          // const {
          //   h,
          //   m,
          //   s
          // } = this.calculateClaimTime(send_time * 1000, create_time * 1000);
          // that.setData({
          //   commodity: data.data,
          //   treasurelog_type: 2,
          //   h,
          //   m,
          //   s,
          // })
        } else {
          wx.showToast({
            title: '礼券状态异常',
          })
        }
      }
    })
  },
  // countdown(time) {
  //   console.log('countdown')
  //   var that = this;
  //   var validDuration = 2 * 60 * 60; // 2小时有效时间（秒）
  //   var currentTime = Math.floor(Date.now() / 1000);

  //   // 计算剩余有效时间
  //   console.log(currentTime,time)
  //   var remainingTime = validDuration - (currentTime - time);

  //   // 超出有效时间直接返回
  //   if (remainingTime <= 0) {
  //     that.setData({
  //       h: '00',
  //       m: '00',
  //       s: '00'
  //     });
  //     return;
  //   }

  //   timer = setInterval(function () {
  //     remainingTime--;

  //     if (remainingTime <= 0) {
  //       clearInterval(timer);
  //       that.setData({
  //         h: '00',
  //         m: '00',
  //         s: '00'
  //       });
  //       return;
  //     }

  //     var Hour = Math.floor(remainingTime / 3600);
  //     var Minute = Math.floor((remainingTime % 3600) / 60);
  //     var Second = remainingTime % 60;

  //     that.setData({
  //       h: Hour < 10 ? '0' + Hour : Hour,
  //       m: Minute < 10 ? '0' + Minute : Minute,
  //       s: Second < 10 ? '0' + Second : Second,
  //     });
  //   }, 1000)
  // },
  calculateClaimTime(sendTime, createTime) {
    const totalDuration = 2 * 60 * 60; // 总倒计时时长2小时（7200秒）
    const claimedOffset = createTime - sendTime; // 领取时间偏移量

    // 计算时分秒
    const hours = Math.floor(claimedOffset / 3600);
    const minutes = Math.floor((claimedOffset % 3600) / 60);
    const seconds = claimedOffset % 60;

    return {
      h: hours.toString().padStart(2, '0'),
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0')
    };
  },
  accept3() {
    wx.reLaunch({
      url: '/pages/mycard/mycard'
    })
  },
  countdown(time) {
    var that = this;
    var thisTime = that.data.thisTime;
    var leftTime = time + 2 * 60 * 60 * 1000 - thisTime;
    //倒计时结束
    if (leftTime <= 1) {
      that.setData({
        h: '00',
        m: '00',
        s: '00',
        treasurelog_type: 3
      })
      clearTimeout(timer);
      return;
    }
    // var Day = Math.floor(leftTime / (60 * 60 * 24)); //天数
    var Hour = Math.floor(leftTime / 3600 / 1000); //小时
    var Minute = Math.floor((leftTime - Hour * 3600 * 1000) / 60 / 1000); //分钟
    var Second = Math.floor((leftTime - Hour * 3600 * 1000 - Minute * 60 * 1000) / 1000); //秒数
    that.setData({
      h: Hour < 10 ? '0' + Hour : Hour,
      m: Minute < 10 ? '0' + Minute : Minute,
      s: Second < 10 ? '0' + Second : Second,
    })
    timer = setTimeout(() => {
      time -= 1000
      that.countdown(time)
    }, 1000)
    return
    timer = setInterval(function () {
      var thisTime = new Date().getTime();
      // var leftSecond = parseInt(thisTime / 1000);
      var leftTime = time + 2 * 60 * 60 * 1000 - thisTime;
      //倒计时结束
      if (leftTime <= 1) {
        clearInterval(timer);
        that.setData({
          h: '00',
          m: '00',
          s: '00',
          timer: null
        })
        return;
      }
      var Day = Math.floor(leftTime / (60 * 60 * 24)); //天数
      var Hour = Math.floor((leftTime - Day * 24 * 60 * 60) / 3600); //小时
      var Minute = Math.floor((leftTime - Day * 24 * 60 * 60 - Hour * 3600) / 60); //分钟
      var Second = Math.floor(leftTime - Day * 24 * 60 * 60 - Hour * 3600 - Minute * 60); //秒数
      that.setData({
        h: Hour < 10 ? '0' + Hour : Hour,
        m: Minute < 10 ? '0' + Minute : Minute,
        s: Second < 10 ? '0' + Second : Second,
      })
    }, 1000)
  },

  // 开心收下部分
  accept() {
    var that = this
    var userinfo = that.data.userinfo
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
    } else {
      wx.showModal({
        title: '提示',
        content: '您将收下好友赠送的优惠券?',
        success(res) {
          console.log(res)
          // 如果res.confirm==true 证明点击确定否则点击取消
          if (res.confirm == true) {
            var coupon_id = that.data.coupon_id
            that.setData({
              treasurelog_type: 2
            })
            clearTimeout(timer);
            var data = {
              coupon_id: coupon_id
            }
            app.apiPost(app.apiList.receive_coupon, data, (data1) => {
              if (data1.status == 1) {
                wx.showToast({
                  title: data1.msg,
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '来晚一步,被别人领了~',
                  icon: 'none'
                })
              }
            })
          } else {

          }
        }
      })
    }
  },
  accept1() {
    wx.showToast({
      title: '奖券已被领取',
      icon: 'none'
    })
  },
  accept2() {
    wx.showToast({
      title: '奖券已过期',
      icon: 'none'
    })
  },
  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
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
    var that = this
    if (wx.getStorageSync('token_new')) {
      that.userCenter()
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    that.quanDetail()
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
