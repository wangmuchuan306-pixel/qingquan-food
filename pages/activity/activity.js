// pages/activity/activity.js
const app = getApp()
import utils from '../../utils/util'
var timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiniuUrl: app.globalData.qiniuUrl,
    search_str:'',
  },
  close(){
    this.setData({
      search_str:'',
    })
    this.getactivitylist()
  },
  searchinput(e){
    clearTimeout(timer)
    let search_str = e.detail.value
    this.setData({
      search_str,
    })
    timer = setTimeout(() => {
      this.getactivitylist()
    }, 500);
  },
  //活动商品
  getactivitylist() {
    let data = {
      page: this.data.page,
      limit: 10,
      active_type: 1,
      search_str:this.data.search_str
    }
    app.apiPost(app.apiList.getactivitylist, data, (res) => {
      if (res.status == 1) {
        var activitylist = res.data
        if (activitylist.length > 0) {
          activitylist.forEach(v => {
            v.act_status = utils.checkTimeRange(v.act_start_time, v.act_end_time)
            v.act_status_text = v.act_status == 0 ? '未开始' : v.act_status == 1 ? '进行中' : '已结束'
            v.act_start_time = utils.timeStamp123(v.act_start_time,"YYYY-MM-DD")
            v.act_end_time = utils.timeStamp123(v.act_end_time,"YYYY-MM-DD")
          });
        }
        this.setData({
          activitylist,
        })
      } else {
        wx.showToast({
          title: res.msg || '活动列表请求失败',
          icon: 'none'
        })
      }
    })
  },
  userCenter() {
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      this.setData({
        userinfo: res.data
      })
    })
  },
  //商品详情
  toinfo(e) {
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo?id=' + e.currentTarget.dataset.id,
    })
  },
  //跳转活动详情
  goDetail(e) {
    let index = e.currentTarget.dataset.index
    let activity = this.data.activitylist[index]
    if (activity.act_status == 0) {
      wx.showToast({
        title: '活动未开始',
        icon: 'none'
      })
      return
    } else if (activity.act_status == 2) {
      wx.showToast({
        title: '活动已结束',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/activitydetail/activitydetail?id=' + activity.id,
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
    this.userCenter()
    this.getactivitylist()
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
    this.setData({
      page: this.data.page + 1,
    })
    this.getactivitylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    let index = e.target.dataset.index
    let activity = this.data.activitylist[index]
    return {
      title: activity.act_desc,
      path: '/pages/activitydetail/activitydetail?id=' + activity.id,
      imageUrl: this.data.qiniuUrl + activity.act_share_img,
    }
  }
})