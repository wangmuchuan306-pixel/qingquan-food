const app = getApp()
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        empty: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: '清泉食品'
        },
        position: {
            type: String,
            value: 'fixed'
        },
        backColor: {
            type: String,
            value: '#fff'
        },
        titleColor: {
            type: String,
            value: '#000'
        },
        tabBar: {
            type: Boolean,
            value: false
        },
        shadow: {
            type: Boolean,
            value: true
        }
    },
    options: {

    },
    observers: {
    },
    /**
     * 组件的初始数据
     */
    data: {
        menu: app.menu
    },
    lifetimes: {
        attached() {
            this.showType()
        },
        ready() {

        },
        detached() {
        },
        moved() {
        }
    },
    pageLifetimes: {
    },


    /**
     * 组件的方法列表
     */
    methods: {
        showType(){
            let pages = getCurrentPages()
            if(pages.length > 1){
                this.setData({
                    showBack: true
                })
            }
        },
        toBack() {
            wx.navigateBack({
                delta: 1,
                fail: () => {
                    wx.switchTab({
                        url: '/pages/index/index',
                    })
                }
            })
        },
        toHome() {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
    }
})