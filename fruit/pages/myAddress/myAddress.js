// pages/AddAddress/AddAddress.js
const app = getApp();
let pageflag = '';
Page({
  data: {
    loginFlag: false,
    myAddress: [] //地址数据
  },
  onLoad: function () {
    if ('confirm' in app.param) {
      app.setBarTitle('选择地址')
      this.setData({
        confirm: app.param.confirm
      })
    }
  },
  onShow: function () {
    this.findAddressWxusers(); //查询用户地址数据
  },
  //查询用户地址数据
  findAddressWxusers() {
    this.setData({
      loginFlag: true
    })
    app.http.post('AddressWxuser/findAddressWxusers', {
        wxuserId: app.wxuserId
      })
      .then(res => {
        this.setData({
          myAddress: res.object,
          loginFlag: false
        })
      })
      .catch(res => {
        this.setData({
          loginFlag: false
        })
      })
  },

  //删除地址
  deleteAddress: function (e) {
    app.showModal({
        content: '确定要删除地址吗？'
      })
      .then(res => {
        app.http.post('AddressWxuser/delete', {
            wxuserAddrId: e.currentTarget.dataset.id
          })
          .then(res => {
            app.success('删除成功');
            this.findAddressWxusers(); //查询用户地址数据
          })
      })
  },

  //编辑地址
  editAddress: function (e) {
    let index = e.currentTarget.dataset.index;
    app.pageTo('AddressDetail', {
      address: this.data.myAddress[index],
      addressLength: this.data.myAddress.length
    });
  },

  //添加地址
  addAddress: function (e) {
    app.pageTo('AddressDetail', {
      addressLength: this.data.myAddress.length
    });
  },

  //选择地址
  chooseAddress(e) {
    let index = e.currentTarget.dataset.index;
    let pages = getCurrentPages();
    let page = pages[pages.length - 2];
    page.data.address = this.data.myAddress[index];
    page.setData({
      address: page.data.address
    })
    app.pageBack();
  },

  //设置默认地址
  setDefault: function (e) { //通过地址ID  修改地址默认状态  
    let data = {
      wxuserAddrId: e.currentTarget.dataset.id, //地址ID
      flag: 1 //默认状态
    };
    app.http.post('AddressWxuser/update', data)
      .then(res => {
        this.findAddressWxusers(); //查询用户地址数据
        app.success('设为默认成功');
      })
  },


  onReady: function () {
    // 页面渲染完成
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
});