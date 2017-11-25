/**
 * 初始化滚动视图数据
 */

let interval = null;//计时器
let timeOut = null;//定时器
let ViewHeight = 0;//获取高度次数

function initScrollView({ _this, top = 0, speed = 30, time = 3000, viewHeight = 0 }) {
  this.that = _this;

  /**初始化数据 */
  _this.data.top = top; //初始位置
  _this.data.speed = speed; //滚动速度
  _this.data.time = time; // 间隔时间
  _this.data.viewHeight = viewHeight; //盒子高度
  _this.data.scrollData = []; //盒子高度
  
  /**注册方法 */
  _this.starScroll = starScroll;//开始滚动
  _this.endScroll = endScroll;//停止滚动
  _this.scroll = scroll;//滚动

  console.log('%c初始化滚动视图', "color: #409EFF")
}

/**
 * 渲染滚动视图数据
 */
initScrollView.prototype.setData = function (_scrollData = []) {

  _scrollData = _scrollData.concat(_scrollData.slice(0, 1));
  this.that.setData({
    scrollData: _scrollData
  });

  if (_scrollData.length != 0) {
    this.getScrollViewHeight(); //获取滚动视图高度
  }

  console.log('%c渲染滚动视图数据', "color: #409EFF")
};


/**
 * 获取滚动视图高度
 */
initScrollView.prototype.getScrollViewHeight = function () {
  let that = this.that;
  if (that.data.scrollData.length == 0) {
    return;
  }
  clearTimeout(timeOut);
  timeOut = setTimeout(_ => {
    wx.createSelectorQuery().selectAll('.scrollViewList').boundingClientRect(rects => {
      if (ViewHeight >= 10) {
        console.error('获取滚动视图高度失败');
        return;
      }
      if (rects.length == 0) {
        console.log('%c获取滚动视图高度失败，将重新获取', "color: #fa5555");
        ViewHeight += 1;
        this.getScrollViewHeight();//获取滚动视图高度
      } else {
        console.log('%c获取滚动视图高度成功', "color: #409EFF");
        that.data.viewHeight = rects[0].height;
        that.starScroll(); //开始滚动
      }
    }).exec()
  }, 100)
};

/**
 * 停止滚动
 */
function endScroll() {
  let that = this;
  clearInterval(interval);
  if (that.data.top % that.data.viewHeight != 0) {
    interval = setInterval(function () {
      that.data.top += 1;
      that.setData({
        top: that.data.top
      });
      if (that.data.top % that.data.viewHeight == 0) {
        clearInterval(interval)
      }
    }, 1000 / that.data.speed);
  }
}

/**
 * 开始滚动
 */
function starScroll() {
  let that = this;
  clearInterval(interval);
  clearTimeout(timeOut);
  timeOut = setTimeout(function () {
    that.scroll();
  }, that.data.time);
}
/**
 * 滚动
 */
function scroll() {
  clearInterval(interval);
  clearTimeout(timeOut);
  let that = this;
  interval = setInterval(function () {
    that.data.top += 1;
    that.setData({
      top: that.data.top
    });
    if (that.data.top % that.data.viewHeight == 0) {
      clearInterval(interval);
      timeOut = setTimeout(function () {
        that.scroll();
      }, that.data.time);
    }
    if (that.data.top >= (that.data.scrollData.length - 1) * that.data.viewHeight) {
      that.data.top = 0;
    }
  }, 1000 / that.data.speed);
}


module.exports = initScrollView;