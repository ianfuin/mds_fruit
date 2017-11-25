const app = getApp();//获取应用实例

import getIndexPage from '../../template/indexPage/indexPage.js';//获取 首页 方法
import getClassPage from '../../template/classPage/classPage.js';//获取 品类 方法
import getShopCarPage from '../../template/shopCar/shopCar.js';//获取 购物车 方法
import getMinePage from '../../template/mine/mine.js';//获取 我的 方法

import getSildeBar from '../../template/sideBar/sideBar.js';//获取侧滑栏方法

let initPageData = {};
let timeout = null;

let indexPage = null;//首页 实例方法
let classPage = null;//品类 实例方法
let shopCarPage = null;//购物车 实例方法
let minePage = null;//我的 实例方法
let sildeBar = null;//侧滑栏 实例方法
/**
 * 初始化底部导航栏
 */
class initTabBar {

  constructor(_this) {
    this.that = _this;

    indexPage = null;//首页 实例方法
    classPage = null;//品类 实例方法
    shopCarPage = null;//购物车 实例方法
    minePage = null;//我的 实例方法
    sildeBar = null;//侧滑栏 实例方法

    /***初始化数据 */
    _this.setData({
      imgUrl: app.imgUrl, //图片地址
      initFlag: false //是否初始化
    });

    /****** 初始化页面方法 ******/
    sildeBar = new getSildeBar(_this);//初始化侧滑栏

    initPageData = new initPage(_this)

    /***注册事件 *****/
    _this.tabBarClick = tabBarClick;//注册底部导航栏点击事件
    _this.scrollView = scrollView;//滚动
    _this.scrollTop = scrollTop;//回到顶部
    _this.goodsDetail = goodsDetail;//点击商品跳转详情页

    console.log('%c初始化底部导航栏', "color: #409EFF")
  }

  /**
   * 渲染导航栏数据
   * @method setData
   * @param {Object} tabBar 底部导航栏数据
   * @param {Number} shopCarNum 底部导航购物车数量
   * @param {Boolean} initFlag 是否初始化导航栏
   * @param {Boolean} scrollY 当前页面能否滑动
   * @param {Number} windowHeight 窗口可见高度
   * @param {Number} windowWidth 窗口可见宽
   * @param {Number} scrollTop 回到顶部
   * @param {Boolean} showScrollTop 显示回到顶部
   * @param {Number} tabBarIndex 当前显示的导航页面
   */
  setData({ tabBar = [], tabBarIndex = 0 }) {

    if (tabBar.list.length > 5) {
      tabBar.list = tabBar.list.slice(0, 5);
      console.warn('底部当航栏超过数量限制，最大数量 5 ');
    }

    //重置lazyFalg
    tabBar.list.forEach(item => {
      item.lazyFlag = false;
    })

    tabBar.list[tabBarIndex].lazyFlag = true;
    app.setBarTitle(tabBar.list[tabBarIndex].text);//设置当前页面标题

    try {
      var res = wx.getSystemInfoSync()
    } catch (e) {
      // Do something when catch error
    }
    this.that.setData({
      tabBar: tabBar,
      shopCarNum: 0,
      initFlag: true,
      scrollY: true,
      windowHeight: res.windowHeight,
      scrollTop: 0,
      showScrollTop: false,
      tabBarIndex: tabBarIndex
    });

    /* 获取code */
    app.getCode()
      .then(res => {
        console.log(`%c获取code：${res.code} 成功`, "color: #67c23a")
        return app.wxlogin(res.code); //获取用户id
      })
      .then(res => {
        app.loginInfo = res.object;
        app.wxuserId = res.object.wxuserId;

        initPageData[tabBar.list[tabBarIndex].pagePath]();//初始化页面

        if (res.object.authorizeType == 0) {
          //获取用户信息
          app.wxGetSetting()
            .then(res => {
              console.log(`%c获取获取用户信息成功`, "color: #67c23a")
              app.globalData.userInfo = res.userInfo;
              app.loginInfo.nickName = res.userInfo.nickName;
              app.loginInfo.avatarUrl = res.userInfo.avatarUrl;
              app.loginInfo.authorizeType = 1;
              app.update(app.loginInfo); //授权后更新用户头像昵称
            })
        }
      })

    console.log('%c渲染导航栏数据', "color: #409EFF")
  };

}
/**
 * 初始化页面
*/
class initPage {
  constructor(that) {
    this.that = that;
  }
  indexPage() {
    if (indexPage === null) {
      indexPage = new getIndexPage(this.that); /**首页 实例方法 */
    }
    indexPageData();//获取 首页 数据
  }
  classPage() {
    if (classPage === null) {
      classPage = new getClassPage(this.that); /**品类 实例方法 */
    }
    classPageData();//获取 品类 数据
  }
  shopCarPage() {
    if (shopCarPage === null) {
      shopCarPage = new getShopCarPage(this.that);/**购物车 实例方法 */
    }
    shopCarPageData();//获取 购物车 数据
  }
  minePage() {
    if (minePage === null) {
      minePage = new getMinePage(this.that);/**我的 实例方法 */
    }
    minePageData();//获取 我的 数据
  }
}

/**
 * 获取首页数据
 */
function indexPageData() {
  indexPage.indexSwiperImg();
  indexPage.indexSwiperText();
  indexPage.indexCouponList();
  indexPage.indexDailySpecials();
  indexPage.indexDailyFresh();
  indexPage.indexGroupBuy();
  indexPage.indexSpike();
}
/**
 * 获取品类数据
 */
function classPageData() {
  classPage.classSwiperImg();
  classPage.classList();
}
/**
 * 获取购物车数据
 */
function shopCarPageData() {
  shopCarPage.findBuyCars();
}
/**
 * 获取我的数据
 */
function minePageData() {
  minePage.findWxuserCoupons();
}

/**
 * 底部导航栏点击事件
 */
function tabBarClick(e) {
  let that = this;
  let index = e.currentTarget.dataset.index;
  let tabList = that.data.tabBar.list[index];

  if (that.data.tabBar.list[index].lazyFlag) {
    clearTimeout(timeout)
    timeout = setTimeout(_ => {
      initPageData[tabList.pagePath]();//初始化页面
    }, 500)
  } else {
    initPageData[tabList.pagePath]();//初始化页面
  }

  app.setBarTitle(tabList.text);//设置当前页面标题
  that.data.tabBar.list[index].lazyFlag = true;

  if (!that.data.hidModel) {
    that.hidSideBar();// 隐藏侧边栏
  }

  that.setData({
    tabBarIndex: index,
    tabBar: that.data.tabBar
  })
}

/**
 * 滚动
 */
function scrollView(e) {
  if (e.detail.scrollTop >= 600) {
    if (!this.data.showScrollTop) {
      this.setData({
        showScrollTop: true
      })
    }
  } else {
    if (this.data.showScrollTop) {
      this.setData({
        showScrollTop: false
      })
    }
  }
}

/**
 * 
 * @param {Object} e 
 */
function orderDetail(e) {
  aoo.pageTo('orderDetail', { productId: e.currentTarget.dataset.id });
}

/**
 * 回到顶部
 * 
 */
function scrollTop() {
  this.setData({
    scrollTop: 0
  })
}

/**
 * 点击商品跳转详情页
 * @param {*} e 
 */
function goodsDetail(e) {
  app.pageTo('goodsDetail', e.currentTarget.dataset.id);
}


module.exports = initTabBar;
