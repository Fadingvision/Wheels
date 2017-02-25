export default class Observer {
  constructor(conf) {
    this.observeData(conf.data)
  }

  observeData(data) {
    Object.keys(data).forEach(key => {
      let tempValue = data[key];
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        set(newVal) {
          tempValue = newVal
          console.log(`你设置了${key},新的值为${newVal}`)
        },
        get() {
          console.log(`你访问了${key}`)
          return tempValue
        }
      })
    })

  }

}