---
title: setTimeout定时器封装
---

# 封装定时器类的工具

## 1.demo 源码

```JavaScript
/**
 * @desc 封装定时类,使用settimeout代替setinterval,控制任务之间的间隔,避免定时器可能的重叠和延迟问题,
 */
class LoopInterval {
  timer = null;
  running = false;

  constructor({ interval = 1000, cbFn = () => {}, cbResolve = () => {}, cbReject = () => {}, middleWareFn = () => {}, timeout = 60 * 1000 } = {}) {
    this.interval = interval; // 定时执行时间
    this.timeout = timeout; // 超时响应时间
    this.cbFn = cbFn; // 定时执行的loop function ,需要是一个promise
    this.cbResolve = cbResolve; // 结束执行的resolve
    this.cbReject = cbReject; // 结束执行的reject
    this.middleWareFn = middleWareFn; // 处理data的中间函数,可以在这里面处理业务
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.runService();
    }
  }

  stop() {
    if (this.running) {
      this.running = false;
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  async runService() {
    if (!this.running) return;
    // api无响应处理
    const dataPromise = this.cbFn();
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(`than ${this.timeout / 1000} seconds no response`);
      }, this.timeout);
    });

    try {
      const data = await Promise.race([dataPromise, timeoutPromise]);
      const isContinue = this.middleWareFn(data);
      // 是否可以继续执行
      if (isContinue) {
        this.timer = setTimeout(() => {
          this.runService();
        }, this.interval);
      } else {
        this.stop();
        this.cbResolve(data);
      }
    } catch (error) {
      this.stop();
      this.cbReject('无响应,请刷新重试');
    }
  }
}

```

## 2.简单使用

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>class的基础学习使用</title>
    <script src="/js/loopInterval.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <h1 class="title">类的基础使用</h1>
    <script>
      async function getChp() {
        return await axios.get('https://api.shadiao.pro/chp');
      }

      function handleDom(data) {
        const title = document.querySelector('.title');
        title.textContent = data?.data?.data?.text;
      }

      // 初始化执行
      getChp();

      let loopInterval = new LoopInterval({
        cbFn: async () => {
          return await getChp();
        },
        cbResolve: (data) => {
          console.log(data, '---------cbResolve');
        },
        cbReject: async (error) => {
          console.log(error, '-------cbReject');
        },

        // 中间件,处理数据
        middleWareFn: (data) => {
          handleDom(data);
          return true;
        },

        interval: 60 * 1000,
        timeout: 60 * 1000, //
      });

      loopInterval.start();

      // 简单的使用
    </script>
  </body>
</html>
```

## 3.稍微复杂场景使用

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>class的基础学习使用</title>
    <script src="/js/loopInterval.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <h1 class="title">类的基础使用</h1>
    <script>
      async function getChp() {
        return await axios.get('https://api.shadiao.pro/chp');
      }

      function handleDom(data) {
        const title = document.querySelector('.title');
        title.textContent = data?.data?.data?.text;
      }

      // 初始化执行
      getChp();

      let abort;
      let loopInterval = null;

      let p1 = new Promise((resolve, reject) => {
        loopInterval = new LoopInterval({
          cbFn: async () => {
            return await getChp();
          },
          cbResolve: (data) => {
            resolve(data);
          },
          cbReject: async (error) => {
            reject(error);
          },
          // 中间件,处理数据
          middleWareFn: (data) => {
            handleDom(data);
            return true;
          },

          interval: 60 * 1000,
          timeout: 60 * 1000, //
        });
        loopInterval.start();
      });
      let p2 = new Promise((resolve, reject) => {
        abort = reject;
      });

      // 可以通过点击事件,手动改变promise的状态
      let p = Promise.race([p1, p2]);
      p.abort = (error) => {
        abort(error);
        loopInterval.stop();
      };
    </script>
  </body>
</html>
```
