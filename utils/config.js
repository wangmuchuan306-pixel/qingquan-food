var server = 'https://usd.0315678.cn/';
var path = server+'app/';
var api = {
	//用户
	login:path+'login/login',//登录
	getinfo:path+'YsdUser/getWxUser',//获取微信资料
	get_phone_num:path+'login/get_phone_num',  //解密手机号
	ajaxGetphone:path+'YsdLogin/ajaxGetphone',  //解密手机号  新
	set_phone_num:path+'login/set_phone_num', //绑定手机号
	userInfo:path+'user/info/load', //查询用户信息
  userComments:path+'user/info/comment', //用户点评、点赞 列表
	invitelist:path+'user/info/invitelist', //邀请的好友列表
  
  //首页
  getBanner:path+'goods/slider',  //首页轮播
	getNavList:path+'goods/property',  //获取保本零售  导航部分数据
	//商品
	getGoodsList:path+'goods/indexgoods',  //获取商品列表
	goodsInfo:path+'goods/info',//商品详情
	goodsAddShare:path+'goods/share',//商品分享后  添加点击量(分享次数)
	goodsCommission:path+'goods/goodsyz',	//查询商品佣金
  goodsSku:path+'goods/sku',	//查询商品sku
  //活动
  getActivityInfo:path+'activity/new_info',  //获取活动详情
  getActivityOpenList:path+'activity/open',  //获取预售拼单列表
	getActivityNewList:path+'activity/new',  //获取会员福利列表
	
	//订单
	orderInfo:path+'order/info',//订单详情
	orderList:path+'order/list',//订单列表
	delOrder:path+'order/del',//删除订单
	updateOrderStatus:path+'order/update',	//更改订单状态
  addOrder:path+'order/add',	//添加订单
	sendmessage:path+'api/sendmessage',//订单变动    下单提醒
	//购物车
	addcar:path+'car/add',//添加购物车
	carList:path+'car/list',//购物车列表
	upcar:path+'car/update',//修改数量
	delcar:path+'car/del',//删除
	zaddCarOrder:path+'order/zarradd',//总订单结算
	addCarOrder:path+'order/arradd',//结算
	selecetCar:path+'car/selecetcar',//结算列表
	//评论
	addComments:path+'goods/comment/add',	//添加评论
	commentsList:path+'goods/comment/list',	//评论列表 
	reCommentsList:path+'goods/comment/new_list',	//热评-评论列表 
	clickLike:path+'goods/comment_like/change',	//点赞评论
	//收货地址
	addAddress:path+'address/add',	//添加地址
	upAddress:path+'address/update',	//修改地址
	addressInfo:path+'address/info',	//地址详情
	addressList:path+'address/list',	//地址列表
	setDefault:path+'address/setDefault',	//设置默认地址
	delAddress:path+'address/del',	//移除地址
	//团长
	addPartner:path+'user/partner/addpartnerinfo',	//提交团长审核
	partnerInfo:path+'user/partner/separtnerinfo',	//团长信息
	partnerOrdernum:path+'order/partnerordernum',	//团长订单数量
	partnerOrder:path+'order/partnerorder',	//团长订单列表
	setpartnerOrder:path+'order/partnersetorder',	//更改团长订单状态
	getzitiAddress:path+'user/partner/partneraddress',	//自提（团长）地址查询
	partnerstatus:path+'user/partner/partnerinfo',	//团长审核状态
	setPartner:path+'user/partner/setpartnerstate',	//重新提交团长审核
	sendmetion:path+'api/sendmetion',	//团长点击确认接货   给用户发送订阅  自提提醒  


	
	//商家
	yesUpLoad:path+'user/stores/login',	//确认商家码
	storesInfo:path+'user/stores/info',	//商家详情
	storesOrderList:path+'user/stores/list',	//商家订单列表
	setStoresOrder:path+'order/storeset',	//修改商家订单状态
  stroesCommentList:path+'goods/comment/storescommon',	//该商家商品评论
  storeGoodsList:path+'goods/store_goods_list',	//该商家商品列表
	//会员
	openMember:path+'user/memberlog',	//开通会员
	sendMember:path+'api/sendismember',	//发送开通会员成功通知

	//支付
	payadd:path+'payment/pay/add',	//添加支付信息
	payVipset:path+'payment/pay/vipset',	//会员支付成功更改状态
	payPartnerset:path+'payment/pay/partnerset',	//团长支付成功更改状态
	balance_pay:path+'payment/balance_pay',	//余额支付
	//钱包
	walletsList:path+'user/info/moneylog',	//钱包列表
	walletDrawal:path+'user/info/putmoney',	//钱包提现申请

	isxiangou:path+'YsdOrder/CheckOrder',	//钱包提现申请

}

module.exports = {server,path,api};