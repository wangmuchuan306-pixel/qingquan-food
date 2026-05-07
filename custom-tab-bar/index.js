const app = getApp()
Component({
  data: {
    selected: 0,
    show: true,
    color: "#999",
    selectedColor: '#003B73',
    list: [{
        pagePath: "/pages/index/index",
        iconPath: "icon-home",
        text: "首页",
      },
      {
        pagePath: "/pages/lotgoodslist/lotgoodslist",
        iconPath: "icon-list",
        text: "分类",
      },
      {
        pagePath: "/pages/orderlist/orderlist",
        iconPath: "icon-form",
        text: "订单",
      },
      {
        pagePath: "/pages/mypage/mypage",
        iconPath: "icon-my",
        text: "我的",
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      // this.setData({
      //   selected: data.index
      // })
    },
    getHeight(callback) {
      const query = wx.createSelectorQuery().in(this);
      query.select('.tab-bar').boundingClientRect((rect) => {
        if (rect) {
          callback(rect.height);
        } else {
          callback(null);
        }
      }).exec();
    },
    showTabBar() {
      this.setData({
        show: true
      })
    },
    hideTabBar() {
      this.setData({
        show: false
      })
    },
  }
})