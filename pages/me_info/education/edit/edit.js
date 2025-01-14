// pages/me_feedback/me_feedback.js
//获取应用实例
const app = getApp();
Page({
  data:{
    index: undefined,
    startDate: '2000-09-01',
    endDate: '2004-07-01',
    multiIndex: [0, 0],
    multiArray: [app.provinceArr, app.collegeObj[app.provinceArr[0]]],
    degreeIndex: 0,
    degreeArr:['高中','大专','本科','硕士','博士']
  },
  onLoad: function (options) {
    this.setData({index: options.index})
  },
  onShow: function () {
    this.checkInfo();
  },
  checkInfo: function () {
    app.appReady().then(() => {
      Promise.all([app.getUserInfo()])
        .then(([user]) => {
          this.setEducation(user.education)
        }).catch((err) => {
          console.log(err);
        });
    });
  },
  setEducation: function (educationStr) {
    if (educationStr) {
      educationStr = JSON.parse(educationStr)
    } else {
      educationStr = [];
    }
    this.setData({
      education: educationStr
    })
    let index = this.data.index
    let data = educationStr[index];
    let what = data.what;
    let where = data.where;
    let when = data.when;
    let multiIndex0 = app.provinceArr.indexOf(where[0]);
    let multiIndex1 = app.collegeObj[where[0]].indexOf(where[1]);
   
    this.setData({
      index: index,
      startDate: when[0],
      endDate: when[1],
      multiIndex: [multiIndex0, multiIndex1],
      degreeIndex: ['高中', '大专', '本科', '硕士', '博士'].indexOf(what),
      multiArray: [app.provinceArr, app.collegeObj[where[0]]]
    })
  },

  handleSave:function(){
    let data = this.data;
    if (data.startDate > data.endDate) {
      app.failAlert('在校时间填写有误！')
      return
    }
    let education = data.education;
    let tempDatas = {
      what: data.degreeArr[data.degreeIndex],
      where: [
        data.multiArray[0][data.multiIndex[0]],
        data.multiArray[1][data.multiIndex[1]]
      ],
      when: [data.startDate, data.endDate]
    };
    education[data.index] = tempDatas;
    app.saveUserInfo({ education }).then(() => {
      wx.navigateBack();
    });
  },
  bindStartDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  bindPickerChange(e) {
    console.log('picker1发送选择改变，携带值为', e.detail.value)
    this.setData({
      degreeIndex: e.detail.value
    })
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为：：：', e.detail)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail)
    let column = e.detail.column;
    let value = e.detail.value;
    if (column===0){
      this.setData({ 
        multiArray: [app.provinceArr, app.collegeObj[app.provinceArr[value]]]
      })
    }
  }
})