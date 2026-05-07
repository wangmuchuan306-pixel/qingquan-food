// pages/lotaddorder/lotaddorder.js
const app = getApp()
var paymoney = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseStyle: 2,
    ztdianstatus: true,
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
    showQrcodePopup: false,
    ztdianstatus: true,
    express: 0,
    idIndex: 0,
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
  nottap(e) {
    wx.showToast({
      title: '本商品不支持' + (e.currentTarget.dataset.type == 1 ? '自提' : '配送'),
      icon: 'none'
    })
  },
  userCenter() {
    var that = this;
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      that.setData({
        userinfo: res.data
      })
      if (res.data.phone) {
        that.setData({
          userphone: res.data.phone
        })
      }
      if (that.data.chooseStyle == 1) {
        that.zongprice()
      } else {
        that.getAddressList()
      }
    })
  },
  newquan() {
    app.apiPost(app.apiList.newquan, {}, (res) => {
      if (res.data.is_lingqu == 0) {
        this.setData({
          newquan: res.data,
          shownew: true,
        })
      }
    })
  },
  //抢购
  tobuy() {
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
    // if (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先完善信息',
    //     complete: (res) => {
    //       if (res.cancel) {}
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '/pages/setpage/setpage',
    //         })
    //       }
    //     }
    //   })
    //   return
    // }
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
      that.zongprice()
      that.getAddressList()
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
          that.zongprice()
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
        } else {
          that.zongprice()
        }
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'loading'
        })
      }
    })
  },
  closePopup2() {
    this.setData({
      balancepayShow: false,
      commodityshow: true,
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
    usedBalance = (usedBalance * 100).toFixed(0)
    this.setData({
      balanMoney2: usedBalance,
    })
  },
  // 确认使用余额
  validated() {
    var balanMoney2 = this.data.balanMoney2
    const regex = /^[1-9]\d*(\.\d+)?$|^0(\.\d+)?$/;
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
  remoneyShow() {
    // var all_money = this.data.all_money
    // var usedBalance = Math.min(this.data.integral, all_money);
    this.setData({
      checked2: true,
      remoneypayShow: true,
      // commodityshow: false,
      // balanMoney2: usedBalance,
    })
  },
  closePopup3() {
    this.setData({
      remoneypayShow: false,
      commodityshow: true,
    })
  },
  // 输入使用的余额
  remoneyValue(e) {
    const remoney2 = e.detail.value; // 获取输入的金额
    const regex = /^[1-9]\d*(\.\d+)?$|^0(\.\d+)?$/; // 定义正则表达式，匹配有效的金额格式

    // 检查输入的金额是否大于余额
    if (parseFloat(remoney2) > parseFloat(this.data.intremoney)) {
      wx.showToast({
        title: '输入的金额不能大于余额',
        icon: 'none'
      });
      return;
    }

    // 检查输入的金额格式是否有效
    if (regex.test(remoney2)) {
      this.setData({
        remoney2, // 更新状态
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
  remoneyValue2() {
    var zongprice = this.data.zongprice
    var intremoney = this.data.intremoney
    if (this.data.remoney && this.data.remoney > 0) {
      zongprice = Number(zongprice) + Number(this.data.remoney)
    }
    var usedBalance = Math.min(intremoney, zongprice);
    if (usedBalance == zongprice) {
      usedBalance = (Number(usedBalance) - 0.01).toFixed(2)
    }
    this.setData({
      remoney2: usedBalance,
    })
  },
  // 确认使用余额
  validated2() {
    var remoney2 = this.data.remoney2
    const regex = /^[1-9]\d*(\.\d+)?$|^0(\.\d+)?$/;
    var zongprice = Number(this.data.zongprice) - Number(this.data.express)
    if (this.data.remoney && this.data.remoney > 0) {
      zongprice = Number(zongprice) + Number(this.data.remoney)
    }
    if (regex.test(remoney2)) {
      if (Number(remoney2) >= Number(zongprice) - 0.01 && remoney2 != 0) {
        wx.showToast({
          title: '最低实付金额为0.01元',
          icon: 'none'
        })
        console.log(Number(zongprice));
        console.log(remoney2);
        console.log(Number(zongprice) > 0.01);
        if (Number(zongprice) > 0.01) {
          remoney2 = (Number(zongprice) - 0.01).toFixed(2)
        } else {
          remoney2 = 0
        }
      }
      this.setData({
        remoney: remoney2,
        remoneyType: 1,
      })
      this.closePopup3()
      this.zongprice()
    } else {
      wx.showToast({
        title: '请输入正确的金额',
        icon: 'none'
      })
    }
  },
  myMoney() {
    app.apiPost(app.apiList.userAccount, {}, (res) => {
      if (res.status == 1) {
        this.setData({
          intremoney: res.data.all_money
        })
      }
    })
  },
  gotochooseztdian() {
    var id = this.data.chooseStyle == 1 ? this.data.ztdian1.id : this.data.ztdian2.id;
    wx.navigateTo({
      url: '/pages/chooseztdian/chooseztdian?id=' + id + '&type=' + this.data.chooseStyle + '&goods_id=' + this.data.goods_id,
    })
  },
  getmanjianinfo() {
    var that = this
    var ztdian = that.data.ztdian
    app.apiPost(app.apiList.manjianinfo, {
      id: ztdian.id
    }, (res) => {
      if (res.data?.id) {
        that.setData({
          manjianinfo: res.data
        })
      }
    })
  },
  //计算总价格
  zongprice() {
    var that = this
    var level = that.data.userinfo.user_level
    var cartlist = that.data.cartlist
    var remoneybl = that.data.remoney
    var total = 0;
    cartlist.forEach(v => {
      var price = level == 2 ? v.specs_pfmoney : (level == 1 ? v.specs_tgmoney : (level == 3 ? v.specs_vipmoney : v.specs_erpmoney))
      v.zongprice = Number(price) * Number(v.number)
      v.zongmoney = Number(price) * Number(v.number)
      total += Number(price) * Number(v.number)
    })
    var zongprice = (total).toFixed(2)
    var zongmoney = (total).toFixed(2)
    if (that.data.reducemoney) {
      zongprice = zongprice - that.data.reducemoney
    }
    var coupons = that.data.coupons ? that.data.coupons : []
    var coupon_money = 0
    if (coupons.length > 0) {
      var c_money = coupons[0].used_amount
      c_money = Number(c_money);
      coupon_money += c_money
      zongprice -= c_money;
      that.setData({
        coupon_money: Number(coupon_money).toFixed(2)
      })
      if (coupons[0].quan_goods_id == 0) {
        if (Number(coupons[0].used_amount) >= 1) {
          var quanyu = Number(coupon_money)
          cartlist.forEach((v, index) => {
            const onebl = (Number(v.zongprice) / Number(zongprice)).toFixed(2)
            const onemj = (onebl * Number(coupon_money)).toFixed(2)
            quanyu = quanyu - onemj
            v.quanmoney = onemj
            v.quan_id = coupons[0].quan_id
            v.zongprice = v.zongprice - onemj
          })
          var maxzongquan = 0
          var maxindexquan = 0
          cartlist.forEach((v, index) => {
            if (maxzongquan < Number(v.zongprice)) {
              maxzongquan = Number(v.zongprice)
              maxindexquan = index
            }
          })
          cartlist[maxindexquan].zongprice = Number(cartlist[maxindexquan].zongprice) - Number(quanyu)
          cartlist[maxindexquan].quanmoney = Number(cartlist[maxindexquan].quanmoney) + Number(quanyu)
        } else {
          cartlist.forEach((v, index) => {
            if (index == 0) {
              v.quanmoney = coupons[0].used_amount
              v.zongprice = Number(v.zongprice) - Number(coupons[0].used_amount)
              v.quan_id = coupons[0].quan_id
            } else {
              v.quanmoney = 0.00
            }
          })
        }
      } else {
        cartlist.forEach((v, index) => {
          if (v.goods_id == coupons[0].quan_goods_id) {
            v.quanmoney = coupons[0].used_amount
            v.zongprice = Number(v.zongprice) - Number(coupons[0].used_amount)
            v.quan_id = coupons[0].quan_id
          } else {
            v.quanmoney = 0.00
          }
        })
      }
    } else {
      cartlist.forEach((v, index) => {
        v.quanmoney = 0.00
      })
    }
    var mjtype = false
    var manjianmoney = 0
    // 计算满减
    if (that.data.chooseStyle == 2 && that.data.manjianinfo && that.data.manjianinfo.id && that.data.shouAddress && that.data.address_id) {
      var manjianinfo = that.data.manjianinfo
      if (Number(manjianinfo.man) <= Number(zongprice)) {
        var mjyu = Number(manjianinfo.jian)
        cartlist.forEach((v, index) => {
          const onebl = (Number(v.zongprice) / Number(zongprice)).toFixed(2)
          const onemj = (onebl * Number(manjianinfo.jian)).toFixed(2)
          mjyu = mjyu - onemj
          v.zongprice = v.zongprice - onemj
        })
        var maxzong = 0
        var maxindex = 0
        cartlist.forEach((v, index) => {
          if (maxzong < Number(v.zongprice)) {
            maxzong = Number(v.zongprice)
            maxindex = index
          }
        })
        cartlist[maxindex].zongprice = Number(cartlist[maxindex].zongprice) - Number(mjyu)
        zongprice = zongprice - manjianinfo.jian
        manjianmoney = Number(manjianinfo.jian)
        mjtype = true
      }
    }
    var all_zongprice = zongprice
    // 是否使用积分
    var balanType = that.data.balanType
    var checked = that.data.checked
    var integral = Number(that.data.integral / 100).toFixed(2)
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
    if (usedBalance != 0.00) {
      var yeyu2 = Number(usedBalance)
      cartlist.forEach((v, index) => {
        const onebl2 = (Number(v.zongprice) / Number(zongprice)).toFixed(2)
        const onemj2 = (onebl2 * Number(usedBalance)).toFixed(2)
        if (Number(onemj2) > Number(v.zongprice)) {
          yeyu2 = yeyu2 - Number(v.zongprice)
          v.points = Number(v.zongprice)
          v.zongprice = 0
        } else {
          yeyu2 = yeyu2 - onemj2
          v.points = onemj2
          v.zongprice = (v.zongprice - onemj2).toFixed(2)
        }
      })
      var maxzongye2 = 0
      var maxindexye2 = 0
      cartlist.forEach((v, index) => {
        if (maxzongye2 < Number(v.zongprice)) {
          maxzongye2 = Number(v.zongprice)
          maxindexye2 = index
        }
      })
      cartlist[maxindexye2].zongprice = Number(cartlist[maxindexye2].zongprice) - Number(yeyu2)
      cartlist[maxindexye2].points = Number(cartlist[maxindexye2].points) + Number(yeyu2)
    } else {
      cartlist.forEach((v, index) => {
        v.points = 0.00
      })
    }
    cartlist.forEach((v, index) => {
      v.points = (v.points * 100).toFixed(2)
    })
    zongprice -= usedBalance
    console.log(zongprice);
    // 是否使用余额
    var remoneyType = that.data.remoneyType
    var checked2 = that.data.checked2
    var intremoney = that.data.intremoney
    if (checked2) {
      if (remoneyType == 1 && that.data.remoney > 0) {
        var remoney = that.data.remoney
        console.log(remoney, zongprice);
        if (Number(remoney) >= Number(zongprice) - 0.01) {
          usedBalance2 = (Number(zongprice) - 0.01).toFixed(2)
        } else {
          usedBalance2 = Number(remoney)
        }
      } else {
        var usedBalance2 = 0.00
      }
    } else {
      var usedBalance2 = 0.00
    }
    if (usedBalance2 != 0.00) {
      var yeyu = Number(usedBalance2)
      cartlist.forEach((v, index) => {
        const onebl = (Number(v.zongprice) / Number(zongprice)).toFixed(2)
        const onemj = (onebl * Number(usedBalance2)).toFixed(2)
        if (Number(onemj) > Number(v.zongprice)) {
          yeyu = yeyu - Number(v.zongprice)
          v.yue = Number(v.zongprice)
          v.zongprice = 0
        } else {
          yeyu = yeyu - onemj
          v.yue = onemj
          v.zongprice = (v.zongprice - onemj).toFixed(2)
        }
      })
      var maxzongye = 0
      var maxindexye = 0
      cartlist.forEach((v, index) => {
        if (maxzongye < Number(v.zongprice)) {
          maxzongye = Number(v.zongprice)
          maxindexye = index
        }
      })
      if (Number(cartlist[maxindexye].zongprice) < Number(yeyu)) {
        cartlist[maxindexye].yue = Number(cartlist[maxindexye].zongprice) + Number(cartlist[maxindexye].yue)
        yeyu = Number(yeyu) - Number(cartlist[maxindexye].zongprice)
        cartlist[maxindexye].zongprice = 0
      } else {
        cartlist[maxindexye].zongprice = Number(cartlist[maxindexye].zongprice) - Number(yeyu)
        cartlist[maxindexye].yue = Number(cartlist[maxindexye].yue) + Number(yeyu)
        yeyu = 0
      }
      if (Number(yeyu) != 0) {
        cartlist.forEach((v, index) => {
          if (Number(v.zongprice) != 0 && Number(yeyu) != 0) {
            if (Number(v.zongprice) < Number(yeyu)) {
              v.yue = Number(v.zongprice) + Number(v.yue)
              yeyu = Number(yeyu) - Number(v.zongprice)
              v.zongprice = 0
            } else {
              v.zongprice = Number(v.zongprice) - Number(yeyu)
              v.yue = Number(v.yue) + Number(yeyu)
              yeyu = 0
            }
          }
        })
      }
      cartlist.forEach((v, index) => {
        v.bl = (v.yue / v.zongmoney).toFixed(4)
      })
    } else {
      cartlist.forEach((v, index) => {
        v.bl = 0.00
        v.yue = 0.00
      })
    }
    zongprice -= usedBalance2
    //判断是否显示运费
    if (that.data.chooseStyle == 1 || !that.data.address_id) {
      var express = 0
    } else {
      var express = Number(that.data.express2)
    }
    that.setData({
      express: express.toFixed(2)
    })
    zongprice = Number(zongprice) + Number(express)
    zongprice = Number(zongprice).toFixed(2)
    console.log(zongprice);
    if (zongprice == 0.00) {
      zongprice = (Number(zongprice) + 0.01).toFixed(2)
      cartlist[0].zongprice = 0.01
    }
    zongprice = Number(zongprice).toFixed(2)
    all_zongprice = Number(all_zongprice).toFixed(2)
    var all_balance = Number(usedBalance).toFixed(2)
    var all_remoney = Number(usedBalance2).toFixed(2)
    var all_money = Number(coupon_money + usedBalance + usedBalance2 + manjianmoney).toFixed(2)
    that.setData({
      zongprice,
      zongmoney,
      all_zongprice,
      all_balance,
      all_remoney,
      all_money,
      reduce_balance: (usedBalance * 100).toFixed(0),
      balanMoney2: (usedBalance * 100).toFixed(0),
      re_money: usedBalance2,
      remoney2: usedBalance2,
      mjtype,
      cartlist
    })
    if (that.data.idIndex == 0) {
      that.orderQuanList()
    }
  },
  orderQuanList() {
    var that = this;
    var idIndex = that.data.idIndex;
    var goods_id = that.data.cartlist.map(item => item.goods_id);
    let data = {
      price: that.data.zongmoney,
      goods_id: goods_id[idIndex]
    }
    app.apiPost(app.apiList.orderQuanList, data, (res) => {
      if (res.status == 1) {
        let couponsList = res.data.yes;
        if (that.data.couponsList && that.data.couponsList.length != 0) {
          couponsList = that.data.couponsList.concat(couponsList)
        }
        idIndex++;
        that.setData({
          couponsList,
          idIndex,
        })
        if (idIndex == goods_id.length) {
          const seen = new Set();
          const uniqueCoupons = couponsList.filter(item => {
            return seen.has(item.quan_id) ? false : seen.add(item.quan_id);
          });

          // 更新数据
          this.setData({
            have_quan: uniqueCoupons.length,
          });
        } else {
          that.orderQuanList();
        }
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
        distance = Number(distance - freight_info.distance2).toFixed(2)
        if ((distance % 1) > 0) {
          distance = Number(distance) + 1
        }
        distance = Math.trunc(distance);
        var express = Number(distance * freight_info.ex_price).toFixed(2)
        express = Number(express) + Number(freight_info.com_price2)
      }
      that.setData({
        express2: express
      })
      that.zongprice()
    }
  },
  //跳转至地址列表页
  take() {
    console.log('take')
    wx.navigateTo({
      url: '/pages/editAddress/editAddress?type=order',
    })
  },
  changTime() {
    this.setData({
      timeShow: true,
      noticeText: this.data.send_tip
    })
  },
  //接收返回值商品数量num
  onChange(event) {
    var that = this
    var index = event.currentTarget.dataset.index
    var cartlist = that.data.cartlist
    cartlist[index].number = event.detail
    that.setData({
      cartlist,
    })
    that.zongprice()
    return
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
  inuphone(e) {
    this.setData({
      userphone: e.detail.value
    })
  },
  //跳转到选择卡券
  choosecard(e) {
    let that = this;
    let have_quan = that.data.have_quan;
    var quan_id = 0;
    var cartlist = that.data.cartlist.map(item => item.goods_id)
    var goods_id = cartlist.join(',')
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
      url: '/pages/choosecard/choosecard?quan_id=' + quan_id + '&price=' + this.data.zongmoney + "&goods_id=" + goods_id + '&goodsnum=' + 1,
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
      var goodsa_id = that.data.ztdian2.storeagoods_id[0]
      var address_id = shouAddress.id
    } else {
      var userphone = that.data.userphone
      var username = that.data.userinfo.nickname
      var useraddress = '自提：' + that.data.ztdian1.store_area
      var goodsa_id = that.data.ztdian1.storeagoods_id[0]
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
      goodsa_id,
      userphone,
      useraddress,
      address_id,
      username,
      summoney,
      pay_real_money,
      isallPoints,
      pointspay,
      store_id: wx.getStorageSync('ztdian').id,
      store_name: '满旺珍品',
      deliver_type: that.data.chooseStyle,
      ztdian_type: that.data.chooseStyle,
      deliver_money: that.data.express,
      orderremark: that.data.notesValue ? that.data.notesValue : '',
      second_day: 1,
      balancepay: that.data.money, //余额支付金额
      about_time: 0, //自提时间
    }
    if (that.data.chooseStyle == 1) {
      data['ztdian'] = that.data.ztdian1.id
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
        data.payinfo.prepay_id = 'prepay_id=' + data.payinfo.prepay_id;
        wx.requestPayment({
          timeStamp: String(data.payinfo.timestamp),
          nonceStr: data.payinfo.nonceStr,
          package: data.payinfo.prepay_id,
          signType: 'MD5',
          paySign: data.payinfo.generateAuthorization,
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
            console.log(res)
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
  notesValue(e) {
    var notesValue = e.detail.value
    this.setData({
      notesValue,
      notexNum: notesValue.length
    })
  },
  //提交订单列表
  back() {
    var that = this
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
    // if (that.data.zindextime == -1 && that.data.chooseStyle == 2) {
    //   wx.showToast({
    //     title: '请选择送货时间',
    //     icon: 'none'
    //   })
    //   return
    // } else if (that.data.zindextime != -1 && that.data.chooseStyle == 2) {
    //   var timelist = that.data.timelist
    //   var zindexday = that.data.zindexday
    //   var zindextime = that.data.zindextime
    //   var song_time = timelist[zindexday].day + '- ' + timelist[zindexday].items[zindextime].sendstar + '~' + timelist[zindexday].items[zindextime].sendend
    //   that.setData({
    //     song_time,
    //   })
    // }
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
    // if (that.data.chooseStyle == 2 && that.data.manjianinfo && that.data.manjianinfo.id && Number(that.data.zongmoney) < Number(that.data.manjianinfo.man)) {
    //   wx.showModal({
    //     title: '提示',
    //     content: `您未满足门店满${that.data.manjianinfo.man}减${that.data.manjianinfo.jian}是否前往凑单`,
    //     cancelText: '继续支付',
    //     confirmText: '前往凑单',
    //     complete: (res) => {
    //       if (res.cancel) {
    //         wx.showLoading({
    //           title: '订单提交中',
    //           mask: true
    //         })
    //         that.addOrdermorewxss()
    //       }
    //       if (res.confirm) {
    //         wx.navigateBack()
    //       }
    //     }
    //   })
    // } else {
    wx.showLoading({
      title: '订单提交中',
      mask: true
    })
    that.addOrdermorewxss()
    // }
    var userinfo = that.data.userinfo
    // if (that.data.chooseStyle == 1 && (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone)) {
    //   wx.showToast({
    //     title: '请先完善您的资料',
    //     icon: 'none',
    //     success() {
    //       setTimeout(() => {
    //         wx.navigateTo({
    //           url: '/pages/setpage/setpage',
    //         })
    //       }, 1500)
    //     }
    //   })
    //   return
    // }
  },
  getUserLocation() {
    var that = this
    // 调用获取用户位置的 API
    wx.getLocation({
      type: 'wgs84', // 可选 'wgs84'（默认）或 'gcj02'（中国大陆）
      success: (res) => {
        that.setData({
          longitude: res.longitude, // 获取经度
          latitude: res.latitude // 获取纬度
        });
        that.getztdianbygoods()
      },
      fail: (err) => {
        wx.authorize({
          scope: 'scope.userLocation', // 请求位置授权
          success: () => {
            // 用户同意授权后调用获取位置的 API
            that.getUserLocation();
          },
          fail: (err) => {
            console.error('用户拒绝授权:', err);
          }
        });
      }
    });
  },
  //查询商品对应自提点
  getztdianbygoods() {
    var that = this;
    var ztdian = wx.getStorageSync('ztdian')
    ztdian['storeagoods_id'] = that.data.storeagoods_id,
      this.setData({
        ztdian2: ztdian,
        ztdian1: ztdian,
        ztdianstatus: true,
      })
    return
    var data = {
      goods_id: that.data.goods_id,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      page: 1,
      limit: 999,
      store_id: wx.getStorageSync('ztdian').id
    }
    app.apiPost(app.apiList.getztdianbygoods, data, (res) => {
      if (res.status == 1) {
        var ztdian = res.data.filter(v => v.business_ok == 0);
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂无出售门店',
            icon: "error",
            duration: 3000,
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          }, 3000);
          return;
        }
        if (ztdian.length == 0) {
          var ztdianstatus = false
          this.setData({
            ztdianstatus,
          })
        } else {
          var ztdianstatus = true
          ztdian[0].distance = (ztdian[0].distance / 1000).toFixed(2)
          this.setData({
            ztdian2: ztdian[0],
            ztdian1: ztdian[0],
            ztdianstatus,
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  //计算距离
  setdistance(latitude, longitude) {
    var lat1 = latitude * Math.PI / 180;
    var lon1 = longitude * Math.PI / 180;
    var lat2 = this.data.freight_info.latitude * Math.PI / 180;
    var lon2 = this.data.freight_info.longitude * Math.PI / 180;

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
  addOrdermorewxss() {
    var that = this
    var {
      cartlist,
      ztdian,
      userinfo,
      chooseStyle,
      express,
      zongprice,
      zongmoney,
      userphone,
      shouAddress,
      notesValue,
      all_remoney,
    } = that.data
    var coupons = that.data.coupons || []
    var pay_list = [{
      goods: [],
      store_id: 1, // 门店id
      orderremark: notesValue ? notesValue : '', // 备注,
      deliver_money: express, // 运费
    }]
    cartlist.forEach(v => {
      pay_list[0].goods.push({
        bl: v.bl,
        number: v.number, // 购买数量
        yue_price: v.yue, // 余额
        oneprice: (Number(userinfo.user_level == 2 ? v.specs_pfmoney : (userinfo.user_level == 1 ? v.specs_tgmoney : (userinfo.user_level == 3 ? v.specs_vipmoney : v.specs_erpmoney))) * Number(v.number)).toFixed(2), // 单价
        memberprice: Number(userinfo.user_level == 2 ? v.specs_pfmoney : (userinfo.user_level == 1 ? v.specs_tgmoney : (userinfo.user_level == 3 ? v.specs_vipmoney : v.specs_erpmoney))), // 会员价
        pay_price: userinfo.iscan_zero == 1 ? 0 : Number(v.zongprice).toFixed(2), // 总价
        goods_id: v.goods_id, // 商品id
        specs_id: v.specs_id, // 商品规格id
        // goodsa_id: v.goodsalist.id, // 门店商品id
        quan_price: v.quanmoney, // 优惠券
        quan_id: v.quan_id || '', //优惠券id
        shopprice: (Number(userinfo.user_level == 2 ? v.specs_pfmoney : (userinfo.user_level == 1 ? v.specs_tgmoney : (userinfo.user_level == 3 ? v.specs_vipmoney : v.specs_erpmoney))) * Number(v.number)).toFixed(2), // 总价
        store_id: 1, // 门店id
        sku_id: 0,
        cart_id: v.id,
        pointspay: v.points, // 积分
        blance_pay: (Number(v.yue) + (Number(v.points) / 100)).toFixed(2), // 余额
        active_id: v.active_id || '',// 活动id
      })
    })
    if (that.data.chooseStyle == 2) {
      userphone = shouAddress.phone //收货人联系方式
      var useraddress = shouAddress.street + shouAddress.address + shouAddress.detail_address //收货人地址
      var username = shouAddress.username //收货人姓名
      var address_id = shouAddress.id
      var second_day = ''
    } else {
      var username = userinfo.nickname
      var useraddress = '自提：' + ztdian.store_area
      var zt_phone = userphone
    }
    var data = {
      about_time: 0,
      address_id, // 地址id
      deliver_money: express, // 运费
      deliver_type: chooseStyle, // 配送方式 1 自提 2 配送
      isallye: 0, // 是否全部使用余额
      pay_real_money: userinfo.iscan_zero == 1 ? 0 : zongprice, // 实际支付金额
      pointspay: that.data.reduce_balance, // 使用积分
      quan_money: that.data.coupon_money, // 优惠券金额
      balancepay: all_remoney, // 余额
      second_day, // 配送时间
      summoney: Number(zongmoney) + Number(express), // 总价
      useraddress, // 地址
      userphone, // 手机号
      username, // 姓名
      store_id: 1, // 门店id
      store_name: '冀唐清泉', // 门店名称
      ztname: '', // 自提点名称
      zt_phone,
      pay_list, // 商品列表
      goodslength: cartlist.length, // 商品数量
    }
    if (coupons.length > 0) {
      data.quan_id = coupons[0].quan_id // 优惠券id
    } else {
      data.quan_id = ''
    }
    if (userinfo.iscan_zero == 0) {
      data.pay_real_money = zongprice
    }
    if(data.pay_real_money == 0 && userinfo.iscan_zero == 0){
      wx.showToast({
        title: '错误',
        icon: 'loading'
      })
      return;
    }
    app.apiPost(app.apiList.addOrdermorewxss, data, (res) => {
      if (res.status = 1) {
        that.setData({
          btnstatus: false,
          // msg: ''
        })
        var pay_real_money = res.orderinfo.pay_real_money
        var orderno = res.orderinfo.orderno
        if ((that.data.useye && that.data.zongprice == 0) || res.iszero == 1) {
          console.error('余额支付/0元券')
          wx.showLoading({
            title: '订单支付成功',
            mask: 'true'
          })
          paymoney = pay_real_money
          that.delPayCart(0)
          return;
        }
        res.payinfo.prepay_id = 'prepay_id=' + res.payinfo.prepay_id;
        wx.requestPayment({
          timeStamp: String(res.payinfo.timestamp),
          nonceStr: res.payinfo.nonceStr,
          package: res.payinfo.prepay_id,
          signType: 'MD5',
          paySign: res.payinfo.generateAuthorization,
          success(q) {
            wx.showToast({
              title: '订单支付成功',
              mask: 'true',
              success() {
                paymoney = pay_real_money
                that.delPayCart(0)
              }
            })
          },
          fail(res) {
            console.log(res)
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
  delPayCart(e) {
    var index = e
    if (index == 0 && this.data.cartlist.length == 1 && !this.data.cartlist[index].id) {
      setTimeout(function () {
        wx.hideLoading()
        //跳转到购买成功页面
        wx.redirectTo({
          url: '/pages/buysuccess/buysuccess?pay_real_money=' + paymoney,
        })
      }, 1500)
      return;
    }
    app.apiPost(app.apiList.delonecartgoods, {
      id: this.data.cartlist[index].id,
    }, (res) => {
      if (index == this.data.cartlist.length - 1) {
        setTimeout(function () {
          wx.hideLoading()
          //跳转到购买成功页面
          wx.redirectTo({
            url: '/pages/buysuccess/buysuccess?pay_real_money=' + paymoney,
          })
        }, 1500)
      } else {
        this.delPayCart(index + 1)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.navigatebar()
    // options.ordertype 上一页面传值 1 单商品下单 2 多商品下单
    if (options.ordertype == 1) { } else {
      this.setData({
        chooseStyle: options.zttype,
      })
      // if (options.zttype == 1) {
      //   wx.setNavigationBarTitle({
      //     title: '自提订单',
      //   })
      // } else {
      //   wx.setNavigationBarTitle({
      //     title: '配送订单',
      //   })
      // }
      var ztdian = wx.getStorageSync('ztdian')
      var storeLatitude = Number(ztdian.latitude) // 门店纬度
      var storeLongitude = Number(ztdian.longitude) // 门店经度
      var cartlist = wx.getStorageSync('cartlist_pay')
      console.log("🚀 ~ lotaddorder2.js:1359 ~ cartlist:", cartlist)
      var maxComPrice = Math.max(...cartlist.map(v =>
        Number(v.freight_info.com_price)
      ));
      // 复制第一个匹配最大值的freight_info到sdf
      var freight_info = {}
      cartlist.forEach(item => {
        if (Number(item.freight_info.com_price) === maxComPrice) {
          freight_info = item.freight_info
        }
      })
      this.setData({
        ordertype: options.ordertype,
        cartlist,
        ztdian,
        storeLatitude,
        storeLongitude,
        freight_info,
      })
      // this.getmanjianinfo()
      this.userCenter()
    }
    // this.czsonglist()
  },
  czsonglist() {
    app.apiPost(app.apiList.czsonglist, {}, (res) => {
      if (res.status == 1) {
        this.setData({
          czsonglist: res.data
        })
      }
    })
  },
  chooseMoney(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myMoney/myMoney?id=' + id,
    })
  },
  gogogocfl(e) {
    var that = this
    var targetItem = that.data.ztdian
    wx.openLocation({
      latitude: Number(targetItem.latitude), // 目标位置的纬度
      longitude: Number(targetItem.longitude), // 目标位置的经度
      name: targetItem.name, // 目标位置名称
      address: targetItem.store_area, // 目标位置地址
      scale: 18, // 缩放比例
      success: function () {
        // 可以在这里执行其他操作
      },
      fail: function () {
        wx.showToast({
          title: '导航失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  navigatebar() { //导航栏
    var menu = wx.getMenuButtonBoundingClientRect()
    var windowsinfo = wx.getWindowInfo()
    var pixelRatio = windowsinfo.windowWidth / 750
    var scrollheight = windowsinfo.windowHeight - (250 * pixelRatio) - menu.top - menu.height
    var boxwidth = 450 - 29 * pixelRatio
    this.setData({
      top: menu.top,
      height: menu.height,
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
    this.walletsList()
    this.myMoney()
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
    wx.removeStorageSync('cartlist_pay')
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
})