//app.js
/*appmodelId//模板ID avatarUrl//用户头像 createTime//创建时间 isDelete:0// 删除状态 lastTime// 最后登录时间 nickName//昵称 openId wxuserId//用户ID*/
// const globalUrl = 'http://192.168.1.197:8080/fruitmarket/'; //全局地址
const globalUrl = 'http://ianfuin.com:8080/fruitmarket/'; //全局地址
const appmodelId = 123456; //模板ID
let _httpRequset = require('/utils/http.js'); //引入请求方法
App({
  globalData: {
    userInfo: null //用户信息
  },
  imgUrl: 'http://ianfuin.com:8080/fruitmarket/', //图片地址
  loginInfo: null, //登录信息  
  wxuserId: null, //用户ID
  phoneNumber: null,//商家电话号码
  mdsPhoneNumber:'17682454582',//美杜莎电话
  http: new _httpRequset(globalUrl, appmodelId), //初始化请求
  onLaunch: function () { },

  /**
   * 获取code 到后台换取 openId, sessionKey, unionId
   */
  getCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          resolve(res)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },

  /**
   * 获取用户id
   */
  wxlogin(_code) {
    let data = {
      code: _code //code
    };
    return this.http.post('Wxuser/wxlogin', data);
  },

  /**
   * 授权后更新用户头像昵称
   * 
   * @returns 
   */
  update({
    wxuserId = '',
    nickName = '',
    avatarUrl = '',
    authorizeType = 1
  }) {
    let data = {};
    data.wxuserId = wxuserId; //用户ID
    data.nickName = nickName; //用户昵称
    data.avatarUrl = avatarUrl; //用户头像
    data.authorizeType = authorizeType; //是否授权
    this.http.post('Wxuser/update', data)
  },

  /**
   * 获取用户信息
   */
  wxGetSetting() {
    return new Promise((resolve, reject) => {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                resolve(res)
                // 可以将 res 发送给后台解码出 unionId
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
              fail: res => {
                reject(res)
              }
            })
          } else {
            wx.getUserInfo({
              success: res => {
                resolve(res)
                // 可以将 res 发送给后台解码出 unionId
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              },
              fail: res => {
                reject(res)
              }
            })
          }
        }
      })
    })
  },

  /**
   * 发起微信支付
   * 
   */
  wxPay(payData) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        'timeStamp': payData.timeStamp,
        'nonceStr': payData.nonceStr,
        'package': payData.package,
        'signType': payData.signType,
        'paySign': payData.paySign,
        'success': function (res) {
          resolve(res)
        },
        'fail': function (res) {
          reject(res)
        }
      })
    })
  },


  /**
   * 跳转页面
   * @method pageTo
   * @param {String} _path 页面路径 不能为空
   * @param {String} _param 页面参数
   */
  pageToFalg: false,
  pageTo(_path = '', _param = {}, _redirect = false) {
    if (_path == '') {
      console.log(`%页面路径不能为空`, "color: #fa5555");
      return;
    }
    if (!this.pageToFalg) {
      setTimeout(_ => {
        this.pageToFalg = false;
      }, 1000);
      this.pageToFalg = true;
      this.param = _param;
      if (_redirect) {
        wx.redirectTo({
          url: `/pages/${_path}/${_path}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/${_path}/${_path}`,
        })
      }
    }
  },

  /**
   * 设置当前页面标题
   * @method setBarTitle
   * @param _title 标题名称
   */
  setBarTitle(_title) {
    wx.setNavigationBarTitle({
      title: _title
    });
  },

  /**
   * 返回页面
   * @method pageBack
   * @param _delta 返回页面数（默认为1）
   */
  pageBack(_delta = 1) {
    wx.navigateBack({
      delta: _delta
    })
  },

  /**
   * 显示成功提示框
   * @method success
   * @param _title 显示内容
   */
  success(_title) {
    wx.showToast({
      title: _title,
      image: '/images/success.png',
      duration: 1000
    })
  },

  /**
   * 显示警告提示框
   * @method warning
   * @param _title 显示内容
   */
  warning(_title) {
    wx.showToast({
      title: _title,
      image: '/images/warn2.png',
      duration: 1000
    })
  },

  /**
   * ​显示模态弹窗
   */
  showModal({
    title = '提示',
    content = '',
    showCancel = true,
    cancelText = '取消',
    cancelColor = '#000000',
    confirmText = '确定',
    confirmColor = '#3CC51F'
  }) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title, //提示的标题
        content: content, //	提示的内容
        showCancel: showCancel, //是否显示取消按钮，默认为 true
        cancelText: cancelText, //取消按钮的文字，默认为"取消"，最多 4 个字符
        cancelColor: cancelColor, //取消按钮的文字颜色，默认为"#000000"
        confirmText: confirmText, //确定按钮的文字，默认为"确定"，最多 4 个字符
        confirmColor: confirmColor, //	确定按钮的文字颜色，默认为"#3CC51F"
        success: function (res) {
          if (res.confirm) {
            //用户点击确定
            resolve(res.confirm)
          } else if (res.cancel) {
            //用户点击取消
            reject(res.cancel)
          }
        }
      })
    })
  },

  /**
   * 倒计时
   * @method countDown
   * @param {String} _endtime //结束时间
   * @return {String} time  
   */
  countDown(_endtime) {
    let time = {
      'hour': '00',
      'minutes': '00',
      'seconds': '00'
    };
    let startTime = Date.now();
    let endTime = new Date(_endtime);
    endTime = endTime.getTime();

    if (endTime - startTime <= 0) {
      clearInterval(interval);

      return time;
    }

    time.hour = Math.floor((endTime - startTime) / (1000 * 3600));
    time.minutes = Math.floor(((endTime - startTime) % (1000 * 3600)) / (1000 * 60));
    time.seconds = Math.floor(((endTime - startTime) % (1000 * 60)) / 1000);

    time.hour = time.hour >= 10 ? time.hour : '0' + time.hour;
    time.minutes = time.minutes >= 10 ? time.minutes : '0' + time.minutes;
    time.seconds = time.seconds >= 10 ? time.seconds : '0' + time.seconds;

    return time;
  }


})