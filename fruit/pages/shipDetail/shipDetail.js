// pages/shipDetail/shipDetail.js
const app = getApp();
const myreg = /\d+/g;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderdetails: null,//产品信息
    wlData: null,//物流数据
    imgUrl: app.imgUrl,
    wlnum: null // 物流单号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let param = app.param;
    app.param = null;
    this.setData({
      orderdetails: param.orderdetails,
      wlnum: param.wlnum
    })
    this.findWlMsg(param); //查询物流信息
  },

  //查询物流信息
  findWlMsg({ code = '', wlnum = '' }) {
    let data = {
      code: code,//物流编码
      wlnum: wlnum //物流单号
    };
    app.http.post('Wlcompany/findWlMsg', data)
      .then(res => {
        let wlData = res.object;
        wlData.forEach(item => {
          if (myreg.test(item.acceptStation)) {
            item.telNum = item.acceptStation.match(/1[3|4|5|7|8][0-9]{9}?/g);
            item.acceptStation = item.acceptStation.replace(item.telNum, `#${item.telNum}#`).split('#');
            item.havePhone = true;
          } else {
            item.havePhone = false;
          }
        })
        this.setData({
          wlData: wlData
        })
      })
  },

  //打电话
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
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

  }
})