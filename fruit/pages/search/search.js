// pages/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],//热门推荐
    searchFlag: false,//是否搜索
    searchList: [],//搜索列表
    searchText: null, //搜索关键词
    ImgUrl: app.imgUrl,//图片地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findSearchWords()  //搜索关键词
  },

  /**
   * 
   * 数据请求
   */
  //获取商品信息
  searchProductByKeyWords(_keyWord) {
    app.http.post('Product/searchProductByKeyWords', { keyWord: _keyWord })
      .then(res => {
        this.setData({
          searchList: res.object
        })
      })
  },


  /**
   * 
   * 方法
   */

  //搜索商品
  searchGoods() {
    this.searchProductByKeyWords(this.data.searchText)
  },

  //搜索关键词
  findSearchWords() {
    app.http.post('SearchWord/findSearchWords')
      .then(res => {
        this.setData({
          hotList: res.object
        })
      })
  },

  //点击关键词搜索
  searchByKeyWords(e) {
    this.searchProductByKeyWords(e.currentTarget.dataset.keyword)
  },


  //输入关键词
  searchText(e) {
    this.data.searchText = e.detail.value.trim();
  },

  //返回首页
  indexPage() {
    wx.navigateBack({
      delta: 1
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