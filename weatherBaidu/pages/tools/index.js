
function handleLocation(res){
  var keys ="QPHBZ-M6XW6-L3HSA-MHB6X-GQESO-7GFEH"
console.log(getApp())
wx.request({
  url: 'https://apis.map.qq.com/ws/geocoder/v1/',
  data: {
    location: `${res.latitude},${res.longitude}`,
    key: keys,
    get_poi: 0
  },
  success:function(res){
    // getApp.setData({
    //   address：res.data.result.address
    // })
    console.log(res.data)
  },
  fail:function(){
    
  }
})

}

module.exports={
  handleLocation: handleLocation
}