// pages/orderlist/orderlist.js
var app = getApp();
const tab_bar = require('../../custom-tab-bar/utils/tab-bar.js')
var order_status; //查询列表时的id
var order_statuss; //对订单有操作时的id
var page = 1;
var orderid;
var commentInfo = '此用户很懒，什么都没有留下.';
var floatTop = -300; //悬浮高度
Page({

   /**
    * 页面的初始数据
    */
   data: {
      url: app.globalData.url,
      veision: app.globalData.veision,
      isIpx: app.globalData.isIpx, //获得手机型号 y
      currentTab: 0, //预设当前项的值
      winHeight: '',
      current: 0,
      dixian: '',
      one_2: 0, //点亮的星星数
      two_2: 5, //没有点亮的星星数
      scrollHeight: wx.getSystemInfoSync().windowHeight,
      loading: false,
      listmore: false,
      count: 0,
      order: [],
      order_status: 0
   },
   //退款
   cancelOrderfy(e) {
      var that = this
      wx.showModal({
         title: '提示',
         content: '是否确认退款',
         complete: (res) => {
            if (res.cancel) {

            }

            if (res.confirm) {
               app.apiPost(app.apiList.cancelOrderfy, {
                  orderno: e.currentTarget.dataset.id
               }, (res) => {
                  wx.showToast({
                     title: res.msg,
                     icon: 'none'
                  })
                  if (res.status == 1) {
                     var order = that.data.order
                     order[e.currentTarget.dataset.index].order_status = 9
                     order[e.currentTarget.dataset.index].sta_txt = '已取消'
                     // order.splice(e.currentTarget.dataset.index, 1)
                     that.setData({
                        order
                     })
                  }
               })
            }
         }
      })
   },
   //确认提货
   querentihuo(e) {
      var that = this
      app.apiPost(app.apiList.getqrcode, {
         orderno: e.currentTarget.dataset.id
      }, (res) => {
         var order = that.data.order
         var index = e.currentTarget.dataset.index
         order[index].qrcode = res.data
         that.setData({
            show: true,
            order,
            showindex: index
         })
         for (let k = index + 1; k < order.length; k++) {
            if (order[k].order_status == 100) {
               var havenext = true
               var nextindex = k
               break
            }
         }
         for (let i = index; i > 0; i--) {
            if (order[i].order_status == 100) {
               var havelast = true
               var lastindex = i
               break
            }
         }
         that.setData({
            havenext: havenext ? havenext : false,
            nextindex,
            havelast: havelast ? havelast : false,
            lastindex
         })
      })
   },
   //继续亮码
   nextcode() {
      var that = this
      if (!that.data.havenext) {
         return
      }
      var index = that.data.nextindex
      var order = that.data.order
      app.apiPost(app.apiList.getqrcode, {
         orderno: order[index].orderno
      }, (res) => {
         order[index].qrcode = res.data
         that.setData({
            show: true,
            order,
            showindex: index
         })
         for (let k = index + 1; k < order.length; k++) {
            if (order[k].order_status == 100) {
               var havenext = true
               var nextindex = k
               break
            }
         }
         for (let i = index; i > 0; i--) {
            if (order[i].order_status == 100) {
               var havelast = true
               var lastindex = i
               break
            }
         }
         that.setData({
            havenext: havenext ? havenext : false,
            nextindex,
            havelast: havelast ? havelast : false,
            lastindex
         })
      })
   },
   lastcode() {
      var that = this
      if (!that.data.havelast) {
         return
      }
      var index = that.data.lastindex
      var order = that.data.order
      app.apiPost(app.apiList.getqrcode, {
         orderno: order[index].orderno
      }, (res) => {
         order[index].qrcode = res.data
         that.setData({
            show: true,
            order,
            showindex: index
         })
         for (let k = index + 1; k < order.length; k++) {
            if (order[k].order_status == 100) {
               var havenext = true
               var nextindex = k
               break
            }
         }
         for (let i = index; i > 0; i--) {
            if (order[i].order_status == 100) {
               var havelast = true
               var lastindex = i
               break
            }
         }
         that.setData({
            havenext: havenext ? havenext : false,
            nextindex,
            havelast: havelast ? havelast : false,
            lastindex
         })
      })
   },
   onClose() {
      page = 1;
      this.setData({
         show: false,
         order: []
      })
      this.getOrderList()
   },
   // 去抽奖也
   spellorder() {
      wx.navigateTo({
         url: '/packageA/pages/spellorder/spellorder',
      })
   },
   // 点击复制
   copywxtap: function (event) {
      // var wxChat = event.currentTarget.dataset.wechatid //接收wxml传过来的数据
      // 下方为微信开发文档中的复制 API
      wx.setClipboardData({
         data: '123', //复制的数据
         success: function (res) {
            wx.getClipboardData({
               success: function (res) {
                  console.log(res.data) //打印赋值的数据
               }
            })
         }
      })
   },
   //判断页面是否加载完成
   isShow() {
      var that = this;
      setTimeout(function () {
         that.setData({
            isShow: true
         })
      }, 1500)
   },
   //删除订单
   delorder(e) {
      var that = this;
      wx.showModal({
         cancelText: '取消',
         confirmText: '确认',
         content: '是否删除此订单',
         showCancel: true,
         title: '提示',
         success: (result) => {
            if (result.confirm == true) {
               app.apiPost(app.apiList.delorder, {
                  orderno: e.currentTarget.dataset.id
               }, (data) => {
                  if (data.status == 1) {
                     wx.showToast({
                        title: '删除成功',
                     })
                     //返回订单列表
                     // setTimeout(function(){
                     //   wx.navigateBack({
                     //     delta: 1,
                     //   })
                     // },1000)
                     that.getOrderList(true);
                  }
               })
            }
         },
         fail: (res) => { },
         complete: (res) => { },
      })

   },
   //点击立即评价
   goAddComments(e) {
      console.log(e);
      wx.navigateTo({
         url: '../addComments/addComments?id=' + e.currentTarget.dataset._id + '&status=' + e.currentTarget.dataset.id,
      })
   },
   //回到顶部
   goTop: function (e) {
      this.setData({
         scrollTop: 0
      })
   },
   //再来一单
   tobuygoods(e) {
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
         url: '/pages/goodsinfo/goodsinfo?id=' + id,
      })
   },
   //获取nav 滚动高度
   onScroll(e) {
      let scrollTop = e.detail.scrollTop
      // console.log(scrollTop);
      // console.log(this.data.scrollHeight / 2);
      // 如果超过半屏
      if (scrollTop > this.data.scrollHeight / 2) {
         this.setData({
            visual: true,
            animation: 'fadeIn'
         })
      } else {
         this.setData({
            animation: 'fadeOut'
         })
         // setTimeout(() => {
         //   this.setData({
         //     visual: false
         //   })
         // }, 1000)
      }
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options)
      if (!app.get('token_new')) {
         console.log('未登录')
         wx.navigateTo({
            url: '/pages/login/login',
         })
      }
      var that = this;
      that.setData({
         theme: 'light'
      })
      app.wxAllchange()
      that.isShow();
      wx.getSystemInfo({
         success: function (res) {
            that.setData({
               winWidth: res.windowWidth,
               winHeight: res.windowHeight
            });
         }
      });
      if (options.type) {
         //订单详情页跳转
         this.setData({
            currentTab: options.id,
            order_status: options.type,
         })
         return;
      }
      if (options.id) {
         that.setData({
            currentTab: options.id
         })
         var order_status = 0;
         if (options.id == 1) {
            order_status = 2
         } else if (options.id == 2) {
            order_status = 4
         } else if (options.id == 3) {
            order_status = 5
         } else if (options.id == 4) {
            order_status = 6
         }
         this.setData({
            order_status: order_status
         })
      }
      if (options.typeid) {
         this.setData({
            order_status: options.typeid,
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
      tab_bar.getTab(2)
      var that = this;
      that.setData({
         theme: 'light'
      })
      app.wxAllchange()
      page = 1;
      that.setData({
         order: [],
         // count: 0,
         loading: false,
         dixian: ''

      }),
         that.setData({
            order: [],
         })
      that.getOrderList();
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
      console.log('onPullDownRefresh')
      var that = this;
      page = 1;
      that.setData({
         order: [],
         // count: 0,
         loading: false,
         dixian: ''
      }),
         that.getOrderList();
   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {
      var that = this;
      if (that.data.dixian != '') {
         console.log('已经到底了')
         return;
      } else {
         page++;
         that.setData({
            listmore: true
         })
         that.getOrderList();
      }
   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function (e) {
      console.log(e);
      var that = this;
      if (e.from = "button") {
         var gid = e.target.dataset.gid;
         setTimeout(function () {
            that.setData({
               order_status: 4,
               currentTab: 4
            })
            order_statuss = 3;
            orderid = e.target.dataset.id;
            // that.updateOrderStatus();
            //分享回调
            that.updateShare(orderid);
         }, 1000)
         var title = e.target.dataset.title;
         var coverimg = e.target.dataset.coverimg;
         return {
            title: title,
            // desc: '分享页面的内容',
            path: '/packageA/pages/goodsInfo/goodsInfo?id=' + gid,
            imageUrl: coverimg,
         }

      }
   },
   //订单分享回调
   updateShare(orderid) {
      var that = this;
      var data = {
         orderno: orderid
      }
      app.apiPost(app.apiList.updateShare, data, (data) => {
         console.log('分享成功')
      })
      that.setData({
         currentTab: 4,
         order_status: 6,
         order: [],
         // count: 0,
         loading: false,
         dixian: ''
      })
      that.getOrderList();
   },
   //用户点击确认收货
   querenshouhuo(e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      var order = that.data.order;
      var title = '确认收货提醒';
      var content = '请确认是否收到商品!';
      var tishi = "收货成功";
      if (that.data.order[index].deliver_type == 1) {
         title = '确认取货提醒';
         content = '请确认是否取到商品!';
         tishi = "取货成功";
      } else if (that.data.order[index].deliver_type == 3) {
         title = '您是否已到店？';
         content = '请到店后向工作人员展示订单，否则请取消';
         tishi = "使用成功";
      }


      wx.showModal({
         title: title,
         content: content,
         showCancel: true,
         cancelText: '取消',
         confirmText: '确认',
         success: function (res) {
            console.log(res);
            if (res.confirm) {
               var data = {
                  orderno: id,
                  ok_type: 4
               }
               app.apiPost(app.apiList.userReceiving, data, (data1) => {
                  if (data1.status == 1) {
                     wx.showToast({
                        title: tishi,
                     }, 1500)
                     order[index].order_status = 4
                     order[index].sta_txt = '已完成'
                     that.setData({
                        order
                     })
                     //跳转到发布评价页面
                     // wx.navigateTo({
                     //   url: '../addComments/addComments?id=' + id + '&status=2',
                     // })
                     // 免单活动
                     // wx.navigateTo({
                     //   url: '/packageA/pages/luckyDraw/luckyDraw?orderId=' + id + '&good_id=' + data.goods_id,
                     // })
                  }
               })
            }

         },
      })
   },
   //显示弹框
   showModal(e) {
      console.log(e.currentTarget.dataset.id);

      orderid = e.currentTarget.dataset._id
      order_statuss = e.currentTarget.dataset.id;

      if (order_statuss == 2) {
         this.showOrderInfo();
      }
      // var order_statu = e.currentTarget.dataset.id
      var that = this;
      // 创建一个动画实例
      var animation = wx.createAnimation({
         // 动画持续时间
         duration: 300,
         // 定义动画效果，当前是匀速
         timingFunction: 'linear',
         delay: 0
      })
      // 将该变量赋值给当前动画
      that.animation = animation
      // 先在y轴偏移，然后用step()完成一个动画
      animation.translateY(900).step();
      // 用setData改变当前动画
      that.setData({
         // 通过export()方法导出数据
         animationData: animation.export(),
         // 改变view里面的Wx：if
         chooseSize: true,
         order_statu: order_statuss
      });
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function () {
         animation.translateY(0).step()
         that.setData({
            animationData: animation.export()
         })
      }, 300)
   },

   //弹框隐藏
   hideModal: function (e) {
      var that = this;
      var animation = wx.createAnimation({
         duration: 300,
         timingFunction: 'linear'
      })
      that.animation = animation
      animation.translateY(900).step();

      that.setData({
         animationData: animation.export(),
      })
      setTimeout(function () {
         animation.translateY(0).step()
         that.setData({
            animationData: animation.export(),
            chooseSize: false,
            one_2: 0,
            two_2: 5

         })
      }, 300)
   },
   // 点击标题切换当前页时改变样式
   swichNav: function (res) {
      page = 1;
      var that = this;
      var cur = res.target.dataset.current;
      if (that.data.currentTab == cur) {
         return false;
      } else {
         var order_status = 0;
         if (cur == 1) {
            order_status = 2
         } else if (cur == 2) {
            order_status = 4
         } else if (cur == 3) {
            order_status = 5
         } else if (cur == 4) {
            order_status = 6
         }
         that.setData({
            currentTab: cur,
            order_status: order_status,
            loading: false,
            count: 0,
            dixian: '',
            order: [],
         })
         that.getOrderList();
      }
   },
   // 滑动切换当前页时改变样式
   switchTab: function (res) {
      console.log(res)
      page = 1;
      var that = this;
      var cur = res.detail.current
      if (that.data.currentTab == cur) {
         return false;
      } else {
         var order_status = 0;
         if (cur == 1) {
            order_status = 2
         } else if (cur == 2) {
            order_status = 4
         } else if (cur == 3) {
            order_status = 5
         } else if (cur == 4) {
            order_status = 6
         }
         that.setData({
            currentTab: cur,
            order_status: order_status,
            loading: false,
            count: 0,
            dixian: ''

         })
         that.getOrderList();
      }
   },
   //点击跳转到订单详情页
   goOrderInfo(e) {
      console.log(e);
      wx.navigateTo({
         url: '../orderInfo/orderInfo?id=' + e.currentTarget.dataset.id,
      })
   },
   //查询订单列表
   // 改变分类按钮
   changetype(e) {
      page = 1
      this.setData({
         order_status: e.currentTarget.dataset.type,
         order: [],
         // page: 1
      })
      this.getOrderList()
   },
   //callWay 表示调用方式 call=true时表示需要重置this.data.order 默认不需要
   getOrderList(callWay = false) {
      wx.showLoading({
         title: '数据加载中',
         mask: true
      })
      var that = this;
      // end
      //停止下拉动作
      wx.stopPullDownRefresh();
      var data = {
         type: that.data.order_status,
         page: page,
         // order_status: that.data.order_status
      }
      app.apiPost(app.apiList.userOrderList, data, (data) => {
         var order = data.data;
         // if (that.data.order_status == 2) {
         //   order = order.filter(item=>item.)
         // }
         if (data.status == 1) {
            // for (var i = 0; i < order.length; i++) {
            //   order[i].pay_time = app.util.getDateDiff(order[i].pay_time);
            // }
            //重置order
            if (callWay) {
               that.setData({
                  order: order
               })
            } else {
               that.setData({
                  order: that.data.order.concat(order),
                  count: data.count,
                  dixian: ''
               })
            }
            if (data.count <= 15 || order.length < 15) {
               that.setData({
                  dixian: '暂无更多内容啦~'
               })
            }
         }
         setTimeout(() => {
            wx.hideLoading()
         }, 1000)
      })

   },
   //给团长/商家拨打电话
   call_phone: function (e) {
      var phone = e.currentTarget.dataset.phone;
      console.log(phone)
      if (phone != undefined) {
         wx.makePhoneCall({
            phoneNumber: phone,
            success: function () {
               console.log("成功拨打电话")
            }
         })
      } else {
         wx.showToast({
            title: '未发现电话号码',
            icon: 'error',
            duration: 1500
         })
      }
   },
})