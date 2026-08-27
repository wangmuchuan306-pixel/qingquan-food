// index.js
const app = getApp()
const tab_bar = require('../../custom-tab-bar/utils/tab-bar.js')
import {
   base64src
} from '../../utils/base64src.js'
var utils = require('../../utils/util.js')
Page({

   data: {
      menu: app.menu,
      pageConfig: {
         buyYearCard: 1,//购买年卡
      },
      crossAxisCount: 2,
      notscroll: true,
      page: 1,
      viplist: [],
      goods_vip: 1,
      xdistance: 0,
      loading: true,
      requestCount: 0,
      hbinfo: {
         background: 'https://qqspapi.0315678.cn/summer/hbackground.jpg',
         width: '1080rpx',
         height: '1920rpx',
         views: [{
            type: 'image',
            url: '',
            css: {
               width: '600rpx',
               height: '600rpx',
               bottom: '200rpx',
               left: '240rpx'
            }
         }]
      },
      paixuindex: 0,
      showtype: 1,
      chooseStyle: 2,
      balanType: 0,
      reduce_balance: 0,
      checked: false,
      balancepayShow: false,
      timeShow: false,
      noticeText: '',
      indexday: 0,
      zindexday: 0,
      indextime: -1,
      zindextime: -1,
      notexNum: 0,
      showQrcodePopup: false,
      cate_pid: 0
   },
   //请求开始
   requestStart() {
      this.setData({
         requestCount: this.data.requestCount + 1
      })
   },
   //请求完成
   requestComplete() {
      this.setData({
         requestCount: this.data.requestCount - 1
      })
      if (this.data.requestCount <= 0) {
         this.setData({
            loading: false
         })
         wx.hideLoading()
      }
   },
   //活动商品
   getactivitylist2() {
      this.requestStart()
      let data = {
         page: 1,
         limit: 5,
         active_type: 0,
      }
      app.apiPost(app.apiList.getactivitylist, data, (res) => {
         this.requestComplete()
         if (res.status == 1) {
            var activitylist = res.data
            if (activitylist.length > 0) {
               activitylist.forEach(v => {
                  v.act_status = utils.checkTimeRange(v.act_start_time, v.act_end_time)
                  v.act_status_text = v.act_status == 0 ? '未开始' : v.act_status == 1 ? '进行中' : '已结束'
                  v.act_start_time = utils.timeStamp123(v.act_start_time, "YYYY-MM-DD")
                  v.act_end_time = utils.timeStamp123(v.act_end_time, "YYYY-MM-DD")
               });
            }
            this.setData({
               activitylist2: activitylist,
            })
         } else {
            wx.showToast({
               title: res.msg || '活动列表请求失败',
               icon: 'none'
            })
         }
      }, { requireAuth: false, showLoading: false })
   },
   goranking(e) {
      let type = e.currentTarget.dataset.type
      wx.navigateTo({
         url: '/pages/rankingList/rankingList?type=' + type,
      })
   },
   //分类列表
   getgoodscat() {
      this.requestStart()
      app.apiPost(app.apiList.getgoodscat, {}, (res) => {
         this.requestComplete()
         res.data = res.data.filter(item => item.cate_name != '年卡')
         // res.data.forEach(v => {
         //    v.list.unshift({
         //       cate_name: '全部',
         //       id: 0
         //    })
         // })
         res.data.unshift({
            cate_name: '全部商品',
            id: 0,
            imgpath: '/images/allGoodscart.png',
            list: [{
               cate_name: '全部商品',
               id: 0
            }]
         })
         this.setData({
            catelist: res.data
         })
         // this.goodsPage()
      }, { requireAuth: false, showLoading: false })
   },
   choosecate(e) {
      let id = e.currentTarget.dataset.id
      this.setData({
         cate_pid: id
      })
      this.goodsPage()
      wx.pageScrollTo({
         selector: '#goodslist',
         offsetTop: -104,
      })
   },
   // 轮播图跳转
   bannernav(e) {
      var that = this
      var path = e.currentTarget.dataset.path;
      var type = e.currentTarget.dataset.type;
      var id = e.currentTarget.dataset.id;
      //console.log(path)
      if (type == 2) {
         //当类型为商品时跳转到商品详情
         wx.navigateTo({
            url: '/pages/goodsinfo/goodsinfo?id=' + id,
         })
      } else if (type == 1) {
         wx.navigateTo({
            url: '/pages/jianjie/jianjie?&id=' + id,
         })
      } else if (type == 3) {
         wx.navigateTo({
            url: e.currentTarget.dataset.path,
         })
      } else if (type == 4) {
         wx.navigateTo({
            url: '/pages/webView/webView?id=6&path=' + e.currentTarget.dataset.path,
         })
      } else if (type == 5) {
         wx.navigateTo({
            url: '/pages/merchantInfo/merchantInfo?store_id=' + id,
         })
      }
   },
   gosetyearcard() {
      wx.navigateTo({
         url: '/pages/setyearcard/setyearcard?typeid=' + this.data.goods_vip,
      })
   },
   notesValue(e) {
      var notesValue = e.detail.value
      this.setData({
         notesValue,
         notexNum: notesValue.length
      })
   },
   changTime() {
      this.setData({
         timeShow: true,
         noticeText: this.data.send_tip
      })
   },
   gotohelp() {
      wx.navigateTo({
         url: '/pages/myhelp/myhelp',
      })
   },
   //选择自提点
   choztdian() {
      wx.navigateTo({
         url: '/pages/chooseztdian/chooseztdian',
      })
   },
   selectDay(e) {
      var index = e.currentTarget.dataset.index
      if (index == this.data.zindexday) {
         this.setData({
            indexday: index,
            indextime: this.data.zindextime,
         })
      } else {
         this.setData({
            indexday: index,
            indextime: -1,
         })
      }
   },
   selectTime(e) {
      var index = e.currentTarget.dataset.index
      this.setData({
         indextime: index,
         zindexday: this.data.indexday,
         zindextime: index,
      })
      setTimeout(() => {
         this.setData({
            timeShow: false,
         })
      }, 300);
   },
   closePopup() {
      this.setData({
         timeShow: false,
      })
   },
   checkedChan(e) {
      // if (this.data.goodsInfo.goods_account_type == 1) {
      //   wx.showToast({
      //     title: '余额卡不可用余额购买',
      //     icon: 'none'
      //   })
      //   return
      // }
      this.setData({
         checked: e.detail
      })
      this.zongprice()
   },
   closePopup2() {
      this.setData({
         balancepayShow: false,
         commodityshow: true,
      })
   },
   balanShow() {
      // var all_money = this.data.all_money
      // var usedBalance = Math.min(this.data.integral, all_money);
      this.setData({
         checked: true,
         balancepayShow: true,
         // commodityshow: false,
         // balanMoney2: usedBalance,
      })
   },
   // 输入使用的余额
   balanValue(e) {
      const balanMoney2 = e.detail.value; // 获取输入的金额
      const regex = /^(0|[1-9]\d*)$/; // 定义正则表达式，匹配有效的金额格式

      // 检查输入的金额是否大于余额
      if (parseFloat(balanMoney2) > parseFloat(this.data.integral)) {
         wx.showToast({
            title: '输入的金额不能大于余额',
            icon: 'none'
         });
         return;
      }

      // 检查输入的金额格式是否有效
      if (regex.test(balanMoney2)) {
         this.setData({
            balanMoney2, // 更新状态
         });
      } else {
         // 提示用户输入格式错误
         wx.showToast({
            title: '请输入有效的积分',
            icon: 'none'
         });
         console.log('输入格式错误'); // 便于调试，有需要时可以打开
      }
   },
   balanValue2() {
      var all_zongprice = this.data.all_zongprice
      var integral = this.data.integral / 100
      var usedBalance = Math.min(integral, all_zongprice);
      usedBalance = usedBalance * 100
      this.setData({
         balanMoney2: usedBalance,
      })
   },
   // 确认使用余额
   validated() {
      var balanMoney2 = this.data.balanMoney2
      const regex = /^(0|[1-9]\d*)$/;
      console.log(regex.test(balanMoney2));
      if (regex.test(balanMoney2)) {
         this.setData({
            balanMoney: balanMoney2,
            balanType: 1,
         })
         this.closePopup2()
         this.zongprice()
      } else {
         wx.showToast({
            title: '请输入正确的金额',
            icon: 'none'
         })
      }
   },
   /**
   * 获取积分
   */
  walletsList() {
    app.apiPost(app.apiList.integral_list, {
      page: this.data.page
    }, (res) => {
      // 如果返回未授权，不做处理
      if (res.status === 10011) {
        return;
      }
      this.setData({
        integral: res.data.integral
      });
    }, { requireAuth: false });
  },
   toreceive() {
      wx.navigateTo({
         url: '/pages/receivequan/receivequan',
      })
   },
   nottap(e) {
      wx.showToast({
         title: '本商品不支持' + (e.currentTarget.dataset.type == 1 ? '自提' : '配送'),
         icon: 'none'
      })
   },
   scanCode() {
      wx.scanCode({
         onlyFromCamera: true,
         success(res) {
            console.log(res)
            wx.navigateTo({
               url: '/' + res.path,
            })
         }
      })
   },
   /**
    * 检查用户是否已登录
    * @returns {boolean}
    */
   checkLogin() {
      if (!this.data.userinfo) {
         wx.showToast({
            title: '请先登录',
            icon: 'none',
            success: () => {
               setTimeout(() => {
                  wx.navigateTo({ url: '/pages/login/login' });
               }, 1000);
            }
         });
         return false;
      }
      return true;
   },

   /**
    * 检查用户信息是否完善
    * @returns {boolean}
    */
   checkUserProfile() {
      const userinfo = this.data.userinfo;
      if (!userinfo) return false;
      
      const defaultHeadimg = 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132';
      
      if (userinfo.headimg === defaultHeadimg || userinfo.nickname === '微信用户' || !userinfo.phone) {
         wx.showModal({
            title: '提示',
            content: '请先完善信息',
            complete: (res) => {
               if (res.confirm) {
                  wx.navigateTo({ url: '/pages/setpage/setpage' });
               }
            }
         });
         return false;
      }
      return true;
   },

   /**
    * 抢购
    */
   tobuy(e) {
      if (!this.checkLogin()) return;
      if (!this.checkUserProfile()) return;
      
      const goods_id = this.data.goodslist[e.currentTarget.dataset.index].goods_id;
      wx.navigateTo({
         url: '/pages/addorder/addorder?num=1&goods_id=' + goods_id,
      });
      return
      app.apiPost(app.apiList.goodsDetail, {
         goods_id
      }, (res) => {
         if (res.data.zttype == 1) {
            that.setData({
               chooseStyle: 1,
               xdistance: 348
            })
         }
         if (res.data.zttype == 2) {
            that.setData({
               chooseStyle: 2,
               xdistance: 0
            })
         }
         that.setData({
            Detail: res.data,
            zttype: res.data.zttype,
            storeLatitude: res.data.store_info.latitude,
            storeLongitude: res.data.store_info.longitude,
            freight_info: res.data.goodsinfo.freight_info,
            commodityshow: true,
            num: 1,
            goods_id,
            coupons: []
         })
         app.apiPost(app.apiList.chanumcou, {
            num: 1,
            goods_id
         }, (data) => {
            that.setData({
               have_quan: data.data.have_quan
            })
         })
         that.getAddressList()
      })
   },
   getusersendtime() {
      this.requestStart()
      app.apiPost(app.apiList.getusersendtime, {}, (res) => {
         this.requestComplete()
         this.setData({
            usersendtime: Number(res.data),
            send_tip: res.twoData
         })
         this.findsendtime()
      }, { requireAuth: false, showLoading: false })
   },
   findsendtime() {
      var that = this
      var usersendtime = that.data.usersendtime
      var date = new Date()
      var stime = date.getTime() + usersendtime * 60 * 60 * 1000
      const today = new Date(date.setHours(0, 0, 0, 0)).getTime(); //获取当天零点的时间
      app.apiPost(app.apiList.findsendtime, {}, (res) => {
         var timelist = []
         const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
         const todayweek = new Date().getDay();
         res.data.forEach(v => {
            if (v.day == '今天') {
               var day = today
               v.day = v.day + '（' + days[todayweek] + '）'
            } else if (v.day == '明天') {
               var day = today + 24 * 60 * 60 * 1000
               if (todayweek % 6 == 0) {
                  var tomorrowweek = 0
               } else {
                  var tomorrowweek = todayweek + 1
               }
               v.day = v.day + '（' + days[tomorrowweek] + '）'
            } else if (v.day == '后天') {
               var day = today + 24 * 60 * 60 * 1000 * 2
               if (todayweek % 6 == 0) {
                  var passtomorrowweek = 1
               } else if (todayweek % 5 == 0) {
                  var passtomorrowweek = 0
               } else {
                  var passtomorrowweek = todayweek + 2
               }
               v.day = v.day + '（' + days[passtomorrowweek] + '）'
            } else {
               var d = Number(v.day.slice(0, -2))
               var day = today + 24 * 60 * 60 * 1000 * d
               v.day = utils.getFutureDate(d)
            }
            var starlist = v.sendstar.split(':')
            var statime = new Date(new Date(day).setHours(starlist[0], starlist[1], starlist[2])).getTime()
            if (stime < statime) {
               // timelist.push(v.day + '：' + v.sendstar + '~' + v.sendend)
               v.sendstar = v.sendstar.slice(0, -3)
               v.sendend = v.sendend.slice(0, -3)
               timelist.push(v)
            }
         })
         const groupedData = res.data.reduce((acc, item) => {
            const dayKey = item.day; // 获取当前项的 day 值（例如 "后天"）
            if (!acc[dayKey]) { // 如果该 day 不存在则初始化空数组
               acc[dayKey] = [];
            }
            acc[dayKey].push(item); // 将当前项推入对应数组
            return acc;
         }, {});
         timelist = Object.entries(groupedData).map(([day, items]) => ({
            day,
            items
         }));
         this.setData({
            timelist
         })
      })
   },
   //关闭立即订购商品列表
   commodityclo() {
      var that = this
      that.setData({
         commodityshow: false
      })
   },
   //接收返回值商品数量num
   onChange(event) {
      console.log(event)
      var that = this
      that.setData({
         num: event.detail
      })
      var data1 = {
         num: that.data.num,
         goods_id: that.data.goods_id
      }
      var coupons = that.data.coupons ? that.data.coupons : []
      if (event.detail < coupons.length) {
         wx.showToast({
            title: '优惠券数量大于您所购买的商品数量',
            icon: 'none',
            success() {
               coupons.pop()
               that.setData({
                  coupons
               })
               that.zongprice()
            }
         })
      } else {
         that.zongprice()
      }
      app.apiPost(app.apiList.chanumcou, data1, (data) => {
         var have_quan = data.data.have_quan
         if (that.data.coupons.length < Number(have_quan)) {
            wx.showToast({
               title: '您有更多可用优惠券',
               icon: 'none'
            })
         }
         that.setData({
            have_quan
         })
      })
   },
   //跳转到选择卡券
   choosecard(e) {
      let that = this;
      let have_quan = that.data.have_quan;
      var quan_id = 0;
      let goods_id = that.data.Detail.goods_id;
      let coupons = that.data.coupons ? that.data.coupons : [];
      if (coupons.length > 0) {
         var quan_id = ''
         coupons.forEach(v => {
            if (quan_id) {
               quan_id = quan_id + ',' + v.quan_id
            } else {
               quan_id = v.quan_id
            }
         })
      }
      wx.navigateTo({
         url: '/pages/choosecard/choosecard?quan_id=' + quan_id + '&price=' + this.data.zongprice + "&goods_id=" + goods_id + '&goodsnum=' + this.data.num,
      })
   },
   //计算总价格
   zongprice() {
      var that = this
      var userinfo = that.data.userinfo;
      var price;
      
      if (userinfo && userinfo.level == 1) {
         price = Number(that.data.Detail.memberprice)
      } else {
         price = Number(that.data.Detail.normalprice)
      }
      
      var zongprice = (price * that.data.num).toFixed(2)
      var zongmoney = (price * that.data.num).toFixed(2)
      if (that.data.reducemoney) {
         zongprice = zongprice - that.data.reducemoney
      }
      var coupons = that.data.coupons ? that.data.coupons : []
      var coupon_money = 0
      if (coupons.length > 0) {
         coupons.forEach(v => {
            if (v.is_discount == 1) {
               var c_money = (price - price * v.zhekou / 10).toFixed(2);
            } else { //满减
               var c_money = v.used_amount
            }
            c_money = Number(c_money);
            coupon_money += c_money
            zongprice -= c_money;
         })
         that.setData({
            coupon_money: Number(coupon_money).toFixed(2)
         })
      }
      var all_zongprice = zongprice
      // 是否使用积分
      var balanType = that.data.balanType
      var checked = that.data.checked
      var integral = that.data.integral / 100
      if (checked) {
         if (balanType == 0) {
            var usedBalance = Math.min(integral, zongprice);
         } else if (balanType == 1) {
            var balanMoney = that.data.balanMoney / 100
            var usedBalance = Math.min(integral, zongprice, balanMoney);
         }
      } else {
         var usedBalance = 0.00
      }
      console.log(usedBalance);
      zongprice -= usedBalance
      //判断是否显示运费
      if (that.data.chooseStyle == 1 || Number(that.data.num) >= Number(that.data.Detail.manjianzitifuwufei)) {
         var express = 0
      } else {
         var express = Number(that.data.express)
      }
      that.setData({
         express: express.toFixed(2)
      })
      zongprice = Number(zongprice) + express
      zongprice = Math.abs(Number(zongprice)).toFixed(2)
      all_zongprice = Number(all_zongprice).toFixed(2)
      var all_balance = Number(usedBalance).toFixed(2)
      var all_money = Number(coupon_money + usedBalance).toFixed(2)
      that.setData({
         zongprice,
         zongmoney,
         all_zongprice,
         all_balance,
         all_money,
         reduce_balance: usedBalance * 100,
         balanMoney2: usedBalance * 100,
      })
      that.chanumcou()
   },
   chanumcou() {
      var that = this
      app.apiPost(app.apiList.chanumcou, {
         num: that.data.num,
         goods_id: that.data.Detail.goods_id,
         goods_price: that.data.zongprice
      }, (data) => {
         that.setData({
            have_quan: data.data.have_quan
         })
      })
   },
   //查询收货地址列表
   getAddressList() {
      var that = this;
      //自提情况
      app.apiPost(app.apiList.findAddress, {}, (data) => {
         if (data.status == 1) {
            if (data.data.length == 0) {
               that.setData({
                  address_id: '',
                  shouAddress: ''
               })
               return;
            }
            var Address = data.data
            that.setData({
               Address: data.data,
            })
            if (Address.find(item => item.default == 1)) {
               var shouAddress = Address.find(item => item.default == 1)
               that.setData({
                  shouAddress,
                  latitude: shouAddress.latitude,
                  longitude: shouAddress.longitude,
                  address_id: shouAddress.id
               })
               that.setexpress()
            } else {
               that.zongprice()
            }
         } else {
            wx.showToast({
               title: data.msg,
               icon: 'loading'
            })
         }
      })
   },
   //计算运费
   setexpress() {
      var that = this
      if (that.data.shouAddress) {
         var shouAddress = that.data.shouAddress
         var distance = that.setdistance(shouAddress.latitude, shouAddress.longitude) //单位：米
         distance = Number(distance / 1000)
         var freight_info = that.data.freight_info
         if (distance <= freight_info.distance) {
            var express = freight_info.com_price
         } else if (distance > freight_info.distance && distance <= freight_info.distance2) {
            var express = freight_info.com_price2
         } else {
            var express = Number(distance * freight_info.ex_price).toFixed(2)
         }
         that.setData({
            express
         })
         that.zongprice()
      }
   },
   //计算距离
   setdistance(latitude, longitude) {
      var lat1 = latitude * Math.PI / 180;
      var lon1 = longitude * Math.PI / 180;
      var lat2 = this.data.storeLatitude * Math.PI / 180;
      var lon2 = this.data.storeLongitude * Math.PI / 180;
      //差值
      var vLon = Math.abs(lon1 - lon2);
      var vLat = Math.abs(lat1 - lat2);
      //h is the great circle distance in radians, great circle就是一个球体上的切面，它的圆心即是球心的一个周长最大的圆。
      var v = Math.sin(vLat / 2);
      var v1 = Math.sin(vLon / 2);
      var h = v * v + Math.cos(lat1) * Math.cos(lat2) * v1 * v1;
      // 地球半径 平均值，米
      var distance = 2 * 6371000 * Math.asin(Math.sqrt(h));
      return distance;
   },
   //用户选择配送方式
   chooseStyle(e) {
      //console.log('切换')
      var that = this;
      var id = e.currentTarget.dataset.id;
      var xdistance = id == 1 ? 348 : 0
      that.setData({
         chooseStyle: id,
         xdistance
      });
      if (id == 1) {
         that.zongprice()
      } else {
         that.setexpress()
      }
   },
   yesztdian() {
      this.setData({
         zitiquerenshow: false,
         ztdian: this.data.ztdian2,
         zitiqueren: true
      })
      this.back()
   },
   guanbi() {
      this.setData({
         zitiquerenshow: false,
      })
   },
   //选择自提点
   choztdian123() {
      this.setData({
         zitiquerenshow: false,
      })
      wx.navigateTo({
         url: '/pages/chooseztdian/chooseztdian',
      })
   },
   //提交订单列表
   back() {
      var that = this
      if (!that.data.shouAddress && that.data.chooseStyle == 2) {
         wx.showToast({
            title: '请选择收货地址',
            icon: 'none'
         })
         return
      }
      // if (!that.data.song_time && that.data.chooseStyle == 2) {
      //   wx.showToast({
      //     title: '请选择送货时间',
      //     icon: 'none'
      //   })
      //   return
      // }
      if (that.data.zindextime == -1 && that.data.chooseStyle == 2) {
         wx.showToast({
            title: '请选择送货时间',
            icon: 'none'
         })
         return
      } else if (that.data.zindextime != -1 && that.data.chooseStyle == 2) {
         var timelist = that.data.timelist
         var zindexday = that.data.zindexday
         var zindextime = that.data.zindextime
         var song_time = timelist[zindexday].day + '- ' + timelist[zindexday].items[zindextime].sendstar + '~' + timelist[zindexday].items[zindextime].sendend
         that.setData({
            song_time,
         })
      }
      // if (!that.data.ztdian && that.data.chooseStyle == 1) {
      //    wx.showToast({
      //       title: '请选择自提点',
      //       icon: 'none'
      //    })
      //    return
      // }
      if (!that.data.zitiqueren && that.data.chooseStyle == 1) {
         if (!that.data.ztdian) {
            that.ssjs()
         } else {
            that.setData({
               ztdian2: that.data.ztdian
            })
         }
         that.setData({
            zitiquerenshow: true,
         })
         return
      }
      if (!that.data.userphone && that.data.chooseStyle == 1) {
         wx.showToast({
            title: '请填写提货人手机号码',
            icon: 'none'
         })
         return
      }
      var userinfo = that.data.userinfo
      if (userinfo && that.data.chooseStyle == 1 && (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone)) {
         wx.showToast({
            title: '请先完善您的资料',
            icon: 'none',
            success() {
               setTimeout(() => {
                  wx.navigateTo({
                     url: '/pages/setpage/setpage',
                  })
               }, 1500)
            }
         })
         return
      }
      var coupons = that.data.coupons || []
      var have_quan = that.data.have_quan || 0
      console.log(have_quan);
      var content = have_quan > 1 ? '您有“多张可用优惠券”未使用' : '您有“可用优惠券”未使用'
      if (that.data.have_quan > 0 && coupons.length == 0) {
         wx.showModal({
            title: '提示',
            content: content,
            cancelText: '继续支付',
            confirmText: '前往使用',
            complete: (res) => {
               if (res.cancel) {
                  if (that.data.integral != 0 && that.data.reduce_balance == 0) {
                     wx.showModal({
                        title: '提示',
                        content: '您有“可抵现金的积分”未使用',
                        cancelText: '继续支付',
                        confirmText: '前往使用',
                        complete: (res) => {
                           if (res.cancel) {
                              wx.showLoading({
                                 title: '订单提交中',
                                 mask: true
                              })
                              that.Order()
                              that.setData({
                                 commodityshow: false
                              })
                           }
                           if (res.confirm) {
                              that.balanShow()
                           }
                        }
                     })
                  } else {
                     wx.showLoading({
                        title: '订单提交中',
                        mask: true
                     })
                     that.Order()
                     that.setData({
                        commodityshow: false
                     })
                  }
               }
               if (res.confirm) {
                  that.choosecard()
               }
            }
         })
      } else {
         if (that.data.integral != 0 && that.data.reduce_balance == 0) {
            wx.showModal({
               title: '提示',
               content: '您有“可抵现金的积分”未使用',
               cancelText: '继续支付',
               confirmText: '前往使用',
               complete: (res) => {
                  if (res.cancel) {
                     wx.showLoading({
                        title: '订单提交中',
                        mask: true
                     })
                     that.Order()
                     that.setData({
                        commodityshow: false
                     })
                  }
                  if (res.confirm) {
                     that.balanShow()
                  }
               }
            })
         } else {
            wx.showLoading({
               title: '订单提交中',
               mask: true
            })
            that.Order()
            that.setData({
               commodityshow: false
            })
         }
      }
   },
   //提交订单
   Order() {
      var that = this
      var goods_num = that.data.num //商品数量
      var goods_name = that.data.Detail.goods_name //商品名称
      var userinfo = that.data.userinfo;
      var goods_price = (userinfo && userinfo.level == 1) ? that.data.Detail.memberprice : that.data.Detail.normalprice //商品价格
      var goods_id = that.data.Detail.goods_id //商品id
      var Address = that.data.Address ?? 0
      if (that.data.address_id) {
         // 获取点击地址
         for (let i = 0; i < Address.length; i++) {
            if (that.data.address_id == Address[i].id) {
               var useAddress = Address[i]
            }
         }
      } else {
         // 获取默认地址
         if (Address) {
            for (let i = 0; i < Address.length; i++) {
               if (Address[i].default == 1) {
                  var useAddress = Address[i]
               }
            }
         } else {
            if (that.data.chooseStyle == 2) {
               that.take()
               return
            }
         }
      }
      // if (!useAddress && that.data.chooseStyle == 2) {
      //   that.take()
      //   // wx.showToast({
      //   //   title: '请选择地址',
      //   //   icon: 'none'
      //   // })
      //   return
      // }
      var shouAddress = that.data.shouAddress
      // 判断是否默认值
      if (that.data.chooseStyle == 2) {
         var userphone = shouAddress.phone //收货人联系方式
         var useraddress = shouAddress.street + shouAddress.address + shouAddress.detail_address //收货人地址
         var username = shouAddress.username //收货人姓名
      } else {
         var userphone = that.data.userphone
         var username = that.data.userinfo ? that.data.userinfo.nickname : '用户'
         var useraddress = '自提：' + that.data.ztdian.zt_addressxinagxi
      }
      var pay_real_money = that.data.zongprice //实际付款金额
      var isallPoints = pay_real_money == 0
      var pointspay = that.data.reduce_balance
      var summoney = goods_price * goods_num //总额
      var data = {
         goods_num,
         goods_name,
         goods_price,
         goods_id,
         userphone,
         useraddress,
         username,
         summoney,
         pay_real_money,
         isallPoints,
         pointspay,
         store_id: 1,
         store_name: '冀唐清泉',
         deliver_type: 2,
         ztdian_type: that.data.chooseStyle,
         deliver_money: that.data.express,
         orderremark: that.data.notesValue ? that.data.notesValue : '',
         second_day: 1,
         balancepay: that.data.money, //余额支付金额
      }
      if (that.data.chooseStyle == 1) {
         data['ztdian'] = that.data.ztdian.id
      }
      if (that.data.chooseStyle == 2) {
         data['song_time'] = that.data.song_time
      }
      var coupons = that.data.coupons ? that.data.coupons : []
      console.log(coupons)
      if (coupons.length > 0) {
         coupons.forEach(v => {
            var quan_id = ''
            coupons.forEach(v => {
               if (quan_id) {
                  quan_id = quan_id + ',' + v.quan_id
               } else {
                  quan_id = v.quan_id
               }
            })
            data['quan_id'] = quan_id
            data['quan_money'] = that.data.coupon_money
         })
      }
      // if (that.data.coupon) {
      //   data['quan_id'] = that.data.coupon.quan_id
      //   data['quan_money'] = that.data.coupon.coupon_money
      // }
      app.apiPost(app.apiList.fyaddOrder, data, (res) => {
         if (res.status === 1) {
            that.setData({
               btnstatus: false
            });
            
            const pay_real_money = res.orderinfo.pay_real_money;
            const orderno = res.orderinfo.orderno;
            
            if ((that.data.useye && that.data.zongprice == 0) || res.iszero == 1) {
               that.handleZeroPayment(orderno);
               return;
            }
            
            that.requestPayment(res.payinfo, orderno);
         } else {
            wx.showToast({
               title: res.msg || '下单失败',
               icon: 'none'
            });
         }
      });
   },

   /**
    * 处理零元支付
    */
   handleZeroPayment(orderno) {
      wx.showLoading({
         title: '订单支付成功',
         mask: true
      });
      setTimeout(() => {
         wx.hideLoading();
         wx.redirectTo({
            url: '/pages/buysuccess/buysuccess?orderno=' + orderno,
         });
      }, 1500);
   },

   /**
    * 请求微信支付
    */
   requestPayment(payinfo, orderno) {
      wx.requestPayment({
         timeStamp: payinfo.timeStamp,
         nonceStr: payinfo.nonceStr,
         package: payinfo.package,
         signType: 'MD5',
         paySign: payinfo.paySign,
         success: () => {
            wx.showToast({
               title: '订单支付成功',
               icon: 'success',
               duration: 1500,
               success: () => {
                  setTimeout(() => {
                     wx.redirectTo({
                        url: '/pages/buysuccess/buysuccess?orderno=' + orderno,
                     });
                  }, 1500);
               }
            });
         },
         fail: (res) => {
            console.error('支付失败:', res);
            this.setData({ btnstatus: false });
            wx.showToast({
               title: '支付失败',
               icon: 'none'
            });
         }
      });
   },

   //选择自提点
   choztdian() {
      wx.navigateTo({
         url: '/pages/chooseztdian/chooseztdian',
      })
   },
   inuphone(e) {
      this.setData({
         userphone: e.detail.value
      })
   },
   //跳转至地址列表页
   take() {
      console.log('take')
      wx.navigateTo({
         url: '/pages/editAddress/editAddress?type=order',
      })
   },
   pickerchange(e) {
      this.setData({
         song_time: this.data.timelist[e.detail.value]
      })
      // var picklist = that.data.picklist
      // var ilist = e.detail.value
      // var stime = picklist[0][ilist[0]] + '-' + picklist[1][ilist[1]] + '-' + picklist[2][ilist[2]] + ' ' + picklist[3][ilist[3]]
      // console.log(stime)
      // console.log(new Date(stime + ':00').getTime(), new Date().getTime())
      // if (new Date(stime + ':00').getTime() < new Date().getTime()) {
      //   wx.showToast({
      //     title: '您选择的配送时间小于当前事前',
      //     icon: 'none'
      //   })
      // } else {
      //   that.setData({
      //     song_time: stime
      //   })
      // }
   },



   // 监听页面滚动
   onPageScroll(e) {
      if (e.scrollTop > 300) {
         this.setData({
            headShow: true,
         })
      } else {
         this.setData({
            headShow: false,
         })
      }
   },
   gosearch() {
      wx.navigateTo({
         url: '/pages/search/search',
      })
   },
   tozt() {
      wx.navigateTo({
         url: '/pages/chooseztdian/chooseztdian',
      })
   },
   //金刚区点击
   icatap(e) {
      if (wx.getStorageSync('token_new')) {
         //跳转页面
         wx.navigateTo({
            url: '/pages/lotgoodslist/lotgoodslist?chooseStyle=' + e.currentTarget.dataset.index,
         })
      } else {
         wx.navigateTo({
            url: '/pages/login/login',
         })
      }
   },
   //切换商品列表筛选
   changetype(e) {
      this.setData({
         paixuindex: e.currentTarget.dataset.type,
         page: 1
      })
      this.goodsPage()
   },
   //切换显示状态
   changeshow() {
      if (this.data.showtype == 1) {
         var showtype = 2
      } else {
         var showtype = 1
      }
      this.setData({
         showtype
      })
      wx.setStorageSync('showtype', showtype)
   },
   //获取自提点信息
   getztdian() {
      app.apiPost(app.apiList.getztdian, {
         page: 1,
         limit: 1,
         latitude: this.data.latitude,
         longitude: this.data.longitude
      }, (res) => {
         //  this.setData({
         //     ztdian: res.data[0]
         //  })
         //  wx.setStorage({
         //     key: 'ztdian',
         //     data: res.data[0],
         //  });
         res.data[0].distance = (res.data[0].distance / 1000).toFixed(2)
         this.setData({
            ztdian2: res.data[0]
         })
      })
   },
   goalllive() {
      wx.navigateTo({
         url: '/pages/activity/activity',
      })
   },
   gotoLive(e) {
      let index = e.currentTarget.dataset.index
      let activity = this.data.activitylist2[index]
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
   //保存海报
   downhb() {
      var that = this
      wx.saveImageToPhotosAlbum({
         filePath: this.data.hbpath,
         success() {
            that.setData({
               show: false
            })
         }
      })
   },
   showshare() {
      if (this.data.userinfo) {
         this.setData({
            show: true
         })
      } else {
         wx.navigateTo({
            url: '/pages/login/login',
         })
      }
   },
   onClose() {
      this.setData({
         show: false
      })
   },
   callphone() {
      wx.makePhoneCall({
         phoneNumber: '18833330416',
      })
   },
   tapg() {
      var that = this
      if (this.data.userinfo) {
         this.towallet()
      } else {
         wx.navigateTo({
            url: '/pages/login/login',
         })
         // wx.login({
         //   success: function (res) {
         //     var code = res.code
         //     // 获取用户信息
         //     wx.getUserInfo({
         //       lang: "zh_CN",
         //       success: function (data) {
         //         var rawData = data.rawData;
         //         var signature = data.signature;
         //         var encryptedData = data.encryptedData;
         //         var iv = data.iv;
         //         that.gouserinfo(code, rawData, signature, encryptedData, iv)
         //       },
         //     });
         //   },
         // });
      }
   },


   tobanner(e) {
      var that = this
      var bannerlist = that.data.bannerlist
      var index = e.currentTarget.dataset.index
      if (bannerlist[index].iswhere == 3) {
         wx.navigateTo({
            url: bannerlist[index].path,
         })
      }
   },
   insearch(e) {
      this.setData({
         searchstr: e.detail.value
      })
   },
   nosearch() {
      this.setData({
         searchstr: '',
         page: 1
      })
      this.goodsPage()
   },
   //我的余额
   towallet() {
      if (wx.getStorageSync('token_new')) {
         wx.navigateTo({
            url: '/pages/mypoints/mypoints',
         })
      } else {
         wx.navigateTo({
            url: '/pages/login/login',
         })
      }
   },
   //我的卡券
   tokq() {
      if (wx.getStorageSync('token_new')) {
         wx.navigateTo({
            url: '/pages/mycard/mycard',
         })
      } else {
         wx.navigateTo({
            url: '/pages/login/login',
         })
      }
   },
   tosetyearcard() {
      if (wx.getStorageSync('token_new')) {
         wx.navigateTo({
            url: '/pages/exchangeCDK/exchangeCDK',
         })
      } else {
         wx.navigateTo({
            url: '/pages/login/login',
         })
      }
   },
   //商品列表
   goodsPage() {
      var that = this
      var data = {
         page: that.data.page,
         limit: 50,
         typeid: that.data.cate_pid,
         latitude: 0,
         longitude: 0,
         address: '',
         search_str: that.data.searchstr,
         is_notshow_vip_goods: 1
      }
      console.log(that.data.paixuindex)
      // if (that.data.paixuindex == 0) {
      //    data['ishot'] = 1
      // }
      if (that.data.paixuindex) {
         if (that.data.paixuindex == 4) {
            data['xg'] = 1
         } else {
            data['paixu'] = that.data.paixuindex
         }
      }
      this.requestStart()
      app.apiPost(app.apiList.goodsPage, data, (res) => {
         this.requestComplete()
         // var viplist = that.data.viplist
         // res.data.forEach(v => {
         //   if (v.is_vip == 1) {
         //     viplist.push(v)
         //   }
         // })
         if (that.data.page == 1) {
            var goodslist = res.data
         } else {
            var goodslist = that.data.goodslist.concat(res.data)
         }
         console.log(goodslist)
         that.setData({
            goodslist,
            // viplist
         })
         this.getspecs(goodslist, 0, 'goodslist')
         // if (that.data.showtype == 2 && that.data.page == 1) {
         // setTimeout(() => {
         //   const waterfallInstance = that.selectComponent("#waterfall");
         //   waterfallInstance.reflow();
         //   that.setData({
         //     notscroll: false
         //   })
         // }, 1000)
         // } else {
         // wx.hideLoading()
         // }
      }, { requireAuth: false, showLoading: false })
   },
   //商品列表
   hotGoods() {
      var that = this
      this.requestStart()
      var data = {
         page: 1,
         limit: 5,
         typeid: 0,
         latitude: 0,
         longitude: 0,
         address: '',
         is_notshow_vip_goods: 1,
         ishot: 1
      }
      app.apiPost(app.apiList.goodsPage, data, (res) => {
         that.requestComplete()
         that.setData({
            hotgoodslist: res.data,
         })
         this.getspecs(res.data, 0, 'hotgoodslist')
      }, { requireAuth: false, showLoading: false })
   },
   //商品列表
   cuxiaoGoods() {
      var that = this
      this.requestStart()
      var data = {
         page: 1,
         limit: 6,
         typeid: 0,
         latitude: 0,
         longitude: 0,
         address: '',
         search_str: '',
         is_notshow_vip_goods: 1,
         is_cx: 1
      }
      app.apiPost(app.apiList.goodsPage, data, (res) => {
         that.requestComplete()
         this.setData({ cxgoosList: res.data })
         this.getspecs(res.data, 0, 'cxgoosList')
      }, { requireAuth: false, showLoading: false })
   },
   getspecs(list, index, key) {
      if (index >= list.length) {
         return
      }
      this.requestStart()
      app.apiPost(app.apiList.getspecs, {
         goods_id: list[index].goods_id
      }, (res) => {
         this.requestComplete()
         let list = this.data[key]
         let gIndex = list.findIndex(v => v.goods_id == list[index].goods_id)
         const specs_pfmoney = Math.min(...res.data.map(item => Number(item['specs_pfmoney'])).filter(price => !isNaN(price)))
         const specs_tgmoney = Math.min(...res.data.map(item => Number(item['specs_tgmoney'])).filter(price => !isNaN(price)))
         const specs_erpmoney = Math.min(...res.data.map(item => Number(item['specs_erpmoney'])).filter(price => !isNaN(price)))
         const specs_vipmoney = Math.min(...res.data.map(item => Number(item['specs_vipmoney'])).filter(price => !isNaN(price)))
         list[gIndex].specs_pfmoney = (specs_pfmoney || 0).toFixed(2)
         list[gIndex].specs_tgmoney = (specs_tgmoney || 0).toFixed(2)
         list[gIndex].specs_erpmoney = (specs_erpmoney || 0).toFixed(2)
         list[gIndex].specs_vipmoney = (specs_vipmoney || 0).toFixed(2)
         const totalStock = res.data.reduce((sum, item) => sum + (Number(item.specs_stock) || 0), 0)
         list[gIndex].all_goodsstock = totalStock
         list[gIndex].goodsstock = totalStock
         list[gIndex].specs = res.data
         this.setData({
            [key]: list
         })
         this.getspecs(list, index + 1, key)
      }, { showLoading: false, requireAuth: false })
   },
   miniIndex() {
      this.requestStart()
      app.apiPost(app.apiList.miniIndex, {}, (res) => {
         this.requestComplete()
         //跑马灯文案
         var pmd = res.data.rolatist;
         var pmd_text = [];
         for (var i = 0; i < pmd.length; i++) {
            // pmd[i].pay_time = app.util.getDateDiff(pmd[i].pay_time);
            pmd_text.push({
               id: pmd[i].goodsid,
               textBefore: pmd[i].nickname + '刚刚订购了',
               goodsName: pmd[i].goodsname,
               dateTime: pmd[i].pay_time,
               //  text:pmd[i].nickname+'买了'+pmd[i].goodsname+' · '+pmd[i].pay_time
            })
         }
         this.setData({
            bannerlist: res.data.bannerlist,
            pmd_text
         })
      }, { requireAuth: false, showLoading: false })
   },
   //商品详情
   toinfo(e) {
      wx.navigateTo({
         url: '/pages/goodsinfo/goodsinfo?id=' + e.currentTarget.dataset.id,
      })
   },
   /**
   * 获取用户中心信息
   */
  userCenter() {
    // 先从本地存储读取用户信息作为备用
    const localUserInfo = wx.getStorageSync('userinfo');
    if (localUserInfo) {
      this.setData({ userinfo: localUserInfo });
      if (localUserInfo.phone) {
        this.setData({ userphone: localUserInfo.phone });
      }
    }
    
    app.apiPost(app.apiList.userCenter, {}, (res) => {
      // 如果返回未授权，不做处理
      if (res.status === 10011) {
        return;
      }
      
      this.setData({
        userinfo: res.data
      });
      if (res.data.phone) {
        this.setData({
          userphone: res.data.phone
        });
      }
      // 更新本地存储
      wx.setStorageSync('userinfo', res.data);
      
      const register_time = Number(res.data.register_time) * 1000;
      const thistime = new Date().getTime();
      if ((register_time + 7 * 24 * 60 * 60 * 1000) > thistime && res.data.phone && res.data.nickname != '微信用户' && res.data.headimg != '') {
        this.newquan();
      }
      this.drawErcode();
    }, { showLoading: false, requireAuth: false });
  },
   changevip(e) {
      this.setData({
         goods_vip: e.currentTarget.dataset.type,
      })
      this.nklist()
   },
   nklist() {
      var that = this
      that.requestStart()
      app.apiPost(app.apiList.goodsPage, {
         page: 1,
         limit: 2,
         goods_vip: that.data.goods_vip,
         typeid: 0,
         latitude: 0,
         longitude: 0,
      }, (res) => {
         that.requestComplete()
         that.setData({
            nklist: res.data
         })
      }, { requireAuth: false, showLoading: false })
   },
   //得到小程序二维码
   drawErcode() {
      var that = this;
      var data = {
         draw_type: 'userinvite',
         path: 'pages/index/index',
      }
      app.apiPost(app.apiList.drawErcode, data, (data) => {
         if (data.status == 1) {
            // var posterConfig = that.data.posterConfig;
            base64src(data.base64img.base64, res => {
               console.log(res) // 返回图片地址，直接赋值到image标签即可
               var hbinfo = that.data.hbinfo
               hbinfo.views[0].url = res
               that.setData({
                  hbinfo
               })
               // posterConfig.images[1].url = res;
               // that.setData({
               //   erweima: res,
               //   posterConfig
               // });
            });
         }
      })
   },
   //生成海报
   onImgOK(e) {
      console.log(e)
      this.setData({
         hbpath: e.detail.path
      })
   },
   //首页的横向分类
   getIndexCat() {
      this.requestStart()
      app.apiPost(app.apiList.getIndexCat, {}, (res) => {
         this.requestComplete()
         this.setData({
            indexcat: res.data
         })
      }, { requireAuth: false, showLoading: false })
   },
   gotoactivity() {
      wx.navigateTo({
         url: '/pages/activity/activity',
      })
   },
   //活动商品
   getactivitylist() {
      let data = {
         active_type: 0,
      }
      app.apiPost(app.apiList.getactivitylist, data, (res) => {
         this.setData({
            activitylist: res.data
         })
      })
   },
   closeQrcodePop() {
      this.setData({
         showQrcodePopup: false
      })
   },
   kongkongruye() {
      // 阻止冒泡事件
   },
   showgroupimg() {
      this.setData({
         showQrcodePopup: true
      })
   },
   daimg() {
      wx.previewImage({
         current: "https://qiniu.0315678.cn/" + this.data.sharepic,
         urls: ["https://qiniu.0315678.cn/" + this.data.sharepic]
      });
   },
   getIndexSet() {
      this.requestStart()
      app.apiPost(app.apiList.getIndexSet, {}, (res) => {
         this.requestComplete()
         this.setData({
            sharepic: res.data.sharepic,
            kanYiDao: res.data.kanYiDao,
            KYDimg: res.data.KYDimg,
         })
      }, { requireAuth: false, showLoading: false })
   },
   newquan() {
      app.apiPost(app.apiList.newquan, {}, (res) => {
         if (res.data.is_lingqu == 0) {
            this.setData({
               newquan: res.data,
               shownew: true,
            })
         }
      })
   },
   closenew() {
      this.setData({
         shownew: false,
      })
   },
   onLoad(options) {
      console.log(options)
      var that = this
      //显示全局 loading
      wx.showLoading({
         title: '加载中...',
         mask: true
      })
      //初始化请求计数
      this.setData({
         loading: true,
         requestCount: 0
      })
      
      this.goodsPage()
      this.miniIndex()
      this.nklist()
      this.getIndexCat()
      // this.getactivitylist()
      this.getIndexSet()
      this.getusersendtime()
      this.getgoodscat()
      this.getactivitylist2()
      this.cuxiaoGoods()
      this.hotGoods()
      if (options) {
         //扫描小程序码进入小程序取得参数
         const scene = decodeURIComponent(options.scene);
         if (scene != 'undefined') {
            //邀请人的id
            var arr = scene.split("&");
            console.log(arr)
            if (arr[1] == "invite") {
               app.captureReferrer(arr[0])
               // that.setData({
               //   ruid: arr[0]
               // })
            }
         }
         if (options.ruid) {
            app.captureReferrer(options.ruid)
            // that.setData({
            //   ruid: options.ruid
            // })
         }
         // if (options.coupon) {
         //   var coupon = JSON.parse(options.coupon)
         //   coupon.quan_id = coupon.histoty_id
         //   var coupons = [coupon]
         //   that.setData({
         //     coupons
         //   })
         //   console.log(that.data.coupons)
         // }
      }

      var menu = wx.getMenuButtonBoundingClientRect()
      var windowsinfo = wx.getWindowInfo()
      var pixelRatio = windowsinfo.windowWidth / 750
      this.setData({
         top: menu.top,
         height: menu.height,
         windowsHeight: windowsinfo.windowHeight,
         pixelRatio
      })
      if (wx.getStorageSync('showtype')) {
         this.setData({
            showtype: wx.getStorageSync('showtype')
         })
      }
   },
   onShow() {
      var that = this
      tab_bar.getTab(0)
      this.userCenter()
      this.walletsList()
      // onShow 中不重新加载商品列表，避免重复请求
      wx.getLocation({
         success(res) {
            that.setData({
               latitude: res.latitude,
               longitude: res.longitude,
            })
            // that.getztdian()
         }
      })
   },
   ssjs() {
      var that = this
      wx.getLocation({
         success(res) {
            that.setData({
               latitude: res.latitude,
               longitude: res.longitude,
            })
            that.getztdian()
         }
      })
   },
   toshare() {
      this.setData({
         show: false
      })
   },
   onShareAppMessage() {
      return {
         path: '/pages/index/index?ruid=' + wx.getStorageSync('uid'),
         imageUrl: '/images/logo.jpg',
         title: '冀唐清泉'
      }
   },
   onShareTimeline() {

   },
   onReachBottom() {
      var page = this.data.page
      var goodslist = this.data.goodslist
      if (goodslist.length % 50 == 0) {
         this.setData({
            page: page + 1
         })
         this.goodsPage()
      }
   },
   // onPageScroll(e){
   //    let scrollTop = e.scrollTop
   //    if(scrollTop >= 215 && !this.data.catebjshow){
   //       this.setData({
   //          catebjshow: true
   //       })
   //    }else if(scrollTop < 215 && this.data.catebjshow){
   //       this.setData({
   //          catebjshow: false
   //       })
   //    }
   // },
})
