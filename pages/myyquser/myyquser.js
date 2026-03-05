// pages/myyquser/myyquser.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1
  },
  getmyyquser() {
    app.apiPost(app.apiList.getmyyquser, {
      page: this.data.page,
      limit: 20
    }, (res) => {
      if (this.data.page == 1) {
        var userlist = []
      } else {
        var userlist = this.data.userlist
      }
      userlist = userlist.concat(res.data)
      this.setData({
        userlist
      })
    })
  },
  callphone(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getmyyquser()
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
    if (this.data.userlist.length % 20 == 0) {
      this.setData({
        page: this.data.page + 1
      })
      this.getmyyquser()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})