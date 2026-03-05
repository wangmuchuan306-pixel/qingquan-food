// pages/addAddress/addAddress.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx, //获得手机型号
    sex: '', //性别默认为空
    address: '',
    default: 2,
    addressstreet: '',
    addressInfo: '',
    isdefault: false,
    veision: app.globalData.veision,
    url: app.globalData.url
  },
  mapView: function () {

    var that = this
    wx.getSetting({
      success(e) {
        console.log(e)
        if (!e.authSetting['scope.address']) {
          wx.showModal({
            title: '清泉食品',
            content: '请授权地理位置以继续使用',
            showCancel: true,
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                wx.openSetting({
                  success: (a) => {
                    console.log(a)
                    if (a.authSetting['scope.address']) {
                      wx.setStorageSync('location', true);
                      that.chalocal()
                    } else {

                    }
                  }
                })
              }

            },
          })
        }else{
          that.chalocal()
        }
      }
    })

  },
  chalocal(){
    var that = this
    wx.chooseLocation({
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      success(res) {
        console.error('res')
        console.log(res)
        that.setData({
          address: res.name,
          addressstreet: res.address,
          longitudes: res.longitude,
          latitudes: res.latitude,
        })
      },
      fail(req){
        console.log(req)
      }

    })
  },
  //用户点击选择地址
  getposition() {
    if (wx.getStorageSync('location') == true) {
      wx.navigateTo({
        url: '../position/position',
      })
    } else {
      wx.showModal({
        title: '清泉食品',
        content: '请授权地理位置以继续使用',
        showCancel: true,
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            wx.openSetting({
              success: (a) => {
                console.log(a)
                if (a.authSetting['scope.userLocation']) {
                  wx.setStorageSync('location', true);
                  wx.showToast({
                    title: '授权成功',
                  })
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'loading'
                  })
                }
              }
            })
          }

        },
      })
    }

  },
  //获取用户输入的文字
  getInput(e) {
    console.log(e);
    var that = this;
    if (e.currentTarget.dataset.type == "name") {
      var username = e.detail.value;
      that.setData({
        username: username
      })
    }
    if (e.currentTarget.dataset.type == "tel") {
      var tel = e.detail.value;
      that.setData({
        tel: tel
      })
    }
    if (e.currentTarget.dataset.type == "addressInfo") {
      var addressInfo = e.detail.value;
      that.setData({
        addressInfo: addressInfo
      })
    }

  },
  //用户点击确定新增
  addAddress() {
    var that = this;
    var sex = '';

    // if (that.data.sex == "wuman") {
    //   sex = 0;
    // } else if (that.data.sex == "man") {
    //   sex = 1;
    // }
    var webData;
    var title;
    webData = {
      latitude: that.data.latitudes,
      longitude: that.data.longitudes,
      username: that.data.username,
      phone: that.data.tel,
      address: that.data.address,
      street: that.data.addressstreet,
      detail_address: that.data.addressInfo,
      default: that.data.default
    }
    if (that.data.infoid) {
      title = "修改成功";
      webData['address_id'] = that.data.infoid;
    } else {
      title = "添加成功";
    }

    app.apiPost(app.apiList.updateAddress, webData, (data) => {
      if (data.status == 1) {
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 1500,
          success(q) {
            that.setData({
              username: '',
              sex: '',
              contact: '',
              address: '',
              addressstreet: '',
              addressInfo: ''
            })
            //清除位置缓存
            wx.navigateBack({
              //返回
              delta: 1
            })
          }
        })
      }
    })
  },
  getPhoneNumber(e) {
    var that = this
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
      return false;
    }
    wx.login({
      success: (res) => {
        var loginCode = res.code;
        let data = {
          code: loginCode,
          encryptedData: encodeURIComponent(e.detail.encryptedData),
          type: 2,
          iv: e.detail.iv
        }
        //session_key 未过期，并且在本生命周期一直有效
        app.apiPost(app.apiList.wxphone, data, (res) => {
          if (res.status == 1) {
            that.setData({
              tel: res.data.phone
            })
            // 付款
            // that.addOrder();
          }
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options._id);
    var that = this;
    if (options._id) {
      that.setData({
        infoid: options._id
      });
      var data = {
        address_id: options._id
      }
      app.apiPost(app.apiList.addressGetOne, data, (data) => {
        if (data.status == 1) {
          that.setData({
            id: data.data.id,
            check: data.data.default == 1,
            username: data.data.username,
            tel: data.data.phone,
            address: data.data.address,
            addressstreet: data.data.street,
            addressInfo: data.data.detail_address,
            isdefault: data.data.default
          })
        }
      })
    }
  },
  switch1Change(e) {
    let that = this;
    let check = that.data.check;
    check = !check;
    console.log(e.detail.value)

    if (e.detail.value) {
      console.log('aaa')
      that.setData({
        default: 1
      })
    } else {
      console.log('bbb')
      that.setData({
        default: 2
      })
    }

    if (check) {
      // that.setDefault();
      // console.log('aaaa')
    } else {
      that.cancelDefault();
      // console.log('bbbb')
    }
  },
  //用户点击默认地址
  // setDefault() {
  //   var that = this;
  //   app.apiPost(app.apiList.setDefault,{address_id:that.data.id,default:that.data.default},(data)=>{
  //     if (data.status == 1) {
  //       that.onShow();
  //     }
  //   })
  // },
  cancelDefault() {
    var that = this;
    app.apiPost(app.apiList.cancelDefault, {
      address_id: that.data.id,
    }, (data) => {
      if (data.status == 1) {
        that.onShow();
      }
    })
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
    wx.getLocation({
      type: 'gcj02',
      // isHighAccuracy:true,
      success(res) {
        console.log('res1')
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude,
          longitude
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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