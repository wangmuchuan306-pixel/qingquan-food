// pages/goodslist/goodslist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtype: 1,
    cateindex: 0,
    page: 1,
    goodslist: []
  },
  //获取商品分类
  getcatelist() {
    app.apiPost(app.apiList.miniIndex, {}, (res) => {
      this.setData({
        catelist: res.data.catelist
      })
      this.getgoodslist()
    })
  },
  //切换分类
  changecate(e) {
    this.setData({
      cateindex: e.currentTarget.dataset.index,
      page: 1
    })
    this.getgoodslist()
  },
  //输入搜索内容
  insearchstr(e) {
    this.setData({
      searchstr: e.detail.value
    })
  },
  //清除输入
  nosearchstr() {
    this.setData({
      searchstr: '',
      showtype: 1
    })
  },
  //搜索商品
  tosearch() {
    this.setData({
      showtype: 2,
      page: 1
    })
    this.getgoodslist()
  },
  //触底
  scrolltolower() {
    var page = this.data.page
    var goodslist = this.data.goodslist
    if (goodslist.length % 20 == 0) {
      this.setData({
        page: page + 1
      })
      this.getgoodslist()
    }
  },
  //获取商品列表
  getgoodslist() {
    var that = this
    var data = {
      page: that.data.page,
      limit: 20,
      // cateone: that.data.catelist[that.data.cateindex].id,
      address: '唐山',
      searchstr: that.data.searchstr
    }
    if (that.data.showtype == 1) {
      data['typeid'] = that.data.catelist[that.data.cateindex].id
    }
    app.apiPost(app.apiList.goodsPage, data, (res) => {
      if (that.data.page == 1) {
        var goodslist = res.data
      } else {
        var goodslist = that.data.goodslist.concat(res.data)
      }
      that.setData({
        goodslist,
        labelist: res.label,
        colorlist: res.color
      })
    })
  },
  //选择商品
  choosegoods(e) {
    var index = e.currentTarget.dataset.index
    var goods_name = this.data.goodslist[index].goods_name
    var goods_id = this.data.goodslist[index].goods_id
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id='+goods_id,
    })
    // let pages = getCurrentPages()
    // let currentPage = pages[pages.length - 2]
    // currentPage.setData({
    //   say_goods_id: goods_id,
    //   goods_name: goods_name
    // })
    // wx.navigateBack()
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      this.setData({
        userinfo: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getcatelist()
    var windows = wx.getWindowInfo()
    this.setData({
      windowHeight: windows.windowHeight,
      pixelRatio: windows.windowWidth / 750
    })
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