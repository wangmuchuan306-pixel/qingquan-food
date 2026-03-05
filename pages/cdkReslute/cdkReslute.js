// pages/cdkReslute/cdkReslute.js
var app = getApp()
Page({

 /**
  * 页面的初始数据
  */
 data: {
  url: app.globalData.url,
 },
  //联系电话
  phone(){
    wx.makePhoneCall({
      phoneNumber: '18833330416',
    })
   },
 	//查看余额
  goyuE(){
    wx.navigateTo({
      url: '/packageB/pages/myWallet/myWallet',
    })
  },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  console.log(options)
  var that = this
  app.apiPost(app.apiList.getIndexSet, {}, (res) => {
    var procedure = res.data
    that.setData({
      procedure: procedure
    })
  })
  if (options.cdk_type != 4) {
   var goodsImg = options.goodsImg
   var line_price = options.line_price
   var cdk_type = options.cdk_type
   var goods_name = options.goods_name
   var qprice = options.qprice
   var reduce = options.reduce
   var used_amount = options.used_amount
   var zhekou_num = options.zhekou_num
   if (used_amount == 0.00) {
    that.setData({
     used_amount: '免费领'
    })
   } else {
    that.setData({
     used_amount: used_amount
    })
   }
   var that = this
   that.setData({
    cdk_type, goodsImg, line_price, goods_name, qprice, reduce,zhekou_num
   })
  }else{
   var money = options.money
   var cdk_type = options.cdk_type

   that.setData({
    money,cdk_type
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

 },
 back() {
  wx.navigateBack({
   delta: 1,
  })
 },
 shouye() {
  wx.switchTab({
   url: '/pages/index/index',
  })
 },
 jiangquan() {
  wx.navigateTo({
   url: '/pages/mycard/mycard',
  })
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