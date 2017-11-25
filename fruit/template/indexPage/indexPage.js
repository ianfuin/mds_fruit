//indexPage.js
const app = getApp();
/**
 * 注册首页方法
 */

class indexMethods {

  constructor(_this) {
    this.that = _this;

    /**初始化数据 */

    /**初始化方法 */

    /**注册方法 */
    _this.clickLogo = clickLogo;//点击商城logo
    _this.clickSearch = clickSearch;//点击搜索
    _this.notice = notice;//点击公告logo
    _this.clickIndexSwiperText = clickIndexSwiperText;//点击轮播公告
    _this.receiveCoupons = receiveCoupons;//领取优惠券
    _this.showColum = showColum;//添加购物车
    console.log('%c初始化首页', "color: #409EFF");
  }

  /**
   * 渲染首页轮播图
   * 
   * @memberof indexMethods
   */

  indexSwiperImg() {
    app.http.post('Poster/findPosts')
      .then(res => {
        this.that.setData({
          indexSwiperImg: res.object
        })
      })
  }

  /**
   * 渲染首页轮播公告
   * 
   * @memberof indexMethods
   */

  indexSwiperText() {
    app.http.post('Notice/findNotices')
      .then(res => {
        this.that.setData({
          indexSwiperText: res.object
        })
      })
  }

  /**
   * 渲染首页优惠券
   * 
   * @memberof indexMethods
   */
  indexCouponList() {
    app.http.post('Coupon/findCoupons')
      .then(res => {
        res.forEach(item => {
          item.flag = true;
        })
        this.that.setData({
          indexCouponList: res
        })
      })
  }

  /**
   * 渲染首页每日特价
   * 
   * @memberof indexMethods
   */
  indexDailySpecials() {
    app.http.post('Plate/findPlateOne')
      .then(res => {
        this.that.setData({
          indexDailySpecials: res.object
        })
      })
  }

  /**
   * 渲染首页每日特鲜
   * 
   * @memberof indexMethods
   */
  indexDailyFresh() {
    app.http.post('Plate/findPlateTwo')
      .then(res => {
        this.that.setData({
          indexDailyFresh: res.object
        })
      })
  }

  /**
   * 渲染首页大家都在团
   * 
   * @memberof indexMethods
   */
  indexGroupBuy() {
    let _groupBuy = [];
    this.that.setData({
      indexGroupBuy: _groupBuy
    })
  }

  /**
   * 渲染首页限时秒杀
   * 
   * @memberof indexMethods
   */
  indexSpike() {
    let _spike = [];
    this.that.setData({
      indexSpike: _spike
    })
  }

}
/**
 * **************************************
 * 
 * **************************************
** */


/**
 * 添加购物车
 */
function showColum(e) {
  let data = { productId: e.currentTarget.dataset.id, quantity: 1, wxuserId: app.wxuserId }
  app.http.post('BuyCar/save', data)
    .then(res => {
      app.success('添加成功！')
    })
}


/**
 * 点击logo
 */
function clickLogo() {
  let that = this;
  that.setData({
    showSideBar: true,
    scrollY: false,
    hidModel: false
  })
}

/**
 * 点击搜索
 */
function clickSearch() {
  app.pageTo('search');
}

/**
 * 点击轮播公告logo
 * 
 */
function notice() {
  app.pageTo('notice');
}

/**
 * 点击轮播公告
 * 
 */
function clickIndexSwiperText(e) {
  console.log(e.currentTarget.dataset)
  app.pageTo('noticeDetail', { noticeId: e.currentTarget.dataset.noticeid });
}

/**
 * 领取优惠券
 * 
 */
function receiveCoupons(e) {
  let index = e.currentTarget.dataset.index;
  if (this.data.indexCouponList[index].flag) {
    let data = {
      wxuserId: app.wxuserId,//用户ID
      couponId: this.data.indexCouponList[index].couponId//优惠券ID
    };
    app.http.post('CouponWxuser/save', data)
      .then(res => {
        if (res.object == 1) {
          this.data.indexCouponList[index].flag = false;
          app.warning('已经领取过了!');
        } else {
          app.success('领取成功!');
        }
      })
  } else {
    app.warning('已经领取过了!');
  }
}

module.exports = indexMethods;