// app.js
const url = 'https://qqspapi.0315678.cn'; // 域名
const util = require('/utils/util.js');

App({
  onLaunch() {
    this.initializePendingReferrer();
    this.initUpdateManager();
    this.checkUserProfile();
  },

  /**
   * 初始化版本更新管理器
   */
  initUpdateManager() {
    if (!wx.getUpdateManager) {
      console.warn('当前微信版本不支持更新功能');
      return;
    }
    
    const updateManager = wx.getUpdateManager();
    
    updateManager.onCheckForUpdate((res) => {
      console.log('检查更新结果:', res.hasUpdate);
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      wx.showToast({
        title: '更新失败，请稍后重试',
        icon: 'none'
      });
    });
  },

  /**
   * 检查用户资料完整性
   */
  checkUserProfile() {
    this.apiPost(this.apiList.userCenter, {}, (res) => {
      if (res.status === 10011) {
        return;
      }
      if (res.status === 1) {
        if (res.data.nickname === '微信用户' || !res.data.phone) {
          wx.navigateTo({
            url: '/pages/setpage/setpage',
          });
        }
      }
    }, { requireAuth: false });
  },
  menu: wx.getMenuButtonBoundingClientRect(),
  globalData: {
    userInfo: null,
    url: 'https://qqspapi.0315678.cn',
    qiniuUrl: 'https://qiniu.0315678.cn/',
  },
  apiList: {
    getspecs: url + '/ApiIndex/getspecs', //获取商品规格
    ongoodsnotingwc: url + '/ApiUser/ongoodsnotingwc', //查询未付款商品
    addOrdermorewxss: url + '/ApiOrderswxpay/addOrdermorewxss', //多下单
    // 2025.10.16 新增英雄联盟活动
    getactivegoods_activehavemore_pelaseselectmaxendtimeandelsectactivepricepay: url + '/ApiUser/getactivegoods_activehavemore_pelaseselectmaxendtimeandelsectactivepricepay', //获取活动商品
    getact: url + '/ApiIndex/getact', //获取活动详情
    // #END
    // 2025/05/16 新增砍一刀功能
    KanYiDao: url + '/ApiUser/KanYiDao', //砍一刀
    KanYiDaoInfo: url + '/ApiUser/KanYiDaoInfo', //获取砍一刀信息
    addLaxin: url + '/ApiUser/addLaxin', //助力-发起助力
    //积分
    integral_list: url + '/ApiAccount/integral_list', //积分流水
    //自提点
    getactivitylist: url + '/ApiIndex/getactivitylist', //活动商品列表
    getqrcode: url + '/ApiIndex/getqrcode', //生成通用二维码
    myztdian: url + '/ApiUser/myztdian', //查询我的自提点
    getdriver: url + '/ApiUser/getdriver', //司机列表
    getkd: url + '/ApiUser/getkd', //快递列表
    newquan: url + '/ApiUser/newquan', //查询新人券
    newbuyquan: url + '/ApiUser/newbuyquan', //领券中心列表
    getztdiangoods: url + '/ApiUser/getztdiangoods', //查询自提点商品
    getztdian: url + '/ApiIndex/getztdian', //获取自提点信息
    getztdianlist: url + '/ApiUser/getztdianlist', //推荐自提点和历史自提点
    pifahuo: url + '/ApiUser/pifahuo', //批量发货
    findzt_water: url + '/ApiUser/findzt_water', //查询自提点流水明细
    ankehushaixuanfahuo: url + '/ApiUser/ankehushaixuanfahuo', //按客户筛选发货
    anshangpinshaixuanfahuo: url + '/ApiUser/anshangpinshaixuanfahuo', //按商品筛选发货
    ankehushaixuanfahuocountandanshangpinshaixuanfahuocount: url + '/ApiUser/ankehushaixuanfahuocountandanshangpinshaixuanfahuocount', //商品发货和用户发货键值
    getgoodscat: url + '/ApiGoods/getgoodscat', //获取商品分类
    zitijiehuo: url + '/ApiOrder/zitijiehuo', //自提点确认接货
    zitiReceiving: url + '/ApiOrder/zitiReceiving', //自提点确认接货
    // cancelOrderfy: url + '/ApiOrder/cancelOrderfy', //退款
    cancelOrderfy: url + '/ApiOrderswxpay/c_orderRound', //退款
    

    mydlsxx: url + '/ApiUser/mydlsxx', //我的代理商信息
    mydlssp: url + '/ApiUser/mydlssp', //查询代理商商品
    findhhr_water: url + '/ApiUser/findhhr_water', //查询合伙人流水明细
    getmyyquser: url + '/ApiUser/getmyyquser',


    //接口
    // sendtreasure: url + '/Treasure/sendtreasure', //赠送优惠券
    // receive_coupon: url + '/Treasure/receive_coupon', //接收优惠券
    login_bk: url + '/ApiLogin/phoneLogin', //登录接口
    login: url + '/ApiLogin/loginUsd', //登录接口
    wxphone: url + '/ApiUser/userGetphone', //授权手机号
    //首页更新
    notice: url + '/ApiIndex/notice', //首页更新公告
    findallvip: url + '/ApiIndex/findallvip', //查询所有会员
    getusersendtime: url + '/ApiIndex/getusersendtime', //获取用户下单后发货时间
    findsendtime: url + '/ApiIndex/findsendtime', //送货时间
    catlist: url + '/ApiIndex/catlist', //行业列表
    becompany: url + '/ApiUser/becompany',
    beworker: url + '/ApiUser/beworker',
    onlinegetmoney: url + '/ApiUser/onlinegetmoney', //线下付款
    // 岗位部分
    companylist: url + '/ApiIndex/companylist', //企业列表接口
    companyinfo: url + '/ApiIndex/companyinfo', // 企业详情
    // cdk
    getcdk: url + '/ApiGift/getcdk', //CDK兑换
    getBanner: url + '/ApiIndex/getBanner', //获取首页轮播
    getNavList: url + '/ApiIndex/getCat', //首页的横向分类
    insertCoupon: url + '/ApiAccount/insertCoupon', //首页新人领取会员
    roundTxt: url + '/ApiUser/roundTxt', //邀请好友随机文案
    roundTxt2: url + '/ApiIndex/roundTxt', //活动随机文案
    checkGetQuan: url + '/ApiGoods/getShowPop', //首页弹框
    rolationList: url + '/ApiGoods/rolationList', //跑马灯
    //活动

    laxinList: url + '/ApiIndex/laxinList', //助力-助力列表
    startLxZhuli: url + '/ApiUser/startLxZhuli', //助力-帮助他人助力
    // sendcoupon: url + '/ApiUser/sendcoupon', //卡券-我的卡券转赠
    // userCouponList:url + '/ApiUser/userCouponList',//卡券-我的优惠券列表 废弃
    // noUseCoupon:url + '/ApiUser/noUseCoupon',//卡券-确认订单查询优惠券列表 废弃
    getCouponList: url + '/ApiUser/getCouponList', //新我的卡券接口
    membercoupon: url + '/ApiUser/membercoupon', //会员中心优惠券
    getmembercou: url + '/ApiUser/getmembercou', //领取会员中心优惠券
    orderQuanList: url + '/ApiUser/orderQuanList', //新的订单查询优惠券
    getMoreContent: url + '/ApiIndex/getMoreContent',
    //商家
    addworker: url + '/ApiStore/addworker', //添加店员 传store_user_id、user_id
    storeworker: url + '/ApiStore/storeworker', //店员列表  有分页
    delworker: url + '/ApiStore/delworker', //删除店员 传user_id
    findstore: url + '/ApiStore/findstore', //加入前查询 传store_user_id


    //商品
    editgoodsstock: url + '/ApiStore/editgoodsstock', //商家修改数量
    salestatus: url + '/ApiStore/salestatus', //商家中心上下架
    storegoodslist: url + '/ApiStore/storegoodslist', //商家中心商品管理
    gethotlist: url + '/ApiIndex/gethotlist', //下单成功显示的商品列表
    getviplist: url + '/ApiIndex/getviplist', //下单成功显示的商品列表
    indexGoodsTop: url + '/ApiGoods/indexGoods', //下单成功显示的商品列表
    goodsPage: url + '/ApiGoods/goodsPage', //首页下面的商品列表
    vipGoods: url + '/ApiGoods/membergoodsPage', //会员页面的商品列表
    goodsDetail: url + '/ApiGoods/goodsDetail', //商品详情
    goodsStore: url + '/ApiGoods/goodsStore', //店铺详情及店铺商品，评价
    store_treasure: url + '/ApiGoods/store_treasure', //店铺打卡
    updateShare: url + '/ApiGoods/updateShare', //分享后更新订单的分享状态或者商品的分享数量
    shareGoodsDetail: url + '/ApiGoods/shareGoodsDetail', //分享商品时获取商品详情
    // searchGoods:url + '/ApiGoods/searchGoods',//商品搜索
    collection: url + '/ApiUser/collecGoods', //收藏
    getCollectGoods: url + "/ApiUser/getCollectGoods", //收藏列表
    getExplain: url + '/ApiGoods/getExplain', //详情页服务说明
    miniIndex: url + '/ApiGoods/miniIndex', //首页上部分接口
    goodsspell: url + '/ApiGoods/goodsspell', //首页上部分接口
    moreStore: url + '/ApiGoods/moreStore',
    buylist: url + '/ApiGoods/buylist',
    //评价
    getGoodsComment: url + '/ApiComment/getGoodsComment', //商品评价
    commentList: url + '/ApiComment/commentList', //发现评价列表
    getOrderDetail: url + '/ApiOrder/getOrderDetail', //发布评价 订单详情
    fyaddOrder: url + '/ApiOrder/fyaddOrder', //富友下单
    getztdian: url + '/ApiUser/getztdian', //获取自提点信息
    findoneztdian: url + '/ApiUser/findoneztdian', //获取单个自提点
    addComment: url + '/ApiUser/addComment', //发布评价
    clickCommnet: url + '/ApiUser/clickCommnet', //评价点赞
    myClickList: url + '/ApiUser/myClickList', //我赞过的
    myClickList: url + '/ApiUser/myClickList', //我的评价
    getReplylist: url + '/ApiComment/getReplylist', //查询评价的评论
    commentUplist: url + '/ApiComment/commentUplist', //点赞列表
    clickRt: url + '/ApiUser/clickRt', //评价的评论点赞
    getLimit: url + '/ApiComment/getLimit', //评价的展开回复
    addReply: url + '/ApiUser/addReply', //添加评价的评价及回复
    commentDetail: url + '/ApiComment/commentDetail', //评论详情
    commentShareNum: url + '/ApiComment/commentShareNum', //分享回调

    //订单
    chanumcou: url + '/ApiOrder/chanumcou', //修改数量时判断是否有可用优惠券  传num，goods_id
    overcomment: url + '/ApiUser/overcomment', //待评价订单
    summitOrder: url + '/ApiOrder/summitOrder', //确认订单查询商品等信息
    userOrderList: url + '/ApiOrder/userOrderList', //我的-订单列表
    userSpellOrder: url + '/ApiOrder/userSpellOrder', //我的-拼团订单列表
    addOrder: url + '/ApiOrder/addOrder', //添加订单
    addspellOrder: url + '/ApiOrder/addspellOrder', //添加抽奖订单
    userOrderDetail: url + '/ApiOrder/userOrderDetail', //订单详情
    cancelOrder: url + '/ApiOrder/cancelOrder', //订单退款
    userReceiving: url + '/ApiOrder/userReceiving', //确认收货
    delorder: url + '/ApiOrder/delUserOrder', //删除订单
    delspell: url + '/ApiOrder/delspell', //删除拼团订单
    orderlogs: url + '/ApiOrder/orderlogs', //会员订单轮播
    order_coupon: url + '/ApiOrder/order_coupon', //下单成功生产随奖券
    getorder_coupon: url + '/ApiOrder/getorder_coupon', //领取随机奖券
    coupon_one: url + '/ApiUser/coupon_one', //coupon_id 查询  优惠券
    receive_coupon: url + '/ApiUser/receive_coupon', //coupon_id   接受优惠券
    sendcoupon: url + '/ApiUser/sendcoupon', //coupon_id   赠优惠券
    getlqlog: url + '/ApiUser/getlqlog', //coupon_id   赠优惠券记录

    //用户
    endcoupon: url + '/ApiUser/endcoupon', //用户快过期优惠券，首页用
    setbirthday: url + '/ApiUser/setbirthday', //用户填写生日信息   参数birthday  
    getOneUserInfo: url + '/ApiUser/getOneUserInfo', //其他地方-获取用户资料
    userCenter: url + '/ApiUser/userCenter', //个人中心-用户资料
    userUpdate: url + '/ApiUser/userUpdate', //个人中心-修改用户资料
    writeCode: url + '/ApiUser/writeCode', //个人中心-关联邀请人
    getRoundImg: url + '/ApiUser/getRoundImg', //邀请好友-随机海报
    addContent: url + '/ApiUser/addContent', //个人中心-反馈

    updateAddress: url + '/ApiUser/updateAddress', //添加、修改收货地址
    findAddress: url + '/ApiUser/findAddress', //收货地址列表
    setDefault: url + '/ApiUser/setDefault', //收货地址-设置默认地址
    addressGetOne: url + '/ApiUser/addressGetOne', //收货地址-详情
    delAddress: url + '/ApiUser/delAddress', //收货地址-详情

    addPay: url + '/ApiPaymoney/addPay', //开通会员 续费会员，开通团长
    addPayfy: url + '/ApiPaymoney/addPayfy', //富友会员
    memberCenter: url + '/ApiUser/memberCenter', //会员中心查询会员参数
    membernums: url + '/ApiUser/membernums', //会员中心查询新会员/老会员
    getPdLookInfo: url + '/ApiParent/getPdLookInfo',
    holderCenter: url + '/ApiStore/holderCenter', //我是股东信息
    scanSelect: url + '/ApiStore/scanSelect', //我是股东-- 我的店铺
    inviteList: url + '/ApiUser/inviteList', //邀请好友-- 我的店铺
    //商家
    order_counts: url + '/ApiStore/order_counts', //商家订单数量
    bingdCode: url + '/ApiStore/bingdCode', //商家输入绑定码
    storeCenter: url + '/ApiStore/storeCenter', //商家个人中心
    storeOrderList: url + '/ApiStore/storeOrderList', //商家个人中心-订单列表
    updateOrderSta: url + '/ApiOrder/updateOrderSta', //商家确认发货
    getThisStoreUser: url + '/ApiStore/getThisStoreUser', //根据当前商家获取所有已经扫描的用户
    addStoreLog: url + '/ApiStore/addStoreLog', //用户扫描商家二维码（加入股东）
    incVideoPlayNum: url + '/ApiStore/incVideoPlayNum', //视频播放量
    getStorelist: url + '/ApiIndex/getStorelist', //门店列表
    nearstorelist: url + '/ApiIndex/nearstorelist', //附近门店列表
    //生成二维码
    drawErcode: url + '/ApiDraw/drawErcode', //商家，团长，商品生成二维码
    //团长
    addParent: url + '/ApiParent/addParent', //申请团长
    parentCenter: url + '/ApiParent/parentCenter', //团长中心
    parentOrderList: url + '/ApiParent/parentOrderList', //团长-订单列表
    //钱包
    blanceList: url + '/ApiAccount/blanceList', //钱包-流水列表
    submitTx: url + '/ApiTx/submitTx', //钱包-提现申请
    userAccount: url + '/ApiAccount/userAccount', //钱包-余额
    //文章
    storeart: url + '/ApiIndex/storeart', //文章公告列表
    getArticle: url + '/ApiIndex/getArticle', //文章详情
    sendMiniMsg: url + '/ApiMessage/sendMiniMsg', //发送订阅
    parentart: url + '/ApiIndex/parentart', //团长中心学习列表

    // 免单活动 2020.12.19 wjh新增
    getMdGoods: url + '/ApiGoods/getMdGoods', //获取免单商品
    openPrize: url + '/ApiUser/openPrize', //获取中奖状态订单信息 / 验证免单活动
    mdRoundTxt: url + '/ApiIndex/mdRoundTxt', //免单随机文案
    mdRound: url + '/ApiUser/mdRound', //顶部中奖信息
    saveMdData: url + '/ApiUser/saveMdData', //刮开之后中奖信息

    // 2021
    getIndexSet: url + '/ApiIndex/getIndexSet', //首页设置
    searchGoods: url + '/ApiSearch/miniSearch', //搜索
    searchHis: url + '/ApiSearch/searchHis', //热门搜索
    getIndexCat: url + '/ApiIndex/getIndexCat', //主页顶部分类
    getIndexAct: url + '/ApiIndex/getIndexAct', //主页活动展示
    getActList: url + '/ApiIndex/getActList', //活动展示
    getCatGoods: url + '/ApiGoods/getCatGoods', //商城页面商品列表
    getCatList: url + '/ApiGoods/getCatList', //商品分类列表
    bindOrigin: url + '/ApiUser/bindOrigin', //商城页面商品列表
    updStaCard: url + '/ApiGift/updStaCard', //开卡
    getOneInfo: url + '/ApiGift/getOneInfo', //扫码获取商家和卡信息
    selectCode: url + '/ApiParent/selectCode', //团长中心是否跳转页面
    parentNewList: url + '/ApiParent/parentNewList', //团长中心取货码获取对应订单信息
    oneKeyOrder: url + '/ApiParent/oneKeyOrder', //取货码批量提取
    searchOrder: url + '/ApiParent/searchOrder', //取货码批量提取
    roomList: url + '/ApiRoom/roomList', //获取直播间列表
    getSignList: url + "/ApiSign/getSignList", //签到页面获取数据
    signIn: url + "/ApiSign/signIn", //签到
    signgoodss: url + "/ApiSign/signgoods", //签到随机内容
    signlist: url + "/ApiSign/signlist", //签到轮播
    signLog: url + "/ApiSign/signLog", //签到记录
    teamsignLog: url + "/ApiSign/teamsignLog", //团签记录
    rankList: url + "/ApiSign/rankList", //个人签到排行榜
    teamlist: url + "/ApiSign/teamlist", //团签到排行榜
    sendQuan: url + "/ApiSign/sendQuan", //签到分享获得优惠券
    signGoods: url + "/ApiGoods/signGoods", //签到商品
    getsignSet: url + "/ApiIndex/getsignSet", //获取签到设置
    pingoods: url + "/ApiIndex/pingoods", //签到中心拼团商品
    cancelDefault: url + "/ApiUser/cancelDefault", //取消默认地址
    crontabMsg: url + "/ApiSign/crontabMsg", //签到提醒
    moreHeadImg: url + "/ApiGoods/moreHeadImg", //接龙
    upHeadImg: url + "/ApiComment/upHeadImg", //点赞列表
    storecat: url + "/ApiStore/storecat", //商家分类
    fxstore: url + "/ApiStore/fxstore", //分享店铺领钱
    addStore: url + "/ApiStore/addStore", //申请成为商户
    // 奖池相关接口
    treasure_logs: url + "/Treasure/treasure_log", //视频抽奖评论列表 参数传comment_id
    likecomment: url + "/Treasure/likecomment", //视频抽奖评论列表 参数传comment_id
    commentlist1: url + "/Treasure/commentlist", //视频抽奖评论列表 参数传limit page video_id  
    zanlist: url + "/Treasure/zanlist", //抽奖结果页判断用户签到金额 参数video_id
    sighstatus: url + "/Treasure/sighstatus", //抽奖结果页判断用户签到金额
    addcomments: url + "/Treasure/addcomment", //中奖名单发布评论
    videoinfo: url + "/Treasure/videoinfo", //中奖名单详情
    likevideo: url + "/Treasure/likevideo", //点赞/取消点赞视频  参数video_id
    videolist: url + "/Treasure/videolist", //奖品视频列表 参数 limit page
    treasure_one: url + "/Treasure/treasure_one", //奖券详情Treasure/
    backtreasure: url + "/Treasure/backtreasure", //奖券详情
    // receive_coupon: url + "/Treasure/receive_coupon", //领取奖券
    // sendtreasure: url + "/Treasure/sendtreasure", //分享奖券
    jackpot: url + "/Treasure/treasure_list", //奖池列表
    jackpot1: url + "/Treasure/treasure_list1", //奖池列表
    tj_treasure_log: url + "/Treasure/tj_treasure_log", //奖池中奖信息列表
    treasure_history: url + "/Treasure/treasure_history", //奖池扫码轮播
    treasure_res: url + "/Treasure/treasure_res", //获奖信息
    mytreasure: url + "/Treasure/mytreasure", //奖券信息
    treasure_banner: url + '/ApiIndex/treasure_banner', //首页轮播
    getchance: url + "/Treasure/getchance", //获取次数 
    addoffchance: url + "/Treasure/addoffchance", //分享增加次数
    addfollchance: url + "/Treasure/addfollchance", //关注增加次数
    //助力
    jmhelpid: url + '/ApiIndex/jmhelpid', //查询加密id
    //三方
    getred: url + "/ApiOther/getred", //判断用户是否有资格领取
    inshopping: url + '/ApiOrder/inshopping', //购物车点击加
    decshopping: url + '/ApiOrder/decshopping', //购物车点击减
    like_store: url + '/ApiUser/like_store', //点赞/取消点赞商家
    getStoreGoodsCat: url + '/ApiIndex/getStoreGoodsCat', //商家商品二级分类
    usershoppingcart: url + '/ApiUser/usershoppingcart', //购物车
    cartcount: url + '/ApiGoods/cartcount', //购物车数量
    delcartgoods: url + '/ApiUser/delcartgoods', //删除购物车
    summitOrder2: url + '/ApiOrder/summitOrder2', //有购车的商品下单接口
    addOrder2: url + '/ApiOrder/addOrder2', //购物车下单接口
    instoreorder: url + '/ApiUser/instoreorder', //扫码进入下单微信支付
    inStoreOrderblance: url + '/ApiUser/inStoreOrderblance', //扫码进入下单!微信支付
    storeName: url + '/ApiIndex/storeName', //扫码进入的商家信息
    getOneStoreOrder: url + '/ApiUser/getOneStoreOrder', //店内支付时间
    delonecartgoods: url + '/ApiUser/delonecartgoods', //购物车删除单个商品
    storeinfo: url + '/ApiGoods/storeinfo', //商家资质
    setwxinfo: url + '/ApiUser/setwxinfo', //保存资料
    registerUser: url + '/ApiUser/registerUser', //实名认证
    getStoreCatList: url + '/ApiGoods/getStoreCatList', //获取商家分类
    groupList: url + '/ApiGoods/groupList', //全部拼团
    getcdkvip: url + '/ApiGift/getcdkvip' //会员兑换
  },
  /**
   * 封装的 API POST 请求方法
   * @param {string} apiUrl - 请求的 API 地址
   * @param {object} data - 请求参数
   * @param {function} callback - 成功回调函数
   * @param {object} options - 可选配置（如 showLoading, loadingText）
   */
  apiPost(apiUrl, data, callback, options = {}) {
    const showLoading = options.showLoading !== false;
    const loadingText = options.loadingText || '加载中...';
    const requireAuth = options.requireAuth !== false; // 默认需要登录
    
    if (showLoading) {
      wx.showLoading({
        title: loadingText,
        mask: true
      });
    }

    const header = {
      'content-type': 'application/json;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    };

    const token = this.get('token_new');
    // 登录接口建立新会话，禁止携带本地残留旧 token，避免串号
    if (token && apiUrl.indexOf('/ApiLogin/') === -1) {
      header['access-token'] = token;
    }

    wx.request({
      url: apiUrl,
      data: data || {},
      method: 'POST',
      dataType: 'json',
      header: header,
      success: (res) => {
        if (!res.data) {
          this.showError('服务器返回数据异常');
          return;
        }

        const { status, msg } = res.data;
        
        if (status === 1) {
          typeof callback === 'function' && callback(res.data);
        } else if (status === 0) {
          this.showError(msg || '操作失败');
        } else if (status === 2) {
          wx.showModal({
            title: '提示',
            content: msg,
            showCancel: false,
            confirmText: '我知道了',
          });
        } else if (status === 10011) {
          // 根据 requireAuth 选项决定是否强制跳转登录
          if (requireAuth) {
            this.handleUnauthorized();
          } else {
            // 不需要强制登录的接口，静默处理，不提示用户
            console.log('未授权但不需要强制登录:', apiUrl);
            typeof callback === 'function' && callback({ status: 10011, msg });
          }
        } else if (status === 10012) {
          wx.showModal({
            title: '提示',
            content: msg,
            confirmText: '购买会员',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/exchangeCDK/exchangeCDK',
                });
              }
            }
          });
        } else if (status === 20260407) {
          wx.showModal({
            title: '提示',
            content: '当前用户状态异常',
            showCancel: false,
            confirmText: '我知道了',
          });
        } else {
          this.showError(msg || '请求失败');
        }
      },
      fail: (error) => {
        console.error(`API请求失败: ${apiUrl}`, error);
        this.showError('网络请求失败，请稍后重试');
      },
      complete: () => {
        if (showLoading) {
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 处理未授权状态
   */
  handleUnauthorized() {
    // 检查本地是否有登录信息
    const token = this.get('token_new');
    const userinfo = wx.getStorageSync('userinfo');
    
    // 如果本地有登录信息但服务器返回未授权，可能是 token 过期
    if (token && userinfo) {
      wx.showModal({
        title: '提示',
        content: '登录状态已过期，请重新登录',
        showCancel: false,
        success: () => {
          this.clearSession();
          wx.navigateTo({
            url: '/pages/login/login',
          });
        }
      });
    } else {
      // 本地没有登录信息，直接提示登录
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.navigateTo({
            url: '/pages/login/login',
          });
        }
      });
    }
  },

  /**
   * 统一错误提示
   * @param {string} msg - 错误信息
   */
  showError(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    });
  },
  /**
   * 封装的文件上传方法
   * @param {string} file - 文件路径
   * @param {function} callback - 成功回调函数
   */
  apiUpload(file, callback) {
    const header = {
      'X-Requested-With': 'XMLHttpRequest',
    };

    const token = this.get('token_new');
    if (token) {
      header['access-token'] = token;
    }

    wx.uploadFile({
      url: url + '/ApiUpload/uploadImg', // 服务器接口
      filePath: file,
      name: 'file',
      header: header,
      success: (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.status === 1) {
            typeof callback === 'function' && callback(data);
          } else {
            this.showError(data.msg || '上传失败');
          }
        } catch (error) {
          console.error('文件上传解析失败:', error);
          this.showError('上传失败，请重试');
        }
      },
      fail: () => {
        console.error('文件上传失败');
        this.showError('文件上传失败，请检查网络');
      }
    });
  },

  /**
   * 设置微信主题样式
   */
  wxAllchange() {
    const theme = wx.getStorageSync('theme');
    if (!theme) return;

    const isDark = theme === 'dark';
    const themes = isDark ? '#0f0c1a' : '#ffffff';
    const themescolor = isDark ? '#ffffff' : '#000000';
    const pullloding = isDark ? 'light' : 'dark';
    const bgtheme = isDark ? '#1C1926' : '#ffffff';
    const rtheme = isDark ? '#0f0c1a' : '#f8f8f8';

    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      const tabBarPages = ['pages/index/index', 'pages/lotgoodslist/lotgoodslist', 'pages/orderlist/orderlist', 'pages/mypage/mypage'];
      
      if (tabBarPages.includes(currentPage.route)) {
        wx.setTabBarStyle({
          color: themescolor,
          selectedColor: '#003B73',
          backgroundColor: bgtheme,
          borderStyle: 'white'
        });
      }
    }

    wx.setNavigationBarColor({
      frontColor: themescolor,
      backgroundColor: themes,
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    });

    wx.setBackgroundTextStyle({
      textStyle: pullloding
    });

    wx.setBackgroundColor({
      backgroundColorTop: rtheme,
      backgroundColorBottom: rtheme,
      backgroundColor: rtheme
    });
  },
  alert: function (msg) {
    wx.showModal({
      content: msg,
      showCancel: false,
      success(e) {
        if (e.confirm) {
          wx.navigateBack({})
        }
      }
    });
  },
  loading: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
  },
  /**
   * 保存登录会话：token 必须由后端签发，禁止前端伪造（伪造会导致串号）
   */
  saveSession(userInfo) {
    if (!userInfo || !userInfo.id) return false;
    const accessToken = userInfo.token || userInfo.access_token || userInfo.accessToken;
    if (!accessToken) {
      console.error('[登录] 后端未返回 token，无法建立会话，loginUsd 返回：', userInfo);
      return false;
    }
    if (userInfo.phone) this.set('userPhone', userInfo.phone);
    this.set('token_new', accessToken);
    this.set('userinfo', userInfo);
    this.set('uid', userInfo.id);
    return true;
  },
  /**
   * 原子清理账号会话，避免 token、uid、userinfo 来自不同账号。
   */
  clearSession(options) {
    const clearReferrer = !options || options.clearReferrer !== false;
    wx.removeStorageSync('token_new');
    wx.removeStorageSync('uid');
    wx.removeStorageSync('userinfo');
    wx.removeStorageSync('userPhone');
    if (clearReferrer) this.clearPendingReferrer();
  },
  /**
   * 清理旧版本遗留的裸 ruid。
   *
   * 旧实现会永久保存分享人的 id，导致同一设备后续登录的其他账号
   * 继续携带上一次的推荐关系。新版本只认可与元数据成对写入的值。
   */
  initializePendingReferrer() {
    const token = this.get('token_new');
    const currentUserId = this.get('uid');
    const userInfo = this.get('userinfo');
    const hasAnySessionPart = !!(token || currentUserId || userInfo);
    const hasCompleteSession = !!(token && currentUserId && userInfo);

    // 兼容旧版本“只删 token、残留 uid/userinfo”的半登录状态。
    if (hasAnySessionPart && !hasCompleteSession) {
      this.clearSession({ clearReferrer: false });
    }

    const referrerId = this.get('ruid');
    const referrerMeta = this.get('ruid_meta');
    if (referrerId && String(referrerMeta) !== String(referrerId)) {
      this.clearPendingReferrer();
    }
  },
  normalizeUserId(userId) {
    const value = String(userId == null ? '' : userId).trim();
    if (!/^\d+$/.test(value)) return '';
    return value.replace(/^0+/, '');
  },
  /**
   * 仅未登录用户可以记录本次分享入口的推荐人。
   */
  captureReferrer(userId) {
    const referrerId = this.normalizeUserId(userId);
    const currentUserId = this.normalizeUserId(this.get('uid'));
    const hasSession = !!this.get('token_new');

    if (!referrerId || hasSession || (currentUserId && currentUserId === referrerId)) {
      this.clearPendingReferrer();
      return false;
    }

    this.set('ruid', referrerId);
    this.set('ruid_meta', referrerId);
    return true;
  },
  getPendingReferrer() {
    const referrerId = this.normalizeUserId(this.get('ruid'));
    const referrerMeta = this.get('ruid_meta');
    const currentUserId = this.normalizeUserId(this.get('uid'));

    if (
      !referrerId ||
      String(referrerMeta) !== referrerId ||
      this.get('token_new') ||
      (currentUserId && currentUserId === referrerId)
    ) {
      this.clearPendingReferrer();
      return '';
    }

    return referrerId;
  },
  clearPendingReferrer() {
    wx.removeStorageSync('ruid');
    wx.removeStorageSync('ruid_meta');
  },
  set: (key, val) => {
    wx.setStorageSync(key, val);
  },
  get: (key) => {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      return null;
    }
  },
})
