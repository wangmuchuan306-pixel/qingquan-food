// pages/impower/impower.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //获取头像
  chooseloge(e) {
    var that = this
    var tmpheadimg = e.detail.avatarUrl
    that.setData({
      tmpheadimg,
    })
  },
  //获取手机号
  getphone(e) {
    var that = this
    app.apiPost(app.apiList.wxphone, {
      code: e.detail.code
    }, (res) => {
      console.log(res);
      that.setData({
        p_phone: res.data.phone
      })
    })
  },
  //输入手机号
  inphone(e) {
    this.setData({
      p_phone: e.detail.value
    })
  },
  //获取昵称
  inputsdf() {
    this.setData({
      name: true,
    })
  },
  //输入昵称
  inickname(e) {
    this.setData({
      p_username: e.detail.value
    })
  },
  //修改资料
  setwxinfo() {
    var that = this
    if (!that.data.tmpheadimg || that.data.tmpheadimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132') {
      wx.showToast({
        title: '请完善头像信息',
        icon: 'none'
      })
      return
    }
    if (!that.data.p_username || that.data.p_username == '微信用户') {
      wx.showToast({
        title: '请完善您的昵称',
        icon: 'none'
      })
      return
    }
    if (!that.data.p_phone) {
      wx.showToast({
        title: '请完善您的电话',
        icon: 'none'
      })
      return
    }
    app.apiUpload(that.data.tmpheadimg, (data) => {
      if (data.status == 1) {
        app.apiPost(app.apiList.setwxinfo, {
          headimg: data.url.url + data.data.imgpath,
          nickname: that.data.p_username,
          phone: that.data.p_phone,
        }, (res) => {
          if (res.status == 1) {
            wx.showToast({
              title: '登录成功',
              icon: 'none',
              success() {
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
              }
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        })
      }
    })

  },
  //用户点击用户协议
  goWebview() {
    wx.navigateTo({
      url: '/pages/webView/webView?id=2',
    })
  },
  goback() {
    wx.navigateBack()
  },
  getUserProfile(e) {
    var that = this;
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (data) => {
        console.log(data)
        //修改用户信息
        var userinfo = {
          nickname: data.userInfo.nickName,
          headimg: data.userInfo.avatarUrl,
          city: data.userInfo.city,
          province: data.userInfo.province,
          sex: data.userInfo.gender
        }
        that.setData({
          userinfo
        })
        wx.showLoading({
          title: '请稍等',
          mask: true,
        })
        that.userLogin()
        return;
        app.apiPost(app.apiList.userUpdate, data, (data) => {
          if (data.status == 1) {
            //缓存是否是新用户字段
            if (that.data.navtype == 1) {
              wx.redirectTo({
                url: that.data.navurl
              })
            } else if (that.data.navtype == 2) {
              wx.switchTab({
                url: that.data.navurl
              })
            } else {
              wx.navigateBack({})
            }
          }
        })
      },
      fail(re) {
        wx.showToast({
          title: '请升级微信',
          icon: 'none'
        })
      }
    })
  },
  // 用户登陆
  userLogin: function () {
    // wx.hideLoading({})
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code
        console.log(code)
        // 获取用户信息
        wx.getUserInfo({
          lang: "zh_CN",
          success: function (data) {
            var rawData = data.rawData;
            var signature = data.signature;
            var encryptedData = data.encryptedData;
            var iv = data.iv;
            that.gouserinfo(code, rawData, signature, encryptedData, iv)
          },
        });
      },
    });
  },
  gouserinfo(code, rawData, signature, encryptedData, iv) {
    var that = this;
    typeof cb == "function" && cb(getApp().globalData.userInfo)

    var ruid = '';
    //邀请人的id
    if (app.get('ruid')) {
      ruid = app.get('ruid');
    }
    // console.log(ruid)
    // //如果有邀请码  则传邀请码
    // if (that.data.origin_id) {
    //   ruid = that.data.origin_id;
    // }
    // if (that.data.invite_id) {
    //   ruid = that.data.invite_id;
    // }
    console.log('去授权啦')
    console.log('ruid' + ruid)
    var userinfo = that.data.userinfo
    // userinfo['nickname'] = 'Â随心'
    var data = {
      code: code,
      rawData: rawData,
      signature: signature,
      iv: iv,
      region: that.data.region,
      region2: '132',
      encryptedData: encryptedData,
      origin_id: ruid, //邀请码、邀请人id
      // invite_id: that.data.invite_id,
      // region: wx.getStorageSync('region'),
      userinfo: userinfo
    }
    console.log(data)
    app.apiPost(app.apiList.login, data, (data) => {
      console.log(data)
      console.log('请求授权')
      wx.hideLoading({})

      if (data.status == 1) {
        console.log(1111)
        data.data.phone ? wx.setStorageSync('userPhone', data.data.phone) : "";
        //缓存是否是新用户字段
        var random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 5 - 1));
        var id = String(random) + data.data.id;
        wx.setStorageSync('token_new', id);
        wx.setStorageSync('userinfo', data.data);
        wx.setStorageSync('uid', data.data.id);
        that.setData({
          origin_id: ruid,
        })
        // that.setData({
        //   loginShow: true
        // })
        // return
        if (data.data.nickname != '微信用户' && data.data.headimg != 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' && data.data.phone) {
          wx.navigateBack({});
        } else {
          that.setData({
            loginShow: true
          })
        }
        // if (that.data.origin_id || that.data.invite_id) {
        //   //检测变量A  navigateback
        //   if (app.get('xburl')) {
        //     app.rm('xburl')
        //     console.log('ccc')
        //     wx.navigateBack({});
        //   } else {
        //     console.log('ddd')
        //     wx.switchTab({
        //       url: '/pages/index/index',
        //     })
        //   }

        //   // }

        // } else {
        //   // if (that.data.useUserProfile) {
        //   //   that.setData({
        //   //     navtype: 3
        //   //   })
        //   // } else {
        //   wx.navigateBack({});
        //   // }
        // }
      }
    })
  },
  closePopup() {
    this.setData({
      loginShow: false,
    })
    wx.removeStorageSync('token_new')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = options.url ?? 0
    var url = options.url ?? 0

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
    app.apiPost(app.apiList.userCenter,{},(res)=>{
      if(res.status == 1){
        if(res.data.nickname == '微信用户' || !res.data.phone){
          wx.navigateTo({
            url: '/pages/setpage/setpage',
          })
        }
      }
    })
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

  }
})