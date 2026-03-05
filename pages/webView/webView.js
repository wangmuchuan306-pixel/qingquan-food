// pages/webView/webView.js
var app = getApp();
import utils from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    app.apiPost(app.apiList.getIndexSet, {}, (res) => {
      var procedure = res.data
      that.setData({
        procedure: procedure
      })
      app.wxAllchange()
      this.setData({
        id: options.id
      })
      if (options.id == 3) {
        this.setData({
          infoid: options._id
        })
      } else if (options.id == 4 || options.id == 7) {
        let dataObj = {};
        console.log(options.id);
        options.id == 4 ? dataObj['type'] = 'help' : dataObj['type'] = 'invite';
        app.apiPost(app.apiList.getMoreContent, dataObj, (data) => {
          console.log(data.data.content);
          var html = utils.richText(data.data.content)
          that.setData({
            title: options.id ? procedure.wxname + "平台助力活动说明" : "邀请好友规则说明",
            html,
          })
        });
      } else if (options.id == 6) {
        this.setData({
          path: options.path
        })
      } else if (options.id == 'miandan') {
        app.apiPost(app.apiList.getMoreContent, {
          type: 'miandan'
        }, (data) => {
          that.setData({
            title: "全民刮免单活动说明",
            html: data.data.mdrule
          })
        });
      } else if (options.id == 'sign') {
        app.apiPost(app.apiList.getMoreContent, {
          type: 'sign'
        }, (data) => {
          console.log(data)
          that.setData({
            title: "签到规则说明",
            html: data.data.content
          })
        });
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
      title: this.data.title,
      imageUrl: '/images/logo.jpg',
    }
  },
  parser: function (e) {
    console.log(e);
  },
})