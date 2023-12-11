---
title: 发布订阅者模式demo
---

# 发布订阅者模式

```JavaScript
// PubSub 模块
class PubSub {
    constructor() {
        this.topics = {};
    }

    subscribe(topic, callback) {
        // 创建新的主题（topic）或添加到现有主题
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }

        // 将回调函数添加到主题的订阅者列表中
        const subscription = {topic, callback};
        this.topics[topic].push(subscription);

        // 返回订阅对象，包含取消订阅方法
        return subscription;
    }

    unsubscribe(topic) {
        // 根据主题名取消订阅
        if (this.topics[topic]) {
            delete this.topics[topic];
        }
    }

    publish(topic, data) {
        // 如果主题存在，则通知所有订阅者
        if (this.topics[topic]) {
            this.topics[topic].forEach((subscription) => subscription.callback(data));
        }
    }
}

export default new PubSub();
```
