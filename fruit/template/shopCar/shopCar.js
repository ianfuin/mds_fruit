const app = getApp(); //获取应用实例
let timeout;
/**
 * 初始化购物车
 */
class initShopCar {

  constructor(_this) {
    this.that = _this;

    /***初始化数据 */
    _this.setData({
      shopData: null
    })

    /***注册事件 *****/
    _this.chooseShopCar = chooseShopCar; //选择购物车
    _this.chooseAll = chooseAll; //全选购物车
    _this.changeShopCar = changeShopCar; //加减购物车
    _this.singleBuy = singleBuy; //跳转到支付详情

    console.log('%c初始化购物车', "color: #409EFF")
  }


  /**
   * 获取购物车列表
   * 
   * @memberof findBuyCars
   */
  findBuyCars() {
    let shopData = {
      shopCarList: [], //购物车信息
      chooseAll: false, //是否全选
      disabled: false, //是否勾选
      totalPrice: 0 //总价(不含运费)
    };
    app.http.post('BuyCar/findBuyCars', {
      wxuserId: app.wxuserId
    })
      .then(res => {
        res.object.forEach(item => {
          item.chooseFlag = false;
          item.price = item.realPrice; //商品价格
          item.carNum = item.quantity; //商品数量
        })
        shopData.shopCarList = res.object;
        this.that.setData({
          shopData: shopData,
          shopCarNum: shopData.shopCarList.length
        })
      })
  }
}

/**
 * 跳转到支付详情
 */
function singleBuy() {
  let that = this;
  let carData = {
    shopCarList: [], //购物车信息
    totalPrice: that.data.shopData.totalPrice //总价(不含运费)
  }
  that.data.shopData.shopCarList.forEach(item => {
    if (item.chooseFlag) {
      carData.shopCarList.push(item)
    }
  })
  app.pageTo('confirmOrder', {
    carData: carData
  })
}

/**
 * 选择购物车
 */
function chooseShopCar(e) {
  let
    that = this,
    index = e.currentTarget.dataset.index,
    shopData = that.data.shopData;

  shopData.shopCarList[index].chooseFlag = !shopData.shopCarList[index].chooseFlag;
  shopData.chooseAll = chackChooseAll(shopData.shopCarList); //检测是否全选
  shopData.disabled = chackChoose(shopData.shopCarList); //检测是否全选
  shopData.totalPrice = totalPrice(shopData.shopCarList); //合计价格

  that.setData({
    shopData: shopData
  });

  that = null;
  index = null;
  shopData = null;
}


/**
 * 全选购物车
 */
function chooseAll() {
  let
    that = this,
    shopData = that.data.shopData;

  shopData.chooseAll = !shopData.chooseAll;
  shopData.disabled = !shopData.disabled;
  shopData.shopCarList.forEach(item => {
    item.chooseFlag = shopData.chooseAll;
  })

  shopData.totalPrice = totalPrice(shopData.shopCarList); //合计价格

  that.setData({
    shopData: shopData
  });

  that = null;
  shopData = null;
}

/**
 * 检测是否全选
 */
function chackChooseAll(_shopCarList) {
  return _shopCarList.every(item => {
    return item.chooseFlag
  })
}

/**
 * 检测是否选择
 */
function chackChoose(_shopCarList) {
  return _shopCarList.some(item => {
    return item.chooseFlag
  })
}

/**
 * 加减购物车
 */
function changeShopCar(e) {
  let
    that = this,
    index = e.currentTarget.dataset.index,
    flag = e.currentTarget.dataset.flag,
    shopData = that.data.shopData;

  shopData.shopCarList[index].carNum = parseInt(shopData.shopCarList[index].carNum);
  flag > 0 ? shopData.shopCarList[index].carNum += 1 : shopData.shopCarList[index].carNum -= 1;
  if (shopData.shopCarList[index].carNum <= 0) {
    shopData.shopCarList[index].carNum = 1;
    wx.showModal({
      title: '确定要删除商品吗',
      cancelColor: '#999999',
      confirmColor: '#333333',
      success: res => {
        if (res.confirm) {
          //删除购物车
          app.http.post('BuyCar/batchDelete', {
            buycarIds: shopData.shopCarList[index].buycarId
          })
            .then(res => {
              shopData.shopCarList.splice(index, 1);
              shopData.totalPrice = totalPrice(shopData.shopCarList); //合计价格
              that.setData({
                shopData: shopData
              })
              app.success('删除成功')
            })
        }
      }
    })
  } else {
    clearTimeout(timeout)
    timeout = setTimeout(_ => {
      let data = {
        buycarId: shopData.shopCarList[index].buycarId, //购物车ID
        quantity: shopData.shopCarList[index].carNum, //购买数量
      };
      app.http.post('BuyCar/update', data);
    }, 500)
  }
  shopData.totalPrice = totalPrice(shopData.shopCarList); //合计价格

  that.setData({
    shopData: shopData
  })
}


/**
 * 合计价格
 */
function totalPrice(_shopCarList) {
  let totalPrice = 0;
  _shopCarList.forEach(item => {
    if (item.chooseFlag) {
      totalPrice += parseInt(item.price) * parseInt(item.carNum);
    }
  })
  return totalPrice;
}


module.exports = initShopCar;