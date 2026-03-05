// pages/mypage/mypage.js
const app = getApp()
import {
  base64src
} from '../../utils/base64src.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hbinfo: {
      background: 'https://qqspapi.0315678.cn/summer/hbackground.jpg',
      width: '1080rpx',
      height: '1920rpx',
      views: [{
        type: 'image',
        url: '',
        css: {
          width: '600rpx',
          height: '600rpx',
          bottom: '200rpx',
          left: '240rpx'
        }
      }]
    }
  },
    // 跳转视频号
  gotovedio(){
    wx.openChannelsUserProfile({
      finderUserName: 'sphNf8HuJnJox76'
    })
  },
  //跳转代理商工作台
  tohhr() {
    wx.navigateTo({
      url: '/pages/myhhr/myhhr',
    })
  },
  gotologin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  //跳转我的积分
  gotopoints() {
    if (this.data.userinfo) {
      wx.navigateTo({
        url: '/pages/mypoints/mypoints',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  //跳转自提点工作台
  tomyztdian() {
    wx.navigateTo({
      url: '/pages/myztdian/myztdian',
    })
  },
  //得到小程序二维码
  drawErcode() {
    var that = this;
    var data = {
      draw_type: 'userinvite',
      path: 'pages/index/index',
    }
    app.apiPost(app.apiList.drawErcode, data, (data) => {
      if (data.status == 1) {
        // var posterConfig = that.data.posterConfig;
        base64src(data.base64img.base64, res => {
          console.log(res) // 返回图片地址，直接赋值到image标签即可
          var hbinfo = that.data.hbinfo
          hbinfo.views[0].url = res
          that.setData({
            hbinfo
          })
          // posterConfig.images[1].url = res;
          // that.setData({
          //   erweima: res,
          //   posterConfig
          // });
        });
      }
    })
  },
  //生成海报
  onImgOK(e) {
    console.log(e)
    this.setData({
      hbpath: e.detail.path
    })
  },
  //保存海报
  downhb() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.hbpath,
      success() {
        that.setData({
          show: false
        })
      }
    })
  },
  showshare() {
    if (this.data.userinfo) {
      this.setData({
        show: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  callphone() {
    wx.makePhoneCall({
      phoneNumber: '18833330416',
    })
  },
  tous() {
    wx.navigateTo({
      url: '/pages/jianjie/jianjie',
    })
  },
  tovip() {
    if (wx.getStorageSync('token_new')) {
      wx.navigateTo({
        // url: '/pages/vipcenter/vipcenter',
        url: '/pages/exchangeCDK/exchangeCDK',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  toset() {
    wx.navigateTo({
      url: '/pages/setpage/setpage',
    })
  },
  tologin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  // toorder() {
  //   wx.navigateTo({
  //     url: '/pages/orderlist/orderlist',
  //   })
  // },
  myOrder(e) {
    var typeid = e.currentTarget.dataset.id
    wx.reLaunch({
      url: '/pages/orderlist/orderlist?typeid=' + typeid,
    })
  },
  collection() {
    if (this.data.userinfo) {
      wx.navigateTo({
        url: '/pages/collection/collection',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  editAddress() {
    if (this.data.userinfo) {
      wx.navigateTo({
        url: '/pages/editAddress/editAddress',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  tocard() {
    if (this.data.userinfo) {
      wx.navigateTo({
        url: '/pages/mycard/mycard',
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.status == 1) {
        var userinfo = res.data
        userinfo.phone = userinfo.phone.substring(0, 3) + '****' + userinfo.phone.substring(7)
        this.setData({
          userinfo: res.data
        })
      }
      this.drawErcode()
    })
  },
  gotojianjie(){
    wx.navigateTo({
      url: '/pages/jianjie/jianjie?id=4',
    })
  },
  gotojianjie6(){
    wx.navigateTo({
      url: '/pages/jianjie/jianjie?id=6',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid'),
      imageUrl: '/images/logo.jpg',
      title: '清泉食品'
    }
  }
})