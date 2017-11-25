// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myCoupon: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findWxuserCoupons(); //查询用户领取的所有优惠券
  },

  //查询用户领取的所有优惠券
  findWxuserCoupons() {
    app.http.post('CouponWxuser/findWxuserCoupons', { wxuserId: app.wxuserId })
      .then(res => {
        this.setData({
          myCoupon: res.object,
        })
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
});