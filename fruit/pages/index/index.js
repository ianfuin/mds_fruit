//index.js
var app = getApp();
import initPage from '../../utils/initPage.js'; //底部导航栏初始数据
import getTabBar from '../../template/tabBar/tabBar.js'; //获取底部导航栏
let tabBarNav = null; //实例化底部导航栏
let initNum = 0;
Page({
  data: {},

  /**
   * 页面加载
   */
  onLoad: function (options) {


  },
  onShow: function () {
    if (typeof app.param == 'undefined') {
      this.setData({
        TabBarIndex: 0,
      })
      tabBarNav = new getTabBar(this); //实例化底部导航栏
      this.tryInitTabBar() //初始化检测
    } else {
      if (typeof app.pageIndex != 'undefined') {
        let TabBarIndex = app.pageIndex;
        app.pageIndex = undefined;
        this.setData({
          TabBarIndex: TabBarIndex,
        })
        tabBarNav = new getTabBar(this); //实例化底部导航栏
        this.tryInitTabBar() //初始化检测
      }
    }

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fed428',
    });

  },
  //初始化检测
  tryInitTabBar() {
    try {
      tabBarNav.setData({
        tabBar: initPage,
        tabBarIndex: this.data.TabBarIndex
      }); //初始话底部导航栏数据
    } catch (error) {
      console.log(error)
      if (initNum >= 10) {
        app.showModal({
          content: '初始化数据失败,请删除小程序重新进入',
          showCancel: false
        })
      } else {
        setTimeout(() => {
          initNum += 1;
          app.warning(`重试中${initNum}`)
          this.tryInitTabBar()
        }, 1000);
      }
    }
  }
});