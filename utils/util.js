const formatTime = date => {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const second = date.getSeconds()

   return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
// 富文本换行
function richText(htmlString) {
   const brCounts = []; // 用于存储每组连续 <br> 的数量
   htmlString = htmlString.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1'); //去除所有的div标签
   // 使用正则表达式匹配连续的 <br> 标签
   let regex = /(<br\s*\/?>\s*){2,}/gi;
   let match;

   // 使用 exec 方法找到所有匹配的组
   while ((match = regex.exec(htmlString)) !== null) {
      // 计算当前匹配项中连续 <br> 的数量
      const brCount = (match[0].match(/<br\s*\/?>/gi) || []).length;
      // 将当前匹配的内容替换为单个 <br>
      var br = ''
      console.log(brCount);
      for (var i = 2; i <= brCount; i++) {
         br = br + '<div><br /></div>'
      }
      // br = '<div>'+br+'</div>'
      htmlString = htmlString.replace(match[0], br);
   }
   htmlString = htmlString.replace(/<video/gi, '<video class="videoBox"');
   htmlString = htmlString.replace(/(?<!<div>\s*)<br\s*\/?>\s*(?!\s*<\/div>)/gi, '<p></p >');
   htmlString = '<div>' + htmlString + '</div>'
   return htmlString;
}
function countDate(item) {
   item = Number(item)
   var date;
   var minutes = Math.floor((Date.now() - item * 1000) / 1000 / 60)
   var hours = Math.floor(minutes / 60)
   var nowMinute = minutes % 60
   var days = Math.floor(hours / 24)
   // console.log(minutes)
   if (minutes <= 5) {
      date = "刚刚"
   } else if (days < 1) {
      if (hours < 1) {
         date = nowMinute + '分钟前'
      } else {
         date = hours + '小时前'
      }
   } else {
      var minute = moment(item * 1000).minute()
      var hour = moment(item * 1000).hour()
      var str = ''
      if (hour >= 6 && hour < 11) {
         str = ' 早上'
      } else if (hour >= 11 && hour < 13) {
         str = ' 中午'
      } else if (hour >= 13 && hour < 18) {
         str = ' 下午'
      } else {
         str = ' 晚上'
      }
      if (minute < 10) {
         minute = '0' + minute
      }
      date = days + '天前' + str + ' ' + hour % 12 + ':' + minute
   }
   return date
}
const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : `0${n}`
}
//判断是否登录
function isLogin(n, data) {
   if (!wx.getStorageSync('token_new')) {
      if (data) {
         if (data.type == 2) {
            wx.navigateTo({
               url: '/pages/login/login?type=' + data.type + '&infoid=' + data.infoid + '&classify=' + data.classify + '&full_sku_id=' + data.full_sku_id + '&num=' + data.num + '&maxnum=' + data.maxnum,
            })
         } else {
            wx.navigateTo({
               url: '/pages/login/login?type=' + data.type + '&infoid=' + data.infoid + '&num=' + data.num + '&storesid=' + data.storesid + '&zttype=' + data.zttype
            })
         }
      }
      // else if(!wx.getStorageSync('token_new') && wx.getStorageSync('zbdl')){
      //   wx.removeStorageSync('zbdl')
      // }
      else {
         wx.navigateTo({
            url: '/pages/login/login?type=1',
         })
      }
      return false;
   } else {
      console.log('已登录')
      n.success();
   }
}
// 将角度转换为弧度
function toRadians(degrees) {
   return degrees * Math.PI / 180;
}
// 计算两点间的距离
function getDistance(lat1, lon1, lat2, lon2) {
   const R = 6371; // 地球平均半径，单位为公里

   const dLat = toRadians(lat2 - lat1);
   const dLon = toRadians(lon2 - lon1);

   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

   const c = 2 * Math.asin(Math.sqrt(a));

   return (R * c).toFixed(2); // 返回的距离单位为公里
}

function getFutureDate(days) {
   const date = new Date();
   date.setDate(date.getDate() + days); // 更安全的跨月计算方式
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
   const weekDay = weekDays[date.getDay()];
   return `${month}-${day}（${weekDay}）`; // 中文括号包裹周几
}

function timeStamp(timestamp) {
   const pad = (num) => num.toString().padStart(2, '0')
   const date = new Date(timestamp * 1000) // 假设传入的是秒级时间戳
   return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}
function timeStamp123(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
  // 处理传入的时间戳（支持秒级和毫秒级）
  const time = typeof timestamp === 'string' ? Number(timestamp) : timestamp;
  const date = time >= 10000000000 ? new Date(time) : new Date(time * 1000);
  
  // 格式化数字，不足两位时前面补零
  const pad = (num) => num.toString().padStart(2, '0');
  
  // 提取时间各部分
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  
  // 根据格式字符串返回对应格式的时间
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}
function checkTimeRange(startTime, endTime) {
  // 处理开始时间和结束时间（支持秒级/毫秒级时间戳、字符串或Date对象）
  const processTime = (time) => {
    if (time instanceof Date) return time.getTime();
    const numTime = typeof time === 'string' ? Number(time) : time;
    return numTime >= 10000000000 ? numTime : numTime * 1000;
  };
  
  const start = processTime(startTime);
  const end = processTime(endTime);
  const now = Date.now(); // 当前时间的毫秒时间戳
  
  // 验证开始时间是否小于结束时间
  if (start > end) {
    console.error('开始时间必须小于结束时间');
    return -1;
  }
  
  if (now < start) {
    return 0; // 当前时间在开始时间之前
  } else if (now > end) {
    return 2; // 当前时间在结束时间之后
  } else {
    return 1; // 当前时间在时间范围之内
  }
}


module.exports = {
   formatTime,
   isLogin: isLogin,
   getDateDiff: countDate,
   getDistance,
   getFutureDate,
   richText,
   timeStamp,
   timeStamp123,
   checkTimeRange,
}