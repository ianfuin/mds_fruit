// pages/confirmOrder/confirmOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiving: ['商家配送', '到店自取', '物流配送'],//收货方式
    receivingIndex: 0,//收货方式索引
    couponList: [{ text: '省1元优惠' }, { text: '省2元优惠' }, { text: '省3元优惠' }],//店铺优惠
    couponIndex: -1,//优惠券索引
    showCoupon: false,//显示选择店铺优惠
    imgUrl: app.imgUrl,
    carData: [], //订单详情
    remark: "", //订单备注
    wxuserCouponId: null, //用户领取的优惠券ID
    wlPrice: null, // 物流价格
    address: null, //选择的地址
    addressid: null, // 选择的地址ID
    payFee: null // 支付价（实际支付价格）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      carData: app.param.carData
    });

    this.getUserAddressDefault()
      .then(res => {
        this.setData({
          address: res.object
        })
      })
  },

  /**
   * 获取用户默认地址
   */
  getUserAddressDefault() {
    return app.http.post('AddressWxuser/getUserAddressDefault', {
      wxuserId: app.wxuserId
    })
  },

  /**
   * 微信支付
   */
  saveOrder: function () {

    /* 检测是否有地址 */
    if (this.data.address === null) {
      app.showModal({
        content: '您还没有默认的联系方式，前往设置'
      })
        .then(res => {
          this.myAddress(); //选择地址
        })
      return;
    }


    /* 开始支付 */
    let productIds = [],
      quantitys = [];

    this.data.carData.shopCarList.forEach(item => {
      productIds.push(item.productId)
      quantitys.push(item.quantity)
    });

    let data = {
      productIds: productIds.join(','), // 产品ID，逗号拼接
      quantitys: quantitys.join(','), //购买产品数量，逗号拼接
      remark: this.data.remark, //订单备注
      wxuserId: app.wxuserId, //用户ID
      wxuserCouponId: this.data.wxuserCouponId, //用户领取的优惠券ID
      totalFee: this.data.carData.totalPrice, // 总价（没有任何优惠的总价）
      payFee: this.data.payFee, // 支付价（实际支付价格）
      wlPrice: this.data.wlPrice, // 物流价格
      addressid: this.data.addressid // 选择的地址ID
    };

    app.http.post('Order/saveOrder', data)
      .then(pay => {
        app.wxPay(pay)
          .then(res => {
            console.log(res);
            app.warning('支付成功')
          })
          .catch(res => {
            console.log(res);
            app.warning('支付失败')
          })
      })
  },

  /**
   * 选择收货方式
   */
  chooseReceiving(e) {
    this.setData({
      receivingIndex: e.detail.value
    })
  },

  /**
   * 选择优惠方式
   */
  chooseCoupon(e) {
    this.setData({
      couponIndex: e.currentTarget.dataset.index
    })
  },

  /**
   * 显示优惠方式
   */
  showCoupon() {
    this.setData({
      showCoupon: !this.data.showCoupon
    })
  },

  /**
   * 选择地址
   */
  myAddress() {
    app.pageTo('myAddress', {
      confirm: true
    });
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