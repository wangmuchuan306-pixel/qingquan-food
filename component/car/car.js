var Api = getApp().globalData.Api;//api地址
var helper = require('../../utils/helper.js');//网络请求
var show = 0;
Component({

  properties: {
    commodity: Object,
  },

  data: {
    touchStart: null,
    rightSpace: 0,
    selectedNum: 1,
  },

  methods: {
    /* 商品是否选中 */
    handleSelect() {
      show = 0;
      let commodity = this.data.commodity;
      let selectedNum = commodity.num;
      if (commodity.isselected == 0) {
        commodity.isselected = 1;
      } else {
        commodity.isselected = 0;
      }
      this.triggerEvent('handleselect', { commodity, selectedNum,show  })
    },
    /* 处理触摸滑动开始 */
    handleTouchStart(e) {
      /* 记录触摸滑动初始位置 */
      let touchStart = e.changedTouches[0].clientX;
      this.setData({
        touchStart
      })
    },
    /* 处理触摸滑动 */
    handleTouchMove(e) {
      console.log(e)
      let moveSpace = e.changedTouches[0].clientX;
      let touchStart = this.data.touchStart;
      if (touchStart != null) {
        if (moveSpace - touchStart > 70) {
          this.setData({
            touchStart: null,
            rightSpace: 0
          })
        }
        else if (moveSpace - touchStart < -70) {
          this.setData({
            touchStart: null,
            rightSpace: 70
          })
        }
      }
    },
    numChange(e) {
      console.log(e.detail.value);
      show = 0;
      let selectedNum = e.detail.value;
      let commodity = this.data.commodity;
      //修改商品数量
      var data={
        cid:commodity._id,
        gid:commodity.gid,
        num:selectedNum
      }
      helper.post(Api.upcar,(data)=>{
        console.log(data)
      },data)
      this.setData({
        selectedNum
      })
      this.triggerEvent('handleselect', { commodity, selectedNum,show })
    },
    deletethis(){//删除该商品
      var that = this;
      let commodity = that.data.commodity;
      var cidarr = []
      cidarr.push(commodity._id)
      var data={
        cidarr:cidarr
      }  
      helper.post(Api.delcar,(data)=>{
        console.log(data)
        if(data.status==1){
          wx.showToast({
            title: '删除成功',
          })
          setTimeout(function(){
            //刷新数据
            that.setData({
              touchStart: null,
              rightSpace: 0
            })
            show = 1;
            that.triggerEvent('handleselect',{ show })
          },500)
          
        }
      },data)
    },
      //跳转到商品详情
    goGoodsInfo(e){
      console.log(e.currentTarget.dataset.gid);
      var gid = e.currentTarget.dataset.gid;
      wx.navigateTo({
        url: '/pages/goodsInfo/goodsInfo?id=' + gid,
      })
    },
  }
})