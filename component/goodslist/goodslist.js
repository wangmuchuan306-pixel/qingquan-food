const app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    goodslist: {
      type: Array,
      value: []
    },
    userinfo: {
      type: Object,
      value: {}
    }
  },
  options: {
  },
  observers: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    iconurl: app.globalData.iconurl,
    qiniurl: app.globalData.qiniurl,
  },
  lifetimes: {
    attached() {
    },
    ready() {
    },
    detached() {
    },
    moved() {
    }
  },
  pageLifetimes: {
  },


  /**
   * 组件的方法列表
   */
  methods: {
    goranking(){
      wx.navigateTo({
        url: '/pages/rankingList/rankingList?type=1',
      })
    },
    gotoDetail(e){
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/goodsinfo/goodsinfo?id=${id}`,
      })
    },
  }
})