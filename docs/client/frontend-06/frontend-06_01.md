---
title: iframe中的数据通信
---

**引言**

这篇文章介绍如何实现页面与 iframe 进行通信，实际工作中可能很难遇到，但一旦遇到了，我们要能够立即想到怎样去实现。

**iframe 向父级页面发送消息**

在 iframe 页面，使用 window.parent 调用 postMessage 方法，即可发送消息给父级页面。

```
window.parent.postMessage(message, '*');
```

message 只能是 String 类型，所以如果想发送多条数据，可以使用 JSON 序列化对象。

```
// 序列化对象
const message = JSON.stringify({
  message: 'Hello',
  date: Date.now(),
});
window.parent.postMessage(message, '*');
```

使用 JSON.stringify 方法对内容进行序列话，即可在传入 postMessage 方法。

**父级页面向 iframe 发送消息**

在父级页面，使用 iframe.contentWindow 调用 postMessage 方法，即可发送消息给 iframe。

```
iframeEl.contentWindow.postMessage(message, '*');
```

iframeEl 表示 iframe DOM 对象。

通过上面两个例子，我们可以得到一个信息。

向谁发送消息，那么调用者对象就是这个发送消息的目标对象，而不是当前对象。

这一点需要非常注意，这里是很容里踩坑的。

**接收消息**

无论是在 iframe 页面还是父级页面，都是使用 window 监听 message 事件接收消息。

```
window.addEventListener('message', function (e) {
  // 获取消息内容 data
  const { data } = e;
});
```

如果消息内容是序列化后的对象，还需要将消息内容反序列化。

```
window.addEventListener('message', function (e) {
  // 获取消息内容 data
  let { data } = e;
  data = JSON.parse(data);
});
```

使用 JSON.parse 方法对内容进行反序列化，即可的到传递过来的内容对象。

**指定发送消息的域名**

上面我们使用 postMessage 方法，传递的第二个参数都是 \*，这里的含义是指任何域名都能接收消息。

建议如果知道消息接收方的域名，第二个参数请传递消息接收方的域名。因为这里是会存在安全隐患的，任何站点都可以向你的站点发送消息，如果没有做相关安全处理，是很容易造成攻击的。

```
iframeEl.contentWindow.postMessage(message, 'https://www.baidu.com');
```

上面的示例代码标识仅当 iframe 的指向 https://www.baidu.com 时才会发送消息。

通过制定域名的的方式，避免安全隐患。
