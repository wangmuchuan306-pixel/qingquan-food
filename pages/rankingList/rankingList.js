// pages/rankingList/rankingList.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconurl: app.globalData.iconurl,
    qiniurl: app.globalData.qiniurl,
    city: wx.getStorageSync('thiscity'),
    page_loading: true,
    hotRankingList: [],
    rankType: {
      1: {
        title: '热销排行',
        data: {
          limit: 20,
          typeid: 0,
          latitude: 0,
          longitude: 0,
          address: '',
          is_notshow_vip_goods: 1,
          paixu: 1,
        }
      },
      2: {
        title: '促销区',
        data: {
          limit: 6,
          typeid: 0,
          latitude: 0,
          longitude: 0,
          address: '',
          search_str: '',
          is_notshow_vip_goods: 1,
          is_cx: 1
        }
      },
      3: {
        title: '幸运拼团',
        data: {
          is_spell: 2,
          isnotrand: 0,//0随机排序1正常排序（邻居在买传1，销量排行传1）
          goodsids: [],//随机排序时已经排过的商品id
        }
      },
      4: {
        title: '主卖区',
        data: {
          limit: 20,
          typeid: 0,
          latitude: 0,
          longitude: 0,
          address: '',
          is_notshow_vip_goods: 1,
          ishot: 1
        }
      },
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let type = options.type
    this.setData({
      type,
      store_id: options.store_id,
    })
    wx.setNavigationBarTitle({
      title: this.data.rankType[type].title,
    })
    this.hotRanking()
    this.userCenter()
  },
  userCenter() {
    const that = this
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      if (res.status == 1) {
        that.setData({
          userinfo: res.data,
        })
      }
    })
  },
  gotoDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/goodsinfo/goodsinfo?id=${id}`,
    })
  },
  // 热卖排行
  hotRanking(e) {
    const that = this
    const page = e?.detail.page || 1
    var data = {
      page: page,
      ...that.data.rankType[this.data.type].data,
    }
    app.apiPost(app.apiList.goodsPage, data, (res) => {
      if (res.data.length == 0) {
        that.setData({
          none: true,
        })
      } else {
        let hotRankingList = page == 1 ? [] : that.data.hotRankingList
        that.setData({
          hotRankingList: hotRankingList.concat(res.data),
          page_loading: false,
        })
      }
      setTimeout(() => {
        that.setData({
          refresh: false,
          loading: false,
        })
      }, 500)
    })
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

  }
})