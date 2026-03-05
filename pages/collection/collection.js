// packageB/pages/collection/collection.js
var app = getApp();
let that = null;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: app.globalData.url,
		start:0,
		end:0,
		touchGoodsId:0,
		goods_info:[],
	},
	start(e){
		console.log('start')
		console.log(e)
		let start = e.changedTouches[0].clientX;
		let goodId = e.currentTarget.dataset.gid;
		that.setData({
			start : start,
			touchGoodsId : goodId,
		});
	},
	end(e){
		console.log('end')
		console.log(e)
		let end = e.changedTouches[0].clientX;
		let start = that.data.start;
		let touchGoodsId = that.data.touchGoodsId;
		let goods_info = that.data.goods_info;
		if(start - end > 40){
			goods_info.forEach((item)=>{
				item.goods_id == touchGoodsId ? item.slide = true : item.slide = false ;
			})
			that.setData({
				end:end,
				goods_info:goods_info,
			})
		}else if(start - end < -40){
			goods_info.forEach((item)=>{
				item.goods_id == touchGoodsId ? item.slide = false : '' ;
			})
			that.setData({
				end:end,
				goods_info:goods_info,
			})
		}
	},
	cancel(){
		wx.showModal({
			title: '提示',
			content: '您确定要取消喜欢该商品吗',
			success (res) {
				if (res.confirm) {
					app.apiPost(app.apiList.collection,{goods_id:that.data.touchGoodsId},(res)=>{
						console.log('删除');
						that.getCollect();
					})
				} else if (res.cancel) {
					console.log('取消')
				}
			}
		})

	},
	goGoodsInfo(e){
		console.log(e);
		let gid = e.currentTarget.dataset.gid;
		wx.navigateTo({
			url: '/pages/goodsinfo/goodsinfo?id='+gid
		})
	},
	getCollect(){
		app.apiPost(app.apiList.getCollectGoods,{},(res)=>{
			// console.log(res);
			res.data.forEach((item,index)=>{
				item.goods_img = item.goods_img;
				item.slide = false;
			})
			if(res.status == 1){
				that.setData({
					goods_info:res.data,
				})
				console.error('我喜欢的')
				console.log(res.data)
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    that = this;
    that.setData({
      theme:'light'
    })
    app.wxAllchange()
		that.getCollect();
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
    that = this
    that.setData({
      theme:'light'
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