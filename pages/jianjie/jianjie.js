// pages/jianjie/jianjie.js
var app = getApp();
var utils = require('../../utils/util.js');
// var WxParse = require('../../../wxParse/wxParse.js');
Page({

   /**
    * 页面的初始数据
    */
   data: {
      html: '',
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      app.wxAllchange()
      console.log(options)
      var article_id = 1
      if (options.scene) {
         //扫描小程序码进入小程序取得参数
         const scene = decodeURIComponent(options.scene);
         if (scene != 'undefined') {
            var arr = scene.split("&");
            if (arr[1] == "article") {
               var article_id = arr[0]
            }
         }
      } else if (options.article_id) {
         var article_id = options.article_id
      }
      if (options.id) {
         article_id = options.id
      }
      var that = this;
      //查询文章详情
      app.apiPost(app.apiList.getArticle, {
         article_id: article_id
      }, (data) => {
         if (data.status == 1) {
            wx.setNavigationBarTitle({
               title: data.data.desc,
            })
            var content = utils.richText(data.data.content);
            // WxParse.wxParse('content', 'html', content, that, 5);
            that.setData({
               html: content
            })
         }
      })
   },
   parser: function (e) {
      console.log(e);
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
      app.wxAllchange()
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