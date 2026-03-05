// pages/goodsinfo/goodsinfo.js
const app = getApp()
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    opentype: '',
    chooseStyle: 2,
    express: 0,
    current: 0,
    balanType: 0,
    reduce_balance: 0,
    checked: false,
    balancepayShow: false,
    timeShow: false,
    noticeText: '',
    indexday: 0,
    zindexday: 0,
    indextime: -1,
    zindextime: -1,
    notexNum: 0,
  },
  notesValue(e) {
    var notesValue = e.detail.value
    this.setData({
      notesValue,
      notexNum: notesValue.length
    })
  },
  changTime() {
    this.setData({
      timeShow: true,
      noticeText: this.data.send_tip
    })
  },
  selectDay(e) {
    var index = e.currentTarget.dataset.index
    if (index == this.data.zindexday) {
      this.setData({
        indexday: index,
        indextime: this.data.zindextime,
      })
    } else {
      this.setData({
        indexday: index,
        indextime: -1,
      })
    }
  },
  selectTime(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      indextime: index,
      zindexday: this.data.indexday,
      zindextime: index,
    })
    setTimeout(() => {
      this.setData({
        timeShow: false,
      })
    }, 300);
  },
  closePopup() {
    this.setData({
      timeShow: false,
    })
  },
  swiperchenge(e) {
    this.setData({
      current: e.detail.current
    })
  },
  nottap(e) {
    wx.showToast({
      title: '本商品不支持' + (e.currentTarget.dataset.type == 1 ? '自提' : '配送'),
      icon: 'none'
    })
  },
  checkedChan(e) {
    // if (this.data.goodsInfo.goods_account_type == 1) {
    //   wx.showToast({
    //     title: '余额卡不可用余额购买',
    //     icon: 'none'
    //   })
    //   return
    // }
    this.setData({
      checked: e.detail
    })
    this.zongprice()
  },
  closePopup2() {
    this.setData({
      balancepayShow: false,
      commodityshow: true,
    })
  },
  balanShow() {
    // var all_money = this.data.all_money
    // var usedBalance = Math.min(this.data.integral, all_money);
    this.setData({
      checked: true,
      balancepayShow: true,
      // commodityshow: false,
      // balanMoney2: usedBalance,
    })
  },
  // 输入使用的余额
  balanValue(e) {
    const balanMoney2 = e.detail.value; // 获取输入的金额
    const regex = /^(0|[1-9]\d*)$/; // 定义正则表达式，匹配有效的金额格式

    // 检查输入的金额是否大于余额
    if (parseFloat(balanMoney2) > parseFloat(this.data.integral)) {
      wx.showToast({
        title: '输入的金额不能大于余额',
        icon: 'none'
      });
      return;
    }

    // 检查输入的金额格式是否有效
    if (regex.test(balanMoney2)) {
      this.setData({
        balanMoney2, // 更新状态
      });
    } else {
      // 提示用户输入格式错误
      wx.showToast({
        title: '请输入有效的积分',
        icon: 'none'
      });
      console.log('输入格式错误'); // 便于调试，有需要时可以打开
    }
  },
  balanValue2() {
    var all_zongprice = this.data.all_zongprice
    var integral = this.data.integral / 100
    var usedBalance = Math.min(integral, all_zongprice);
    usedBalance = Math.floor(usedBalance * 100)
    this.setData({
      balanMoney2: usedBalance,
    })
  },
  // 确认使用余额
  validated() {
    var balanMoney2 = this.data.balanMoney2
    const regex = /^(0|[1-9]\d*)$/;
    console.log(regex.test(balanMoney2));
    if (regex.test(balanMoney2)) {
      this.setData({
        balanMoney: balanMoney2,
        balanType: 1,
      })
      this.closePopup2()
      this.zongprice()
    } else {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      })
    }
  },
  // 获取积分
  walletsList() {
    var that = this;
    app.apiPost(app.apiList.integral_list, {
      page: that.data.page
    }, (res) => {
      that.setData({
        integral: res.data.integral
      })
    })
  },
  //左上角返回
  backpage() {
    let pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
    // let currentPage = pages[pages.length -1]
    // console.log(currentPage)
  },
  // 监听页面滚动
  onPageScroll(e) {
    if (e.scrollTop > 300) {
      this.setData({
        headShow: true,
      })
    } else {
      this.setData({
        headShow: false,
      })
    }
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
  callphone() {
    wx.makePhoneCall({
      phoneNumber: '18833330416',
    })
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
  Closeye() {
    this.setData({
      showye: false
    })
  },
  //跳转到选择卡券
  choosecard(e) {
    let that = this;
    let have_quan = that.data.have_quan;
    var quan_id = 0;
    let goods_id = that.data.goods_id;
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
  likegoods() {
    var that = this
    var Detail = that.data.Detail
    let goodId = that.data.goods_id;
    app.apiPost(app.apiList.collection, {
      goods_id: goodId
    }, (res) => {
      if (res.status == 1) {
        Detail.iscollect = res.data.need_light;
        if (res.data.need_light == 1) {
          wx.showToast({
            title: '成功加入喜欢',
          })
        } else {
          wx.showToast({
            title: '成功取消喜欢',
            icon: 'none'
          })
        }
        that.setData({
          Detail
        })
      }
    })
  },
  shareTrends(e) {
    var that = this
    var goods_id = that.data.Detail.goods_id
    var goods_name = that.data.Detail.goods_name
    wx.navigateTo({
      url: '/pages/trends/trends?goods_id=' + goods_id + '&goods_name=' + goods_name,
    })
  },
  //接收商品ID值
  Detail() {
    var that = this
    var goods_id = that.data.goods_id
    app.apiPost(app.apiList.goodsDetail, {
      goods_id
    }, (res) => {
      if (res.data.zttype == 1) {
        that.setData({
          chooseStyle: 1,
          xdistance: 348
        })
      }
      var swiperlength = res.data.gallery.length
      if (res.data.goods_img) {
        swiperlength++
      }
      if (res.data.goodsvideo) {
        swiperlength++
      }
      res.data.content = utils.richText(res.data.content)
      that.setData({
        Detail: res.data,
        swiperlength,
        zttype: res.data.zttype,
        storeLatitude: res.data.store_info.latitude,
        storeLongitude: res.data.store_info.longitude,
        freight_info: res.data.goodsinfo.freight_info
      })
    })
  },
  //接收上一级信息
  addresslist() {
    var that = this
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var prevPage = pages[pages.length - 2]
    prevPage.setData({
      addressList
    })
  },
  yesztdian() {
    this.setData({
      zitiquerenshow: false,
      ztdian: this.data.ztdian2,
      zitiqueren: true
    })
    this.back()
  },
  guanbi() {
    this.setData({
      zitiquerenshow: false,
    })
  },
  //选择自提点
  choztdian123() {
    this.setData({
      zitiquerenshow: false,
    })
    wx.navigateTo({
      url: '/pages/chooseztdian/chooseztdian',
    })
  },
  //提交订单列表
  back() {
    var that = this
    if (that.data.Detail.goods_vip_type == 0 || that.data.Detail.goods_vip == 2) {
      if (!that.data.shouAddress && that.data.chooseStyle == 2) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return
      }
      // if (!that.data.song_time && that.data.chooseStyle == 2) {
      //   wx.showToast({
      //     title: '请选择送货时间',
      //     icon: 'none'
      //   })
      //   return
      // }
      if (that.data.zindextime == -1 && that.data.chooseStyle == 2) {
        wx.showToast({
          title: '请选择送货时间',
          icon: 'none'
        })
        return
      } else if (that.data.zindextime != -1 && that.data.chooseStyle == 2) {
        var timelist = that.data.timelist
        var zindexday = that.data.zindexday
        var zindextime = that.data.zindextime
        var song_time = timelist[zindexday].day + '- ' + timelist[zindexday].items[zindextime].sendstar + '~' + timelist[zindexday].items[zindextime].sendend
        that.setData({
          song_time,
        })
      }
      //  if (!that.data.ztdian && that.data.chooseStyle == 1) {
      //     wx.showToast({
      //        title: '请选择自提点',
      //        icon: 'none'
      //     })
      //     return
      //  }
      if (!that.data.zitiqueren && that.data.chooseStyle == 1) {
        if (!that.data.ztdian) {
          that.ssjs()
        } else {
          that.setData({
            ztdian2: that.data.ztdian
          })
        }
        that.setData({
          zitiquerenshow: true,
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
    }
    //  else {
    //    // var data = {
    //    //    payname: "member",
    //    //    // pay_type: that.data.open[that.data.vipindex].type,
    //    //    pay_type: that.data.Detail.goods_vip_type,
    //    //    type: 1,
    //    //    userd_quanmoney: 0
    //    // }
    //    // if (that.data.coupons && that.data.coupons.length > 0) {
    //    //    data['quan_id'] = that.data.coupons[0].quan_id
    //    //    data.userd_quanmoney = that.data.coupons[0].used_amount
    //    // }
    //    // app.apiPost(app.apiList.addPayfy, data, (res) => {
    //    //    wx.requestPayment({
    //    //       nonceStr: res.payinfo.nonceStr,
    //    //       package: res.payinfo.package,
    //    //       paySign: res.payinfo.paySign,
    //    //       timeStamp: res.payinfo.timeStamp,
    //    //       signType: res.payinfo.signType,
    //    //       success() {
    //    //          that.userCenter()
    //    //          that.setData({
    //    //             buysuccess: true
    //    //          })
    //    //       }
    //    //    })
    //    // })
    // }
    var coupons = that.data.coupons || []
    var have_quan = that.data.have_quan || 0
    console.log(have_quan);
    var content = have_quan > 1 ? '您有“多张可用优惠券”未使用' : '您有“可用优惠券”未使用'
    if (that.data.have_quan > 0 && coupons.length == 0) {
      wx.showModal({
        title: '提示',
        content: content,
        cancelText: '继续支付',
        confirmText: '前往使用',
        complete: (res) => {
          if (res.cancel) {
            if (that.data.integral != 0 && that.data.reduce_balance == 0) {
              wx.showModal({
                title: '提示',
                content: '您有“可抵现金的积分”未使用',
                cancelText: '继续支付',
                confirmText: '前往使用',
                complete: (res) => {
                  if (res.cancel) {
                    wx.showLoading({
                      title: '订单提交中',
                      mask: true
                    })
                    that.Order()
                    that.setData({
                      commodityshow: false
                    })
                  }
                  if (res.confirm) {
                    that.balanShow()
                  }
                }
              })
            } else {
              wx.showLoading({
                title: '订单提交中',
                mask: true
              })
              that.Order()
              that.setData({
                commodityshow: false
              })
            }
          }
          if (res.confirm) {
            that.choosecard()
          }
        }
      })
    } else {
      if (that.data.integral != 0 && that.data.reduce_balance == 0) {
        wx.showModal({
          title: '提示',
          content: '您有“可抵现金的积分”未使用',
          cancelText: '继续支付',
          confirmText: '前往使用',
          complete: (res) => {
            if (res.cancel) {
              wx.showLoading({
                title: '订单提交中',
                mask: true
              })
              that.Order()
              that.setData({
                commodityshow: false
              })
            }
            if (res.confirm) {
              that.balanShow()
            }
          }
        })
      } else {
        wx.showLoading({
          title: '订单提交中',
          mask: true
        })
        that.Order()
        that.setData({
          commodityshow: false
        })
      }
    }
  },
  //提交订单
  Order() {
    var that = this
    if (that.data.Detail.goods_vip_type == 0 || that.data.Detail.goods_vip == 2) {
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
      // if (!useAddress && that.data.chooseStyle == 2) {
      //   that.take()
      //   // wx.showToast({
      //   //   title: '请选择地址',
      //   //   icon: 'none'
      //   // })
      //   return
      // }
      var shouAddress = that.data.shouAddress
      // 判断是否默认值
      if (that.data.chooseStyle == 2) {
        var userphone = shouAddress.phone //收货人联系方式
        var useraddress = shouAddress.street + shouAddress.address + shouAddress.detail_address //收货人地址
        var username = shouAddress.username //收货人姓名
      } else {
        var userphone = that.data.userphone
        var username = that.data.userinfo.nickname
        var useraddress = '自提：' + that.data.ztdian.zt_addressxinagxi
      }
      var pay_real_money = that.data.zongprice //实际付款金额
      var isallPoints = pay_real_money == 0
      var pointspay = that.data.reduce_balance
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
        isallPoints,
        pointspay,
        store_id: 1,
        store_name: '清泉食品',
        deliver_type: 2,
        ztdian_type: that.data.chooseStyle,
        deliver_money: that.data.express,
        orderremark: that.data.notesValue ? that.data.notesValue : '',
        second_day: 1,
        balancepay: that.data.money, //余额支付金额
      }
      if (that.data.chooseStyle == 1) {
        data['ztdian'] = that.data.ztdian.id
      }
      if (that.data.chooseStyle == 2) {
        data['song_time'] = that.data.song_time
      }
      // if (that.data.coupon) {
      //   data['quan_id'] = that.data.coupon.quan_id
      //   data['quan_money'] = that.data.coupon.coupon_money
      // }
      var coupons = that.data.coupons ? that.data.coupons : []
      if (coupons.length > 0) {
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
      }
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
    } else {
      var data = {
        payname: "member",
        // pay_type: that.data.open[that.data.vipindex].type,
        pay_type: that.data.Detail.goods_vip_type,
        type: 1,
        userd_quanmoney: 0
      }
      // if (that.data.coupons && that.data.coupons.length > 0) {
      //    data['quan_id'] = that.data.coupons[0].quan_id
      //    data.userd_quanmoney = that.data.coupons[0].used_amount
      // }
      var coupons = that.data.coupons ? that.data.coupons : []
      if (coupons.length > 0) {
        var quan_id = ''
        coupons.forEach(v => {
          if (quan_id) {
            quan_id = quan_id + ',' + v.quan_id
          } else {
            quan_id = v.quan_id
          }
        })
        data['quan_id'] = quan_id
        data.userd_quanmoney = that.data.coupon_money
      }
      app.apiPost(app.apiList.addPayfy, data, (res) => {
        wx.requestPayment({
          nonceStr: res.payinfo.nonceStr,
          package: res.payinfo.package,
          paySign: res.payinfo.paySign,
          timeStamp: res.payinfo.timeStamp,
          signType: res.payinfo.signType,
          success(q) {
            wx.showToast({
              title: '订单支付成功',
              mask: 'true',
              success() {
                that.userCenter()
                that.setData({
                  buysuccess: true,
                })
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
      })
    }
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
      var have_quan = data.data.have_quan
      if (that.data.coupons.length < Number(have_quan)) {
        wx.showToast({
          title: '您有更多可用优惠券',
          icon: 'none'
        })
      }
      that.setData({
        have_quan
      })
    })
  },
  //打开立即订购商品列表
  commodityshow() {
    var that = this
    utils.isLogin({
      success() {
        var userinfo = that.data.userinfo
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
        app.apiPost(app.apiList.ongoodsnotingwc, {
          id: that.data.goods_id
        }, (res) => {
          if (res.status == 1 && res.data.length > 0) {
            res.data[0].number = 1
            var cartlist = res.data
            var ordertype = '/pages/lotaddorder2/lotaddorder2?ordertype=2&zttype=' + 2
            wx.setStorageSync('cartlist_pay', cartlist)
            wx.navigateTo({
              url: ordertype,
            })
          }
        })
        // if(that.data.active_id){
        //   wx.navigateTo({
        //     url:'/pages/addorder/addorder?num=1&goods_id=' + that.data.goods_id+'&active_id=' + that.data.active_id
        //   })
        // }else{
        //   wx.navigateTo({
        //     url:'/pages/addorder/addorder?num=1&goods_id=' + that.data.goods_id
        //   })
        // }
        return
        // 获取缓存中自提点信息
        var ztdianStorage = wx.getStorageSync('ztdian');
        if (ztdianStorage) {
          that.setData({
            ztdian: ztdianStorage
          })
        }
        // if (that.data.Detail.goods_vip_type == 0 || that.data.Detail.goods_vip == 2) {
        that.setData({
          commodityshow: true
        })
        var data1 = {
          num: that.data.num,
          goods_id: that.data.goods_id
        }
        app.apiPost(app.apiList.chanumcou, data1, (data) => {
          that.setData({
            have_quan: data.data.have_quan
          })
        })
        that.zongprice()
        // } else {
        //    var data = {
        //       payname: "member",
        //       // pay_type: that.data.open[that.data.vipindex].type,
        //       pay_type: that.data.Detail.goods_vip_type,
        //       type: 1,
        //       userd_quanmoney: 0
        //    }
        //    if (that.data.coupons && that.data.coupons.length > 0) {
        //       data['quan_id'] = that.data.coupons[0].quan_id
        //       data.userd_quanmoney = that.data.coupons[0].used_amount
        //    }
        //    app.apiPost(app.apiList.addPayfy, data, (res) => {
        //       wx.requestPayment({
        //          nonceStr: res.payinfo.nonceStr,
        //          package: res.payinfo.package,
        //          paySign: res.payinfo.paySign,
        //          timeStamp: res.payinfo.timeStamp,
        //          signType: res.payinfo.signType,
        //          success() {
        //             that.userCenter()
        //             that.setData({
        //                buysuccess: true
        //             })
        //          }
        //       })
        //    })
        // }
      }
    })
  },
  successClose() {
    this.setData({
      buysuccess: false
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },
  //关闭立即订购商品列表
  commodityclo() {
    var that = this
    that.setData({
      commodityshow: false
    })
  },
  //跳转至地址列表页
  take() {
    console.log('take')
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?type=order',
    })
  },
  //获取用户输入的提现金额
  getmoney(e) {
    console.log(e.detail.value)
    var that = this;
    var money = e.detail.value,
      smallten = 0,
      disabled = false;
    money.indexOf(0) == 0 ? money = money.substring(1) : '';
    if (money < 0 || money == "") { //防止空值 负数 bug
      wx.showToast({
        icon: "none",
        title: '请输入正确的余额',
      })
    }
    if (Number(money) > that.data.canpayblance) {
      money = that.data.canpayblance
    }
    // 按钮是否禁用以及红色提示显示信息的标记
    that.setData({
      disabled,
      smallten,
      money,
      reducemoney: money / 100
    })
  },
  onblur1(e) {
    var money = parseInt(e.detail.value);
    if (!money) {
      return;
    }
    this.setData({
      money: money
    })
  },
  //用户点击使用全部
  allDrawal() {
    var that = this;
    var maxmoney = that.data.canpayblance; //账户余额
    let priceAll = that.data.zongprice; //z支付的价格
    if (maxmoney >= priceAll) {
      // maxmoney = priceAll
      maxmoney = that.data.zongprice
    } else {
      maxmoney = maxmoney
    }
    that.setData({
      money: parseInt(maxmoney),
      reducemoney: parseInt(maxmoney) / 100,
      disabled: false
    })
  },
  //点击确认使用
  walletDrawal() {
    let that = this;
    if (that.data.money == "") {
      that.setData({
        money: 0,
      })
    }
    if (this.data.money >= 0) {
      this.setData({
        useye: true,
        show: false,
        showye: false,
      })
    } else {
      this.setData({
        show: false,
        showye: false,
        useye: false
      })
    }
    this.zongprice();
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
    var zongmoney = (price * that.data.num).toFixed(2)
    if (that.data.reducemoney) {
      zongprice = zongprice - that.data.reducemoney
    }
    var coupons = that.data.coupons ? that.data.coupons : []
    var coupon_money = 0
    if (coupons.length > 0) {
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
    var all_zongprice = zongprice
    // 是否使用积分
    var balanType = that.data.balanType
    var checked = that.data.checked
    var integral = that.data.integral / 100
    if (checked) {
      if (balanType == 0) {
        var usedBalance = Math.min(integral, zongprice);
      } else if (balanType == 1) {
        var balanMoney = that.data.balanMoney / 100
        var usedBalance = Math.min(integral, zongprice, balanMoney);
      }
    } else {
      var usedBalance = 0.00
    }
    console.log(usedBalance);
    zongprice -= usedBalance
    //判断是否显示运费
    console.log(that.data.chooseStyle, that.data.num, that.data.Detail.manjianzitifuwufei)
    if (that.data.chooseStyle == 1 || Number(that.data.num) >= Number(that.data.Detail.manjianzitifuwufei)) {
      var express = 0
    } else {
      // var express = Number(that.data.express)
      var express = that.setexpress(1) ? that.setexpress(1) : 0
      express = Number(express)
      console.log(express)
    }
    that.setData({
      express: express.toFixed(2)
    })
    zongprice = Number(zongprice) + express
    zongprice = Math.abs(Number(zongprice)).toFixed(2)
    all_zongprice = Number(all_zongprice).toFixed(2)
    var all_balance = Number(usedBalance).toFixed(2)
    var all_money = Number(coupon_money + usedBalance).toFixed(2)
    that.setData({
      zongprice,
      zongmoney,
      all_zongprice,
      all_balance,
      all_money,
      reduce_balance: usedBalance * 100,
      balanMoney2: usedBalance * 100,
    })
  },
  //计算运费
  setexpress(rt) {
    var that = this
    if (that.data.shouAddress) {
      var shouAddress = that.data.shouAddress
      var distance = that.setdistance(Number(shouAddress.latitude), Number(shouAddress.longitude)) //单位：米
      distance = Number(distance / 1000)
      var freight_info = that.data.freight_info
      if (distance <= freight_info.distance) {
        var express = freight_info.com_price
      } else if (distance > freight_info.distance && distance <= freight_info.distance2) {
        var express = freight_info.com_price2
      } else {
        var express = Number(distance * freight_info.ex_price).toFixed(2)
      }
      if (rt == 1) {
        return express
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
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.data.phone) {
        this.setData({
          userphone: res.data.phone
        })
      }
      this.setData({
        userinfo: res.data,
      })
      this.getAddressList()
    })
  },
  //填写余额弹框
  chooseye() {
    var that = this
    var zongprice = that.data.zongprice
    var blance = Number(that.data.userinfo.blance)
    var canpayblance = zongprice > blance ? blance : zongprice
    that.setData({
      showye: true,
      canpayblance
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
        if (that.data.shouAddress && that.data.shouAddress.id) {

        } else {
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
        }
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'loading'
        })
      }
    })
  },
  columnchange(e) {
    console.log(e)
    var that = this
    var indexlist = that.data.indexlist
    indexlist[e.detail.column] = e.detail.value
    var picklist = that.data.picklist
    if (e.detail.column < 2) {
      var thismonth = picklist[1][indexlist[1]]
      var thisyear = picklist[0][indexlist[0]]
      var daylist = []
      if (thismonth == 2) {
        if (thisyear % 4 == 0) {
          var lastday = 29
        } else {
          var lastday = 28
        }
      } else if (thismonth == 1 || thismonth == 3 || thismonth == 5 || thismonth == 7 || thismonth == 8 || thismonth == 10 || thismonth == 12) {
        var lastday = 31
      } else {
        var lastday = 30
      }
      for (let j = 1; j <= lastday; j++) {
        daylist.push(j)
      }
      picklist[2] = daylist
    }
    that.setData({
      picklist,
      indexlist
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
  getpickerlist() {
    var that = this
    var date = new Date()
    var thisyear = date.getFullYear()
    var thismonth = date.getMonth() + 1
    var thisday = date.getDate()
    var thishour = date.getHours()
    var yearlist = [thisyear, thisyear + 1, thisyear + 2]
    var monthlist = []
    var hourlist = []
    for (let i = 1; i <= 12; i++) {
      monthlist.push(i)
      if (thismonth == i) {
        var monthindex = i - 1
      }
    }
    for (let x = 0; x < 24; x++) {
      hourlist.push(x)
      if (thishour == x) {
        var hourindex = x
      }
    }
    var daylist = []
    if (thismonth == 2) {
      if (thisyear % 4 == 0) {
        var lastday = 29
      } else {
        var lastday = 28
      }
    } else if (thismonth == 1 || thismonth == 3 || thismonth == 5 || thismonth == 7 || thismonth == 8 || thismonth == 10 || thismonth == 12) {
      var lastday = 31
    } else {
      var lastday = 30
    }
    for (let j = 1; j <= lastday; j++) {
      daylist.push(j)
      if (thisday == j) {
        var dayindex = j - 1
      }
    }
    var picklist = [yearlist, monthlist, daylist, hourlist]
    that.setData({
      picklist,
      indexlist: [0, monthindex, dayindex, hourindex + 1]
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
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const todayweek = new Date().getDay();
      res.data.forEach(v => {
        if (v.day == '今天') {
          var day = today
          v.day = v.day + '（' + days[todayweek] + '）'
        } else if (v.day == '明天') {
          var day = today + 24 * 60 * 60 * 1000
          if (todayweek % 6 == 0) {
            var tomorrowweek = 0
          } else {
            var tomorrowweek = todayweek + 1
          }
          v.day = v.day + '（' + days[tomorrowweek] + '）'
        } else if (v.day == '后天') {
          var day = today + 24 * 60 * 60 * 1000 * 2
          if (todayweek % 6 == 0) {
            var passtomorrowweek = 1
          } else if (todayweek % 5 == 0) {
            var passtomorrowweek = 0
          } else {
            var passtomorrowweek = todayweek + 2
          }
          v.day = v.day + '（' + days[passtomorrowweek] + '）'
        } else {
          var d = Number(v.day.slice(0, -2))
          var day = today + 24 * 60 * 60 * 1000 * d
          v.day = utils.getFutureDate(d)
        }
        var starlist = v.sendstar.split(':')
        var statime = new Date(new Date(day).setHours(starlist[0], starlist[1], starlist[2])).getTime()
        if (stime < statime) {
          // timelist.push(v.day + '：' + v.sendstar + '~' + v.sendend)
          v.sendstar = v.sendstar.slice(0, -3)
          v.sendend = v.sendend.slice(0, -3)
          timelist.push(v)
        }
      })
      const groupedData = res.data.reduce((acc, item) => {
        const dayKey = item.day; // 获取当前项的 day 值（例如 "后天"）
        if (!acc[dayKey]) { // 如果该 day 不存在则初始化空数组
          acc[dayKey] = [];
        }
        acc[dayKey].push(item); // 将当前项推入对应数组
        return acc;
      }, {});
      timelist = Object.entries(groupedData).map(([day, items]) => ({
        day,
        items
      }));
      this.setData({
        timelist
      })
    })
  },
  getusersendtime() {
    app.apiPost(app.apiList.getusersendtime, {}, (res) => {
      this.setData({
        usersendtime: Number(res.data),
        send_tip: res.twoData
      })
      this.findsendtime()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    that.setData({
      goods_id: options.id
    })
    if (options.active_id) {
      this.setData({
        active_id: options.active_id
      })
    }
    if (options.ruid) {
      wx.setStorageSync('ruid', options.ruid)
    }
    if (wx.getStorageSync('goodscoupon')) {
      var coupon = wx.getStorageSync('goodscoupon')
      coupon.quan_id = coupon.histoty_id
      var coupons = [coupon]
      that.setData({
        coupons
      })
      wx.removeStorageSync('goodscoupon')
    } else {
      if (options.coupon) {
        console.log(options.coupon)
        var coupon = JSON.parse(options.coupon)
        coupon.quan_id = coupon.histoty_id
        var coupons = [coupon]
        that.setData({
          coupons
        })
      }
    }
    var menu = wx.getMenuButtonBoundingClientRect()
    var windowsinfo = wx.getWindowInfo()
    var pixelRatio = windowsinfo.windowWidth / 750
    this.setData({
      top: menu.top,
      height: menu.height,
      pixelRatio
    })
    that.getpickerlist()
    that.getusersendtime()
    that.getztdian()
    that.walletsList()
    that.getactivegoods_activehavemore_pelaseselectmaxendtimeandelsectactivepricepay()
  },
  getactivegoods_activehavemore_pelaseselectmaxendtimeandelsectactivepricepay() {
    const _this = this
    let data = {
      goods_id: _this.data.goods_id,
    }
    app.apiPost(app.apiList.getactivegoods_activehavemore_pelaseselectmaxendtimeandelsectactivepricepay, data, (res) => {
      if (res.status == 1) {
        if (res.data.length > 0) {
          res.data.forEach(v => {
            v.act_status = utils.checkTimeRange(v.min_act_start_time, v.max_act_end_time)
          })
          _this.setData({
            act_status: res.data[0].act_status,
            active_price: res.goods.active_price
          })
        }
      }
    })
  },
  getztdian() {
    app.apiPost(app.apiList.getztdian, {
      page: 1,
      limit: 999
    }, (res) => {
      this.setData({
        ztdianlist: res.data
      })
    })
  },
  ssjs() {
    var that = this
    wx.getLocation({
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.getztdian123()
      }
    })
  },
  //获取自提点信息
  getztdian123() {
    app.apiPost(app.apiList.getztdian, {
      page: 1,
      limit: 1,
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }, (res) => {
      //  this.setData({
      //     ztdian: res.data[0]
      //  })
      //  wx.setStorage({
      //     key: 'ztdian',
      //     data: res.data[0],
      //  });
      res.data[0].distance = (res.data[0].distance / 1000).toFixed(2)
      this.setData({
        ztdian2: res.data[0]
      })
    })
  },
  changeziti(e) {
    var ztdianlist = this.data.ztdianlist
    var index = e.detail.value
    this.setData({
      ztdian: ztdianlist[index]
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
    this.userCenter()
    this.Detail()
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
      title: this.data.Detail.goods_name,
      imageUrl: this.data.Detail.goods_img,
      path: '/pages/goodsinfo/goodsinfo?id=' + this.data.goods_id + '&ruid=' + wx.getStorageSync('uid')
    }
  },
  onShareTimeline() {

  }
})