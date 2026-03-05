//请求类
const http  = {
  getveision:()=>{
      return '1.5.3';
  },
  //发送Get请求
  get : (url,callback,params,header) => {
    var webdata = {
      token:wx.getStorageSync('token'),
      ysdversion:http.getveision()
  }
  var data = Object.assign(webdata,params)
      //发起请求
      request(url,'GET',data,header,(data)=>{
          return callback(data);
      },header)
  },
  //发送POST请求
  post:(url,callback,params,header) => {
    header = "application/x-www-form-urlencoded";
    var webdata = {
      token:'1c14e43785db1176f5d81e8247fe00bd',
      ysdversion:http.getveision()
  }
    var data = Object.assign(webdata,params)
      //发起请求
      request(url,'POST',data,header,(data)=>{
          // return callback(data)    
          if (data.status == 1) {
            return callback(data);
          } else if(data.status==0) {
            // this.alert(data.msg);
            if(data.msg=="您的登录已失效."){
              console.log(111)
              // this.rm('token');
              wx.removeStorageSync('token')
            }
          }else if(data.status==9){
            // this.rm('token');
            wx.removeStorageSync('token')

          }else{
            // this.alert(data.msg);
          }    
      },header)
  }
}

//公共封装类
const request = (url,method,data,header,callback)=>{
  //调用微信发起请求
  wx.request({
      url  : url,  //请求的url地址
      data : data, //请求的数据
      header: {
          'content-type': header ? header : 'application/json' // 默认头部请求参数
      },
      timeout :60000,   //连接请求超时
      method  :method, //请求方法
      dataType:'JSON', //返回格式
      //执行成功返回的方法
      success :(data,statusCode) =>{
         //解析data
         let result = JSON.parse(data.data);
        // if(result.status<1){
        //    wx.showToast({
        //     title: result.msg,
        //     icon:'loading'
        //   })
        //   return;
        // }
         //直接返回
         if(typeof callback === 'function')
          return callback(result); 
      },
      //执行失败返回的方法
      fail:(res)=>{
          wx.showToast({title:'网络连接超时',icon:'none'})  
      }
  })     
}

//import
module.exports = http;