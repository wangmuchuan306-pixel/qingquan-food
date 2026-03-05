// pages/editAddress/editAddress.js
var app = getApp();
// var utils = require('../../../utils/util.js');
// var Api = getApp().globalData.Api;//api地址
// var helper = require('../../../utils/helper.js');//网络请求
Page({

  /**
   * 页面的初始数据
   */
  data: {
    veision: app.globalData.veision,
    url: app.globalData.url,
    isIpx: app.globalData.isIpx, //获得手机型号
    addressList: [], //默认收货地址为零
    pageType: '', //用来判断页面是否由订单页跳转
  },
  //用户点击确定新增
  addAddressinfo() {
    var that = this;
    var webData;
    var url;
    var title;
    var addressList = that.data.addressList;
    var isjinxing = true;
    for (var i = 0; i < addressList.length; i++) {
      //判断是否存在重复添加
      if (that.data.username == addressList[i].username && that.data.tel == addressList[i].phone && that.data.address + that.data.addressInfo == addressList[i].address + addressList[i].detail_address) {
        wx.showToast({
          title: '不能重复添加',
          icon: 'loading'
        })
        return;
      }
    }
    console.log(isjinxing);
    var bao = "北京";
    var cityName = that.data.cityName;
    // if (cityName.indexOf('北京') >= 0) {
    //   isjinxing = true;

    // } else {
    //   isjinxing = false;
    //   // wx.showModal({
    //   //   title: '拉菲之谜提示您',
    //   //   content: '当前仅提供北京区域内配送',
    //   //   showCancel: false,
    //   //   confirmText: '我知道了',
    //   //   success: function (res) {

    //   //   },
    //   // })
    // }
    // if (isjinxing) {
    webData = {
      username: that.data.username,
      phone: that.data.tel,
      address: that.data.address,
      street: that.data.addressstreet,
      detail_address: that.data.addressInfo,
    }
    app.apiPost(app.apiList.updateAddress, webData, (data) => {
      if (data.status == 1) {
        title = "添加成功";
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 1500,
          success(q) {
            that.setData({
              username: '',
              cityName: '',
              contact: '',
              address: '',
              addressInfo: ''
            })
          }
        })
      }
    })
    // }
  },
  getWxAddress() {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        console.log("vres.authSetting['scope.address']：", res.authSetting['scope.address'])
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              // console.log(res);
              // console.log(res.userName)
              // console.log(res.postalCode)
              // console.log(res.provinceName)
              // console.log(res.cityName)
              // console.log(res.countyName)
              // console.log(res.detailInfo)
              // console.log(res.nationalCode)
              // console.log(res.telNumber)
              that.setData({
                cityName: res.cityName,
                username: res.userName,
                tel: res.telNumber,
                address: res.countyName,
                addressInfo: res.detailInfo,
                isdefault: false
              })
              that.addAddressinfo();
            },
            fail(e) {
              console.log(e);
            }
          })
          // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问

        } else {
          if (res.authSetting['scope.address'] == false) {
            console.log("222")
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)

              }
            })
          } else {
            console.log("eee")
            wx.chooseAddress({
              success(res) {
                that.setData({
                  cityName: res.cityName,
                  username: res.userName,
                  tel: res.telNumber,
                  address: res.countyName,
                  addressInfo: res.detailInfo,
                  isdefault: false
                })
                that.addAddressinfo();
              }
            })
          }
        }
      }
    })
  },
  //用户点击默认地址
  setDefault(e) {
    console.log(e);
    var that = this;
    if (e.currentTarget.dataset.type == 1) {
      app.apiPost(app.apiList.setDefault, {
        address_id: e.currentTarget.dataset.id
      }, (data) => {
        if (data.status == 1) {
          that.onShow();
        }
      })
    }
  },
  //用户点击新建地址/编辑
  addAddress(e) {
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../addAddress/addAddress?_id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '../addAddress/addAddress',
      })
    }

  },
  //用户点击删除地址
  delAddress(e) {
    var that = this;
    console.log(e);
    wx.showModal({
      title: '提示',
      content: '您确定删除这条收货地址吗?',
      success(res) {
        if (res.confirm) {
          console.log('确定了')
          var webData = {
            address_id: e.currentTarget.dataset.id
          }
          app.apiPost(app.apiList.delAddress, webData, (data) => {
            if (data.status == 1) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500,
                success() {
                  that.onShow();
                }
              })
            }
          })
        } else {
          console.log('取消了')

        }
      }

    })
    // return

  },
  //获取收货地址
  getAddress() {
    var that = this;
    app.apiPost(app.apiList.findAddress, {}, (data) => {
      if (data.status == 1) {
        let prevPage_id = that.data.prevPage_id;
        data.data.forEach(item => {
          item.id == prevPage_id ? item.check = true : item.check = false;
        })
        that.setData({
          addressList: data.data
        })
      }
    })
  },
  //若 pageType==order
  // chooseThis(e) {
  //   console.log(e);
  //   var that = this;
  //   var pages = getCurrentPages();   //当前页面

  //   var prevPage = pages[pages.length - 2];   //上一页面
  //   var shouAddress ;
  //   for(var i=0;i<that.data.addressList.length;i++){
  //     if(e.currentTarget.dataset.id =that.data.addressList[i].id ){
  //       shouAddress = that.data.addressList[i];
  //     }
  //   }
  //   prevPage.setData({
  //     //直接给上一个页面赋值
  //     address_id: e.currentTarget.dataset.id,
  //     chooseStyle: 1,
  //     shouAddress:shouAddress
  //   });
  //   // prevPage.getAddressList();
  //   setTimeout(() => {
  //     wx.navigateBack({
  //       //返回
  //       delta: 1
  //     })
  //   }, 500);
  // },
  useThis(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    console.log('index')
    console.log(index)
    let addressList = that.data.addressList;
    let check_This = null;
    addressList.forEach((item, index_) => {
      console.log(item);
      index_ == index ? item.check = true : item.check = false;
    })
    check_This = addressList[index];
    that.setData({
      addressList
    })
    var latitude = that.data.addressList[index].latitude
    var longitude = that.data.addressList[index].longitude
    console.log(latitude, longitude)
    // return
    var pages = getCurrentPages(); //当前页面
    var prevPage = pages[pages.length - 2];
    if (prevPage.route == 'pages/lotgoodslist/lotgoodslist') {
      prevPage.setData({
        //直接给上一个页面赋值
        shouAddress: check_This,
      });
      setTimeout(() => {
        wx.navigateBack({
          //返回
          delta: 1
        })
      }, 500);
    } else {
      prevPage.setData({
        //直接给上一个页面赋值
        address_id: check_This.id,
        latitude,
        longitude,
        // chooseStyle: 1,
        shouAddress: check_This,
        index1: index
      });
      prevPage.setexpress();
      setTimeout(() => {
        wx.navigateBack({
          //返回
          delta: 1
        })
      }, 500);
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options');
    console.log(options.chooseStyle);
    var that = this;
    if (options.type) {
      that.setData({
        pageType: options.type,
        prevPage_id: options.id,
        chooseStyle: options.chooseStyle
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
    var that = this;
    that.getAddress();
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
    wx.removeStorageSync('address');
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
    return {
      path: '/pages/index/index?ruid=' + wx.getStorageSync('uid')
    }
  }
})