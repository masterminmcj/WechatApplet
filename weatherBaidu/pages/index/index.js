//index.js
const app = getApp()
const tools=require('../tools/index.js');
import * as echarts from '../../ec-canvas/echarts';
var option={};
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  chart.setOption(option);
  return chart;
}
//使用百度地图天气API
var bmap = require('../../libs/bmap-wx.min.js'); 

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    ec: {
      onInit: initChart
    },
    userInfo: {},
    Wind:[],
    dataIsLoad:false,
    logged: false,
    takeSession: false,
    requestResult: '',
    address:'',
    city_code:'',
    nowDate: new Date().getMonth() + 1 + '月' + new Date().getDate() + '日',
    weatherData:{}
      },
  onLoad:function(){
    this.getLocation()
    var that = this;
  },

  getLocation:function(){
    
    wx.getLocation({
      type: 'gcj02',
      success:this.handleLocation,
      fail: (e) => {
        // console.log(e)
      console.log('获取位置失败')
      }
    })
  },

getWeater:function(){
  var that = this;
  // 新建百度地图对象 
  var BMap = new bmap.BMapWX({
    ak: 'HaLDltBWiWz9GBpFo5Q2GG7BdOpcTDF0'
  });
  var fail = function (data) {


  };
  var success = function (data) {

    var mydata = data;
    //星期
    var futureArr = [];
    //最高温度
    var High_temp = [];
    //最低温度
    var Low_temp = [];
    //风情况
    var Winds = [];
//天气情况
var Weathers=[]

    var weatherArr = mydata.originalData.results[0].weather_data;

for(var i=0;i<weatherArr.length;i++){
  futureArr.push(weatherArr[i].date.slice(0,2));
  Winds.push(weatherArr[i].wind);
  Weathers.push(weatherArr[i].weather);
  Low_temp.push(weatherArr[i].temperature.split('~')[1].split('℃')[0]);
  High_temp.push(weatherArr[i].temperature.split('~')[0]);

}
  
    option = {
    
      xAxis: {
        splitNumber :100,
        type: 'category',
        data: [],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: 'red',
          // padding: [5, 10, 5, 10],
         
          rotate: -30,
          fontSize: 14
        }

      },
      yAxis: {
        type: 'value',
        show: false,
      

      },
      series: [
        {
          data: High_temp,
          type: 'line',
          label: {
            show: true,
            formatter: '{c}℃',
            color: '#333',
            fontSize: 14
          }
        },
        {
          data: Low_temp,
          type: 'line',
          label: {
            show: true,
            formatter: '{c}℃',
            color: '#333',
            fontSize: 14

          }
        }


      ],
      grid: {
        top:20,
        x:0,
        y:0,
        x2:-5,
     
      }
    };


    that.setData({
      weatherData: {
        update_time: '实时',
        temp: mydata.currentWeather[0].date.split('：')[1].split('℃')[0],
        temp_level: mydata.originalData.results[0].index[0].zs,
        temp_range: mydata.currentWeather[0].temperature,
        temp_wind: mydata.currentWeather[0].wind,
        dress_advice: mydata.originalData.results[0].index[0].des,
        future: futureArr,
        weathers: Weathers,
        PM25:mydata.currentWeather[0].pm25,
        now_weather:mydata.currentWeather[0].weatherDesc

      },
      ec: {
        onInit: initChart
      },
      dataIsLoad: true,
      Wind: Winds

    })


  }
  // 发起weather请求 
  BMap.weather({
    fail: fail,
    success: success
  }); 



  
},
  handleLocation(res){
    var keys = "QPHBZ-M6XW6-L3HSA-MHB6X-GQESO-7GFEH"
      var that=this;
wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${res.latitude},${res.longitude}`,
        key: keys,
        get_poi: 0
      },
      success: function (res) {
        
        // getApp.setData({
        //   address：res.data.result.address
        // })
        that.setData({
          address: res.data.result.address_component.province + '.' + res.data.result.address_component.city + '( ' +        res.data.result.address_component.district+')',
          city_code: res.data.result.ad_info.city
        })
        that.getWeater();
      },
      fail: function () {

      }
    })

  }

})
