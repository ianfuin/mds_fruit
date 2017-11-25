// pages/myOrder/myOrder.js
const app = getApp();
let timeOut = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    swiperIndex: 0,//滑块位置
    navIndex: 0,//导航栏位置
    navBottomLeft: 0,//导航条底部位置
    navList: [
      { text: '待付款', payFlag: 0 },
      // { text: '待成团',payFlag:0 },
      { text: '待发货', payFlag: 1 },
      { text: '待收货', payFlag: 2 },
      { text: '已完成', payFlag: 3 },
      // { text: '售后退款',payFlag:0 }
    ],
    lazyList: [],//懒加载
    orderList: [] //订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getwindowHeight();//获取屏幕高度

    for (let i = 0; i < this.data.navList.length; i++) {
      this.data.lazyList[i] = false;
      this.data.orderList[i] = [{}];
    }

    this.data.lazyList[app.param.payFlag] = true;
    this.findOrderByState(app.param.payFlag);//根据订单状态查询订单
    this.setData({
      swiperIndex: app.param.payFlag,
      navIndex: app.param.payFlag,
      lazyList: this.data.lazyList,
      orderList: this.data.orderList
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

  //根据订单状态查询订单
  findOrderByState(_payFlag) {
    let data = {
      payFlag: _payFlag, //订单状态(0,等待买家付款, 1,买家已付款, 2,卖家已发货, 3,交易成功)
      // wxuserId: app.wxuserId// 用户ID
      wxuserId: "1"// 用户ID
    };
    app.http.post('Order/findOrderByState', data)
      .then(res => {
        this.data.orderList[_payFlag] = res.object;
        this.setData({
          orderList: this.data.orderList
        })
      })
  },

  //取消订单


  //付款
  saveOrderFail(e) {
    let data = {
      orderIds: e.currentTarget.dataset.orderid,// 订单ID，逗号拼接
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

  //查看物流
  shipDetail(e) {
    let data = {
      wlnum: e.currentTarget.dataset.wlnum,
      code: e.currentTarget.dataset.code,
      orderdetails: e.currentTarget.dataset.orderdetails
    };
    app.pageTo('shipDetail', data)
  },

  //确认收货

  //删除订单

  //查看订单详情
  orderDetail(e) {
    app.pageTo('orderDetail', { orderId: e.currentTarget.dataset.orderid, payFlag: this.data.swiperIndex });
  },

  //点击导航
  clickNav(e) {
    this.data.clickNav = true;
    let _navId = `nav${e.currentTarget.dataset.index - 1}`;
    this.setData({
      navId: _navId,
      navIndex: e.currentTarget.dataset.index,
      swiperIndex: e.currentTarget.dataset.index
    })
  },

  //滑块滑动
  swiperChange(e) {
    let _navId = `nav${e.detail.current - 1}`;

    if (this.data.lazyList[e.detail.current]) {
      clearTimeout(timeOut)
      timeOut = setTimeout(_ => {
        this.findOrderByState(e.detail.current);//根据订单状态查询订单
      }, 500)
    } else {
      this.findOrderByState(e.detail.current);//根据订单状态查询订单
    }

    this.data.lazyList[e.detail.current] = true;

    this.setData({
      navId: _navId,
      lazyList: this.data.lazyList,
      navIndex: e.detail.current
    })
  },

  //回到首页
  indexPage() {
    app.pageBack();
    app.pageIndex = 0;
  },

  //获取屏幕高度
  getwindowHeight() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
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