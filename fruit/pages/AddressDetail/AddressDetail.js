// pages/AddressDetail/AddressDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editAddressFlag: false, //是否编辑地址
    wxuserAddrId: null, //地址ID
    setDefaultFlag: true,//是否能取消默认
    address: {
      name: '', //姓名
      phone: '', //电话号码
      detailedAddress: '', //详细地址
      region: ['广东省', '广州市', '海珠区'],
      state: false, //默认状态
    },
    autoFocus: {
      nameFlag: false,
      phoneFlag: false,
      detailFlag: false
    },
    customItem: '全部',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if ('address' in app.param) {
      //编辑地址
      app.setBarTitle('编辑地址');
      this.data.editAddressFlag = true;

      let address = app.param.address;
      this.data.setDefaultFlag = app.param.addressLength > 1 ? true : false;

      this.data.wxuserAddrId = address.wxuserAddrId;
      this.data.address.name = address.userNameAddr;
      this.data.address.phone = address.telephone;
      this.data.address.detailedAddress = address.detailAddr;
      this.data.address.region = [address.province, address.city, address.area];
      this.data.address.state = address.flag == 1 ? true : false;

      this.setData({
        address: this.data.address,
        setDefaultFlag: this.data.setDefaultFlag
      })

    } else {
      //添加地址
      app.setBarTitle('添加地址');
      this.data.setDefaultFlag = app.param.addressLength > 0 ? true : false;

      this.data.address.state = app.param.addressLength > 0 ? false : true;
      this.setData({
        address: this.data.address,
        setDefaultFlag: this.data.setDefaultFlag
      })
    }

  },

  //保存地址
  saveAddress: function (e) {
    const myreg = /^1[3|4|5|7|8][0-9]{9}$/;
    if (this.data.address.name == '') {
      this.data.autoFocus.nameFlag = true;
      this.message('请输入收货人姓名');
      return;
    }
    if (!myreg.test(this.data.address.phone)) {
      this.data.autoFocus.phoneFlag = true;
      this.message('请输入正确的手机号码');
      return;
    }
    if (this.data.address.detailedAddress == '') {
      this.data.autoFocus.detailFlag = true;
      this.message('请输入详细地址');
      return;
    }

    let data = {
      wxuserId: app.wxuserId,
      telephone: this.data.address.phone,
      userNameAddr: this.data.address.name,
      province: this.data.address.region[0],
      city: this.data.address.region[1],
      area: this.data.address.region[2],
      detailAddr: this.data.address.detailedAddress
    };
    data.flag = this.data.address.state ? '1' : '0';

    if (this.data.editAddressFlag) {
      //更新地址
      data.wxuserAddrId = this.data.wxuserAddrId;
      app.http.post('AddressWxuser/update', data)
        .then(res => {
          app.success('保存成功')
          setTimeout(_ => {
            app.pageBack()
          }, 500)
        })
    } else {
      //保存地址
      app.http.post('AddressWxuser/save', data)
        .then(res => {
          app.success('保存成功')
          setTimeout(_ => {
            app.pageBack()
          }, 500)
        })
    }

  },

  //设为默认
  setDefault: function () {
    this.data.address.state = !this.data.address.state;
    this.setData({
      address: this.data.address
    })
  },

  //输入姓名
  inputName: function (e) {
    this.data.address.name = e.detail.value.trim();
  },

  //输入电话号码
  inputPhone: function (e) {
    this.data.address.phone = e.detail.value;
  },

  //输入详细地址
  inputDetailedAddress: function (e) {
    this.data.address.detailedAddress = e.detail.value;
  },

  //选择地址
  bindRegionChange(e) {
    this.data.address.region = e.detail.value;
    this.setData({
      address: this.data.address
    })
  },

  //提示输入必要信息
  message(_content = '') {
    wx.showModal({
      title: '提示',
      content: _content,
      showCancel: false,
      success: res => {
        if (res.confirm) {
          this.setData({
            autoFocus: this.data.autoFocus
          });
          this.data.autoFocus = {
            nameFlag: false,
            phoneFlag: false,
            detailFlag: false
          };
        }
      }
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