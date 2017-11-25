let tabBar = {
  color: "#333",
  selectedColor: "#fed428",
  backgroundColor: "#ffffff",
  borderStyle: "black",
  list: [
    {
      "pagePath": "indexPage",
      "text": "首页",
      "iconPath": "/images/tab0.png",
      "selectedIconPath": "/images/tab0_1.png",
      "lazyFlag": false
    },
    {
      "pagePath": "classPage",
      "text": "品类",
      "iconPath": "/images/tab1.png",
      "selectedIconPath": "/images/tab1_1.png",
      "lazyFlag": false
    },
    {
      "pagePath": "shopCarPage",
      "text": "购物车",
      "iconPath": "/images/tab2.png",
      "selectedIconPath": "/images/tab2_1.png",
      "lazyFlag": false
    },
    {
      "pagePath": "minePage",
      "text": "我的",
      "iconPath": "/images/tab3.png",
      "selectedIconPath": "/images/tab3_1.png",
      "lazyFlag": false
    }
  ]
};

module.exports = tabBar;