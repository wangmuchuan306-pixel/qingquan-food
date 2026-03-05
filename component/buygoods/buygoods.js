// component/buygoods/buygoods.js
const app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    id: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    chooseStyle: 2
  },

  lifetimes: {
    attached() {
      this.getusersendtime()
      this.userCenter()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    userCenter() {
      app.apiPost(app.apiList.userCenter, {}, (res) => {
        this.setData({
          userinfo: res.data
        })
        if (res.data.phone) {
          this.setData({
            userphone: res.data.phone
          })
        }
      })
    },
    goodsDetail(goods_id) {
      var that = this
      console.log(that.properties.id)
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
          num: 1,
          coupons: [],
          goods_id
        })
        app.apiPost(app.apiList.chanumcou, {
          num: 1,
          goods_id: that.data.goods_id
        }, (data) => {
          that.setData({
            have_quan: data.data.have_quan
          })
        })
        that.getAddressList()
      })
    },
    getusersendtime() {
      app.apiPost(app.apiList.getusersendtime, {}, (res) => {
        this.setData({
          usersendtime: Number(res.data)
        })
        this.findsendtime()
      })
    },
    findsendtime() {
      var that = this
      var usersendtime = that.data.usersendtime
      var date = new Date()
      var stime = date.getTime() + usersendtime * 60 * 60 * 1000
      const today = new Date(date.setHours(0, 0, 0, 0)).getTime(); //获取当天零点的时间
      app.apiPost(app.apiList.findsendtime, {}, (res) => {
        var timelist = []
        res.data.forEach(v => {
          if (v.day == '今天') {
            var day = today
          } else if (v.day == '明天') {
            var day = today + 24 * 60 * 60 * 1000
          } else if (v.day == '后天') {
            var day = today + 24 * 60 * 60 * 1000 * 2
          } else {
            var d = Number(v.day.slice(0, -2))
            var day = today + 24 * 60 * 60 * 1000 * d
          }
          var starlist = v.sendstar.split(':')
          var statime = new Date(new Date(day).setHours(starlist[0], starlist[1], starlist[2])).getTime()
          if (stime < statime) {
            timelist.push(v.day + '：' + v.sendstar + '~' + v.sendend)
          }
        })
        this.setData({
          timelist
        })
      })
    },
    //关闭立即订购商品列表
    commodityclo() {
      var that = this
      that.setData({
        commodityshow: false
      })
    },
    //接收返回值商品数量num
    onChange(event) {
      var that = this
      // console.log(event.detail);
      that.setData({
        num: event.detail
      })
      var data1 = {
        num: that.data.num,
        goods_id: that.data.goods_id
      }
      var coupons = that.data.coupons ? that.data.coupons : []
      if (event.detail < coupons.length) {
        wx.showToast({
          title: '优惠券数量大于您所购买的商品数量',
          icon: 'none',
          success() {
            coupons.pop()
            that.setData({
              coupons
            })
            that.zongprice()
          }
        })
      } else {
        that.zongprice()
      }
      app.apiPost(app.apiList.chanumcou, data1, (data) => {
        that.setData({
          have_quan: data.data.have_quan
        })
      })
    },
    //跳转到选择卡券
    choosecard(e) {
      let that = this;
      let have_quan = that.data.have_quan;
      var quan_id = 0;
      let goods_id = that.data.Detail.goods_id;
      let coupons = that.data.coupons ? that.data.coupons : [];
      if (coupons.length > 0) {
        var quan_id = ''
        coupons.forEach(v => {
          if (quan_id) {
            quan_id = quan_id + ',' + v.quan_id
          } else {
            quan_id = v.quan_id
          }
        })
      }
      wx.navigateTo({
        url: '/pages/choosecard/choosecard?quan_id=' + quan_id + '&price=' + this.data.zongprice + "&goods_id=" + goods_id + '&goodsnum=' + this.data.num,
      })
    },
    //计算总价格
    zongprice() {
      var that = this
      if (that.data.userinfo.level == 1) {
        var price = Number(that.data.Detail.memberprice)
      } else {
        var price = Number(that.data.Detail.normalprice)
      }
      var zongprice = (price * that.data.num).toFixed(2)
      if (that.data.reducemoney) {
        zongprice = zongprice - that.data.reducemoney
      }
      var coupons = that.data.coupons ? that.data.coupons : []
      if (coupons.length > 0) {
        var coupon_money = 0
        coupons.forEach(v => {
          if (v.is_discount == 1) {
            var c_money = (price - price * v.zhekou / 10).toFixed(2);
          } else { //满减
            var c_money = v.used_amount
          }
          c_money = Number(c_money);
          coupon_money += c_money
          zongprice -= c_money;
        })
        that.setData({
          coupon_money: Number(coupon_money).toFixed(2)
        })
      }
      //判断是否显示运费
      if (that.data.chooseStyle == 1 || Number(that.data.num) >= Number(that.data.Detail.manjianzitifuwufei)) {
        var express = 0
      } else {
        var express = Number(that.data.express)
      }
      that.setData({
        express: express.toFixed(2)
      })
      zongprice = Number(zongprice) + express
      zongprice = Number(zongprice).toFixed(2)
      that.setData({
        zongprice
      })
    },
    //查询收货地址列表
    getAddressList() {
      var that = this;
      //自提情况
      app.apiPost(app.apiList.findAddress, {}, (data) => {
        if (data.status == 1) {
          if (data.data.length == 0) {
            that.setData({
              address_id: '',
              shouAddress: ''
            })
            return;
          }
          var Address = data.data
          that.setData({
            Address: data.data,
          })
          if (Address.find(item => item.default == 1)) {
            var shouAddress = Address.find(item => item.default == 1)
            that.setData({
              shouAddress,
              latitude: shouAddress.latitude,
              longitude: shouAddress.longitude,
              address_id: shouAddress.id
            })
            that.setexpress()
          }
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'loading'
          })
        }
      })
    },
    //计算运费
    setexpress() {
      var that = this
      if (that.data.shouAddress) {
        var shouAddress = that.data.shouAddress
        var distance = that.setdistance(shouAddress.latitude, shouAddress.longitude) //单位：米
        distance = Number(distance / 1000)
        var freight_info = that.data.freight_info
        if (distance <= freight_info.distance) {
          var express = freight_info.com_price
        } else if (distance > freight_info.distance && distance <= freight_info.distance2) {
          var express = freight_info.com_price2
        } else {
          var express = Number(distance * freight_info.ex_price).toFixed(2)
        }
        that.setData({
          express
        })
        that.zongprice()
      }
    },
    //计算距离
    setdistance(latitude, longitude) {
      var lat1 = latitude * Math.PI / 180;
      var lon1 = longitude * Math.PI / 180;
      var lat2 = this.data.storeLatitude * Math.PI / 180;
      var lon2 = this.data.storeLongitude * Math.PI / 180;
      //差值
      var vLon = Math.abs(lon1 - lon2);
      var vLat = Math.abs(lat1 - lat2);
      //h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
      var v = Math.sin(vLat / 2);
      var v1 = Math.sin(vLon / 2);
      var h = v * v + Math.cos(lat1) * Math.cos(lat2) * v1 * v1;
      // 地球半径 平均值，米
      var distance = 2 * 6371000 * Math.asin(Math.sqrt(h));
      return distance;
    },
    //用户选择配送方式
    chooseStyle(e) {
      //console.log('切换')
      var that = this;
      var id = e.currentTarget.dataset.id;
      var xdistance = id == 1 ? 348 : 0
      that.setData({
        chooseStyle: id,
        xdistance
      });
      if (id == 1) {
        that.zongprice()
      } else {
        that.setexpress()
      }
    },
    //提交订单列表
    back() {
      var that = this
      if (!that.data.song_time && that.data.chooseStyle == 2) {
        wx.showToast({
          title: '请选择送货时间',
          icon: 'none'
        })
        return
      }
      if (!that.data.ztdian && that.data.chooseStyle == 1) {
        wx.showToast({
          title: '请选择自提点',
          icon: 'none'
        })
        return
      }
      if (!that.data.userphone && that.data.chooseStyle == 1) {
        wx.showToast({
          title: '请填写提货人手机号码',
          icon: 'none'
        })
        return
      }
      var userinfo = that.data.userinfo
      if (that.data.chooseStyle == 1 && (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone)) {
        wx.showToast({
          title: '请先完善您的资料',
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
      wx.showLoading({
        title: '订单提交中',
        mask: true
      })
      that.Order()
      that.setData({
        commodityshow: false
      })
    },
    //提交订单
    Order() {
      var that = this
      var goods_num = that.data.num //商品数量
      var goods_name = that.data.Detail.goods_name //商品名称
      var goods_price = that.data.userinfo.level == 1 ? that.data.Detail.memberprice : that.data.Detail.normalprice //商品价格
      var goods_id = that.data.Detail.goods_id //商品id
      var Address = that.data.Address ?? 0
      if (that.data.address_id) {
        // 获取点击地址
        for (let i = 0; i < Address.length; i++) {
          if (that.data.address_id == Address[i].id) {
            var useAddress = Address[i]
          }
        }
      } else {
        // 获取默认地址
        if (Address) {
          for (let i = 0; i < Address.length; i++) {
            if (Address[i].default == 1) {
              var useAddress = Address[i]
            }
          }
        } else {
          if (that.data.chooseStyle == 2) {
            that.take()
            return
          }
        }
      }
      if (!useAddress && that.data.chooseStyle == 2) {
        that.take()
        // wx.showToast({
        //   title: '请选择地址',
        //   icon: 'none'
        // })
        return
      }
      // 判断是否默认值
      if (that.data.chooseStyle == 2) {
        var userphone = useAddress.phone //收货人联系方式
        var useraddress = useAddress.street + useAddress.address + useAddress.detail_address //收货人地址
        var username = useAddress.username //收货人姓名
      } else {
        var userphone = that.data.userphone
        var username = that.data.userinfo.nickname
        var useraddress = '自提'
      }
      var pay_real_money = that.data.zongprice //实际付款金额
      var summoney = goods_price * goods_num //总额
      var data = {
        goods_num,
        goods_name,
        goods_price,
        goods_id,
        userphone,
        useraddress,
        username,
        summoney,
        pay_real_money,
        store_id: 1,
        store_name: '清泉食品',
        deliver_type: 2,
        ztdian_type: that.data.chooseStyle,
        deliver_money: that.data.express,
        orderremark: '',
        second_day: 1,
        balancepay: that.data.money, //余额支付金额
      }
      if (that.data.chooseStyle == 1) {
        data['ztdian'] = that.data.ztdian.id
      }
      if (that.data.chooseStyle == 2) {
        data['song_time'] = that.data.song_time
      }
      var coupons = that.data.coupons ? that.data.coupons : []
      console.log(coupons)
      if (coupons.length > 0) {
        coupons.forEach(v => {
          var quan_id = ''
          coupons.forEach(v => {
            if (quan_id) {
              quan_id = quan_id + ',' + v.quan_id
            } else {
              quan_id = v.quan_id
            }
          })
          data['quan_id'] = quan_id
          data['quan_money'] = that.data.coupon_money
        })
      }
      // if (that.data.coupon) {
      //   data['quan_id'] = that.data.coupon.quan_id
      //   data['quan_money'] = that.data.coupon.coupon_money
      // }
      app.apiPost(app.apiList.fyaddOrder, data, (data) => {
        if (data.status = 1) {
          that.setData({
            btnstatus: false,
            // msg: ''
          })
          var pay_real_money = data.orderinfo.pay_real_money
          var orderno = data.orderinfo.orderno
          if ((that.data.useye && that.data.zongprice == 0) || data.iszero == 1) {
            console.error('余额支付/0元券')
            wx.showLoading({
              title: '订单支付成功',
              mask: 'true'
            })
            setTimeout(function () {
              wx.hideLoading()
              //跳转到购买成功页面
              wx.redirectTo({
                url: '/pages/buysuccess/buysuccess?orderno=' + orderno,
              })
            }, 1500)
            return;
          }
          wx.requestPayment({
            timeStamp: data.payinfo.timeStamp,
            nonceStr: data.payinfo.nonceStr,
            package: data.payinfo.package,
            signType: 'MD5',
            paySign: data.payinfo.paySign,
            success(q) {
              wx.showToast({
                title: '订单支付成功',
                mask: 'true',
                success() {
                  setTimeout(function () {
                    wx.hideLoading()
                    //跳转到购买成功页面
                    wx.redirectTo({
                      url: '/pages/buysuccess/buysuccess?orderno=' + orderno,
                    })
                  }, 1500)
                }
              })
            },
            fail(res) {
              that.setData({
                btnstatus: false
              })
              wx.showToast({
                title: '支付失败...',
                icon: 'loading'
              })
              console.log('失败')
            }
          })
        } else {
          wx.showToast({
            title: '下单失败',
          })
        }
      })
    },
    //选择自提点
    choztdian() {
      wx.navigateTo({
        url: '/pages/chooseztdian/chooseztdian',
      })
    },
    inuphone(e) {
      this.setData({
        userphone: e.detail.value
      })
    },
    //跳转至地址列表页
    take() {
      console.log('take')
      wx.navigateTo({
        url: '/pages/editAddress/editAddress?type=order',
      })
    },
    pickerchange(e) {
      this.setData({
        song_time: this.data.timelist[e.detail.value]
      })
      // var picklist = that.data.picklist
      // var ilist = e.detail.value
      // var stime = picklist[0][ilist[0]] + '-' + picklist[1][ilist[1]] + '-' + picklist[2][ilist[2]] + ' ' + picklist[3][ilist[3]]
      // console.log(stime)
      // console.log(new Date(stime + ':00').getTime(), new Date().getTime())
      // if (new Date(stime + ':00').getTime() < new Date().getTime()) {
      //   wx.showToast({
      //     title: '您选择的配送时间小于当前事前',
      //     icon: 'none'
      //   })
      // } else {
      //   that.setData({
      //     song_time: stime
      //   })
      // }
    },
  }
})