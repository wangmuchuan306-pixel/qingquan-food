// pages/chooseZTDian/chooseZTDian.js
var app = getApp()
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zt: 1,
    page: 1,
    search_str: '',
  },
  //选择位置
  chooseLocation() {
    var that = this
    wx.chooseLocation({
      success(res) {
        that.setData({
          locationName: res.address,
          longitude: res.longitude,
          latitude: res.latitude,
          zt: 2,
          search:res.name
        })
        that.getztdian()
      }
    })
  },
  //选择自提点
  choztdian(e) {
    console.log(e)
    var type = e.currentTarget.dataset.type
    if (type == 1) {
      var ztdian = this.data.myztdList
    } else {
      var ztdian = e.currentTarget.dataset.info
    }
    var thispages = getCurrentPages()
    var lastpage = thispages[thispages.length - 2]
    lastpage.setData({
      ztdian
    })
    wx.setStorage({
      key: 'ztdian',
      data: ztdian,
    });
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserLocation()
    this.getwindowHigth()
  },
  getUserLocation() {
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    var that = this
    // 调用获取用户位置的 API
    wx.getLocation({
      type: 'gcj02', // 可选 'wgs84'（默认）或 'gcj02'（中国大陆）
      success: (res) => {
        that.setData({
          longitude: res.longitude, // 获取经度
          latitude: res.latitude, // 获取纬度
          search:'',
        });
        that.reverseGeocode(res.latitude, res.longitude)
        // if (that.data.zt == 1) {
        //   that.getztdianlist()
        // } else if (that.data.zt == 2) {
        that.getztdian()
        // }
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
  reverseGeocode(latitude, longitude) {
    var that = this
    const key = 'QJNBZ-4Z6CB-RBOUG-JM2ZT-AJCST-S7BEQ'; // 替换成你的腾讯地图 API 密钥
    wx.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${key}`,
      success: (res) => {
        if (res.data && res.data.result) {
          const locationName = res.data.result.address; // 获取详细地址
          that.setData({
            locationName: locationName
          });
        } else {
          wx.showToast({
            title: '获取地址失败',
            icon: 'none'
          });
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '请求地址信息失败',
          icon: 'none'
        });
      }
    });
  },
  getztdianlist() {
    var that = this
    var data = {
      page: that.data.page,
      limit: 999,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      search_str: that.data.search_str
    }
    app.apiPost(app.apiList.getztdianlist, data, (res) => {
      if (res.status) {
        var myztdList = res.data
        if (myztdList.distance) {
          myztdList.distance = (myztdList.distance / 1000).toFixed(2)
        } else {
          const coordinates = myztdList.lnginfo.split(',');
          const longitude2 = parseFloat(coordinates[0]);
          const latitude2 = parseFloat(coordinates[1]);
          myztdList.distance = util.getDistance(that.data.latitude, that.data.longitude, latitude2, longitude2)
        }
        var historyztdList = res.history
        historyztdList.forEach(v => {
          if (v.distance) {
            v.distance = (v.distance / 1000).toFixed(2)
          } else {
            const coordinates = v.lnginfo.split(',');
            const longitude2 = parseFloat(coordinates[0]);
            const latitude2 = parseFloat(coordinates[1]);
            v.distance = util.getDistance(that.data.latitude, that.data.longitude, latitude2, longitude2)
          }
        })
        that.setData({
          myztdList,
          historyztdList,
        })
        wx.hideLoading()
      }
    })
  },
  // 自提点信息
  getztdian() {
    var that = this
    var data = {
      page: that.data.page,
      limit: 999,
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      search_str: that.data.search_str
    }
    app.apiPost(app.apiList.getztdian, data, (res) => {
      if (res.status == 1) {
        var ztdianList = res.data
        ztdianList.forEach(v => {
          if (v.distance) {
            v.distance = (v.distance / 1000).toFixed(2)
          } else {
            const coordinates = v.lnginfo.split(',');
            const longitude2 = parseFloat(coordinates[0]);
            const latitude2 = parseFloat(coordinates[1]);
            v.distance = util.getDistance(that.data.latitude, that.data.longitude, latitude2, longitude2)
          }
        })
        this.setData({
          ztdianList,
        })
        wx.hideLoading()
      }
    })
  },
  choosezt(e) {
    var zt = e.currentTarget.dataset.id
    this.setData({
      zt,
    })
    this.getUserLocation()
  },
  getwindowHigth() {
    const systemInfo = wx.getWindowInfo();
    const windowHeight = systemInfo.windowHeight;
    const windowWidth = systemInfo.windowWidth;
    const scrollHeight = windowHeight * (750 / windowWidth) - 222
    this.setData({
      scrollHeight,
      windowWidth
    })
  },
  searchValue(e) {
    var that = this
    var search_str = e.detail.value
    that.setData({
      search_str,
    })
  },
  //搜索自提点
  tosearch() {
    this.setData({
      page: 1
    })
    this.getUserLocation()
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})