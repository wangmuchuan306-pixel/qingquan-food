// pages/abc/abc.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: true,
    KeyboardKeys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."],
    content: [],
  },
  // 获取用户信息
  getuserinfo() {
    var userinfo = wx.getStorageSync('userinfo') ?? 0
    if (userinfo) {
      this.setData({
        userinfo: userinfo
      })
    } else {
      wx.navigateTo({
        url: `/pages/login/login?type=2&url=pages/abc/abc`,
      })
    }

  },
  // 获取插入光标位置
  getStrPosition(e) {
    console.log(e);
    var that = this;
    var focus = that.data.focus;
    that.setData({
      focus: true,
    });
    let {
      strIndex
    } = e.currentTarget.dataset;
    this.setData({
      cursorIndex: strIndex
    });
  },
  //键盘
  keyTap(e) {
    let {
      keys
    } = e.currentTarget.dataset,
      content = this.data.content.join(""), // 转为字符串
      strLen = content.length, {
        cursorIndex
      } = this.data;
    switch (keys) {
      case ".":
        if (content.indexOf(".") === -1) {
          // 已有一个点的情况下
          content.length < 1 ? (content = "0.") : (content += ".");
        }
        break;
      case "<":
        if (cursorIndex > 0 && cursorIndex !== strLen) {
          // 从插入光标开始删除元素
          this.data.content.splice(cursorIndex - 1, 1);
          content = this.data.content.join("");
        } else {
          content = content.substr(0, content.length - 1);
        }
        if (!strLen || cursorIndex === strLen) {
          // 插入光标位置重置
          this.setData({
            cursorIndex: ""
          });
        }
        // 删除点 组件中可以用Observer监听删除点和删除0的情况
        if (content[0] === "0" && content[1] !== ".") {
          content = content.substr(1, content.length - 1);
        }
        if (content[0] === ".") {
          content = "0" + content;
        }
        break;
      default:
        let spotIndex = content.indexOf("."); //小数点的位置
        if (content[0] === "0" && content[1] !== ".") {
          content = content.substr(1, content.length - 1);
        }
        if (spotIndex === -1 || strLen - spotIndex !== 3) {
          //小数点后只保留两位
          content += keys;
        }
        break;
    }

    if (content <= 100000) {
      this.setData({
        content: content.split(""), // 转为数组
        money: content, // 支付金额
      });
    } else {
      wx.showToast({
        title: "支付金额不能大于100000",
        icon: "none",
        duration: 1500,
      });
    }
  },
  handlePay() {
    var that = this;
    var money = that.data.money;
    var focus = that.data.focus;
    focus = false;
    that.setData({
      focus,
    });
    if (money < "0.01") {
      wx.showToast({
        title: "支付金额不能小于0.01",
        icon: "none",
        duration: 1500,
      });
      return;
    }
  },

  topay() {
    var that = this
    app.apiPost(app.apiList.onlinegetmoney, {
      zt_id: that.data.zt_id,
      money: that.data.money
    }, (res) => {
      wx.requestPayment({
        nonceStr: res.payinfo.nonceStr,
        package: res.payinfo.package,
        paySign: res.payinfo.paySign,
        timeStamp: res.payinfo.timeStamp,
        signType: res.payinfo.signType,
        success(data) {
          var pay_time = new Date().getTime()
          wx.redirectTo({
            url: '/pages/paysuccess/paysuccess?money=' + that.data.money + '&pay_time=' + pay_time + '&ztdian=' + that.data.ztdian.zt_name,
          })
        },
        complete(data) {
          console.log(data)
        }
      })
    })
  },
  findoneztdian() {
    app.apiPost(app.apiList.findoneztdian, {
      id: this.data.zt_id
    }, (res) => {
      this.setData({
        ztdian: res.data
      })
    })
  },
  callphone() {
    wx.makePhoneCall({
      phoneNumber: '18833330416',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getuserinfo()
    const windowinfo = wx.getWindowInfo()
    console.log(windowinfo)
    var height = windowinfo.windowHeight
    var pr = windowinfo.windowWidth / 750
    this.setData({
      height,
      pr
    })
    if (options) {
      var scene = decodeURIComponent(options.scene);
      console.log(scene)
      var zt_id = scene.split("&");
      this.setData({
        zt_id: zt_id[0]
      })
    }
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
    var userinfo = wx.getStorageSync('userinfo') ?? 0
    if(userinfo){
      this.findoneztdian()
    }
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