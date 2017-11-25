// pages/goodsDetail/goodsDetail.js
let app = getApp();
let timeout = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexSwiperImg: ['http://47.94.20.159/1.jpg', 'http://47.94.20.159/2.jpg', 'http://47.94.20.159/3.jpg', 'http://47.94.20.159/4.jpg', 'http://47.94.20.159/5.jpg'],
    showModel: false, //显示背景
    goodDetail: null, //商品信息
    showColum: false, //显示计数器
    carNum: 0 //加入购物车数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.findByIdDtl(); //查看产品详情

    try {
      let res = wx.getSystemInfoSync();
      this.setData({
        windowHeight: res.windowHeight
      })
    } catch (e) {
      // Do something when catch error
    }
  },

  //查看产品详情
  findByIdDtl() {
    app.http.post('Product/findByIdDtl', {
      productId: app.param
    })
      .then(res => {
        this.setData({
          goodDetail: res.object,
          RealPrice: res.object.realPrice,
        })
      })
  },

  //添加产品到购物车
  buyCarSave() {

    let data = {
      productId: this.data.goodDetail.productId, //产品ID
      quantity: this.data.showColum, //购买数量
      wxuserId: app.wxuserId //用户ID
    };

    app.http.post('BuyCar/save', data)
      .then(res => {

      })
  },

  /**
   * 加减购物车
   */
  changeShopCar: function (e) {
    let flag = e.currentTarget.dataset.flag;

    this.data.carNum += parseInt(flag);

    if (this.data.carNum <= 0) {
      this.showColum(); //显示|隐藏计数器
    }

    this.setData({
      carNum: this.data.carNum
    })

    /*     clearTimeout(timeout)
        timeout = setTimeout(_ => {
          let data = {
            buycarId: shopData.shopCarList[index].buycarId,//购物车ID
            quantity: shopData.shopCarList[index].carNum,//购买数量
          };
          app.http.post('BuyCar/update', data);
        }, 500) */

  },


  /**
   * 显示|隐藏计数器
   */
  showColum() {
    this.data.showColum = !this.data.showColum;
    this.data.carNum = this.data.showColum ? 1 : 0;
    this.setData({
      showColum: this.data.showColum,
      carNum: this.data.carNum
    })
  },

  /**
   * 跳转购物车
   */
  ToShopcar: function () {
    app.pageBack();
    app.pageIndex = 2;
  },

  //显示背景
  showModel() {
    this.setData({
      showModel: !this.data.showModel
    })
  },

  /**
 * 
 */
  mds() {
    app.pageTo('mds')
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