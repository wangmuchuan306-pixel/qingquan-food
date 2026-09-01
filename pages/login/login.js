// pages/impower/impower.js
const app = getApp()
const DEFAULT_AVATAR = 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    canSubmit: false,
    agreed: false,
  },
  // 勾选/取消勾选同意协议
  toggleAgree() {
    this.setData({
      agreed: !this.data.agreed,
    })
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
      if (res.status == 1 && res.account_switched && res.data) {
        const profileComplete = that.isProfileComplete(res.data)
        if (!app.saveSession(res.data)) {
          wx.showToast({
            title: '账号恢复失败，请稍后重试',
            icon: 'none'
          })
          return
        }
        app.clearPendingReferrer()
        that.setData({
          p_phone: res.data.phone || '',
          loginShow: !profileComplete
        }, () => {
          that.checkCanSubmit()
        })
        wx.showToast({
          title: profileComplete ? '已恢复原账号' : '已恢复原账号，请完善资料',
          icon: 'none'
        })
        if (profileComplete) {
          setTimeout(() => {
            that.finishLoginNavigation()
          }, 800)
        }
        return
      }
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
    const isValidHeadimg = tmpheadimg && tmpheadimg != DEFAULT_AVATAR
    const isValidUsername = p_username && p_username != '微信用户'
    const isValidPhone = p_phone && /^1[3-9]\d{9}$/.test(p_phone)
    const canSubmit = !!(isValidHeadimg && isValidUsername && isValidPhone)
    this.setData({ canSubmit })
  },

  isProfileComplete(userInfo) {
    return !!(userInfo &&
      userInfo.nickname != '微信用户' &&
      userInfo.headimg != DEFAULT_AVATAR &&
      userInfo.phone)
  },

  finishLoginNavigation() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      const prevPageRoute = pages[pages.length - 2].route
      const tabBarPages = ['pages/index/index', 'pages/lotgoodslist/lotgoodslist', 'pages/orderlist/orderlist', 'pages/mypage/mypage']
      if (tabBarPages.includes(prevPageRoute)) {
        wx.switchTab({
          url: '/' + prevPageRoute,
        })
      } else {
        wx.navigateBack({})
      }
      return
    }
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //修改资料
  setwxinfo() {
    var that = this
    if (!that.data.tmpheadimg || that.data.tmpheadimg == DEFAULT_AVATAR) {
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
      url: '/pages/agreement/agreement?type=service',
    })
  },

  goPrivacy() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?type=privacy',
    })
  },
  goback() {
    wx.navigateBack()
  },
  getUserProfile(e) {
    var that = this;
    // 必须由用户主动勾选同意协议后才能授权登录，不得默认同意
    if (!that.data.agreed) {
      wx.showToast({
        title: '请先阅读并勾选同意用户协议和隐私政策',
        icon: 'none',
      });
      return;
    }
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
        if (that.isProfileComplete(data.data)) {
          that.finishLoginNavigation()
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
      // 未登录时静默跳过，避免"稍后登录"返回时又被强制拉回登录页
      if(res.status === 10011){
        return;
      }
      if(res.status == 1){
        if(res.data.nickname == '微信用户' || !res.data.phone){
          wx.navigateTo({
            url: '/pages/setpage/setpage',
          })
        }
      }
    }, { requireAuth: false })
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
