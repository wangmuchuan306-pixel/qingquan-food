// pages/mypage/mypage.js
const app = getApp()
const tab_bar = require('../../custom-tab-bar/utils/tab-bar.js')
import { base64src } from '../../utils/base64src.js'

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
        url: '/images/logo.png',
        css: {
          width: '350rpx',
          height: '350rpx',
          top: '475rpx',
          left: '365rpx',
          background: '#fff'
        }
      }, {
        type: 'image',
        url: '',
        css: {
          width: '370rpx',
          height: '370rpx',
          bottom: '630rpx',
          left: '355rpx',
          background: '#fff'
        }
      }]
    },
    loading: false
  },

  /**
   * 检查用户是否已登录
   * @returns {boolean}
   */
  checkLogin() {
    if (!this.data.userinfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/login/login' });
          }, 1000);
        }
      });
      return false;
    }
    return true;
  },

  /**
   * 跳转视频号
   */
  gotovedio() {
    wx.openChannelsUserProfile({
      finderUserName: 'sphNf8HuJnJox76'
    });
  },

  /**
   * 跳转代理商工作台
   */
  tohhr() {
    wx.navigateTo({ url: '/pages/myhhr/myhhr' });
  },

  /**
   * 跳转登录页
   */
  gotologin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  /**
   * 跳转我的积分
   */
  gotopoints() {
    if (!this.checkLogin()) return;
    wx.navigateTo({ url: '/pages/mypoints/mypoints' });
  },
  /**
   * 跳转自提点工作台
   */
  tomyztdian() {
    wx.navigateTo({ url: '/pages/myztdian/myztdian' });
  },

  /**
   * 生成小程序二维码
   */
  drawErcode() {
    app.apiPost(app.apiList.drawErcode, {
      draw_type: 'userinvite',
      path: 'pages/index/index',
    }, (res) => {
      if (res.status === 1) {
        base64src(res.base64img.base64, (imgPath) => {
          const hbinfo = { ...this.data.hbinfo };
          hbinfo.views[1].url = imgPath;
          this.setData({ hbinfo });
        });
      }
    });
  },

  /**
   * 海报生成完成回调
   */
  onImgOK(e) {
    this.setData({ hbpath: e.detail.path });
  },

  /**
   * 保存海报到相册
   */
  downhb() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.hbpath,
      success: () => {
        wx.showToast({ title: '保存成功', icon: 'success' });
        this.setData({ show: false });
      },
      fail: () => {
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  /**
   * 显示分享弹窗
   */
  showshare() {
    if (!this.checkLogin()) return;
    this.setData({ show: true });
    tab_bar.changeTabBar(0);
  },

  /**
   * 关闭分享弹窗
   */
  onClose() {
    this.setData({ show: false });
    tab_bar.changeTabBar(1);
  },

  /**
   * 拨打电话
   */
  callphone() {
    wx.makePhoneCall({ phoneNumber: '18833330416' });
  },

  /**
   * 跳转关于我们
   */
  tous() {
    wx.navigateTo({ url: '/pages/jianjie/jianjie?id=17' });
  },

  /**
   * 跳转会员中心
   */
  tovip() {
    if (!this.checkLogin()) return;
    wx.navigateTo({ url: '/pages/exchangeCDK/exchangeCDK' });
  },

  /**
   * 跳转设置页面
   */
  toset() {
    wx.navigateTo({ url: '/pages/setpage/setpage' });
  },

  /**
   * 跳转登录页（已废弃，使用 gotologin）
   */
  tologin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  /**
   * 跳转订单列表
   */
  myOrder(e) {
    const typeid = e.currentTarget.dataset.id;
    wx.reLaunch({ url: '/pages/orderlist/orderlist?typeid=' + typeid });
  },

  /**
   * 跳转收藏页面
   */
  collection() {
    if (!this.checkLogin()) return;
    wx.navigateTo({ url: '/pages/collection/collection' });
  },

  /**
   * 跳转地址编辑页面
   */
  editAddress() {
    if (!this.checkLogin()) return;
    wx.navigateTo({ url: '/pages/editAddress/editAddress' });
  },

  /**
   * 跳转我的卡包
   */
  tocard() {
    if (!this.checkLogin()) return;
    wx.navigateTo({ url: '/pages/mycard/mycard' });
  },

  /**
   * 获取用户中心信息
   */
  userCenter() {
    this.setData({ loading: true });
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      this.setData({ loading: false });
      if (res.status === 10011) {
        this.setData({ userinfo: null });
        return;
      }
      if (res.status === 1) {
        const userinfo = { ...res.data };
        if (userinfo.phone && userinfo.phone.length >= 11) {
          userinfo.phone = userinfo.phone.substring(0, 3) + '****' + userinfo.phone.substring(7);
        }
        this.setData({ userinfo });
      }
      this.drawErcode();
    }, { showLoading: false, requireAuth: false });
  },
  gotojianjie() {
    wx.navigateTo({
      url: '/pages/jianjie/jianjie?id=19',
    })
  },
  gotojianjie6() {
    wx.navigateTo({
      url: '/pages/jianjie/jianjie?id=19',
    })
  },
  logout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearSession()
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }
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
    tab_bar.getTab(3)
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
      title: '冀唐清泉'
    }
  }
})
