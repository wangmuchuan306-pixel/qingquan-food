// pages/lotgoodslist/lotgoodslist.js
const app = getApp()
const tab_bar = require('../../custom-tab-bar/utils/tab-bar.js')
var utils = require('../../utils/util.js')
Page({

   /**
    * 页面的初始数据
    */
   data: {
      page: 1,
      cartpage: 1,
      catindex: 0,
      all_price: 0,
      ctwoindex: 0,
      paixuindex: 0,
      gwcNumber: 0,
      ztpage: 1,
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
      specshow: false,
      qiniu: 'https://qiniu.0315678.cn/',
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
   // 获取积分
   walletsList() {
      var that = this;
      app.apiPost(app.apiList.integral_list, {
         page: that.data.page
      }, (res) => {
         that.setData({
            integral: res.data.integral
         })
      })
   },
   nottap(e) {
      wx.showToast({
         title: '本商品不支持' + (e.currentTarget.dataset.type == 1 ? '自提' : '配送'),
         icon: 'none'
      })
   },
   //查看商品详情
   togoods(e) {
      wx.navigateTo({
         url: '/pages/goodsinfo/goodsinfo?id=' + e.currentTarget.dataset.id,
      })
   },
   //去下单
   // tobuy() {
   //   if (this.data.all_price == 0) {
   //     wx.showToast({
   //       title: '请选择您要购买的商品',
   //       icon: 'none'
   //     })
   //     return
   //   }
   //   var cartlist = this.data.cartlist
   //   var cartindex = this.data.cartindex
   //   if (this.data.chooseStyle == 1) {
   //     var ztdian = this.data.ztdian
   //     var data = JSON.stringify(ztdian)
   //   } else {
   //     var shouAddress = this.data.shouAddress
   //     var data = JSON.stringify(shouAddress)
   //   }
   //   wx.navigateTo({
   //     url: '/pages/lotaddorder/lotaddorder?goods_id=' + cartlist[cartindex].goods_id + '&cart_id=' + cartlist[cartindex].id + '&num=' + cartlist[cartindex].number + '&data=' + data + '&chooseStyle=' + this.data.chooseStyle,
   //   })
   //   // var paylist = []
   //   //   if (cartlist.length > 1) {
   //   //     var aztype = cartlist.find(item => item.check).zttype
   //   //     for (let i = 0; i < cartlist.length; i++) {
   //   //       if (cartlist[i].check) {
   //   //         if (aztype == 12) {
   //   //           aztype = cartlist[i].zttype
   //   //         } else {
   //   //           if (cartlist[i].zttype != 12 && aztype != cartlist[i].zttype) {
   //   //             wx.showToast({
   //   //               title: '您选择的商品含有不同的配送方式，不支持同时下单',
   //   //               icon: 'none'
   //   //             })
   //   //             return
   //   //           }
   //   //           if (cartlist[i].zttype != 12) {
   //   //             aztype = cartlist[i].zttype
   //   //           }
   //   //         }
   //   //         paylist.push({
   //   //           cart_id: cartlist[i].id,
   //   //           goods_id: cartlist[i].goods_id,
   //   //           number: cartlist[i].num
   //   //         })
   //   //       }
   //   //     }
   //   //   } else {
   //   //     var aztype = cartlist[0].zttype
   //   //     paylist.push({
   //   //       cart_id: cartlist[0].id,
   //   //       goods_id: cartlist[0].goods_id,
   //   //       number: cartlist[0].num
   //   //     })
   //   //   }
   //   //   paylist = JSON.stringify(paylist)
   //   //   var chooseStyle = this.data.chooseStyle
   //   //   if (chooseStyle == 1) {
   //   //     var ztdian = this.data.ztdian
   //   //     ztdian = JSON.stringify(ztdian)
   //   //     wx.navigateTo({
   //   //       url: '/pages/lotaddorder/lotaddorder?chooseStyle=' + chooseStyle + '&ztdian=' + ztdian + '&zttype=' + aztype + '&paylist=' + paylist,
   //   //     })
   //   //   } else {
   //   //     var shouAddress = this.data.shouAddress
   //   //     shouAddress = JSON.stringify(shouAddress)
   //   //     wx.navigateTo({
   //   //       url: '/pages/lotaddorder/lotaddorder?chooseStyle=' + chooseStyle + '&shouAddress=' + shouAddress + '&zttype=' + aztype + '&paylist=' + paylist,
   //   //     })
   //   //   }
   // },
   //配送地址设置
   setaddress() {
      wx.navigateTo({
         url: '/pages/editAddress/editAddress?type=order',
      })
   },
   //自提点设置
   setztdian() {
      if (this.data.ztdian) {
         wx.navigateTo({
            url: '/pages/chooseztdian/chooseztdian',
         })
      } else {
         this.getztdian()
      }
   },
   //返回
   goback() {
      if (this.data.firstpage) {
         wx.navigateBack()
      } else {
         wx.switchTab({
            url: '/pages/index/index',
         })
      }
   },
   //切换自提配送
   changestyle() {
      if (this.data.chooseStyle == 1) {
         this.setData({
            chooseStyle: 2
         })
         this.findAddress()
      } else {
         this.setData({
            chooseStyle: 1
         })
         this.getztdian()
      }
   },
   //搜索输入
   insearch(e) {
      this.setData({
         search_str: e.detail.value
      })
   },
   //搜索商品
   tosearch() {
      this.setData({
         page: 1
      })
      this.goodsPage()
   },
   //取消搜索
   nosearch() {
      this.setData({
         page: 1,
         search_str: '',
      })
      this.goodsPage()
   },
   //切换一级分类
   chaonecat(e) {
      this.setData({
         catindex: e.currentTarget.dataset.index,
         page: 1,
         ctwoindex: 0
      })
      this.goodsPage()
   },
   //切换二级分类
   chatwocat(e) {
      this.setData({
         ctwoindex: e.currentTarget.dataset.index,
         page: 1
      })
      this.goodsPage()
   },
   //切换排序
   changepaixu(e) {
      this.setData({
         paixuindex: e.currentTarget.dataset.type,
         page: 1
      })
      this.goodsPage()
   },
   //展示购物车弹窗
   showcart() {
      this.setData({
         show: true
      })
   },
   onClose() {
      this.setData({
         show: false
      })
   },
   //清空所有
   delcartgoods() {
      var that = this
      app.apiPost(app.apiList.delcartgoods, {
         store_id: 1
      }, (res) => {
         wx.showToast({
            title: res.msg,
            icon: 'none'
         })
         if (res.status == 1) {
            that.setData({
               cartpage: 1
            })
            that.cartcount()
            that.usershoppingcart()
            var goodslist = that.data.goodslist
            goodslist.forEach(v => {
               v.number = 0
            })
            that.setData({
               goodslist
            })
         }
      })
   },
   //删除单个商品
   delonecartgoods(type, index, list) {
      var that = this
      if (type == 'list') {
         var id = that.data.cartlist.find(item => item.goods_id == list[index].goods_id).id
      } else {
         var id = list[index].id
      }
      var thisgoods = list[index]
      app.apiPost(app.apiList.delonecartgoods, {
         id: id
      }, (res) => {
         wx.showToast({
            title: res.msg,
            icon: 'none'
         })
         if (type == 'list') {
            list[index].number = 0
            that.setData({
               goodslist: list
            })
            that.usershoppingcart()
            that.cartcount()
            this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
         } else {
            var goodslist = that.data.goodslist
            goodslist.forEach(v => {
               if (v.goods_id == thisgoods.goods_id) {
                  v.number = 0
               }
            })
            list.splice(index, 1)
            that.setData({
               cartlist: list,
               goodslist
            })
            this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
         }
      })
   },
   //减少数量
   reducenum(e) {
      var that = this
      var type = e.currentTarget.dataset.type
      var index = e.currentTarget.dataset.index
      if (type == 'list') {
         var list = that.data.goodslist
      } else {
         var list = that.data.cartlist
      }
      var thisgoods = list[index]
      var selectIdlist = this.data.selectIdlist || []
      if (selectIdlist.filter(v => v == thisgoods.goods_id).length == 0) {
         selectIdlist.push({ g_id: thisgoods.goods_id, s_id: thisgoods.specs[0].specs_id })
      }
      this.setData({
         selectIdlist,
      })
      if (thisgoods.number <= thisgoods.specs[0].specs_batch || thisgoods.specs[0].specs_stock == 0 || thisgoods.specs[0].specs_batch > thisgoods.specs[0].specs_stock || (thisgoods.xg_num > 0 && thisgoods.specs[0].specs_batch > thisgoods.xg_num)) {
         that.delonecartgoods(type, index, list)
      } else {
         let specsnum = 1
         let specsmaxnum = thisspecs.specs_stock
         if (thisgoods.xg_num > 0) {
            if (thisspecs.specs_stock <= thisgoods.xg_num) {
               specsmaxnum = thisspecs.specs_stock - (thisspecs.shoppingspecs?.number || 0)
            } else {
               specsmaxnum = thisgoods.xg_num - (thisspecs.shoppingspecs?.number || 0)
            }
         } else {
            specsmaxnum = thisspecs.specs_stock - (thisspecs.shoppingspecs?.number || 0)
         }
         if (thisgoods.number > specsmaxnum) {
            specsnum = thisgoods.number - specsmaxnum
         }
         app.apiPost(app.apiList.decshopping, {
            goods_id: thisgoods.goods_id,
            specs_id: type == 'list' ? thisgoods.specs[0].specs_id : thisgoods.specs_id,
            number: specsnum,
            store_id: 1,
            goodsa_id: thisgoods.goodsa_id || thisgoods.id,
         }, (res) => {
            if (res.status == 1) {
               list[index].number -= specsnum
               if (type == 'list') {
                  that.setData({
                     goodslist: list
                  })
               } else {
                  var goodslist = that.data.goodslist
                  goodslist.forEach(v => {
                     if (v.goods_id == thisgoods.goods_id) {
                        v.number -= specsnum
                     }
                  })
                  that.setData({
                     cartlist: list,
                     goodslist
                  })
               }
               that.usershoppingcart()
               that.cartcount()
               this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
            }
         })
      }
   },
   //增加数量
   addnum(e) {
      if (!wx.getStorageSync('token_new')) {
         wx.showModal({
            title: '提示',
            content: '加入购物车需要登录，是否登录',
            cancelText: '暂不登录',
            confirmText: '前往登录',
            complete: (res) => {
               if (res.cancel) {
                  return
               }

               if (res.confirm) {
                  wx.navigateTo({
                     url: '/pages/login/login',
                  })
               }
            }
         })
      }
      var that = this
      var type = e.currentTarget.dataset.type
      var index = e.currentTarget.dataset.index
      if (type == 'list') {
         var list = that.data.goodslist
      } else {
         var list = that.data.cartlist
      }
      var thisgoods = list[index]
      var selectIdlist = this.data.selectIdlist || []
      if (selectIdlist.filter(v => v == thisgoods.goods_id).length == 0) {
         selectIdlist.push({ g_id: thisgoods.goods_id, s_id: thisgoods.specs[0].specs_id })
      }
      this.setData({
         selectIdlist,
      })

      let thisspecs = thisgoods.specs[0]
      let specsnum = thisspecs.specs_batch
      if (!thisgoods.number) {
         if (thisspecs.specs_stock < thisspecs.specs_batch) {
            wx.showToast({
               title: '库存小于起批',
               icon: 'none'
            })
            return
         } else if (thisgoods.xg_num > 0 && thisgoods.xg_num < thisspecs.specs_batch) {
            wx.showToast({
               title: '限购小于起批',
               icon: 'none'
            })
            return
         }
      } else {
         if (thisspecs.specs_stock - (thisgoods.number || 0) <= 0) {
            wx.showToast({
               title: '已达库存上限',
               icon: 'none'
            })
            return
         } else if (thisgoods.xg_num > 0 && thisgoods.xg_num - (thisgoods.number || 0) <= 0) {
            wx.showToast({
               title: '已达限购上限',
               icon: 'none'
            })
            return
         }
         if (thisgoods.number >= specsnum) {
            specsnum = 1
         } else {
            specsnum = specsnum - thisgoods.number
         }
      }

      app.apiPost(app.apiList.inshopping, {
         goods_id: thisgoods.goods_id,
         specs_id: thisgoods.specs[0].specs_id,
         num: specsnum,
         store_id: 1,
         goodsa_id: thisgoods.goodsa_id || thisgoods.id,
      }, (res) => {
         wx.showToast({
            title: res.msg,
            icon: 'none'
         })
         if (res.status == 1) {
            list[index].number += specsnum
            if (type == 'list') {
               that.setData({
                  goodslist: list
               })
            } else {
               var goodslist = that.data.goodslist
               goodslist.forEach(v => {
                  if (v.goods_id == thisgoods.goods_id) {
                     v.number += specsnum
                  }
               })
               that.setData({
                  cartlist: list,
                  goodslist
               })
            }
            that.usershoppingcart()
            that.cartcount()
            this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
         }
      })
   },
   //输入数量
   innum(e) {
      var that = this
      var type = e.currentTarget.dataset.type
      var index = e.currentTarget.dataset.index
      var num = Number(e.detail.value)
      if (type == 'list') {
         var list = that.data.goodslist
      } else {
         var list = that.data.cartlist
      }
      var thisgoods = list[index]
      if (num == thisgoods.number) {
         return
      }
      var selectIdlist = this.data.selectIdlist || []
      if (selectIdlist.filter(v => v == thisgoods.goods_id).length == 0) {
         selectIdlist.push({ g_id: thisgoods.goods_id, s_id: thisgoods.specs[0].specs_id })
      }
      this.setData({
         selectIdlist,
      })
      let thisspecs = thisgoods.specs[0]
      if (num > thisgoods.number) {
         if (thisspecs.specs_stock - thisgoods.number <= 0) {
            wx.showToast({
               title: '已达最大库存',
               icon: 'none'
            })
            this.setData({
               goodslist: list
            })
            return
         }
         let specsnum = thisspecs.specs_batch
         if (thisspecs.specs_stock - num <= 0) {
            specsnum = thisspecs.specs_stock - thisgoods.number
         } else {
            specsnum = num - thisgoods.number
         }
         app.apiPost(app.apiList.inshopping, {
            goods_id: thisgoods.goods_id,
            specs_id: type == 'list' ? thisgoods.specs[0].specs_id : thisgoods.specs_id,
            num: specsnum,
            store_id: 1,
            goodsa_id: thisgoods.goodsa_id || thisgoods.id,
         }, (res) => {
            wx.showToast({
               title: res.msg,
               icon: 'none'
            })
            if (res.status == 1) {
               list[index].number = num
               if (type == 'list') {
                  that.setData({
                     goodslist: list
                  })
               } else {
                  var goodslist = that.data.goodslist
                  goodslist.forEach(v => {
                     if (v.goods_id == thisgoods.goods_id) {
                        v.number = num
                     }
                  })
                  that.setData({
                     cartlist: list,
                     goodslist
                  })
               }
               that.usershoppingcart()
               that.cartcount()
               this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
            }
         })
      } else {
         if (num == 0 || num < thisspecs.specs_batch || thisspecs.specs_stock == 0 || thisspecs.specs_batch > thisspecs.specs_stock) {
            that.delonecartgoods(type, index, list)
         } else {
            app.apiPost(app.apiList.decshopping, {
               goods_id: thisgoods.goods_id,
               specs_id: type == 'list' ? thisgoods.specs[0].specs_id : thisgoods.specs_id,
               number: thisgoods.number - num,
               store_id: 1,
               goodsa_id: thisgoods.goodsa_id || thisgoods.id,
            }, (res) => {
               if (res.status == 1) {
                  list[index].number = num
                  if (type == 'list') {
                     that.setData({
                        goodslist: list
                     })
                  } else {
                     var goodslist = that.data.goodslist
                     goodslist.forEach(v => {
                        if (v.goods_id == thisgoods.goods_id) {
                           v.number = num
                        }
                     })
                     that.setData({
                        cartlist: list,
                        goodslist
                     })
                  }
                  that.usershoppingcart()
                  that.cartcount()
                  this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
               }
            })
         }
      }
   },

   delnogoodcart(index) {
      app.apiPost(app.apiList.delonecartgoods, {
         id: this.data.delcartsid[index]
      }, (res) => {
         if (index == this.data.delcartsid.length - 1) {
            this.usershoppingcart()
            this.cartcount()
         } else {
            this.delnogoodcart(index + 1)
         }
      })
   },
   //购物车列表
   usershoppingcart() {
      app.apiPost(app.apiList.usershoppingcart, {
         page: this.data.cartpage,
         limit: 10,
         store_id: 1
      }, (res) => {
         if (this.data.cartpage == 1) {
            var cartlist = res.data
         } else {
            var cartlist = this.data.cartlist.concat(res.data)
         }
         this.setData({
            cartlist
         })
      })
   },
   //购物车单选
   checkcart(e) {
      var index = e.currentTarget.dataset.index
      this.setData({
         cartindex: index
      })
      // var cartlist = this.data.cartlist
      // cartlist[index].check = !cartlist[index].check
      // this.setData({
      //   cartlist
      // })
      this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
   },
   //购物车全选
   allcheck() {
      var allcheck = !this.data.allcheck
      var cartlist = this.data.cartlist
      cartlist.forEach(v => {
         if (allcheck) {
            v.check = true
         } else {
            v.check = false
         }
      })
      this.setData({
         allcheck,
         cartlist
      })
      this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
   },
   //设置总金额
   setallmoney() {
      var thiscart = this.data.cartlist[this.data.cartindex]
      var userinfo = this.data.userinfo
      var all_price = thiscart.number * (userinfo.level == 1 ? thiscart.memberprice : thiscart.normalprice)
      all_price = Number(all_price).toFixed(2)
      this.setData({
         all_price
      })
      // var cartlist = this.data.cartlist
      // var all_price = 0
      // var allnum = 0
      // var userinfo = this.data.userinfo
      // cartlist.forEach(v => {
      //   if (userinfo.level) {
      //     var price = v.normalprice
      //   } else {
      //     var price = v.memberprice
      //   }
      //   if (v.check) {
      //     all_price += v.number * price
      //     allnum++
      //   }
      // })
      // if (allnum == cartlist.length) {
      //   var allcheck = true
      // } else {
      //   var allcheck = false
      // }
      // this.setData({
      //   all_price: all_price.toFixed(2),
      //   allcheck
      // })
   },
   //查询收货地址
   findAddress() {
      app.apiPost(app.apiList.findAddress, {}, (res) => {
         if (res.data.find(item => item.default == 1)) {
            var shouAddress = res.data.find(item => item.default == 1)
         } else {
            var shouAddress = res.data[0]
         }
         this.setData({
            addresslist: res.data,
            shouAddress
         })
      })
   },
   userCenter() {
      app.apiPost(app.apiList.userCenter, {}, (res) => {
         if (res.status == 1) {
            this.setData({
               userinfo: res.data
            })
            if (res.data.phone) {
               this.setData({
                  userphone: res.data.phone
               })
            }
         } else {
            wx.showToast({
               title: '请先登录',
               icon: 'none',
               success() {
                  wx.navigateTo({
                     url: '/pages/login/login',
                  })
               }
            })
         }
      })
   },
   //scroll滚动
   scrolltolower() {
      if (this.data.goodslist.length % 10 == 0) {
         var page = this.data.page + 1
         this.setData({
            page
         })
         this.goodsPage()
      }
   },
   //商品列表
   goodsPage() {
      var that = this
      wx.showLoading({
         title: '数据加载中',
         mask: true
      })
      var data = {
         page: that.data.page,
         limit: 10,
         typeid: that.data.catelist[that.data.catindex].id,
         typeid2: that.data.catelist[that.data.catindex].list[that.data.ctwoindex].id,
         latitude: 0,
         longitude: 0,
         address: '',
         search_str: that.data.search_str,
         is_notshow_vip_goods: 1,
         zttype: that.data.chooseStyle
      }
      if (that.data.paixuindex) {
         if (that.data.paixuindex == 4) {
            data['xg'] = 1
         } else {
            data['paixu'] = that.data.paixuindex
         }
      }
      app.apiPost(app.apiList.goodsPage, data, (res) => {
         res.data.forEach(v => {
            v['number'] = v.inshopping
         })
         if (that.data.page == 1) {
            var goodslist = res.data
         } else {
            var goodslist = that.data.goodslist.concat(res.data)
         }
         that.setData({
            goodslist,
         })
         if (res.data.length > 0) {
            this.getspecs(res.data, 0)
         }
         wx.hideLoading()
      })
   },
   //分类列表
   getgoodscat() {
      app.apiPost(app.apiList.getgoodscat, {}, (res) => {
         res.data = res.data.filter(item => item.cate_name != '年卡')
         res.data.forEach(v => {
            v.list.unshift({
               cate_name: '全部',
               id: 0
            })
         })
         res.data.unshift({
            cate_name: '全部',
            id: 0,
            list: [{
               cate_name: '全部',
               id: 0
            }]
         })
         if (this.data.cate_id) {
            let catindex = res.data.findIndex(item => item.id == this.data.cate_id)
            this.setData({
               catindex
            })
         }
         this.setData({
            catelist: res.data,
         })
         this.goodsPage()
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
            that.getztdian123()
         }
      })
   },
   //获取自提点信息
   getztdian123() {
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
   cartcount() {
      app.apiPost(app.apiList.cartcount, {
         store_id: 1
      }, (res) => {
         this.setData({
            gwcNumber: res.data
         })
      })
   },
   //获取自提点
   getztdian() {
      var that = this
      wx.getLocation({
         success(res) {
            app.apiPost(app.apiList.getztdian, {
               latitude: res.latitude,
               longitude: res.longitude,
               page: 1,
               limit: 1
            }, (data) => {
               that.setData({
                  ztdian: data.data[0]
               })
            })
         }
      })
   },




   //抢购
   tobuy(e) {
      var that = this
      var userinfo = that.data.userinfo
      if (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone) {
         wx.showModal({
            title: '提示',
            content: '请先完善信息',
            complete: (res) => {
               if (res.cancel) { }
               if (res.confirm) {
                  wx.navigateTo({
                     url: '/pages/setpage/setpage',
                  })
               }
            }
         })
         return
      }
      var goods_id = that.data.goodslist[e.currentTarget.dataset.index].goods_id
      wx.navigateTo({
         url: '/pages/addorder/addorder?num=1&goods_id=' + goods_id,
      })
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
      app.apiPost(app.apiList.getusersendtime, {}, (res) => {
         this.setData({
            usersendtime: Number(res.data),
            send_tip: res.twoData
         })
         this.findsendtime()
      })
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
      var that = this
      // console.log(event.detail);
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
      if (that.data.userinfo.level == 1) {
         var price = Number(that.data.Detail.memberprice)
      } else {
         var price = Number(that.data.Detail.normalprice)
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
      if (that.data.chooseStyle == 1 && (userinfo.headimg == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132' || userinfo.nickname == '微信用户' || !userinfo.phone)) {
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
      var goods_price = that.data.userinfo.level == 1 ? that.data.Detail.memberprice : that.data.Detail.normalprice //商品价格
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
         var username = that.data.userinfo.nickname
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
         orderremark: '',
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
      app.apiPost(app.apiList.fyaddOrder, data, (data) => {
         if (data.status = 1) {
            that.setData({
               btnstatus: false,
               // msg: ''
            })
            var pay_real_money = data.orderinfo.pay_real_money
            var orderno = data.orderinfo.orderno
            if ((that.data.useye && that.data.zongprice == 0) || data.iszero == 1) {
               console.error('余额支付/0元券')
               wx.showLoading({
                  title: '订单支付成功',
                  mask: 'true'
               })
               setTimeout(function () {
                  wx.hideLoading()
                  //跳转到购买成功页面
                  wx.redirectTo({
                     url: '/pages/buysuccess/buysuccess?orderno=' + orderno,
                  })
               }, 1500)
               return;
            }
            wx.requestPayment({
               timeStamp: data.payinfo.timeStamp,
               nonceStr: data.payinfo.nonceStr,
               package: data.payinfo.package,
               signType: 'MD5',
               paySign: data.payinfo.paySign,
               success(q) {
                  wx.showToast({
                     title: '订单支付成功',
                     mask: 'true',
                     success() {
                        setTimeout(function () {
                           wx.hideLoading()
                           //跳转到购买成功页面
                           wx.redirectTo({
                              url: '/pages/buysuccess/buysuccess?orderno=' + orderno,
                           })
                        }, 1500)
                     }
                  })
               },
               fail(res) {
                  console.log(res)
                  that.setData({
                     btnstatus: false
                  })
                  wx.showToast({
                     title: '支付失败...',
                     icon: 'loading'
                  })
                  console.log('失败')
               }
            })
         } else {
            wx.showToast({
               title: '下单失败',
            })
         }
      })
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

   getspecs(list, index) {
      if (index >= list.length) {
         return
      }
      app.apiPost(app.apiList.getspecs, {
         goods_id: list[index].goods_id
      }, (res) => {
         let goodslist = this.data.goodslist
         let gIndex = goodslist.findIndex(v => v.goods_id == list[index].goods_id)
         const specs_pfmoney = Math.min(...res.data.map(item => Number(item['specs_pfmoney'])).filter(price => !isNaN(price)))
         const specs_tgmoney = Math.min(...res.data.map(item => Number(item['specs_tgmoney'])).filter(price => !isNaN(price)))
         const specs_erpmoney = Math.min(...res.data.map(item => Number(item['specs_erpmoney'])).filter(price => !isNaN(price)))
         const specs_vipmoney = Math.min(...res.data.map(item => Number(item['specs_vipmoney'])).filter(price => !isNaN(price)))
         goodslist[gIndex].specs_pfmoney = (specs_pfmoney || 0).toFixed(2)
         goodslist[gIndex].specs_tgmoney = (specs_tgmoney || 0).toFixed(2)
         goodslist[gIndex].specs_vipmoney = (specs_vipmoney || 0).toFixed(2)
         goodslist[gIndex].specs_erpmoney = (specs_erpmoney || 0).toFixed(2)
         const totalStock = res.data.reduce((sum, item) => sum + (Number(item.specs_stock) || 0), 0)
         goodslist[gIndex].all_goodsstock = totalStock
         goodslist[gIndex].number = res.data.reduce((sum, item) => sum + (Number(item.shoppingspecs?.number) || 0), 0)
         goodslist[gIndex].specs = res.data
         this.setData({
            goodslist
         })
         this.getspecs(list, index + 1)
      })
   },
   showchospecs(e) {
      var that = this
      if (!this.data.userinfo) {
         wx.showToast({
            title: '请先登录',
            icon: 'none'
         })
         setTimeout(() => {
            wx.navigateTo({
               url: '/pages/login/login',
            })
         }, 1000)
         return
      }
      let index = e.currentTarget.dataset.index
      app.apiPost(app.apiList.getspecs, {
         goods_id: this.data.goodslist[index].goods_id
      }, (res) => {
         let goodslist = this.data.goodslist
         const specs_pfmoney = Math.min(...res.data.map(item => Number(item['specs_pfmoney'])).filter(price => !isNaN(price)))
         const specs_tgmoney = Math.min(...res.data.map(item => Number(item['specs_tgmoney'])).filter(price => !isNaN(price)))
         const specs_erpmoney = Math.min(...res.data.map(item => Number(item['specs_erpmoney'])).filter(price => !isNaN(price)))
         const specs_vipmoney = Math.min(...res.data.map(item => Number(item['specs_vipmoney'])).filter(price => !isNaN(price)))
         goodslist[index].specs_pfmoney = (specs_pfmoney || 0).toFixed(2)
         goodslist[index].specs_tgmoney = (specs_tgmoney || 0).toFixed(2)
         goodslist[index].specs_vipmoney = (specs_vipmoney || 0).toFixed(2)
         goodslist[index].specs_erpmoney = (specs_erpmoney || 0).toFixed(2)
         const totalStock = res.data.reduce((sum, item) => sum + (Number(item.specs_stock) || 0), 0)
         goodslist[index].all_goodsstock = totalStock
         goodslist[index].number = res.data.reduce((sum, item) => sum + (Number(item.shoppingspecs?.number) || 0), 0)
         goodslist[index].specs = res.data

         let specsindex = 0
         let thisgoods = goodslist[index]
         let thisspecs = thisgoods.specs[specsindex]
         let is_thisspecsadd = true
         let specsnum = thisspecs.specs_batch
         if (!thisspecs.shoppingspecs) {
            if (thisspecs.specs_stock < thisspecs.specs_batch) {
               is_thisspecsadd = false
            } else if (thisgoods.xg_num > 0 && thisgoods.xg_num < thisspecs.specs_batch) {
               is_thisspecsadd = false
            }
         } else {
            if (thisspecs.specs_stock - (thisspecs.shoppingspecs.number || 0) <= 0) {
               is_thisspecsadd = false
            } else if (thisgoods.xg_num > 0 && thisgoods.xg_num - (thisspecs.shoppingspecs.number || 0) <= 0) {
               is_thisspecsadd = false
            }
            if (thisspecs.shoppingspecs.number >= specsnum) {
               specsnum = 1
            } else {
               specsnum = specsnum - thisspecs.shoppingspecs.number
            }
         }
         let specsmaxnum = thisspecs.specs_stock
         if (thisgoods.xg_num > 0) {
            if (thisspecs.specs_stock <= thisgoods.xg_num) {
               specsmaxnum = thisspecs.specs_stock - (thisspecs.shoppingspecs?.number || 0)
            } else {
               specsmaxnum = thisgoods.xg_num - (thisspecs.shoppingspecs?.number || 0)
            }
         } else {
            specsmaxnum = thisspecs.specs_stock - (thisspecs.shoppingspecs?.number || 0)
         }
         that.setData({
            goodslist,
            thisgoods,
            specshow: true,
            specsindex,
            specsnum,
            is_thisspecsadd,
            specsmaxnum,
         })
      })
   },
   specsClose() {
      this.setData({
         specshow: false,
      })
   },
   //选择规格
   choosespecs(e) {
      var specsindex = e.currentTarget.dataset.index
      var thisgoods = this.data.thisgoods
      let thisspecs = thisgoods.specs[specsindex]
      let is_thisspecsadd = true
      let specsnum = thisspecs.specs_batch
      if (!thisspecs.shoppingspecs) {
         if (thisspecs.specs_stock < thisspecs.specs_batch) {
            is_thisspecsadd = false
         } else if (thisgoods.xg_num > 0 && thisgoods.xg_num < thisspecs.specs_batch) {
            is_thisspecsadd = false
         }
      } else {
         if (thisspecs.specs_stock - (thisspecs.shoppingspecs.number || 0) <= 0) {
            is_thisspecsadd = false
         } else if (thisgoods.xg_num > 0 && thisgoods.xg_num - (thisspecs.shoppingspecs.number || 0) <= 0) {
            is_thisspecsadd = false
         }
         if (thisspecs.shoppingspecs.number >= specsnum) {
            specsnum = 1
         } else {
            specsnum = specsnum - thisspecs.shoppingspecs.number
         }
      }
      let specsmaxnum = thisspecs.specs_stock
      if (thisgoods.xg_num > 0) {
         if (thisspecs.specs_stock <= thisgoods.xg_num) {
            specsmaxnum = thisspecs.specs_stock - (thisspecs.shoppingspecs?.number || 0)
         } else {
            specsmaxnum = thisgoods.xg_num - (thisspecs.shoppingspecs?.number || 0)
         }
      } else {
         specsmaxnum = thisspecs.specs_stock - (thisspecs.shoppingspecs?.number || 0)
      }
      this.setData({
         specsindex,
         specsnum,
         is_thisspecsadd,
         specsmaxnum,
      })
   },
   //多规格添加购物车更改数量
   onChangeshop(e) {
      this.setData({
         specsnum: e.detail
      })
   },
   //选择规格后加入购物车
   toinshop() {
      var that = this
      var thisgoods = that.data.thisgoods
      var specsindex = that.data.specsindex
      let thisspecs = thisgoods.specs[specsindex]
      if (!thisspecs.shoppingspecs) {
         if (thisspecs.specs_stock < thisspecs.specs_batch) {
            wx.showToast({
               title: '库存小于起批',
               icon: 'none'
            })
            return
         } else if (thisgoods.xg_num > 0 && thisgoods.xg_num < thisspecs.specs_batch) {
            wx.showToast({
               title: '限购小于起批',
               icon: 'none'
            })
            return
         }
      } else {
         if (thisspecs.specs_stock - (thisspecs.shoppingspecs.number || 0) <= 0) {
            wx.showToast({
               title: '已达库存上限',
               icon: 'none'
            })
            return
         } else if (thisgoods.xg_num > 0 && thisgoods.xg_num - (thisspecs.shoppingspecs.number || 0) <= 0) {
            wx.showToast({
               title: '已达限购上限',
               icon: 'none'
            })
            return
         }
      }

      var selectIdlist = this.data.selectIdlist || []
      if (selectIdlist.filter(v => v == thisgoods.goods_id).length == 0) {
         selectIdlist.push({ g_id: thisgoods.goods_id, s_id: thisgoods.specs[specsindex].specs_id })
      }
      this.setData({
         selectIdlist,
      })
      app.apiPost(app.apiList.inshopping, {
         goods_id: thisgoods.goods_id,
         specs_id: thisgoods.specs[specsindex].specs_id,
         num: that.data.specsnum
      }, (res) => {
         wx.showToast({
            title: res.msg,
            icon: 'none'
         })
         if (res.status == 1) {
            let goodslist = that.data.goodslist
            let gIndex = goodslist.findIndex(v => v.goods_id == thisgoods.goods_id)
            goodslist[gIndex].number += that.data.specsnum
            that.setData({
               specshow: false,
               goodslist
            })
            that.usershoppingcart()
            that.cartcount()
            this.selectComponent('#shoppingcart').refreshcart(this.data.selectIdlist)
         }
      })
   },


   /**
    * 生命周期函数--监听页面加载
    */
   onLoad(options) {
      var menu = wx.getMenuButtonBoundingClientRect()
      var windowsinfo = wx.getWindowInfo()
      var pixelRatio = windowsinfo.windowWidth / 750
      var scrollheight = windowsinfo.windowHeight - (130 * pixelRatio)
      var boxwidth = 450 - 29 * pixelRatio
      this.setData({
         top: menu.top,
         height: menu.height,
         pixelRatio,
         scrollheight,
         boxwidth
      })
      // if (options.chooseStyle == 1) {
      //   this.getztdian()
      // } else {
      //   this.findAddress()
      // }
      // this.setData({
      //   chooseStyle: options.chooseStyle
      // })
      this.getgoodscat()
      this.getusersendtime()
      this.usershoppingcart()
      // this.cartcount()
      // var thispages = getCurrentPages()
      // if (thispages.length > 1) {
      //   var firstpage = true
      // } else {
      //   var firstpage = false
      // }
      // this.setData({
      //   firstpage
      // })
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
      tab_bar.getTab(1)
      this.userCenter()
      this.walletsList()
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

   },
})