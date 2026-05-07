// packageB/pages/myhelp/myhelp.js
var app = getApp();
import {
  base64src
} from '../../utils/base64src';
const posterConfig = {
  jdConfig: {
    width: 750,
    height: 1334,
    backgroundColor: '#ffffff',
    debug: false,
    pixelRatio: 1,
    blocks: [{ //橙色边框
      width: 670,
      height: 254,
      x: 40,
      y: 914,
      borderWidth: 4,
      borderColor: '#ff6600',
      borderRadius: 32,
      backgroundColor: '#ffffff',
    }

    ],

    images: [ //商品图片

      { //冀唐清泉二维码
        width: 300,
        height: 300,
        x: 223,
        y: 495,
        url: '',
        zIndex: 2,
      },
      {
        width: 750,
        height: 1334,
        x: 0,
        y: 0,
        url: '/images/helpshare.jpg',
        zIndex: 1,
      }
    ]

  },

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpn: false,
    veision: app.globalData.veision,
    url: app.globalData.url,
    endTime: 0,
    endTimeArr: {},
    timeend: 0, //倒计时是否结束 0-结束
    ishelp: false, //是否开始助力
    helpnum: 0, //已助力人数
    isThelp: false, //是否帮别人助力
    headimg: '', //头像
    isself: 0, //isThelp=true   当前人是否已经帮忙助力过
    issuccess: 0, //当前助力是否已完成 1-已完成  
    id: 0, //列表id
    title: '唐山本地生活就上冀唐清泉！便宜实惠还给钱～！',
    disabled: false,
    posterConfig: posterConfig.jdConfig, //调用写好的海报数据
  },
  gohome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  //goWebView
  goWebView() {
    console.log(1);
    wx.navigateTo({
      url: '/pages/webView/webView?id=4',
    })
  },
  gogoodsinfo() {
    var that = this
    wx.navigateTo({
      url: '/packageA/pages/goodsInfo/goodsInfo?id=' + that.data.signset.goods_id,
    })
  },
  gocoupon() {
    wx.navigateTo({
      url: '/pages/mypoints/mypoints',
    })
  },
  getsignset() {
    var that = this
    app.apiPost(app.apiList.getsignSet, {}, (res) => {
      if (res.status == 1) {
        that.setData({
          signset: res.data
        })
      }
    })
  },
  bindgetPhoneNumber(e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.login({
        success: function (p) {
          //  // console.log(p);
          var code = p.code;
          that.setData({
            code: code
          })

          wx.checkSession({
            success() {
              //session_key 未过期，并且在本生命周期一直有效
              var data = {
                encryptedData: encodeURIComponent(e.detail.encryptedData),
                iv: e.detail.iv,
                code: that.data.code,
              }
              app.apiPost(app.apiList.wxphone, data, (res) => {
                if (res.status == 1) {
                  that.startLxZhuli();
                  that.KanYiDaoInfo(); //助力列表
                }
              })
            },
            fail() { }
          })
        }
      })
    }
  },

  // bindGetUserInfo: function (e) {
  //   this.setData({
  //     disabled:true
  //   })
  //   console.log(e);
  //   if (e.detail.userInfo) {
  //     var that = this;
  //     that.userLogin();
  //   } else {
  //     //用户按了拒绝按钮
  //     wx.showModal({
  //       title: '警告',
  //       content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
  //       showCancel: false,
  //       confirmText: '返回授权',
  //       success: function (res) {
  //         if (res.confirm) {
  //           // console.log('用户点击了“返回授权”')
  //         }
  //       }
  //     });
  //   }
  // },

  // 用户登陆
  userLogin: function () {
    console.log('登陆');
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res);
        var code = res.code
        // success
        // 获取用户信息
        wx.getUserInfo({
          lang: "zh_CN",
          success: function (data) {
            console.log(data);
            typeof cb == "function" && cb(getApp().globalData.userInfo)
            var rawData = data.rawData;
            var signature = data.signature;
            var encryptedData = data.encryptedData;
            var iv = data.iv;
            var ruid = '';
            //邀请人的id
            if (app.get('ruid')) {
              ruid = app.get('ruid');
            }
            var data = {
              code: code,
              rawData: rawData,
              signature: signature,
              iv: iv,
              encryptedData: encryptedData,
              origin_id: ruid
            }
            console.log(data);
            app.apiPost(app.apiList.login, data, (data) => {
              if (data.status == 1) {
                var random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 5 - 1));
                console.log(random)
                console.log(String(random) + data.data.id)
                var id = String(random) + data.data.id;
                wx.setStorageSync('token_new', id);
                wx.setStorageSync('userinfo', data.data);
                wx.setStorageSync('uid', data.data.id);
                //帮助好友助力
                that.startLxZhuli();
                that.KanYiDaoInfo(); //助力列表
              }
            })
          }
        });
      }
    });
  },
  //点击我也要助力领奖
  gohelp() {
    console.log('我也要助力')
    wx.showToast({
      title: '正在加载...',
      icon: 'none'
    })
    this.setData({
      isThelp: false,
      gohelp: false,
      issuccess: 0,
      timeend: 1,
      laxin_id: 0,
      laxin_id1: 0,
      headimg: app.get('userinfo').headimg,
      helpid: app.get('uid'),
    })

    this.addLaxin();
  },
  //点击帮助好友助力
  startLxZhuli() {
    var that = this;
    if (that.data.debounceFlag) return;
    that.setData({ debounceFlag: true });
    app.apiPost(app.apiList.KanYiDao, {
      user_id: that.data.helpid,
    }, (data) => {
      if (data.status == 1) {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
        that.KanYiDaoInfo(); //助力列表
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none'
        })
      }
      setTimeout(() => {
        that.setData({ debounceFlag: false });
      }, 500);
      return;
      if (data.status == 1) {
        if (app.get('userinfo')) {
          this.setData({
            headimg: app.get('userinfo').headimg
          })
        }
        that.setData({
          isself: 1, //是否已助力  是
          disabled: true
        })
        wx.showToast({
          title: '助力成功',
          duration: 1500
        })
        that.KanYiDaoInfo();
      }
    })
  },
  //点击喊好友
  addLaxin() {
    var that = this;
    // app.util.isLogin({
    //   success(){
    app.apiPost(app.apiList.addLaxin, {}, (data) => {
      console.log(data)
      if (data.status == 1) {
        that.setData({
          ishelp: true, //是否开始助力
          timeend: 1, //重新开启倒计时
          // laxin_id:that.data.md5id
        })
      }
      that.KanYiDaoInfo()
    })
    // }
    // })

  },
  //用户点击收入跳转到我的钱包
  goWallet() {
    var that = this;
    app.util.isLogin({
      success() {
        wx.navigateTo({
          url: '/packageB/pages/myWallet/myWallet',
        })
      }
    })

  },
  KanYiDaoInfo() {
    var that = this;
    var data = {
      user_id: that.data.helpid || app.get('uid'),
    }
    app.apiPost(app.apiList.KanYiDaoInfo, data, (res) => {
      base64src(res.data.KanYiDaoInfo.share_info.help_shareimg, url => {
        app.apiUpload(url, (data) => {
          that.setData({
            shareimg: data.url.url + data.data.imgpath, //分享图片
          })
        })
      });
      base64src(res.data.KanYiDaoInfo.share_info.help_background, url => {
        app.apiUpload(url, (data) => {
          that.setData({
            help_background: data.url.url + data.data.imgpath, //分享图片
          })
        })
      });
      that.setData({
        sharetitle: res.data.KanYiDaoInfo.share_info.help_sharetitle,
        helpnum: res.data.helpKanList.length,
        neednum: Number(res.data.needPersonNum),
        helpList: res.data.helpKanList,
        headimg: res.data.KanYiDaoInfo.userInfo.headimg,
        laxin_status: res.data.KanYiDaoInfo.laxin_status || 0, //助力状态  0-未开始 1-进行中 2-已结束 3-已完成
        integralNum: res.data.integralNum,
        timeend: 1,
      })
      res.data.helpKanList.forEach(v => {
        if (app.get('uid') == v.userInfo.id) {
          that.setData({
            isuserhelp: true,
          })
        }
      });
      if (res.data.KanYiDaoInfo.laxin_status) {
        that.setData({
          ishelp: true,
          endTime: res.data.KanYiDaoInfo.end_time
        })
        if (res.data.KanYiDaoInfo.laxin_status == 3) {
          that.setData({
            issuccess: 1,
            helptext: '成功',
            share: false,
          })
        }
        if (res.data.KanYiDaoInfo.laxin_status == 1) {
          if (that.data.helpid && that.data.helpid != app.get('uid')) {
            res.data.helpKanList.forEach(v => {
              if (app.get('uid') == v.userid) {
                that.setData({
                  ishelped: true,
                })
              }
            });
          }
        }
        that.drawErcode()
        var endTime = res.data.KanYiDaoInfo.end_time;
        if (endTime) {
          // 转换为次日凌晨时间戳
          const endDate = new Date(endTime * 1000);
          endDate.setHours(24, 0, 0, 0); // 设置为次日的00:00:00
          // 当前日期凌晨时间戳
          const nowDate = new Date().setHours(0, 0, 0, 0);

          if (nowDate < endDate.getTime()) {
            that.countDown();
          } else if (nowDate >= endDate.getTime()) {
            that.setData({
              ishelp: false,
              issuccess: 0,
              helpnum: 0,
              helpList: [],
              yeshelp: true,
              helptext: '超时',
              share: false,
            })
          }
        }
      } else {
        that.setData({
          ishelp: false,
        })
      }
    })
  },
  //助力列表
  laxinList() {
    var that = this;
    app.apiPost(app.apiList.laxinList, {
      laxin_uniqid: that.data.laxin_id1
    }, (data) => {
      console.log(data)
      if (data.status == 1) {
        that.setData({
          my_start: data.info.my_start,
          mylaxin_id: data.info.my_laxin_id,
        })
        if (data.info.isstart == 0) {
          that.setData({
            ishelp: false, //未开始
            timeend: data.info.isendtime,
            helpList: [],
            isself: 0,
            helpnum: data.data.length,
          })
          return;
        }
        that.setData({
          helpnum: data.data.length,
          helpList: data.data,
          isself: data.info.self,
          issuccess: data.info.success,
          ishelp: true,
          headimg: data.info.headimg,
          timeend: data.info.isendtime,
          iscantext: data.iscantext,
        })
        if (data.info.lxres.end_time) {
          that.setData({
            endTime: data.info.lxres.end_time,
            laxin_id: data.info.lxres.uniqid,
            mlaxin_id: data.info.lxres.id
          })
          that.drawErcode()
          that.countDown();
        }
      }
    })
  },
  //活动悬浮 抖动效果
  active_dou() {
    var that = this;
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationDatas_dou = wx.createAnimation({
      duration: 1000, // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) { }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationDatas_dou.scale(1.15).step();
      } else {
        this.animationDatas_dou.scale(1.0).step();
      }
      this.setData({
        animationDatas_dou: this.animationDatas_dou.export() //输出动画
      });

      circleCount++;
      // console.log(circleCount)
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 1000);
  },
  /**
   * 倒计时
   */
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.isWarehouse;
    let endTimeArr = this.data.endTimeArr;
    let endTime = this.data.endTime;
    // 对结束时间进行处理渲染到页面
    var endTimeArr1 = {};
    // console.log(endTime)
    // console.log(newTime)

    if (endTime * 1000 - newTime > 0) {
      let time = (endTime * 1000 - newTime) / 1000;
      // 获取天、时、分、秒
      // let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      // v.d = this.timeFormat(day);
      endTimeArr1 = {
        h: this.timeFormat(hou),
        m: this.timeFormat(min),
        s: this.timeFormat(sec),
        endTime: this.timeFormat(hou) + '：' + this.timeFormat(min) + "：" + this.timeFormat(sec),
      }
      this.setData({
        endTimeArr: endTimeArr1
      })
      // return;

    } else {
      //活动已结束，全部设置为'00'
      endTimeArr1 = {
        h: '00',
        m: '00',
        s: '00',
        endTime: "00：00：00",
      }
      this.setData({
        endTimeArr: endTimeArr1,
        timeend: 0
      })
      // v.h = '00';
      // v.m = '00';
      // v.s = '00';
      // v.end_time = "00：00：00" ;
    }

    setTimeout(this.countDown, 1000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let newTime = new Date().getTime();
    console.log(newTime)
    // var md5id = utilMd5.hexMD5(newTime); 
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
        guid += "-";
    }
    this.active_dou();
    // this.getsignset();
    // this.roundTxt()
    this.setData({
      md5id: guid
    })
    console.log(options);

    // this.laxinList()
    if (options.uid) {
      if (options.uid == app.get('userinfo').id) {
        this.setData({
          isThelp: false
        })
        //查询助力列表
        this.KanYiDaoInfo()
      } else {
        wx.setStorageSync('ruid', options.uid);
        this.setData({
          isThelp: true,
          helpid: options.uid,
        })
        //查询助力列表
        this.KanYiDaoInfo()

      }
    } else if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      if (scene != 'undefined') {
        //邀请人的id
        var arr = scene.split("&");
        if (arr[0] == app.get('userinfo').id) {
          this.setData({
            isThelp: false
          })
          //查询助力列表
          this.KanYiDaoInfo()
        } else {
          wx.setStorageSync('ruid', arr[0]);
          this.setData({
            isThelp: true,
            helpid: arr[0]
          })
          //查询加密id
          this.jmhelpid(arr[0])
        }
      }
    } else {
      console.log(1);

      //查询助力列表
      this.KanYiDaoInfo()
    }
    if (!app.get('token_new')) {
      this.setData({
        showkan: true,
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    console.log(options.id)
    console.log(app.get('iphoneType').substring(0, 6))
    if (app.get('iphoneType').substring(0, 6) == 'iPhone') {
      this.setData({
        isIpn: true
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
    if (app.get('userinfo')) {
      this.setData({
        headimg: app.get('userinfo').headimg
      })
    }
    if (this.data.showkan) {
      this.KanYiDaoInfo()
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
  //随机分享内容
  roundTxt() {
    return;
    app.apiPost(app.apiList.roundTxt, {
      type: 'lxtxt'
    }, (data) => {
      this.setData({
        title: data.data.desc
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var that = this;
    var uid = app.get('uid');
    if (that.data.laxin_status == 1) {
      return {
        title: that.data.sharetitle,
        path: '/pages/myhelp/myhelp?uid=' + uid,
        imageUrl: that.data.shareimg, // 可以更换分享的图片  助力图片
      }
    } else {
      return {
        title: that.data.sharetitle,
        path: '/pages/myhelp/myhelp',
        imageUrl: that.data.shareimg, // 可以更换分享的图片  助力图片
      }
    }
  },
  //分享到朋友圈
  onShareTimeline() {
    var that = this;
    var id = that.data.laxin_id;
    if (that.data.signset.help_sharetitle) {
      var title = that.data.signset.help_sharetitle
      var shareimg = that.data.signset.help_shareimg2
    } else {
      var title = that.data.title
      var shareimg = app.globalData.url + "/summer/zlfx.jpg"
    }
    //点击右上角
    //判断是否帮别人助力
    if (that.data.isThelp) {
      id = that.data.laxin_id1;
      //帮别人分享助力
      return {
        title: title,
        query: 'id=' + id + '&uid=' + that.data.isThelpuid,
        imageUrl: shareimg, // 可以更换分享的图片  助力图片
      }
    }
    //判断助力是否发起
    if (that.data.ishelp) {
      //已发起
      return {
        title: title,
        query: 'id=' + id + '&uid=' + app.get('userinfo').id,
        imageUrl: shareimg, // 可以更换分享的图片  助力图片
      }
    }
    //未发起
    return {
      title: title,
      query: '',
      imageUrl: shareimg, // 可以更换分享的图片  助力图片
    }
  },
  //用户点击分享按钮
  chooseShare(e) {
    var that = this;
    if (!app.get('token_new')) {
      wx.showModal({
        title: '冀唐清泉提示您',
        content: '请绑登录后操作',
        showCancel: true,
        cancelText: '取消',
        confirmText: '去登录',
        success: function (res) {
          if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        },
      })
      return;
    }
    if (e.target.dataset.type == "me") {
      that.gohelp();
    } else {
      if (!that.data.ishelp || !that.data.timeend) {
        that.addLaxin();
      }
    }
    //判断助力是否已开始

    that.setData({
      share: true
    });


  },
  //生成海报
  onPosterSuccess(e) {
    var that = this;
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1500
    })
    console.log(e);
    const {
      detail
    } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    });
    that.onClose();
  },
  onPosterFail(err) {
    console.error(err);
  },
  onClose() {
    this.setData({
      show: false,
      showspell: false,
      share: false
    });
  },
  //得到小程序二维码
  drawErcode() {
    var that = this;
    var id = app.get('uid');
    if (!app.get('token_new')) {
      return;
    }

    var data = {
      draw_type: 'help',
      path: 'pages/myhelp/myhelp',
      id: id
    }
    app.apiPost(app.apiList.drawErcode, data, (data) => {
      if (data.status == 1) {
        var posterConfig = that.data.posterConfig;
        base64src(data.base64img.base64, res => {
          console.log(res) // 返回图片地址，直接赋值到image标签即可
          posterConfig.images[0].url = res;
          that.setData({
            erweima: res,
            posterConfig
          });
          console.log(posterConfig)
        });
      }
    })
  },
  //他人id
  jmhelpid(id) {
    var that = this
    app.apiPost(app.apiList.jmhelpid, {
      id: id
    }, (data) => {
      if (data.status == 1) {
        that.setData({
          laxin_id1: data.data
        })
        //查询助力列表
        this.KanYiDaoInfo()
      }
    })
  }
})