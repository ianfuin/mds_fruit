// pages/orderDetail/orderDetail.js
const app = getApp();
// payFlag: null, //订单状态(0,等待买家付款, 1,买家已付款, 2,卖家已发货, 3,交易成功)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null//订单详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId = app.param.orderId;
    app.param = null;
    setTimeout(_=>{
    this.findOrderById(orderId);//根据ID查询订单
    },30000)
  },

  //根据ID查询订单
  findOrderById(_orderId) {
    app.http.post('Order/findOrderById', { orderId: _orderId })
      .then(res => {
        this.setData({
          orderDetail: res.object
        })
        console.log(this.data.orderDetail)
      })
  },

  //拨打电话
  makePhone() {
    if (app.phoneNumber == null) {
      return;
    }
    wx.makePhoneCall({
      phoneNumber: app.phoneNumber,
    })
  },

  //付款
  saveOrderFail() {
    let data = {
      orderIds: this.data.orderDetail.orderId,// 订单ID，逗号拼接
      wxuserId: app.wxuserId
    };
    app.http.post('Order/saveOrderFail', data)
      .then(res => {
        app.wxPay(res)
          .then(payres => {
            app.success('支付成功')
          })
          .catch(payres => {
            app.warning('支付失败')
          })
      })
  },

  //提醒卖家发货
  remindDelivery() {
    app.success('提醒卖家成功！')
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
});