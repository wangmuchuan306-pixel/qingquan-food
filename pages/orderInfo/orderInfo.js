// pages/orderInfo/orderInfo.js
var app = getApp();
var utils = require('../../utils/util.js');
var Api = getApp().globalData.Api; //api地址
var helper = require('../../utils/helper.js'); //网络请求
var order_statuss;
var commentInfo = '系统默认好评.';
// var QQMapWX = require('../../pages/libs/qqmap-wx-jssdk.min.js');
// var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    veision: app.globalData.veision,
    url: app.globalData.url,
    isIpx: app.globalData.isIpx, //获得手机型号
    infoid: "",
    one_2: 0, //点亮的星星数
    two_2: 5, //没有点亮的星星数
    radio: '买错了',
    store: {}
  },
  callsj(e) {
    wx.makePhoneCall({
      phoneNumber: (e.currentTarget.dataset.phone).toString(),
      complete(res) {
        console.log(res)
      }
    })
  },
  //再来一单
  tobuygoods() {
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id=' + this.data.info.goods[0].goodsid,
    })
  },
  //退款
  cancelOrderfy(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否确认退款',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          app.apiPost(app.apiList.cancelOrderfy, {
            orderno: e.currentTarget.dataset.id
          }, (res) => {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            if (res.status == 1) {
              // var order = that.data.order
              // order[e.currentTarget.dataset.index].order_status = 9
              // order[e.currentTarget.dataset.index].sta_txt = '已取消'
              // order.splice(e.currentTarget.dataset.index, 1)
              var info = that.data.info
              info.detail_view_txt_title = '订单已退款'
              info.detail_view_txt_desc = '钱款已原路退回，请注意查收'
              info.order_status = 9
              that.setData({
                info
              })
            }
          })
        }
      }
    })
  },
  //确认提货
  querentihuo(e) {
    app.apiPost(app.apiList.getqrcode, {
      orderno: e.currentTarget.dataset.id
    }, (res) => {
      this.setData({
        showindex: e.currentTarget.dataset.index,
        qrcode: res.data,
        show: true
      })
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  //选择退款理由
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  //点击确认退款
  cancelOrder() {
    var that = this;
    // 商品id
    var goodsa = that.data.goodsa
    var data = {
      orderno: that.data.infoid,
      reason: that.data.radio
    }
    console.log(that.data.infoid)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (that.data.info.deliver_type == 3) {
      wx.showModal({
        cancelText: '确定',
        confirmText: '我再想想',
        content: '是否确定取消订单？',
        showCancel: true,
        title: '提示',
        success: (result) => {
          console.log(result)
          if (result.cancel == true) {
            wx.showLoading({
              title: '正在提交...',
              mask: true
            })
            app.apiPost(app.apiList.cancelOrder, data, (data) => {
              console.log(data)
              if (data.status == 1) {
                wx.hideLoading({
                  success: (res) => {
                    wx.showToast({
                      title: '退款成功~',
                      duration: 1000
                    })
                    that.onClose();
                    setTimeout(function () {
                      if (pages[1].is == "packageA/pages/orderList/orderList") {
                        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                        prevPage.setData({
                          currentTab: 4,
                          order_status: 6
                        })
                        wx.navigateBack({ //返回
                          delta: 1
                        })
                        prevPage.getOrderList();
                      } else {
                        wx.redirectTo({
                          url: '/packageA/pages/orderList/orderList?id=4' + '&type=6'
                        })
                      }
                      // that.getOrderInfo();
                    }, 1000)

                  },
                })



              }
            })
          }
        },
        fail: (res) => {},
        complete: (res) => {
          console.log(res)
        },
      })

    } else {
      console.error('退款')
      wx.showModal({
        cancelText: '直接退',
        confirmText: '再等等',
        content: '再等等吧，商家马上接单',
        showCancel: true,
        title: '是否确认退款',
        success: (result) => {
          console.log(result)
          if (result.cancel == true) {
            wx.showLoading({
              title: '正在提交...',
              mask: true
            })
            app.apiPost(app.apiList.cancelOrder, data, (data) => {
              if (data.status == 1) {
                wx.hideLoading({
                  success: (res) => {
                    wx.showToast({
                      title: '退款成功~',
                      duration: 1500
                    })
                    that.onClose();
                    setTimeout(function () {
                      if (pages[1].is == "packageA/pages/orderList/orderList") {
                        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
                        prevPage.setData({
                          currentTab: 4,
                          order_status: 6
                        })
                        wx.navigateBack({ //返回
                          delta: 1
                        })
                        prevPage.getOrderList();
                      } else {
                        wx.redirectTo({
                          url: '/packageA/pages/orderList/orderList?id=4' + '&type=6'
                        })
                      }
                      // that.getOrderInfo();
                      // prevPage.setData({
                      //   currentTab:4
                      // })
                      // wx.navigateBack({//返回
                      //   delta: 1
                      // })
                      // prevPage.getOrderList();
                    }, 1500)
                  },
                })
              }
            })
          }
        },
        fail: (res) => {},
        complete: (res) => {
          console.log(res)
        },
      })
    }


  },
  showPopup(e) {
    console.log(e)
    var goodsa = e.currentTarget.dataset.goodsa
    var that = this;
    var info = that.data.info
    console.log(info)
    console.log(goodsa)
    var infotui = []
    info.goods.forEach(function (v, k) {
      if (info.goods[k].goodsid == goodsa) {
        infotui.push(info.goods[k])
      }
    })
    console.log(infotui)
    that.setData({
      show: true,
      goodsa,
      infotui: infotui[0]
    })
  },
  onClose() {
    var that = this;
    that.setData({
      show: false
    });
  },
  //用户点击选择地址
  getposition() {
    var that = this
    // if (wx.getStorageSync('location') == true) {
    this.getLoc();
    // } else {
    //   wx.showModal({
    //     title: that.data.procedure.wxname,
    //     content: '请授权地理位置以继续使用',
    //     showCancel: true,
    //     success: function (res) {
    //       console.log(res);
    //       if (res.confirm) {
    //         wx.openSetting({
    //           success: (a) => {
    //             console.log(a)
    //             if (a.authSetting['scope.userLocation']) {
    //               wx.setStorageSync('location', true);
    //               wx.showToast({
    //                 title: '授权成功',
    //               })
    //             } else {
    //               wx.showToast({
    //                 title: '授权失败',
    //                 icon: 'loading'
    //               })
    //             }
    //           }
    //         })
    //       }

    //     },
    //   })
    // }

  },

  formSubmit_store(e) {
    var _this = this;
    var dest = e;
    console.log(dest);
    //调用距离计算接口
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      // from: { _this.data.latitude,_this.data.longitude}, //若起点有数据则采用起点坐标，若为空默认当前地址
      from: {
        latitude: wx.getStorageSync('latitude'),
        longitude: wx.getStorageSync('longitude')
      },
      to: dest, //终点坐标
      success: function (res) { //成功后的回调
        console.log(res)
        var res = res.result;
        var dis = [];
        _this.data.store['elements'] = (res.elements[0].distance / 1000).toFixed(2);
        //将返回数据存入newest数组，
        _this.setData({ //设置并更新distance数据
          store: _this.data.store
        });
        console.log(_this.data.store)
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        ////console.log(res);
      }
    });
  },
  // 地图导航
  getLoc: function (e) {
    var latitude;
    var longitude;
    var name;
    var address;
    if (this.data.info.ztdian_type == 1) {
      var lnginfo = this.data.ztdian.lnginfo.split(',')
      latitude = Number(lnginfo[1]);
      longitude = Number(lnginfo[0]);
      name = this.data.ztdian.zt_name;
      address = this.data.ztdian.zt_addresss;
    } else {
      latitude = this.data.info.partner_info.latitude;
      longitude = this.data.info.partner_info.longitude;
      name = this.data.info.partner_info.p_username;
      address = this.data.info.partner_info.r_area;
    }
    var that = this;
    wx.openLocation({
      latitude: latitude, // 要去的地址经度，浮点数
      longitude: longitude, // 要去的地址纬度，浮点数
      name: name, // 位置名
      address: address, // 要去的地址详情说明
      // scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
      // infoUrl: 'http://www.gongjuji.net' // 在查看位置界面底部显示的超链接,可点击跳转（测试好像不可用）
    });
    // wx.getLocation({
    //   type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    //   success: function (res) {
    //     console.log(res);
    //     //使用微信内置地图查看位置接口

    //   },
    //   cancel: function (res) {
    //     console.log('地图定位失败');
    //   }
    // })
  },
  //点击立即评价
  goAddComments(e) {
    var that = this;
    wx.navigateTo({
      url: '../addComments/addComments?id=' + that.data.infoid + '&status=2',
    })
  },
  //复制uid
  copy(e) {
    // 将数字转换成字符串
    var ordernid = String(e.currentTarget.dataset.ordernid);
    wx.setClipboardData({
      data: ordernid,
      success: function (res) {
        console.log(res);
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  //跳转到商品详情
  goGoodsInfo(e) {
    console.log(e.currentTarget.dataset.gid);
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '../goodsInfo/goodsInfo?id=' + gid,
    })
  },
  //删除订单
  delorder() {
    var that = this;
    wx.showModal({
      cancelText: '取消',
      confirmText: '确认',
      content: '是否删除此订单',
      showCancel: true,
      title: '提示',
      success: (result) => {
        if (result.confirm == true) {
          app.apiPost(app.apiList.delorder, {
            orderno: that.data.infoid
          }, (data) => {
            if (data.status == 1) {
              wx.showToast({
                title: '删除成功',
                duration: 1500
              })
              //返回订单列表
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1500)
            }
          })
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    })

  },
  //显示弹框
  showModal(e) {
    order_statuss = 4;
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear',
      delay: 0
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(900).step();
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true,
      order_statu: order_statuss
    });
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },

  //弹框隐藏
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(900).step();

    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false,

      })
    }, 200)
  },
  //用户点击星星评分
  in_xin: function (e) {
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin == 'star') {
      one_2 = Number(e.currentTarget.id)
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
  },
  //评论弹窗--订单详情
  showOrderInfo() {
    var that = this;
    var data = {
      _id: that.data.infoid
    }
    helper.post(Api.orderInfo, (data) => {
      var orderInfo = data.msg;
      if (data.status == 1) {
        orderInfo.goods.coverimg = app.globalData.url + orderInfo.goods.coverimg;
        that.setData({
          orderInfo: orderInfo,
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'loading'
        })
      }
    }, data)
  },
  //拿到用户输入评价内容
  getComments(e) {
    console.log(e.detail.value);
    if (e.detail.value.length < 10) {
      wx.showToast({
        title: '至少输入十个字.',
        icon: 'none'
      })
    } else {
      commentInfo = e.detail.value;
    }

  },
  //用户点击提交评价
  setComments(e) {
    var that = this;
    var star = that.data.one_2;
    var oid = that.data.infoid;
    if (star == 0) {
      wx.showToast({
        title: '请选择星级评价！',
        icon: 'none'
      })
    } else {
      var data = {
        _id: oid,
        msg: commentInfo,
        star: star
      }
      helper.post(Api.addComments, (data) => {
        if (data.status == 1) {

          that.updateOrderStatus();
          that.hideModal();
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'loading'
          })
        }
      }, data)
    }

  },
  //用户点击确认收货
  querenshouhuo(e) {
    var that = this;
    var title = '确认收货提醒';
    var content = '请确认是否收到商品!';
    var tishi = "收货成功";
    var modeltxt = '确认收货';
    if (that.data.info.deliver_type == 1) {
      title = '确认取货提醒';
      content = '请确认是否取到商品!';
      tishi = "取货成功";
    } else if (that.data.info.deliver_type == 3) {
      title = '请确认是否核销订单?';
      content = '请到店后向店内工作人员展示订单并点击确认使用，否则请取消~';
      tishi = "使用成功";
      modeltxt = '确认使用';

    }
    wx.showModal({
      title: title,
      content: content,
      showCancel: true,
      cancelText: '取消',
      confirmText: modeltxt,
      success: function (res) {
        console.log(res);

        if (res.confirm) {
          var info = that.data.info
          info.order_status = 4
          that.setData({
            info
          })
          var data = {
            orderno: that.data.infoid,
            ok_type: 4,


          }
          wx.showToast({
            title: tishi,
          }, 500)
          //订阅消息
          //跳转到发布评价页面
          // wx.navigateTo({
          //   url: '../addComments/addComments?id=' + that.data.infoid + '&status=2',
          // })
          //跳转到发布评价页面
          //  setTimeout(() => {
          //    console.log('aaa')
          //   wx.navigateTo({
          //     url: '../addComments/addComments?id=' + id + '&status=2',
          //   })
          //  }, 500);
          // return
          app.apiPost(app.apiList.userReceiving, data, (data1) => {
            if (data1.status == 1) {
              wx.showToast({
                title: tishi,
              }, 500)
              //订阅消息
              //跳转到发布评价页面
              // wx.navigateTo({
              //   url: '../addComments/addComments?id=' + that.data.infoid + '&status=2',
              // })
              //跳转到发布评价页面
              setTimeout(() => {
                console.log('aaa')
                wx.navigateTo({
                  url: '../addComments/addComments?id=' + id + '&status=2',
                })
              }, 500);
              // 免单活动
              // wx.navigateTo({
              //   url: '/packageA/pages/luckyDraw/luckyDraw?orderId='+that.data.infoid+'&good_id='+data.goods_id,
              // })
            }
          })
        }

      },
    })
  },
  //用户点击相应按钮更改订单状态
  updateOrderStatus(e) {
    console.log(e);
    var that = this;
    if (e != undefined) {
      order_statuss = e;
    }
    var orderid = that.data.infoid;
    var data = {
      _id: orderid,
      order_status: parseInt(order_statuss) + 1
    }
    helper.post(Api.updateOrderStatus, (data) => {
      if (data.status == 1) {
        var msg;
        if (order_statuss == 1) {
          msg = '确认收货成功.';
          // wx.requestSubscribeMessage({
          //   tmplIds: ["fyQYzNCmsp6_TDHt4q0OvFvujgvENGfH8SU0DVTXpfQ"],
          //   success: function (res) {
          //     console.log(res);
          //     if (res['fyQYzNCmsp6_TDHt4q0OvFvujgvENGfH8SU0DVTXpfQ'] === 'accept') {
          //       wx.showToast({
          //         title: '订阅OK！'
          //       })
          //       var sendmessageData = {
          //         token: wx.getStorageSync('token'),
          //         _id: orderid,
          //         page: '/pages/orderInfo/orderInfo?id=' + orderid
          //       }
          //       utils.getWebDataWithPostOrGet({
          //         url: 'app/api/sendconfirm',
          //         param: sendmessageData,
          //         method: "POST",
          //         success: function (a) {
          //           console.log(a);
          //           if (a.status == 1) {
          //             wx.navigateTo({
          //               url: '../addComments/addComments?id=' + orderid + '&status=2',
          //             })
          //           }


          //         }
          //       })
          //     }
          //     //成功
          //   },
          //   fail(err) {
          //     //失败
          //     console.error(err);
          //   }
          // })
        } else if (order_statuss == 2) {
          msg = '评价成功.';
        } else if (order_statuss == 3) {
          msg = '分享成功.';
        }
        that.getOrderInfo();
        wx.showToast({
          title: msg,
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'loading'
        })
      }
    }, data)
  },

  //跳转到商家信息页面
  goMerchantInfo(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id; //商家id
    wx.navigateTo({
      url: '/packageB/pages/merchantInfo/merchantInfo?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    console.log('167032024123117356331948602609'.length)
    // qqmapsdk = new QQMapWX({
    //   key: 'LIXBZ-2CTK6-2QQSM-MJDCC-5ND7Q-V5BV2'
    // });
    console.log('页面加载时---')
    console.log(options)
    var that = this;
    app.apiPost(app.apiList.getIndexSet, {}, (res) => {
      var procedure = res.data
      that.setData({
        procedure: procedure
      })
    })
    that.setData({
      theme: 'light'
    })
    app.wxAllchange()
    if (options.q) {
      var infoid = decodeURIComponent(options.q)
      infoid = infoid.split("=")[1]
      that.setData({
        infoid
      })
    }
    if (options.id) {
      that.setData({
        infoid: options.id
      });
      console.log(that.data.infoid)
    }
    if (wx.getStorageSync('ismember') != undefined) {
      that.setData({
        ismember: wx.getStorageSync('ismember')
      })
    }
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
    this.getOrderInfo();
    if (wx.getStorageSync('theme')) {
      var theme = wx.getStorageSync('theme')
      that.setData({
        theme
      })
    } else {
      that.setData({
        theme: 'light'
      })
    }
    app.wxAllchange()
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
    order_statuss = 3;
    // that.updateOrderStatus();
    //分享回调
    that.updateShare();
    return {
      title: that.data.info.goodsname,
      // desc: '分享页面的内容',
      path: '/pages/goodsInfo/goodsInfo?id=' + that.data.goodsid,
      imageUrl: that.data.info.goodsimg,
    }


  },
  //订单分享回调
  updateShare() {
    var that = this;
    var data = {
      orderno: that.data.infoid
    }
    app.apiPost(app.apiList.updateShare, data, (data) => {
      console.log('分享成功')
    })
  },
  //获取订单详情
  getOrderInfo() {
    var that = this;
    var data = {
      orderno: that.data.infoid
    }
    app.apiPost(app.apiList.userOrderDetail, data, (data) => {
      var info = data.data[0];
      if (data.status == 1) {
        that.setData({
          info: info
        })
        if (info.fh_type == 1) {
          that.getdriver()
        }else{
          that.getkd()
        }
        that.findoneztdian()
        // if (info.partner_info) {
        //   that.formSubmit_store([{
        //     latitude: info.partner_info.latitude,
        //     longitude: info.partner_info.longitude,
        //   }]);
        // } else {
        //   that.formSubmit_store([info.store_info]);
        // }
      }
    })
  },
  //司机列表
  getdriver() {
    var that = this
    app.apiPost(app.apiList.getdriver, {
      page: 1,
      limit: 999
    }, (res) => {
      var info = that.data.info
      info['siji'] = res.data.find(item => item.id == info.fh_sj)
      that.setData({
        info
      })
    })
  },
  //快递列表
  getkd() {
    var that = this
    app.apiPost(app.apiList.getkd, {
      page: 1,
      limit: 999
    }, (res) => {
      var info = that.data.info
      info['kuaidi'] = res.data.find(item => item.id == info.fh_kd)
      that.setData({
        info
      })
    })
  },
  findoneztdian() {
    app.apiPost(app.apiList.findoneztdian, {
      id: this.data.info.ztdian
    }, (res) => {
      this.setData({
        ztdian: res.data
      })
    })
  },

  //给团长/商家拨打电话
  call_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    console.log(phone)
    if (phone != undefined) {
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
          console.log("成功拨打电话")
        }
      })
    } else {
      wx.showToast({
        title: '未发现电话号码',
        icon: 'error',
        duration: 1500
      })
    }
  },

  // 跳转免单活动
  toFreeActivities() {
    let that = this;
    wx.navigateTo({
      url: '/packageA/pages/luckyDraw/luckyDraw?orderId=' + that.data.infoid + '&good_id=' + that.data.info.goodsid,
    })
  }
})