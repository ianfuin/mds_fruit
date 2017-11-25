// mine.js
const app = getApp();
/**
 * 模块说明
 * @module minePage
 */

/**
 * @param {参数类型} 参数名
 * 字符串（String）
 * 数字(Number)
 * 布尔(Boolean)
 * 数组(Array)
 * 对象(Object)
 * 空（Null）
 * 未定义（Undefined）
 */


/**
 * 这是 minePage 类
 * @class minePage
 * @constructor
 * @param {Object} that 当前页面的Page数据
 */
class minePage {

  constructor(_this) {
    this.that = _this;
    _this.setData({
      navList: [
        { text: '待付款' },
        { text: '待发货' },
        { text: '待收货' },
        { text: '已完成' }
      ],
    })
    /**初始化数据 */
    if (app.globalData.userInfo === null) {
      app.wxGetSetting()
        .then(res => {
          _this.setData({
            userInfo: res.userInfo
          })
        })
    } else {
      _this.setData({
        userInfo: app.globalData.userInfo
      })
    }

    /***注册事件 *****/
    _this.myOrder = myOrder;//查看我的订单
    _this.coupon = coupon;//查看我的优惠券
    _this.myAddress = myAddress;//地址管理
    _this.offerPay = offerPay;//优惠买单
    _this.mds = mds;
    console.log('%c初始化我的页面', "color: #409EFF");
  }

  /**
   * 渲染分类数据
   * @method classList
   * @param {Object} classList 分类数据
   */
  classList(_classList = {}) {
    this.that.setData({
      classList: _classList
    })
  }

  /**
* 获取我的优惠券
* @method findWxuserCoupons
*/
  findWxuserCoupons() {
    let myCoupon = [];
    app.http.post('CouponWxuser/findWxuserCoupons', { wxuserId: app.wxuserId })
      .then(res => {
        this.that.setData({
          myCoupon: res.object
        })
      })
  }
}

/**
 * 查看我的订单
 * @method myOrder
 */
function myOrder(e) {
  app.pageTo('myOrder', { payFlag: e.currentTarget.dataset.index });
}

/**
 * 查看我的优惠券
 * @method coupon
 */
function coupon() {
  app.pageTo('coupon');
}

/**
 * 地址管理
 * @method myAddress
 */
function myAddress() {
  app.pageTo('myAddress');
}

/**
 * 优惠买单
 * @method offerPay
 */
function offerPay() {
  app.pageTo('offerPay');
}

/**
 * 
 */
function mds() {
  app.pageTo('mds')
}

module.exports = minePage;