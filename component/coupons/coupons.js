// component/coupons/coupons.js
let app = getApp();
import utils from '../../utils/util.js'
Component({

   properties: {
      couponsList: Array, //view 查看  used 使用
      permissions: String, //可用
      usedCouponsList: Array, //不可用/已用
      onemoney:Number,
      again: {
         value: false,
         type: Boolean
      },
      goodsnum: String,
      type: String
   },
   observers: {
      'couponsList': function (couponsList) {
         this.countdown()
      }
   },
   /**
    * 页面的初始数据
    */
   data: {
      veision: app.globalData.veision,
      url: app.globalData.url,
   },
   pageLifetimes: {
      show: function () {
         var that = this
         console.log('show')
         // 页面被展示
         that.setData({
            theme: 'light'
         })
         app.wxAllchange()
         that.getlqlog()
      },
   },
   ready() {
      var that = this;
      if (app.get('userinfo')) {
         that.setData({
            headimg: app.get('userinfo').headimg
         })
      }
      that.setData({
         theme: 'light'
      })
      app.wxAllchange()
   },

   methods: {
      countdown() {
         var that = this;
         var couponsList = that.data.couponsList.map(item => {
            if (item.status === 3) {
               return {
                  ...item,
                  expireTime: item.send_time * 1000 + 7200 * 1000
               }
            }
            return item;
         });

         // 检查是否有需要倒计时的项
         const hasActiveItems = couponsList.some(item => item.status === 3);
         if (!hasActiveItems) return;

         // 全局定时器
         var timer = setInterval(() => {
            var now = Date.now();
            var updates = {};
            var activeCount = 0;

            couponsList.forEach((item, index) => {
               if (item.status === 3) {
                  var remaining = item.expireTime - now;

                  if (remaining <= 0) {
                     updates[`couponsList[${index}].countdown`] = null;
                     // 触发列表更新
                     that.triggerEvent('getCouponList'); 
                     return;
                  }
                  activeCount++;

                  var hours = Math.floor(remaining / (1000 * 60 * 60));
                  var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                  var seconds = Math.floor((remaining % (1000 * 60)) / 1000);

                  updates[`couponsList[${index}].countdown`] = {
                     h: hours.toString().padStart(2, '0'),
                     m: minutes.toString().padStart(2, '0'),
                     s: seconds.toString().padStart(2, '0')
                  };
               }
            });

            that.setData(updates);
            
            // 没有活动倒计时时清除定时器
            if (activeCount === 0) {
               clearInterval(timer);
               that.globalTimer = null;
            }
         }, 1000);

         // 清除旧定时器
         if (this.globalTimer) clearInterval(this.globalTimer);
         this.globalTimer = timer;
      },
      //优惠券使用说明
      showcontent(e) {
         this.setData({
            quanindex: e.currentTarget.dataset.index,
            show: true
         })
      },
      gotureceiv(e) {
         if (e.currentTarget.dataset.type == 1) {
            var id = this.data.zzlist[e.currentTarget.dataset.index].yhq_id;
         } else {
            var id = this.data.couponsList[e.currentTarget.dataset.index].histoty_id;
         }
         var username = wx.getStorageSync('userinfo').nickname;
         var imgsrc = wx.getStorageSync('userinfo').headimg;
         var uid = wx.getStorageSync('uid')
         wx.navigateTo({
            url: '/pages/reward/receivereward?coupon_id=' + id + '&username=' + username + '&imgsrc=' + imgsrc + '&fromuid=' + uid
         })
      },
      onClose() {
         this.setData({
            show: false
         })
      },
      //转赠记录
      getlqlog() {
         app.apiPost(app.apiList.getlqlog, {}, (res) => {
            var zzlist = res.data
            zzlist.forEach(v => {
               v.coupon_end_time = utils.timeStamp(v.coupon_end_time)
               v.get_user_phone = v.get_user_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            })
            this.setData({
               zzlist,
            })
         })
      },
      sendtreasure(e) {
         app.apiPost(app.apiList.sendtreasure, {
            id: e.currentTarget.dataset.id
         }, (res) => {
            wx.showToast({
               title: res.msg,
               icon: 'none'
            })
         })
      },
      useCoupon(e) {
         let that = this;
         let couponId = e.currentTarget.dataset.couponid;
         let couponsList = that.data.couponsList;
         var index = e.currentTarget.dataset.index
         var checknum = couponsList.filter(v => v.checked == true).length
         if (couponsList[index].checked) {
            couponsList[index].checked = !couponsList[index].checked
            checknum--
            that.setData({
               couponsList,
               checknum
            })
         } else {
            if (checknum == that.properties.goodsnum) {
               wx.showToast({
                  title: '最多可以使用' + that.properties.goodsnum + '张优惠券',
                  icon: 'none'
               })
               couponsList[index].checked = false
               that.setData({
                  couponsList
               })
               return
            } else {
               console.log(111)
               couponsList[index].checked = !couponsList[index].checked
               checknum++
               that.setData({
                  couponsList,
                  checknum
               })
            }
         }
         // couponsList.forEach((item, index) => {
         //   if (item.quan_id == couponId) {
         //     item.checked = !item.checked;
         //     if (item.checked == true) that.triggerEvent("choosethis", item);
         //     if (item.checked == false) that.triggerEvent("choosethis", null);
         //   } else {
         //     item.checked = false;
         //   }
         // })
         // console.log(that.data.again);
      },
      //立即使用卡券
      usequan() {
         var that = this
         var couponsList = that.data.couponsList
         var checknum = that.data.checknum
         if (checknum == 0) {
            wx.navigateBack()
         } else {
            var coupons = []
            couponsList.forEach(v => {
               if (v.checked) {
                  coupons.push(v)
               }
            })
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
               coupons
            })
            wx.navigateBack({
               delta: 1, //想要返回的层级,
               success: (res) => {
                  prevPage.zongprice();
               }
            })
         }
      },
      tousecoupon(e) {
         var that = this
         var couponsList = that.data.couponsList
         var index = e.currentTarget.dataset.index
         var item = couponsList[index]
         if (item.face_type == 1) {
            // wx.switchTab({
            //    url: '/pages/index/index',
            // })
            wx.navigateTo({
               url: '/pages/lotgoodslist/lotgoodslist',
            })
         } else {
            // var coupon = JSON.stringify(item)
            // console.log(coupon)
            wx.setStorageSync('goodscoupon', item)
            wx.redirectTo({
               url: '/pages/addorder/addorder?num=1&goods_id=' + item.quan_goods_id
               // + '&coupon=' + coupon,
            })
         }
      },
      xufei() {
         wx.navigateTo({
            url: '/pages/memberPage_bk/memberPage_bk',
         })
      }
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      var that = this;
      that.setData({
         theme: 'light'
      })
      app.wxAllchange()
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
      var that = this;
      that.setData({
         theme: 'light'
      })
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