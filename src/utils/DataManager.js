
import axios from 'axios'
import mitter from '@/utils/mitt';

axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/2281964-0-default'

export class DataManager {
  static getInstance() {
    if (!this.instance) {
      this.instance = new DataManager()
    }
    return this.instance
  }
  // 获取数据
  getData() {
    return new Promise((resolve) => {
      axios.get("/city").then(response => {
        resolve(response.data)
      })
    })
  }
  // 模拟轮询请求服务器
  refreshData() {
    // 15 秒刷新一次数据
    setInterval(async () => {
      let data = await this.getData()
      mitter.emit('refreshHomeCount', data)
    }, 15000)
  }
}

