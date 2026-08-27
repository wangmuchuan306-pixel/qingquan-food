// pages/impower/impower.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    canSubmit: false,
  },
  //获取头像
  chooseloge(e) {
    var that = this
    var tmpheadimg = e.detail.avatarUrl
    that.setData({
      tmpheadimg,
    }, () => {
      that.checkCanSubmit()
    })
  },
  //获取手机号
  getphone(e) {
    var that = this
    if (!e.detail.code) return
    app.apiPost(app.apiList.wxphone, {
      code: e.detail.code
    }, (res) => {
      if (res.status == 1 && res.data.phone) {
        that.setData({
          p_phone: res.data.phone
        }, () => {
          that.checkCanSubmit()
        })
      }
    })
  },
  //输入手机号
  inphone(e) {
    this.setData({
      p_phone: e.detail.value
    }, () => {
      this.checkCanSubmit()
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
    }, () => {
      this.checkCanSubmit()
    })
  },

  checkCanSubmit() {
    const { tmpheadimg, p_username, p_phone } = this.data
    const isValidHeadimg = tmpheadimg && tmpheadimg != 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
    const isValidUsername = p_username && p_username != '微信用户'
    const isValidPhone = p_phone && /^1[3-9]\d{9}$/.test(p_phone)
    const canSubmit = !!(isValidHeadimg && isValidUsername && isValidPhone)
    this.setData({ canSubmit })
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
      url: '/pages/jianjie/jianjie?id=20',
    })
  },

  goPrivacy() {
    wx.navigateTo({
      url: '/pages/jianjie/jianjie?id=21',
    })
  },
  goback() {
    wx.navigateBack()
  },
  getUserProfile(e) {
    var that = this;
    that.setData({ loading: true });
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (data) => {
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
        that.userLogin()
      },
      fail(re) {
        that.setData({ loading: false });
        wx.showToast({
          title: '请授权登录',
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

    // 推荐人只能来自本次未登录状态下的有效分享入口
    var ruid = app.getPendingReferrer();
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
    // 登录前原子清空旧账号会话，但保留本次待消费的推荐人
    app.clearSession({ clearReferrer: false })
    app.apiPost(app.apiList.login, data, (data) => {
      console.log(data)
      that.setData({ loading: false })

      if (data.status == 1) {
        // 用后端签发的真实 token 建立会话（兼容顶层/内层两种返回结构）
        var session = data.data || {};
        if (!session.token && !session.access_token && !session.accessToken) {
          session.token = data.token || data.access_token || data.accessToken;
        }
        var sessionSaved = app.saveSession(session);
        if (!sessionSaved) {
          wx.showToast({
            title: '登录会话建立失败，请稍后重试',
            icon: 'none'
          })
          return
        }
        // 推荐关系仅允许消费一次，避免后续账号复用
        app.clearPendingReferrer();
        that.setData({
          origin_id: ruid,
        })
        // that.setData({
        //   loginShow: true
        // })
        // return
        if (data.data.nickname != '微信用户' && data.data.headimg != 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' && data.data.phone) {
          // 判断是否从 tabBar 页面跳转过来
          const pages = getCurrentPages();
          if (pages.length > 1) {
            const prevPage = pages[pages.length - 2];
            const prevPageRoute = prevPage.route;
            // 如果上一页是 tabBar 页面，使用 switchTab 返回
            const tabBarPages = ['pages/index/index', 'pages/lotgoodslist/lotgoodslist', 'pages/orderlist/orderlist', 'pages/mypage/mypage'];
            if (tabBarPages.includes(prevPageRoute)) {
              wx.switchTab({
                url: '/' + prevPageRoute,
              });
            } else {
              wx.navigateBack({});
            }
          } else {
            // 如果没有上一页，默认跳转到首页
            wx.switchTab({
              url: '/pages/index/index',
            });
          }
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
    app.clearSession()
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
