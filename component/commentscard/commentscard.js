// component/commentscard/commentscard.js
var app = getApp();
var Api = getApp().globalData.Api;//api地址
var helper = require('../../utils/helper.js');//网络请求
var QQMapWX = require('../../pages/libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
// 实例化API核心类
qqmapsdk = new QQMapWX({
  key: 'LIXBZ-2CTK6-2QQSM-MJDCC-5ND7Q-V5BV2'
});
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myProperty: Object,
    local: Boolean,
    index: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: app.globalData.url,
    isnon: false,
    isopen: false,
    shareModel: {}
  },
  pageLifetimes: {
    show: function () {
      var that = this
      console.log('show')
      // 页面被展示
      if(app.get('theme')){
        var theme = app.get('theme')
        that.setData({
          theme
        })
      }else{
        that.setData({
          theme:'light'
        })
      }
      app.wxAllchange()
    },
  },
  ready() {
    var that = this;
    if (app.get('userinfo')) {
      that.setData({
        headimg: app.get('userinfo').headimg
      })
    }
    if(app.get('theme')){
      var theme = app.get('theme')
      that.setData({
        theme
      })
    }else{
      that.setData({
        theme:'dark'
      })
    }
    app.wxAllchange()
    if (!that.data.myProperty) {
      console.log('啥也没有')
      return;
    }
    var imageUrl = that.data.myProperty.goodsimg
    that.setData({
      shareModel: {
        id:that.data.myProperty.id,
        index:that.data.index,
        title: that.data.myProperty.content,
        path: 'packageA/pages/commentDetail/commentDetail?id=' + that.data.myProperty.id+'&ruid='+app.get('uid')+'&goodsid='+that.data.myProperty.goodsid,
        imageUrl: imageUrl,
        fromButton: 'one'
      }
    })
    //获取外层wrap的高度
    const query = wx.createSelectorQuery().in(this);
    // query.select('#question_info').boundingClientRect();
    // query.exec(function (res) {
    //   console.log(res)
    //   that.setData({
    //     infoWrapperHeight:res[0].height
    //   })
    // })
    query.select('.list_content').boundingClientRect()
    query.exec(function (res) {
      // console.log(res)
      var isnone1 = false;
      if (res[0].height >= 50) {
        isnone1 = true;
      }
      var info1 = that.data.myProperty;
      info1.isnone = isnone1;
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 1];
      if (that.data.myProperty.show_goods == 1 || that.data.myProperty.show_goods == 3) {
        let commentsList = prevPage.data.commentsList;
        let isnone = 'commentsList[' + that.data.index + '].isnone';
        prevPage.setData({
          [isnone]: isnone1
        })
      } else {
        let info = prevPage.data.info;
        let isnone = 'info.comment_goods_one.isnone';
        prevPage.setData({
          [isnone]: isnone1
        })
      }
      that.setData({
        myProperty: info1,
      })

    })

  },
  moved() {
    console.error('change')
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //点击详情展开全部/收起
    zhankai() {
      var that = this;
      var info = that.data.myProperty;
      var isopen1 = !info.isopen;
      info.isopen = isopen1;
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 1];
      let commentsList = prevPage.data.commentsList;
      let isopen = 'commentsList[' + that.data.index + '].isopen';
      that.setData({
        myProperty: info
      })
      prevPage.setData({
        [isopen]: isopen1
      })
    },
    // 图片点击事件 预览
    imgYu: function (event) {
      var that = this;
      var src = event.currentTarget.dataset.src;//获取data-src
      // const imgList = [];//获取data-list
      var imgList = that.data.myProperty.c_img_path;
      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      })
    },
    //点击评论一下
    showadd(e) {
      // console.log(e)
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 1];
      let id = e.currentTarget.dataset.id;
      let goodsid = e.currentTarget.dataset.goodsid;
      let index = this.data.index;

      prevPage.showadd(id, goodsid, index);
    },
    //点击评论
    showList(e) {
      var that = this;
      app.util.isLogin({
        success() {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 1];
          let id = e.currentTarget.dataset.id;
          let goodsid = e.currentTarget.dataset.goodsid;
          let index = that.data.index;
          prevPage.getReplylist(id, goodsid, index);
        }
      })
    },
    getLoaction() {
      var that = this;
      wx.openSetting({
        success: (a) => {
          console.log(a)
          if (a.authSetting['scope.userLocation']) {
            wx.getLocation({
              type: 'gcj02',
              success: function (res) {
                console.log(res);
                qqmapsdk.reverseGeocoder({
                  location: {
                    latitude: res.latitude,
                    longitude: res.longitude,
                  },
                  success: function (result) {
                    wx.setStorageSync('latitude', res.latitude);
                    wx.setStorageSync('longitude', res.longitude);
                    wx.setStorageSync('location', true);
                    // app.alert('授权成功，手动请刷新页面~')
                    wx.showToast({
                      title: '授权成功',
                    })
                    setTimeout(() => {
                      let pages = getCurrentPages();
                      let prevPage = pages[pages.length - 1];
                      prevPage.getCommentsList();
                      prevPage.onShow();
                    }, 500)
                  }
                });
              },
              fail: function (res) {
                console.log(res)
                wx.setStorageSync('location', false);

              }
            })

          } else {
            wx.showToast({
              title: '授权失败',
              icon: 'loading'
            })
          }
        }
      })
    },
    //跳转到商品详情
    goGoodsInfo(e) {
      console.log(e.currentTarget.dataset);
      // console.log(this.myProperty)
      wx.navigateTo({
        url: '/packageA/pages/goodsInfo/goodsInfo?id=' + this.data.myProperty.goodsid,
      })
    },
    //跳转到评价详情
    commentDetail(){
      wx.navigateTo({
        url: '/packageA/pages/commentDetail/commentDetail?id='+this.data.myProperty.id+'&goodsid='+this.data.myProperty.goodsid,
      })
    },
    //点赞功能
    clickLike(e) {
      var that = this;
      app.util.isLogin({
        success() {
          var info = that.data.myProperty;
          var data = { comment_id: info.id, comment_userid: info.c_userid, goods_name: info.goodsname }
          app.apiPost(app.apiList.clickCommnet, data, (data) => {
            if (data.status == 1) {
              // var index = e.currentTarget.dataset.index
              // var commentsList = that.data.commentsList;
              // var islike = 'commentsList[' + index + '].islike';
              // var like = 'commentsList[' + index + '].like';
              // var animationDatas = 'commentsList[' + index + '].animationDatas';
              if (info['isself'] == 1) {
                info['isself'] = 0;
              } else {
                info['isself'] = 1;
              }
              info['up_num'] = info['up_num'] + 1;
            
              // var animation = wx.createAnimation({
              //   duration: 300,
              //   timingFunction: 'ease-in',
              // })
              // that.animation = animation;
              // animation.scale(2, 2).step();
              // animation.scale(1, 1).step();
              // info['animationDatas'] = animation.export();
              that.setData({
                myProperty: info
              })
              setTimeout(() => {
                wx.showToast({
                  title: '感谢您的认可~',
                  icon: "success",
                });
                setTimeout(() => {
                  wx.hideToast();
                }, 1500)
              }, 0);
            }
          })
        }
      })
    },
  }
})
