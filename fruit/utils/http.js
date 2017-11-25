


class httpRequset {

  constructor(_globalUrl = '', _appmodelId = null) {
    this.globalUrl = _globalUrl;
    this.appmodelId = _appmodelId;
  }

  get(url, _data = {}) {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.globalUrl + url,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        data: _data,
        success: res => {
          if (res.statusCode == 200) {
            console.log(`%c======== 接口 ${url} 请求成功 ========`, "color: #67c23a");
            _resolve(res.data);
          } else {
            _reject(res.statusCode);
            console.log(`%c======== 接口 ${url} 错误 ${res.statusCode} ========`, "color: #eb9e05");
          }
        },
        fail: res => {
          console.log(`%c======== 接口 ${url} 请求失败 ========`, "color: #fa5555");
          _reject(res);
        }
      });
    })
  }

  post(url, _data = {}) {
    let that = this;
    if (that.appmodelId != null) {
      _data.appmodelId = that.appmodelId;
    }
    return new Promise(function (resolve, reject) {
      wx.request({
        url: that.globalUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: _data,
        success: res => {
          if (res.statusCode == 200) {
            console.log(`%c======== 接口 ${url} 请求成功 ========`, "color: #67c23a");
            resolve(res.data);
          } else {
            reject(res.statusCode);
            console.log(`%c======== 接口 ${url} 错误 ${res.statusCode} ========`, "color: #eb9e05");
          }
        },
        fail: res => {
          console.log(`%c======== 接口 ${url} 请求失败 ========`, "color: #fa5555");
          reject(res);
        }
      });
    })
  }

  uploadFile(_filePath, _formData = {}) {
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: that.globalUrl + "fileup.do",
        filePath: _filePath,
        name: 'file',
        // header: {}, // 设置请求的 header
        formData: _formData, // HTTP 请求中其他额外的 form data
        success: function (res) {
          // success
          resolve(res)
        },
        fail: function () {
          // fail
          reject('图片上传失败')
          console.log('图片上传失败')
        },
        complete: function () {
          // complete
        }
      })
    })
  }
}

module.exports = httpRequset;