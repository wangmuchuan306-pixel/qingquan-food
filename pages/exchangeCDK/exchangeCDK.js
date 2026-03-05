// packageA/pages/exchangeCDK/exchangeCDK.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url,

  },
  //联系电话
  phone() {
    wx.makePhoneCall({
      phoneNumber: '18833330416',
    })
  },
  goResult() {
    var that = this
    var cdk = that.data.cdk
    var data1 = {
      cdk: cdk
    }
    app.apiPost(app.apiList.getcdkvip, data1, (data) => {
      if (data.status == 1) {
        // cdk_type 1折扣券2现金券3免费奖品4红包
        var cdk_type = data.data.cdk_type
        // console.log('aaa',data.data.goods.length)

        if (cdk_type != 4) {
          if (data.data.goods.goods_id != 0) {
            var goodsImg = data.data.goods.goods_img
            var cdk_type = data.data.cdk_type
            var qprice = data.data.goods.qprice
            var goods_name = data.data.goods.goods_name
            var reduce = data.data.goods.reduce
            var line_price = data.data.goods.line_price
            var used_amount = data.data.used_amount
            var zhekou_num = data.data.zhekou_num
            console.log('aaa')
            that.setData({
              goodsImg,
              qprice,
              cdk_type,
              line_price,
              used_amount
            })
            wx.navigateTo({
              url: '/pages/cdkReslute/cdkReslute?goodsImg=' + goodsImg + '&qprice=' + qprice + '&cdk_type=' + cdk_type + '&reduce=' + reduce + '&line_price=' + line_price + '&used_amount=' + used_amount + '&goods_name=' + goods_name + '&zhekou_num=' + zhekou_num,
            })
            // wx.requestSubscribeMessage({
            //   tmplIds: ['FYX0BArDAnbM3sEJlvaZaBEHS0AbBeGkmyCaI3ybSVI'],
            //   success() {
            //     wx.showToast({
            //       title: '兑换成功',
            //       success() {
            //         setTimeout(() => {
            //           wx.navigateTo({
            //             url: '/pages/cdkReslute/cdkReslute?goodsImg=' + goodsImg + '&qprice=' + qprice + '&cdk_type=' + cdk_type + '&reduce=' + reduce + '&line_price=' + line_price + '&used_amount=' + used_amount + '&goods_name=' + goods_name + '&zhekou_num=' + zhekou_num,
            //           })
            //         }, 1500);
            //       }
            //     })
            //   }
            // })

          }

        } else {
          var money = data.data.money
          var cdk_type = data.data.cdk_type
          wx.requestSubscribeMessage({
            tmplIds: ['FYX0BArDAnbM3sEJlvaZaBEHS0AbBeGkmyCaI3ybSVI'],
            success() {
              wx.navigateTo({
                url: '/pages/cdkReslute/cdkReslute?money=' + money + '&cdk_type=' + cdk_type,
              })
            }
          })
        }

        return



      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
    })
    return

  },
  gologin() {
    // wx.clearStorageSync(); //清空缓存
    //写入缓存代号A

    console.log('写入寻宝缓存')
    //重新登陆
    app.util.isLogin({
      success() {
        console.log('登录了')
      }
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
    app.set('xburl', 1) //设置这个不会返回到首页
    var token = wx.getStorageSync('token_new')
    if (!token) {
      that.gologin()
    }
  },
  //获取输入值
  getValues(e) {
    var that = this
    var values = (e.detail.value).trim()

    console.log(values.length)
    that.setData({
      cdk: values
    })
    console.log(values)
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
    var token = wx.getStorageSync('token_new')
    if (!token) {

    }
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
    var that = this;
    var uid = '';
    if (wx.getStorageSync('uid')) {
      uid = wx.getStorageSync('uid');
    }
    return {
      title: "网罗全城门店优惠~欢迎使用" + that.data.procedure.wxname + "本地生活平台卡券兑换服务",
      // desc: '分享页面的内容',
      path: '/packageA/pages/exchangeCDK/exchangeCDK?ruid=' + uid,
      imageUrl: app.globalData.url + "/summer/covercdk.jpg",
    }
  }
})