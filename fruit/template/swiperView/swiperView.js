/**
 * 初始化滑动滑块
 */

function initSwiperView(_this) {
  this.that = _this;

  _this.swiperTouchstart = swiperTouchstart; //开始滑动
  _this.swiperTouchend = swiperTouchend; //开始滑动
  _this.swiperTouchmove = swiperTouchmove; //滑动

  console.log('%c初始化滑动滑块', "color: #409EFF")
}

/**
 * 渲染导滑动滑块数据
 */
initSwiperView.prototype.setData = function () {
  this.that.setData({
  });

  console.log('%c渲染导滑动滑块数据', "color: #409EFF")
};

/**
 * 开始滑动
 */
function swiperTouchstart(e) {
  let that = this;
  that.data.swiperStartX = e.touches[0].pageX;
  console.log(e)
}
function swiperTouchend(e) {
  console.log(e)
}
/**
 * 滑动
 */
function swiperTouchmove(e) {
  let that = this;
  let pageX = e.touches[0].pageX;
  console.log(pageX - that.data.swiperStartX)
}

module.exports = initSwiperView;