// pages/myWallet/myWallet.js
var app = getApp();

// var QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
var utils = require('../../utils/util.js');
var Api = getApp().globalData.Api; //api地址
var helper = require('../../utils/helper.js'); //网络请求
var floatTop = -300; //悬浮高度
var money = 0;
var maxmoney = 10000;
var page = 1;
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    veision: app.globalData.veision,
    isphone: 0,
    url: app.globalData.url,
    isIpx: app.globalData.isIpx, //获得手机型号
    disabled: true, //提现按钮默认禁用
    walletsList: [],
    walletcount: 0,
    comment_end: false,
    money: '',
    wallets: 0,
    loading: false,
    listmore: false, //上啦加载动画
  },
  // 余额支付
  BalancePayment() {
    var that = this
    var all_money = that.data.info.all_money
    // wx.navigateTo({
    //   url: '../../../packageB/pages/BalancePayment/BalancePayment?all_money='+all_money,
    // })
    wx.scanCode({
      onlyFromCamera: false,
      success: function (res) {
        console.log(res)
        if (res.path) {
          var pathes = res.path
          console.log(pathes)
          wx.navigateTo({
            url: '/' + pathes,
          })
        }
      }

    })
  },
  //获取微信绑定的手机号 
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '授权手机号,才可以进行提现',
        success: function (res) {}
      })
    } else {
      wx.checkSession({
        success() {
          wx.login({
            success: function (p) {
              //  // console.log(p);
              var code = p.code;
              var data = {
                encryptedData: encodeURIComponent(e.detail.encryptedData),
                iv: e.detail.iv,
                code: code,
                // type:1
              }
              app.apiPost(app.apiList.wxphone, data, (res) => {
                if (res.status == 1) {
                  that.showModal();
                  that.setData({
                    phone: res.data.phone,
                    isphone: 1
                  })
                }
              })
            }
          })

        },
        fail() {}
      })
    }
  },
  //隐藏弹框
  onClose() {
    this.setData({
      share: false
    });
  },
  //判断页面是否加载完成
  isShow() {
    var that = this;
    setTimeout(function () {
      that.setData({
        isShow: true
      })
    }, 1500)

  },
  //获取用户输入的提现金额
  getmoney(e) {
    let that = this;
    console.log(e.detail.value);
    maxmoney = this.data.info.blance;
    // money = 0;
    // this.setData({
    //   disabled: true
    // })
    var money = e.detail.value;
    console.log('余额：' + maxmoney)
    console.log('输入金额:' + money)

    let small_money_tx = parseFloat(that.data.info.small_money_tx);
    if (money < small_money_tx) {
      console.log('小于' + small_money_tx)
      this.setData({
        disabled: true,
        smallten: 1 //1-小于10  2-大于余额
      })
    } else if (money - maxmoney > 0) {
      console.log('大于余额')
      this.setData({
        disabled: true,
        smallten: 2 //1-小于10  2-大于余额
      })
    } else {
      console.log('可提现')
      this.setData({
        disabled: false,
        smallten: 0
      })
    }
    this.setData({
      money
    })

  },
  //用户点击全部提现
  allDrawal() {
    // money = parseInt(this.data.wallet);
    this.data.money = parseInt(this.data.info.blance);
    this.setData({
      money: String(this.data.money),
      disabled: false
    })
  },
  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getScrollTop: function () {
    var that = this;
    if (wx.canIUse('getSystemInfo.success.screenWidth')) {
      wx: wx.getSystemInfo({
        success: function (res) {
          rate = res.screenWidth / 750;
          floatTop = 495 * rate;
          that.setData({
            scrollTop: 495 * res.screenWidth / 750,
            scrollHeight: res.screenHeight / (res.screenWidth / 750) - 495,
          });
        }
      });
    }
  },
  //获取nav 滚动高度
  onPageScroll(event) {
    var scrollTop = event.scrollTop;
    this.setData({
      scrollTop_up: scrollTop
    })
    if (scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
    if (scrollTop >= floatTop && !this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: true,
      });
    } else if (scrollTop < floatTop && this.data.isShowFloatTab) {
      this.setData({
        isShowFloatTab: false,
      });
    }
    // console.log(e.scrollTop);
    var that = this;
    // 3.当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
    if (scrollTop > that.data.menuTop) {
      that.setData({
        menuFixed: true
      })
    } else {
      that.setData({
        menuFixed: false
      })
    }
  },
  showModal: function () {
    var that = this
    var ismember = app.get('ismember');
    var userinfo = that.data.userinfo
    if (ismember > 0 && userinfo.id_num) {
      // 显示遮罩层
      this.setData({
        share: true
      })
    }  
    if(!userinfo.id_num && ismember > 0){
      wx.showModal({
        title: that.data.procedure.wxname+'提示您',
        content: '您未进行实名认证，提现需要实名认证，是否实名认证',
        showCancel: true,
        cancelText: '取消',
        confirmText: '去认证',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/setting/setting',
            })
          }
        },
      })
    }
    // if(ismember<=0){
    //   wx.showModal({
    //     title: that.data.procedure.wxname+'提示您',
    //     content: '非会员不可提现，是否开通会员',
    //     showCancel: true,
    //     cancelText: '取消',
    //     confirmText: '去开通',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.navigateTo({
    //           url: '../memberPage_bk/memberPage_bk',
    //         })
    //       }
    //     },
    //   })
    // }
  },
   //获取用户信息
   getUserInfo() {
    var that = this;
    app.apiPost(app.apiList.userCenter, {}, (data) => {
      if (data.status == 1) {
        var info = data.data;
        console.log(info)
        that.setData({
          userinfo: info,
          tel: info.phone,
          birthday: info.birthday,
          avatarUrl: info.headimg
        })
        wx.setStorageSync('userinfo', info);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if(wx.getStorageSync('userinfo')){
      var userinfo = wx.getStorageSync('userinfo')
      that.setData({
        userinfo
      })
    }
    that.setData({
      totalsave: options.totalsave
    })
    that.isShow();
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
    var that = this;
      that.setData({
        theme: 'light'
      })
    app.wxAllchange()
    that.walletsList();
    that.userAccount();
    var query = wx.createSelectorQuery() //创建节点查询器 query
    query.select('#affix').boundingClientRect() //这段代码的意思是选择Id= the - id的节点，获取节点位置信息的查询请求
    query.exec(function (res) {
      console.log(res);
      that.setData({
        menuTop: res[0].top
      })
    });
    that.getUserInfo()
  },
  //查询余额
  userAccount() {
    var that = this;
    app.apiPost(app.apiList.userAccount, {}, (data) => {
      if (data.status == 1) {
        data.data.blances = parseInt(data.data.blance).toFixed(2);
        if (data.data.blances < 10) {
          data.data.blances = 0.00
        }
        that.setData({
          info: data.data,
          isphone: data.data.isbdphone,
          phone: data.data.phone
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    page = 1;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    page = 1;

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    page = 1;
    this.setData({
      walletsList: [],
      walletcount: 0,
      comment_end: false,
      loading: false
    })
    that.walletsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.comment_end) {
      console.log('已经到底了！');
      return;
    } else {
      page++;
      this.setData({
        listmore: true, //上啦加载动画
      })
      that.walletsList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid')
    }
  },
  //查询交易列表
  walletsList() {
    var that = this;
    //停止下拉动作
    wx.stopPullDownRefresh();
    app.apiPost(app.apiList.blanceList, {
      page: page
    }, (data) => {
      // var current_month = '';
      // var yearMonth = '';
      // var month_list = [];
      // // var sumlist = q.data.msg;
      // var sumlist = [];
      // var datalist = {};
      // var j = 0;
      // if (data.status == 1) {
      //   for (var i = 0; i < data.msg.length; i++){
      //     data.msg[i].inTime = utils.formatTimeTwo(data.msg[i].inTime, 'Y年M月D日h:m');
      //     console.log(data.msg[i].inTime);
      //     data.msg[i].yearMonth = data.msg[i].inTime.substring(0, 8);
      //     data.msg[i].date = data.msg[i].inTime.substring(8, 11);
      //     data.msg[i].time = data.msg[i].inTime.substring(11, 16);

      //     yearMonth = data.msg[i].yearMonth;
      //     if (current_month != yearMonth) {
      //       month_list.push(yearMonth);
      //       current_month = yearMonth;
      //     }
      //   }
      //   console.log(data.msg)
      //   var walletcount = data.count;
      var comment_end = false;
      if (data.count <= 15 || data.data.length < 15) {
        comment_end = true;
      }
      that.setData({
        walletsList: that.data.walletsList.concat(data.data),
        walletcount: data.count,
        comment_end: comment_end
      })
      //   wx.setStorageSync('walletcount', walletcount);
      // }else{
      //   wx.showToast({
      //     title: data.msg,
      //     icon:'loading'
      //   })
      // }


    })

  },
  //用户点击确认提现
  walletDrawal() {
    var that = this;

    var region = wx.getStorageSync('region')
    var latitude = wx.getStorageSync('latitude')
    var longitude = wx.getStorageSync('longitude')
    var phone = that.data.phone
    if (region) {
      var data = {
        txmoney: that.data.money,
        region: region,
        latitude: latitude,
        longitude: longitude,
        phone: phone
      }
      console.log(data);


      // return
      app.apiPost(app.apiList.submitTx, data, (data) => {
        if (data.status == 1) {
          that.setData({
            money: ''
          })
          money = 0;
          // that.onShow();
          page = 1;
          that.walletsList();
          that.userAccount();
          that.onPullDownRefresh();
          that.onClose();
          wx.showToast({
            title: '提现申请成功',
            duration: 1500,
            success() {}
          })
          wx.requestSubscribeMessage({
            tmplIds: ["W_2uz-_JPbxETSwVPKoreoI8tZ-3EW_oi95ICsEARtc", 'BxH6qQK__TaSpPpafujf8jau4ArLYlkw78dfSB8LjEc'],
            success: function (res) {
              console.log(res);
              if (res['W_2uz-_JPbxETSwVPKoreoI8tZ-3EW_oi95ICsEARtc'] === 'accept') {
                wx.showToast({
                  title: '订阅OK！'
                })
              }
              //成功
            },
            fail(err) {
              //失败
              console.error(err);
            }
          })

        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none'
          })
        }
      })
    } else {
      console.log('aaa')
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude,
            },
            success: function (result) {
              wx.setStorageSync('latitude', res.latitude);
              wx.setStorageSync('longitude', res.longitude);
              wx.setStorageSync('location', true);
              wx.setStorageSync('region', result.result.address_component.province + result.result.address_component.city);
            }
          });
        },
        fail: function (res) {
          wx.setStorageSync('location', false);
        }
      })
    }

    // wx.requestSubscribeMessage({
    //   tmplIds: ["BxH6qQK__TaSpPpafujf8jau4ArLYlkw78dfSB8LjEc"],
    //   success: function (res) {
    //     console.log(res);
    //     if (res['BxH6qQK__TaSpPpafujf8jau4ArLYlkw78dfSB8LjEc'] === 'accept') {
    //       wx.showToast({
    //         title: '订阅OK！'
    //       })
    //     }
    //     //成功
    //   },
    //   fail(err) {
    //     //失败
    //     console.error(err);
    //   }
    // })


  }

})