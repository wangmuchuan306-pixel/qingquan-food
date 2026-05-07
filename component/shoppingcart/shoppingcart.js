const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        userinfo: {
            type: Object,
            value: {}
        },
        tabBarHeight: {
            type: String,
            value: ''
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow: false,
        cartShow: false,
    },
    lifetimes: {
        attached() {
            this.usershoppingcart()
        },
        ready() {

        }
    },
    methods: {
        show() {
            if (!this.data.userinfo) {
                wx.showToast({
                    title: '请先登录',
                    icon: 'none'
                })
                setTimeout(() => {
                    wx.navigateTo({
                        url: '/pages/login/login',
                    })
                }, 1500)
                return
            }
            if (this.data.isShow != this.data.cartShow) return
            this.setData({
                isShow: true,
                page: 1,
            })
            setTimeout(() => {
                this.setData({
                    cartShow: true,
                })
            }, 200)
            this.usershoppingcart()
        },
        hide() {
            if (this.data.isShow != this.data.cartShow) return
            this.setData({
                cartShow: false,
            })
            setTimeout(() => {
                this.setData({
                    isShow: false,
                })
            }, 300)
        },
        showOrHide() {
            if (this.data.cartShow) {
                this.hide()
            } else {
                this.show()
            }
        },

        //购物车列表
        usershoppingcart() {
            var that = this
            app.apiPost(app.apiList.usershoppingcart, {
                store_id: 1
            }, (res) => {
                var selectIdlist = this.data.selectIdlist || []
                var delcartsid = []
                var cartlist = res.data
                cartlist.forEach(v => {
                    v.Selected = selectIdlist.filter(id => id.g_id == v.goods_id && id.s_id == v.specs_id).length > 0
                    // if (!v.goodslist) {
                    //     delcartsid.push(v.id)
                    // }
                })
                var all_Selected = cartlist.filter(v => v.Selected == true).length == cartlist.length
                this.setData({
                    cartlist,
                    all_Selected,
                    cartSelectNum: cartlist.filter(v => v.Selected).length
                })
                this.getspecs(cartlist, 0)
                if (delcartsid.length > 0) {
                    this.setData({
                        delcartsid,
                    })
                    this.delnogoodcart(0)
                }
            })
        },

        getspecs(list, index) {
            if (index >= list.length) {
                this.setallmoney()
                return
            }
            app.apiPost(app.apiList.getspecs, {
                goods_id: list[index].goods_id
            }, (res) => {
                let cartlist = this.data.cartlist
                let gIndex = cartlist.findIndex(v => v.goods_id == list[index].goods_id && v.specs_id == list[index].specs_id)
                cartlist[gIndex].specs = res.data.filter(v => v.specs_id == cartlist[gIndex].specs_id)
                this.setData({
                    cartlist
                })
                this.getspecs(list, index + 1)
            })
        },

        cartcount() {
            var that = this
            app.apiPost(app.apiList.cartcount, {
                store_id: 1
            }, (res) => {
                this.setData({
                    gwcNumber: res.data
                })
            })
        },

        //scroll滚动
        // scrolltolower() {
        //     var page = this.data.page + 1
        //     this.setData({
        //         page
        //     })
        //     this.usershoppingcart()
        // },
        //购物车单选
        checkcart(e) {
            var index = e.currentTarget.dataset.index
            var cartlist = this.data.cartlist
            var selectIdlist = this.data.selectIdlist || []
            cartlist[index].Selected = !cartlist[index].Selected
            if (cartlist[index].Selected) {
                if (selectIdlist.filter(d => d.g_id == cartlist[index].goods_id && d.s_id == cartlist[index].specs_id).length == 0) {
                    selectIdlist.push({g_id:cartlist[index].goods_id,s_id:cartlist[index].specs_id})
                }
            } else {
                if (selectIdlist.filter(d => d.g_id == cartlist[index].goods_id && d.s_id == cartlist[index].specs_id).length > 0) {
                    selectIdlist = selectIdlist.filter(d => d.g_id != cartlist[index].goods_id || d.s_id != cartlist[index].specs_id)
                }
            }
            var all_Selected = cartlist.every(item => item.Selected);
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 1]
            prevPage.setData({
                selectIdlist,
            })
            this.setData({
                cartlist,
                all_Selected,
                selectIdlist,
                cartSelectNum: cartlist.filter(v => v.Selected).length
            })
            // var cartlist = this.data.cartlist
            // cartlist[index].check = !cartlist[index].check
            // this.setData({
            //   cartlist
            // })
            this.setallmoney()
        },
        //购物车全选
        allcheck() {
            var all_Selected = !this.data.all_Selected
            var cartlist = this.data.cartlist
            var selectIdlist = this.data.selectIdlist || []
            cartlist.forEach(v => {
                if (all_Selected) {
                    v.Selected = true
                    if (selectIdlist.filter(d => d.g_id == v.goods_id && d.s_id == v.specs_id).length == 0) {
                        selectIdlist.push({g_id:v.goods_id,s_id:v.specs_id})
                    }
                } else {
                    v.Selected = false
                    if (selectIdlist.filter(d => d.g_id == v.goods_id && d.s_id == v.specs_id).length > 0) {
                        selectIdlist = selectIdlist.filter(d => d.g_id != v.goods_id || d.s_id != v.specs_id)
                    }
                }
            })
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 1]
            prevPage.setData({
                selectIdlist,
            })
            this.setData({
                all_Selected,
                cartlist,
                selectIdlist,
                cartSelectNum: cartlist.filter(v => v.Selected).length
            })
            this.setallmoney()
        },
        //设置总金额
        setallmoney() {
            var cartlist = this.data.cartlist.filter(v => v.Selected)
            var userinfo = this.data.userinfo
            var all_price = 0
            cartlist.forEach(v => {
                all_price += v.number * (userinfo.user_level == 2 ? v.specs[0].specs_pfmoney : (userinfo.user_level == 1 ? v.specs[0].specs_tgmoney : (userinfo.user_level == 3 ? v.specs[0].specs_vipmoney : v.specs[0].specs_erpmoney)))
            })
            all_price = Number(all_price).toFixed(2)
            this.setData({
                all_price
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
                    let pages = getCurrentPages()
                    let prevPage = pages[pages.length - 1]
                    var goodslist = prevPage.data.goodslist
                    goodslist.forEach(v => {
                        v.number = 0
                    })
                    prevPage.setData({
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
                } else {
                    that.usershoppingcart()
                    let pages = getCurrentPages()
                    let prevPage = pages[pages.length - 1]
                    var goodslist = prevPage.data.goodslist
                    goodslist.forEach(v => {
                        if (v.goods_id == thisgoods.goods_id) {
                            let specs_index = v.specs.findIndex(item => item.specs_id == thisgoods.specs_id)
                            if (v.specs[specs_index].shoppingspecs) {
                                v.specs[specs_index].shoppingspecs.number = 0
                            }
                            v.number = v.specs.reduce((sum, item) => sum + (Number(item.shoppingspecs?.number) || 0), 0)
                        }
                    })
                    list.splice(index, 1)
                    prevPage.setData({
                        goodslist
                    })
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
            if (selectIdlist.filter(v => v.g_id == thisgoods.goods_id && v.s_id == thisgoods.specs_id).length == 0) {
                selectIdlist.push({g_id:thisgoods.goods_id,s_id:thisgoods.specs_id})
            }
            this.setData({
                selectIdlist,
            })
            if (thisgoods.specs[0].shoppingspecs.number <= thisgoods.specs[0].specs_batch || thisgoods.specs[0].specs_stock == 0 || thisgoods.specs[0].specs_batch > thisgoods.specs[0].specs_stock || (thisgoods.xg_num > 0 && thisgoods.specs[0].specs_batch > thisgoods.xg_num)) {
                that.delonecartgoods(type, index, list)
            } else {
                let specsnum = 1
                let specsmaxnum = thisgoods.specs[0].specs_stock
                if (thisgoods.xg_num > 0) {
                    if (thisgoods.specs[0].specs_stock <= thisgoods.xg_num) {
                        specsmaxnum = thisgoods.specs[0].specs_stock - (thisgoods.specs[0].shoppingspecs?.number || 0)
                    } else {
                        specsmaxnum = thisgoods.xg_num - (thisgoods.specs[0].shoppingspecs?.number || 0)
                    }
                } else {
                    specsmaxnum = thisgoods.specs[0].specs_stock - (thisgoods.specs[0].shoppingspecs?.number || 0)
                }
                if (thisgoods.specs[0].shoppingspecs.number > specsmaxnum) {
                    specsnum = thisgoods.specs[0].shoppingspecs.number - specsmaxnum
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
                            let pages = getCurrentPages()
                            let page = pages[pages.length - 1]
                            var goodslist = page.data.goodslist
                            goodslist.forEach(v => {
                                if (v.goods_id == thisgoods.goods_id) {
                                    v.number -= specsnum
                                }
                            })
                            that.setData({
                                cartlist: list,
                            })
                            page.setData({
                                goodslist
                            })
                        }
                        that.usershoppingcart()
                        that.cartcount()
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
                            this.setData({
                                loginshow: true,
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
            if (selectIdlist.filter(v => v.g_id == thisgoods.goods_id && v.s_id == thisgoods.specs_id).length == 0) {
                selectIdlist.push({g_id:thisgoods.goods_id,s_id:thisgoods.specs_id})
            }
            this.setData({
                selectIdlist,
            })
            let thisspecs = thisgoods.specs[0]
            let specsnum = 1
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
                    list[index].number += specsnum
                    if (type == 'list') {
                        that.setData({
                            goodslist: list
                        })
                    } else {
                        let pages = getCurrentPages()
                        let page = pages[pages.length - 1]
                        var goodslist = page.data.goodslist
                        goodslist.forEach(v => {
                            if (v.goods_id == thisgoods.goods_id) {
                                v.number += specsnum
                            }
                        })
                        that.setData({
                            cartlist: list,
                        })
                        page.setData({
                            goodslist
                        })
                    }
                    that.usershoppingcart()
                    that.cartcount()
                    that.setallmoney()
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
            var selectIdlist = this.data.selectIdlist || []
            if (selectIdlist.filter(v => v.g_id == thisgoods.goods_id && v.s_id == thisgoods.specs_id).length == 0) {
                selectIdlist.push({g_id:thisgoods.goods_id,s_id:thisgoods.specs_id})
            }
            this.setData({
                selectIdlist,
            })
            if (num == thisspecs.shoppingspecs.number) {
                return
            }
            let thisspecs = thisgoods.specs[0]
            if (num > thisspecs.shoppingspecs.number) {
                if (thisspecs.specs_stock - (thisspecs.shoppingspecs.number || 0) <= 0) {
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
                    specsnum = thisspecs.specs_stock - (thisspecs.shoppingspecs.number || 0)
                } else {
                    specsnum = num - (thisspecs.shoppingspecs.number || 0)
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
                            let pages = getCurrentPages()
                            let page = pages[pages.length - 1]
                            var goodslist = page.data.goodslist
                            goodslist.forEach(v => {
                                if (v.goods_id == thisgoods.goods_id) {
                                    v.number = num
                                }
                            })
                            that.setData({
                                cartlist: list,
                            })
                            page.setData({
                                goodslist
                            })
                        }
                        that.usershoppingcart()
                        that.cartcount()
                        that.setallmoney()
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
                                let pages = getCurrentPages()
                                let page = pages[pages.length - 1]
                                var goodslist = page.data.goodslist
                                goodslist.forEach(v => {
                                    if (v.goods_id == thisgoods.goods_id) {
                                        v.number = num
                                    }
                                })
                                that.setData({
                                    cartlist: list,
                                })
                                page.setData({
                                    goodslist
                                })
                            }
                            that.usershoppingcart()
                            that.cartcount()
                            that.setallmoney()
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
        refreshcart(selectIdlist) {
            this.setData({
                selectIdlist,
            })
            this.usershoppingcart()
            this.cartcount()
        },
        //抢购
        tobuy(e) {
            var that = this
            if (!that.data.userinfo) {
                wx.showToast({
                    title: '请先登录',
                    icon: 'none'
                })

                setTimeout(() => {
                    wx.navigateTo({
                        url: '/pages/login/login',
                    })
                }, 1500)
                return
            }
            if (this.data.all_price == 0) {
                wx.showToast({
                    title: '请选择您要购买的商品',
                    icon: 'none'
                })
                if (this.data.cartlist.length > 0) {
                    this.show()
                }
                return
            }
            var cartlist = this.data.cartlist.filter(v => v.Selected)
            cartlist.forEach(v => {
                v.specs_pfmoney = v.specs[0].specs_pfmoney
                v.specs_tgmoney = v.specs[0].specs_tgmoney
                v.specs_erpmoney = v.specs[0].specs_erpmoney
                v.specs_vipmoney = v.specs[0].specs_vipmoney
                v.specs_stock = v.specs[0].specs_stock
                v.specs_batch = v.specs[0].specs_batch
                v.specs_name = v.specs[0].specs_name
                v.specs_img = v.specs[0].specs_img ? 'https://qiniu.0315678.cn/' + v.specs[0].specs_img : v.goods_img
            })
            var ordertype = '/pages/lotaddorder2/lotaddorder2?ordertype=2&zttype=' + 2
            wx.setStorageSync('cartlist_pay', cartlist)
            this.setData({
                selectIdlist: [],
            })
            this.hide()
            setTimeout(() => {
                console.log(ordertype)
                wx.navigateTo({
                    url: ordertype,
                })
            }, 500)
        }
    }
})