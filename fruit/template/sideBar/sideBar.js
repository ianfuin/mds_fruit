/**
 * 初始化侧边栏页面数据
 */

class initSildeBar {

  constructor(_this) {
    this.that = _this;
    try {
      var res = wx.getSystemInfoSync()
    } catch (e) {
      // Do something when catch error
    }
    /**数据 */
    _this.setData({
      showSideBar: false,//显示侧边栏
      hidModel: true,//隐藏幕模糊背景
      showIntr: false,//显示隐藏简介
      slideBarSwiperImg: [],//侧滑栏轮播数据
      windowWidth: res.windowWidth,//窗口可见宽
      touchstart_pageX: 0//滑动开始的位置
    });

    /**方法 */
    _this.touchstart = touchstart;//屏幕滑动操作
    _this.touchend = touchend;//屏幕滑动操作
    _this.hidSideBar = hidSideBar;//隐藏侧边栏
    _this.showIntr = showIntr;//显示隐藏简介
    _this.openLocation = openLocation;//查看商家位置
    _this.makePhoneCall = makePhoneCall;//拨打电话
    _this.previewImage = previewImage;//预览图片

    console.log('%c初始化侧滑栏', "color: #409EFF")
  }

  /**
 * 渲染侧边栏页面数据
 */
  setData(_tabData = {}) {

    this.that.setData({
      tabData: _tabData
    });

    console.log('%渲染侧滑栏页面数据', "color: #409EFF")
  };

}

/**
 * 查看商家位置
 */
function openLocation() {
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        name: '商家名城',
        address: '商家详细说明',
        scale: 28 //缩放比例，范围5~18，默认为18
      })
    }
  })
}

/**
 * 拨打电话
 */
function makePhoneCall() {
  wx.makePhoneCall({
    phoneNumber: '1340000' //仅为示例，并非真实的电话号码
  })
}

/**
 * 预览图片
 */
function previewImage() {
  wx.previewImage({
    current: 'https://res.wx.qq.com/mpres/htmledition/images/mp_qrcode218877.gif', // 当前显示图片的http链接
    urls: ['https://res.wx.qq.com/mpres/htmledition/images/mp_qrcode218877.gif'] // 需要预览的图片http链接列表
  })
}

/**
 * 屏幕滑动操作
 */

//滑动开始
function touchstart(e) {
  let that = this;
  that.data.touchstart_pageX = e.touches[0].pageX;
}
//滑动结束
function touchend(e) {
  let that = this;
  if (e.changedTouches[0].pageX - that.data.touchstart_pageX >= that.data.windowWidth / 3) {
    that.setData({
      showSideBar: true,
      hidModel: false
    })
  }
}

/**
 * 隐藏侧边栏
 */
function hidSideBar() {
  let that = this;
  if (!that.data.hidModel) {
    that.data.hidModel = true;
    setTimeout(_ => {
      that.setData({
        hidModel: true
      })
    }, 500)
  }
  that.setData({
    scrollY: true,
    showSideBar: false
  })
}

/**
 * 显示隐藏简介
 */

function showIntr() {
  let that = this;
  that.setData({
    showIntr: !that.data.showIntr
  })
}

module.exports = initSildeBar;