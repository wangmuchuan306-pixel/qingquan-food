// pages/setpage/setpage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  setwxinfo() {
    var that = this
    if (!that.data.headimg || that.data.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132') {
      wx.showToast({
        title: '请完善头像信息',
        icon: 'none'
      })
      return
    }
    if (!that.data.nickname || that.data.nickname == '微信用户') {
      wx.showToast({
        title: '请完善您的昵称',
        icon: 'none'
      })
      return
    }
    if (!that.data.phone) {
      wx.showToast({
        title: '请完善您的电话',
        icon: 'none'
      })
      return
    }
    app.apiPost(app.apiList.setwxinfo, {
      headimg: that.data.headimg,
      nickname: that.data.nickname,
      phone: that.data.phone,
      birthday: that.data.birthday
    }, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.msg,
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
  },
  chooseimg(e) {
    var that = this
    app.apiUpload(e.detail.avatarUrl, (res) => {
      that.setData({
        headimg: res.url.url + res.data.imgpath,
      })
    })
  },
  inname(e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  inphone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  cbirthday(e) {
    var that = this
    console.log(e)
    var birthday = e.detail.value
    wx.showModal({
      title: '提示',
      content: '您的生日为' + birthday + '，设置后不可更改',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          app.apiPost(app.apiList.setbirthday, {
            birthday
          }, (data) => {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              success() {
                that.userCenter()
              }
            })
          })
        }
      }
    })
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.data.nickname == '微信用户' && !res.data.phone) {
        setTimeout(() => {
          wx.showToast({
            title: '请修改昵称并填写手机号',
            icon: 'none',
            duration: 3000
          })
        }, 1000)
      } else if (res.data.nickname == '微信用户') {
        setTimeout(() => {
          wx.showToast({
            title: '请修改昵称',
            icon: 'none',
            duration: 3000
          })
        }, 1000)
      } else if (!res.data.phone) {
        setTimeout(() => {
          wx.showToast({
            title: '请填写手机号',
            icon: 'none',
            duration: 3000
          })
        }, 1000)
      }
      this.setData({
        headimg: res.data.headimg,
        nickname: res.data.nickname,
        phone: res.data.phone ? res.data.phone : '',
        birthday: res.data.birthday,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.userCenter()
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
    if (this.data.nickname == '微信用户' || !this.data.phone) {
      wx.navigateTo({
        url: '/pages/setpage/setpage',
      })
    }
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
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid')
    }
  }
})