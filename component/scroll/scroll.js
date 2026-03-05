const app = getApp()
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        empty: { // 是否开启scroll相关事件
            type: Boolean,
            value: true
        },
        scrollY: { // 是否开启垂直方向的滚动
            type: Boolean,
            value: true
        },
        is_scroll: { // 是否开启滚动事件监听
            type: Boolean,
            value: false
        },
        refresherEnabled: { // 是否开启下拉刷新
            type: Boolean,
            value: true
        },
        refresh: { // 当前是否正在刷新
            type: Boolean,
            value: false
        },
        refreshType: { // 刷新类型
            type: String,
            value: 'shuaxin'
        },
        page: { // 当前页码
            type: Number,
            value: 1
        },
        loading: { // 是否显示正在加载更多
            type: Boolean,
            value: false
        },
        l_size: { // 加载更多文字的大小
            type: Number,
            value: 16
        },
        l_color: { // 加载更多文字的颜色
            type: String,
            value: '#999'
        },
        l_text: { // 加载更多文字
            type: String,
            value: '加载中...'
        },
        none: { // 是否显示暂无更多
            type: Boolean,
            value: false
        },
        n_text: { // 暂无更多文字
            type: String,
            value: '暂无更多'
        },
        to_top: { // 是否开启返回顶部
            type: Boolean,
            value: true
        },
        top_icon: { // 返回顶部按钮的图标
            type: String,
            value: app.globalData.iconurl + 'goUp2.png',
        },
        top_show_scroll: { // 滚动到多少距离才显示返回顶部按钮
            type: Number,
            value: 400
        },
        page_loading: { // 页面加载
            type: Boolean,
            value: false
        },
    },
    options: {
        multipleSlots: true
    },
    observers: {
    },
    /**
     * 组件的初始数据
     */
    data: {
        triggered: false,
        top_show: false,
        foot_height: '0px',
    },
    lifetimes: {
        attached() {

        },
        ready() {
            const _this = this
            const query = this.createSelectorQuery()
            query.select('#foot').boundingClientRect()
            query.exec(function (res) {
                _this.setData({
                    foot_height: res[0].height + 'px',
                })
            })
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
        // 滑动到底部时触发的方法
        scrolltolower() {
            // 触发自定义事件scrolltolower，页面可以监听这个事件
            if (this.data.loading || this.data.none || this.data.refresh || !this.data.empty) {
                return
            }
            this.setData({
                loading: true,
            })
            let page = this.data.page + 1
            this.setData({
                page: page
            })
            let data = {
                page,
                type: 'tolower',
            }
            this.triggerEvent('onUpdata', data);
        },

        // 下拉刷新触发的方法
        refresherrefresh() {
            this.setData({
                page: 1,
                none: false,
                triggered: true,
            })
            let data = {
                page: 1,
                type: 'refresh',
            }
            this.triggerEvent('onUpdata', data);
        },
        refresherrestore() {
            this.setData({
                triggered: false,
            })
        },
        scroll(e) {
            if (e.detail.scrollTop >= this.data.top_show_scroll) {
                this.setData({
                    top_show: true,
                })
            } else {
                this.setData({
                    top_show: false,
                })
            }
            if (!this.data.is_scroll || !this.data.empty) {
                return
            }
            this.triggerEvent('getscroll', e.detail);
        },
        to_top() {
            this.setData({
                scrollTop: 0,
            })
        }
    }
})