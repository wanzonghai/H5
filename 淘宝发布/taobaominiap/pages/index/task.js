var taskPlugin = requirePlugin("myPlugin");

Page({
  data: {
    modalOpened: false,
    taskData: {},

  },
 
  complete(item) {
    let { value = {} } = item.target.dataset   
    console.log('===== value ======', JSON.stringify(value));
    taskPlugin.triggerItem(value)
    .then(res => {
      console.log('res',res)
    }).catch(err => {
      console.log('err', err)
    })
  },
  getData() {
    taskPlugin.getTaskList()
    .then(res => {
      let taskData = res || [{"actionType":"SIGN","awardConfig":"1次","complete":false,"deliveryTplId":8279,"finishCount":0,"fromToken":"dgOn1gaI9naZqRaPIwvIp1zSqUDn1Rk1ojv7Tn","hidden":false,"implId":"other_0_1_8279_0","reachLimit":false,"status":"ACCEPTED","taskCount":1,"taskOrder":0,"taskScene":"other","taskTitle":"签到任务","taskType":"task_sign"},{"actionType":"EXCUTE","actionURL":"https://www.baidu.com","awardConfig":"1次","complete":false,"deliveryTplId":8926,"finishCount":0,"fromToken":"eo6e1oaUOAenPde0fgNhOdrU6UZdg7MgV6vlio","hidden":false,"implId":"live_0_1_8926_0","reachLimit":false,"status":"ACCEPTED","taskCount":1,"taskOrder":1,"taskScene":"live","taskTitle":"浏览直播15S","taskType":"task_browse"},{"actionType":"EXCUTE","actionURL":"https://www.baiidu.com","awardConfig":"1次","complete":false,"deliveryTplId":9345,"finishCount":0,"fromToken":"oQWd1Q5t0q5EKw5QIknH19jTOUx7kPLkAW26Se","hidden":false,"implId":"shop_0_1_9345_0","reachLimit":false,"status":"ACCEPTED","taskCount":1,"taskOrder":2,"taskScene":"shop","taskTitle":"浏览店铺15秒","taskType":"task_browse"}]
      console.log('success', taskData)
      this.setData({
        taskData
      })
    }).catch(err => {
      console.log('err', err)
    })
  },
  openModal() {
    this.getData()
    this.setData({
      modalOpened: true,
    });
  },
  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
});