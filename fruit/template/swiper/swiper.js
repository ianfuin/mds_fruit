//swiper.js

/**
 * 初始化滑块数据
 */

// let initData = {
//   height: 375,
//   current: 0,
//   color: '#fff',
//   selectColor: 'rgba(0,0,0,0.5)'
// };
class initSwiper {

  constructor(_this) {
    this.that = _this;
    
    _this.swiperChange = swiperChange;//注册滑块滑动事件

    console.log('%c初始化滑块', "color: #409EFF")
  }
}

/**
 *滑块滑动事件 
 */
function swiperChange(e) {
  let that = this;
  that.data.swiperData.current = e.detail.current;
  that.setData({
    swiperData: that.data.swiperData
  })
}

module.exports = initSwiper;