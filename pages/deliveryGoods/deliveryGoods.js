// pages/preparegoods/preparegoods.js
const app = getApp()
// const XLSX = require('../../utils/xlsx.mini');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    // type: 2,
    page: 1,
    infopage: 1,
    nsgoodslist: [],
    nsinfolist: [],
    titletype: 1,
    url: app.globalData.url
  },
  //搜索输入
  insearch(e) {
    this.setData({
      search: e.detail.value
    })
  },
  //清除搜索
  nosearch() {
    this.setData({
      search: '',
      page: 1,
      nsgoodslist: []
    })
    if (this.data.titletype == 1) {
      this.notsendgoodslist()
    } else {
      this.notsendgoodsuserlist()
    }
  },
  //搜索数据
  tosearch() {
    this.setData({
      page: 1,
      nsgoodslist: []
    })
    if (this.data.titletype == 1) {
      this.notsendgoodslist()
    } else {
      this.notsendgoodsuserlist()
    }
  },
  callphone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  //外层批量发货
  plsend() {
    var that = this
    var orderid = []
    var nsgoodslist = that.data.nsgoodslist
    if (that.data.titletype == 1) {
      nsgoodslist.forEach((v, k) => {
        if (v.ischeck) {
          v.orderuser.forEach(item => {
            orderid = orderid.concat(item.orderno)
          })
        }
      })
      nsgoodslist = nsgoodslist.filter(v => !v.ischeck)
    } else {
      nsgoodslist.forEach((item, index) => {
        item.ordergoods.forEach((v, k) => {
          if (v.ischeck) {
            orderid.push(v.orderno)
          }
        })
        item.ordergoods = item.ordergoods.filter(v => !v.ischeck)
      })
      nsgoodslist = nsgoodslist.filter(v => v.ordergoods.length > 0)
    }
    if (orderid.length == 0) {
      wx.showToast({
        title: '请选择您需要发货的商品',
        icon: 'none'
      })
    } else {
      app.apiPost(app.apiList.pifahuo, {
        orderno: orderid.join(','),
      }, (res) => {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          success() {
            if (that.data.titletype == 2) {
              nsgoodslist.forEach(v => {
                var goodsnum = 0
                v.ordergoods.forEach(item => {
                  goodsnum = goodsnum + item.goodsnum
                })
                v.goodsnum = goodsnum
              })
            }
            that.setData({
              nsgoodslist
            })
            that.notsendgoodscount()
          }
        })
      })
    }
  },
  //t2团长选择
  parentcheck(e) {
    var nsgoodslist = this.data.nsgoodslist
    nsgoodslist[e.currentTarget.dataset.index].parentcheck = !nsgoodslist[e.currentTarget.dataset.index].parentcheck
    nsgoodslist[e.currentTarget.dataset.index].ordergoods.forEach(v => {
      if (nsgoodslist[e.currentTarget.dataset.index].parentcheck) {
        v.ischeck = true
      } else {
        v.ischeck = false
      }
    })
    this.setData({
      nsgoodslist
    })
  },
  //t1选择
  goodscheck(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var nsgoodslist = that.data.nsgoodslist
    if (that.data.titletype == 1) {
      nsgoodslist[index].ischeck = !nsgoodslist[index].ischeck
    } else {
      var gindex = e.currentTarget.dataset.gindex
      nsgoodslist[index].ordergoods[gindex].ischeck = !nsgoodslist[index].ordergoods[gindex].ischeck
      var checknum = 0
      nsgoodslist[index].ordergoods.forEach(v => {
        if (v.ischeck) {
          checknum++
        }
      })
      console.log(checknum)
      if (checknum == nsgoodslist[index].ordergoods.length) {
        nsgoodslist[index].parentcheck = true
      } else {
        nsgoodslist[index].parentcheck = false
      }
    }
    that.setData({
      nsgoodslist
    })
  },
  //切换标题
  changetitle(e) {
    var titletype = e.currentTarget.dataset.type
    this.setData({
      titletype,
      search: '',
      page: 1,
      nsgoodslist: []
    })
    if (titletype == 1) {
      this.notsendgoodslist()
    } else {
      this.setData({
        show: false
      })
      this.notsendgoodsuserlist()
    }
  },
  //开始导出报表
  goexcel() {
    var that = this
    app.apiPost(app.apiList.exportorderphp, {
      type: 1
    }, (res) => {
      console.log(res)
      const fs = wx.getFileSystemManager(); //获取全局唯一的文件管理器 
      fs.writeFile({ //写文件
        filePath: wx.env.USER_DATA_PATH + "/统计报表.xlsx", // wx.env.USER_DATA_PATH 指定临时文件存入的路径，后面字符串自定义
        data: res, // res.data就是获取到的二进制文件流
        encoding: "binary", //二进制流文件必须是 binary
        success(e) {
          wx.openDocument({ // 打开文档
            filePath: wx.env.USER_DATA_PATH + "/统计报表.xlsx", //拿上面存入的文件路径
            showMenu: true, // 显示右上角菜单
            success: function (x) {
              console.log("successfun", x);
            },
          })
        }
      })
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  //代发/备货清单
  notsendgoodslist() {
    var that = this
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    app.apiPost(app.apiList.anshangpinshaixuanfahuo, {
      searchstr: that.data.search,
      page: 1,
      limit: 999,
      zitidian: that.data.zitidian
    }, (res) => {
      res.data.forEach(v => {
        var len = v.orderuser.length
        v.plist = v.orderuser
        for (let i = 0; i < len; i++) {
          for (let j = i + 1; j < len; j++) {
            if (v.plist[i].headimg === v.plist[j].headimg) {
              v.plist.splice(j, 1)
              len-- // 减少循环次数提高性能
              j-- // 保证j的值自加后不变
            }
          }
        }
      })
      that.setData({
        allist: res.data
      })
      that.getshowdata()
    })
  },
  //代发/备货清单按买家筛选
  notsendgoodsuserlist() {
    var that = this
    wx.showLoading({
      title: '数据加载中',
      mask: true
    })
    app.apiPost(app.apiList.ankehushaixuanfahuo, {
      page: 1,
      limit: 999,
      search: that.data.search,
      zitidian: that.data.zitidian
    }, (res) => {
      that.setData({
        allist: res.data
      })
      that.getshowdata()
    })
  },
  //获取显示数据
  getshowdata() {
    var that = this
    var allist = that.data.allist
    var page = that.data.page
    var nsgoodslist = that.data.nsgoodslist
    nsgoodslist = nsgoodslist.concat(allist.slice((page - 1) * 5, page * 5))
    // console.log(allist.slice((page - 1) * 5, 5))
    console.log(nsgoodslist)
    if (that.data.titletype == 2) {
      nsgoodslist.forEach(v => {
        var goodsnum = 0
        v.ordergoods.forEach(item => {
          goodsnum = goodsnum + item.goodsnum
        })
        v.goodsnum = goodsnum
      })
    }
    that.setData({
      nsgoodslist
    })
    wx.hideLoading()
  },
  //切换订单类型
  changetype(e) {
    console.log(e)
    var type = e.currentTarget.dataset.type
    this.setData({
      type
    })
    // this.showinfo()
  },
  //配货/自提订单详情
  showinfo(e) {
    this.setData({
      gindex: e.currentTarget.dataset.index,
      show: true
    })
  },
  // 发货
  updateOrderStatus(e) {
    var that = this
    wx.showModal({
      title: '确认发货提示',
      content: '是否确认发货',
      complete: (res) => {
        if (res.cancel) {

        }

        if (res.confirm) {
          var index = e.currentTarget.dataset.index
          var nsgoodslist = that.data.nsgoodslist
          var gindex = that.data.gindex
          wx.showLoading({
            title: '正在发货请稍等',
            mask: true
          })
          if (index == 'allsendorder') {
            var list = nsgoodslist[gindex].orderuser
            var oidlist = []
            for (let i = 0; i < list.length; i++) {
              if (list[i].ischecked) {
                oidlist.push(list[i].orderno)
              }
            }
            app.apiPost(app.apiList.pifahuo, {
              orderno: oidlist.toString(),
            }, (res) => {
              wx.hideLoading()
              wx.showToast({
                title: res.msg
              })
              if (res.status == 1) {
                list = list.filter(item => !item.ischecked)
                if (list.length == 0) {
                  nsgoodslist.splice(gindex, 1)
                } else {
                  nsgoodslist[gindex].orderuser = list
                }
                that.setData({
                  nsgoodslist,
                  show: false
                })
              }
            })
          } else {
            app.apiPost(app.apiList.pifahuo, {
              orderno: nsgoodslist[gindex].orderuser[index].orderno,
            }, (res) => {
              wx.hideLoading()
              wx.showToast({
                title: res.msg
              })
              if (res.status == 1) {
                nsgoodslist[gindex].orderuser.splice(index, 1)
                that.setData({
                  nsgoodslist
                })
              }
            })
          }
        }
      }
    })
  },
  //选择配送方式
  cstype(e) {
    this.setData({
      send_type: e.currentTarget.dataset.type
    })
  },
  //确认发货
  choosetype(e) {
    var that = this
    var list = that.data.nsinfolist
    wx.showLoading({
      title: '正在发货请稍等',
      mask: true
    })
    if (that.data.indexBtn == 'allsendorder') {
      var oidlist = []
      var aidlist = []
      for (let i = 0; i < list.length; i++) {
        if (list[i].ischecked) {
          aidlist.push(list[i].address_id)
          oidlist.push(list[i].orderid)
        }
      }
      var newaidlist = Array.from(new Set(aidlist))
      var addressid = newaidlist.toString()
      app.apiPost(app.apiList.sendOrder2, {
        orderid: oidlist.toString(),
        addressid,
        send_type: that.data.send_type,
        store_id: wx.getStorageSync('store_id')
      }, (res) => {
        if (res.status == 1) {
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
          })
          that.setData({
            sendgoods: false,
            infopage: 1,
          })
          that.showinfo()
          that.getonegoods()
          that.notsendgoodscount()
        } else {
          that.setData({
            bshow: true,
            sendgoods: false
          })
        }
      })
    } else {
      app.apiPost(app.apiList.sendOrder2, {
        orderid: list[that.data.indexBtn].orderid,
        addressid: list[that.data.indexBtn].address_id,
        store_id: wx.getStorageSync('store_id'),
        send_type: that.data.send_type
      }, (res) => {
        if (res.status == 1) {
          wx.hideLoading()
          wx.showToast({
            title: res.msg,
          })
          that.setData({
            sendgoods: false,
            infopage: 1,
          })
          that.showinfo()
          that.getonegoods()
          that.notsendgoodscount()
        } else {
          that.setData({
            bshow: true,
            sendgoods: false
          })
        }
      })
    }
  },
  //获取单条商品数据
  getonegoods(specs_id) {
    var that = this
    app.apiPost(app.apiList.notsendgoodslist, {
      specs_id: that.data.specs_id,
      deliver_type: that.data.deliver_type
    }, (res) => {
      var nsgoodslist = that.data.nsgoodslist
      nsgoodslist.forEach((v, k) => {
        if (v.specs_id == that.data.specs_id) {
          if (res.data.length == 0) {
            nsgoodslist.splice(k, 1)
          } else {
            nsgoodslist[k] = res.data[0]
          }
        }
      })
      that.setData({
        nsgoodslist
      })
    })
  },
  //关闭配送方式弹窗
  sendcancel() {
    var that = this
    that.setData({
      sendgoods: false
    })
  },
  //选择配送商品
  chooseorder(e) {
    var nsgoodslist = this.data.nsgoodslist
    var gindex = this.data.gindex
    var index = e.currentTarget.dataset.index
    nsgoodslist[gindex].orderuser[index].ischecked = !nsgoodslist[gindex].orderuser[index].ischecked
    var checkednum = 0
    nsgoodslist[gindex].orderuser.forEach((v, k) => {
      if (v.ischecked) {
        checkednum++
      }
    })
    if (checkednum == nsgoodslist[gindex].orderuser.length) {
      var allchecked = true
    } else {
      var allchecked = false
    }
    if (checkednum > 0) {
      var cansend = true
    } else {
      var cansend = false
    }
    this.setData({
      nsgoodslist,
      allchecked,
      cansend
    })
  },
  //选择全部商品
  chooseall() {
    var that = this
    var nsgoodslist = this.data.nsgoodslist
    var gindex = this.data.gindex
    nsgoodslist[gindex].orderuser.forEach((v, k) => {
      if (that.data.allchecked) {
        v.ischecked = false
      } else {
        v.ischecked = true
      }
    })
    if (that.data.allchecked) {
      var cansend = false
    } else {
      var cansend = true
    }
    that.setData({
      nsgoodslist,
      allchecked: !that.data.allchecked,
      cansend
    })
  },
  //获取数量
  notsendgoodscount() {
    app.apiPost(app.apiList.ankehushaixuanfahuocountandanshangpinshaixuanfahuocount, {
      zitidian: this.data.zitidian
    }, (res) => {
      this.setData({
        count1: res.data.anshangpinshaixuanfahuo,
        count2: res.data.ankehushaixuanfahuo
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      zitidian: options.zitidian
    })
    this.notsendgoodslist()
    this.notsendgoodscount()
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
    var that = this
    var page = that.data.page
    if (that.data.nsgoodslist.length < that.data.allist.length) {
      that.setData({
        page: page + 1
      })
      console.log(page)
      that.getshowdata()
    }
  },
  //scoll触底
  scrolltolower(e) {
    var that = this
    var infopage = that.data.infopage
    // if (e) {
    //   var goods_id = e.currentTarget.dataset.id
    //   that.setData({
    //     goods_id
    //   })
    // } else {
    //   var goods_id = that.data.goods_id
    // }
    if (that.data.nsinfolist.length % 10 == 0) {
      infopage++
      that.setData({
        infopage
      })
      app.apiPost(app.apiList.notsendgoodsinfo, {
        page: infopage,
        limit: 10,
        specs_id: that.data.specs_id,
        type: that.data.deliver_type
      }, (res) => {
        var nsinfolist = that.data.nsinfolist.concat(res.data)
        that.setData({
          show: true,
          nsinfolist,
          count: res.count
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})