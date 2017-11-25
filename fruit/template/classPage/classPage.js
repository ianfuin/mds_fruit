//classPage.js
const app = getApp();
let timeOut = null;
/**
 * 模块说明
 * @module classPage
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
 * 这是 classPage 类
 * @class classPage
 * @constructor
 * @param {Object} that 当前页面的Page数据
 */
class classPage {

  constructor(_this) {
    this.that = _this;

    /**初始化数据 */
    _this.setData({
      lazyList: [],
      goodLlist: [],
      current: 0 //当前选中的分类
    })

    /**初始化方法 */
    _this.clickSearch = clickSearch;//跳转到搜索页面
    _this.clickClassList = clickClassList;//点击分类
    _this.swiperChange = swiperChange;//滑块滑动

    console.log('%c初始化分类页', "color: #409EFF");
  }


  /**
   * 渲染分类数据
   * 
   * @memberof classPage
   */
  classList() {
    app.http.post('Category/findCategories')
      .then(res => {

        for (let i = 0; i < res.object.length; i++) {
          this.that.data.lazyList[i] = false;
          this.that.data.goodLlist[i] = [{}];
        }

        this.that.data.lazyList[0] = true;
        findProductByCId(this.that, res.object[0].categoryId);//根据分类ID查询产品
        this.that.setData({
          lazyList: this.that.data.lazyList,
          classList: res.object
        })
      })
  }

  /**
   * 渲染品类轮播图数据
   * 
   * @memberof classPage
   */
  classSwiperImg() {
    let _classSwiperImg = [{}, {}];
    this.that.setData({
      classSwiperImg: _classSwiperImg
    })
  }

}

/**
 * 跳转到搜索页面
 * @method clickSearch
 */
function clickSearch() {
  app.pageTo('search');
}

/**
 * 点击分类
 * @method clickClassList
 */
function clickClassList(e) {
  let _index = e.currentTarget.dataset.index;
  let _navId = `nav${_index - 1}`;
  if (_index == 0) {
    _navId = `nav${0}`;
  }
  this.setData({
    navId: _navId,
    swiperIndex: _index,
    current: _index
  })
}

/**
 * 根据分类ID查询产品
 * 
 * @param {Object} _this 
 * @param {String} _categoryId 
 */
function findProductByCId(_this, _categoryId, _index = 0) {

  app.http.post('Category/findProductByCId', { categoryId: _categoryId })
    .then(res => {
      _this.data.goodLlist[_index] = res.object;
      _this.setData({
        goodLlist: _this.data.goodLlist
      })
    })
}

//滑块滑动
function swiperChange(e) {
  let _navId = `nav${e.detail.current - 1}`;
  if (this.data.lazyList[e.detail.current]) {
    clearTimeout(timeOut)
    timeOut = setTimeout(_ => {
      findProductByCId(this, this.data.classList[e.detail.current].categoryId, e.detail.current);//根据分类ID查询产品
    }, 500)
  } else {
    findProductByCId(this, this.data.classList[e.detail.current].categoryId, e.detail.current);//根据分类ID查询产品
  }

  this.data.lazyList[e.detail.current] = true;

  this.setData({
    navId: _navId,
    lazyList: this.data.lazyList,
    current: e.detail.current
  })
}


module.exports = classPage;