// pages/search/search.js
var app = getApp()
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishotList: [],
    hotIndex: 0,
    inputValue: '',
    locaValue: [],
    searchDel: true,
    pageShow: false,
    goodsList: [],
    logon: '',
  },
  // 搜索框内容获取
  searchChenga(e) {
    var inputValue = e.detail.value
    var searchDel
    if (inputValue == '') {
      searchDel = true
    } else {
      searchDel = false
    }
    this.setData({
      searchDel,
      inputValue,
    })
  },
  // 清空搜索框
  searchEmpty() {
    this.setData({
      searchDel: true,
      inputValue: '',
      pageShow: false,
    })
  },
  // 搜索
  search() {
    var that = this;
    var inputValue = that.data.inputValue.trim();
    var locaValue = that.data.locaValue || [];
    if (inputValue) {
      var index = locaValue.indexOf(inputValue);
      if (index !== -1) {
        locaValue.splice(index, 1);
        locaValue.unshift(inputValue);
      } else {
        locaValue.unshift(inputValue);
      }
      that.setData({
        locaValue,
      });
      wx.setStorage({
        key: "locaValue",
        data: locaValue
      });
    } else {
      wx.showToast({
        title: '请输入内容后搜索',
        icon: 'none',
        duration: 2000,
      });
    }
    var location = wx.getStorageSync('location')
    var data1 = {
      goods_name: inputValue,
      goodstype: 0,
      goodsby: 'all',
      page: 1,

    }
    app.apiPost(app.apiList.searchGoods, data1, (res) => {
      if (res.status == 1) {
        if (res.data.list.length > 0) {
          wx.showLoading({
            title: '数据加载中',
          })
          var goodsList = res.data.list
          // goodsList.forEach(v =>{
          //   v.add_time = utils.getDateDiff(v.add_time);
          // })
          setTimeout(() => {
            wx.hideLoading();
          }, 1000);
          setTimeout(() => {
            that.setData({
              goodsList: goodsList,
              pageShow: true,
            })
            this.getspecs(goodsList, 0, 'goodsList')
          }, 500);
        } else {
          wx.showToast({
            title: '没有搜索到任何结果',
            icon: 'none',
            duration: 2000,
          });
        }
      }
    })
  },
  getspecs(list, index, key) {
    if (index >= list.length) {
      return
    }
    app.apiPost(app.apiList.getspecs, {
      goods_id: list[index].goods_id
    }, (res) => {
      let list = this.data[key]
      let gIndex = list.findIndex(v => v.goods_id == list[index].goods_id)
      const specs_ptmoney = Math.min(...res.data.map(item => Number(item['specs_ptmoney'])).filter(price => !isNaN(price)))
      const specs_tgmoney = Math.min(...res.data.map(item => Number(item['specs_tgmoney'])).filter(price => !isNaN(price)))
      const specs_erpmoney = Math.min(...res.data.map(item => Number(item['specs_erpmoney'])).filter(price => !isNaN(price)))
      list[gIndex].specs_ptmoney = (specs_ptmoney || 0).toFixed(2)
      list[gIndex].specs_tgmoney = (specs_tgmoney || 0).toFixed(2)
      list[gIndex].specs_erpmoney = (specs_erpmoney || 0).toFixed(2)
      const totalStock = res.data.reduce((sum, item) => sum + (Number(item.specs_stock) || 0), 0)
      list[gIndex].all_goodsstock = totalStock
      list[gIndex].specs = res.data
      this.setData({
        [key]: list
      })
      this.getspecs(list, index + 1, key)
    })
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      this.setData({
        userinfo: res.data
      })
    })
  },
  // 清空搜索历史
  allhistoryEmpty() {
    wx.showModal({
      title: '提示',
      content: '是否清空搜索历史',
      confirmText: '确认',
      cancelText: '取消',
      complete: (res) => {
        if (res.confirm) {
          wx.removeStorage({
            key: 'locaValue'
          })
          this.setData({
            locaValue: []
          })
        }
      }
    })
  },
  // 删除一个搜索历史
  onehistoryEmpty(e) {
    var index = e.currentTarget.dataset.index
    var locaValue = this.data.locaValue
    locaValue.splice(index, 1)
    this.setData({
      locaValue,
    })
    wx.setStorage({
      key: "locaValue",
      data: locaValue
    })
  },
  // 点击(搜索历史或热门搜索)搜索
  hotValue(e) {
    var value = e.currentTarget.dataset.value
    this.setData({
      inputValue: value,
      searchDel: false,
    })
    this.search()
  },
  // 跳转商品详情
  gotodetails(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id=' + id,
    })
  },
  // 跳转登录
  // gotologinOn(){
  //   wx.showToast({
  //     title: '登录后可查看详情！',
  //     icon: 'none'
  //   })
  //   wx.redirectTo({
  //     url: '/pages/loginOn/loginOn',
  //   })
  // },
  // 跳转商店
  // gotostoreCenter(e){
  //   var id = e.currentTarget.dataset.id
  //   wx.navigateTo({
  //     url: '/pages/storeCenter/storeCenter?id='+id,
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (app.get('pageSet')) {
      this.setData({
        pageSet: app.get('pageSet')
      })
    }
    // this.setData({
    //   logon : wx.getStorageSync('userinfo')? true : false,
    // })
    // this.searchHis()
    this.localValue()
  },
  // 获取本地搜索历史
  localValue() {
    wx.getStorage({
      key: 'locaValue',
      success: (res) => {
        this.setData({
          locaValue: res.data
        })
      }
    })
  },
  // 获取热门搜索列表
  // searchHis(){
  //   var that = this
  //   app.apiPost(app.apiList.searchHis,'',(res)=>{
  //     if(res.status == 1){
  //       var ishotList = res.data
  //       var hotTxt = []
  //       for(var i = 0; i < ishotList.length; i+=10){
  //         var group = ishotList.slice(i, i + 10);
  //         hotTxt.push(group);
  //       }
  //       that.setData({
  //         ishotList:hotTxt
  //       })
  //     }
  //   })
  // },
  // 刷新热门搜索
  // ishotRefresh(){
  //   var hotIndex = this.data.hotIndex
  //   var ishotList = this.data.ishotList
  //   if(hotIndex==ishotList.length-1){
  //     hotIndex = 0
  //   }else{
  //     hotIndex = hotIndex + 1
  //   }
  //   this.setData({
  //     hotIndex,
  //   })
  // },

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
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})