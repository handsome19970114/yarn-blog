---
title: NodeJS 配置代理
---

```js
const http = require('http');
const url = require('url');

//创建代理服务
function createProxyServer(host, listenPort, port) {
  const server = http.createServer((req, res) => {
    // 解析请求的 URL
    const parsedUrl = url.parse(req.url);

    // 获取请求的路径和查询参数
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.search ? parsedUrl.search.slice(1) : null;

    // 构建代理请求的选项
    const options = {
      hostname: host, // 目标主机名
      port: port || 80, // 目标端口
      path: parsedUrl.path, // 请求路径
      method: req.method, // 请求方法
      headers: req.headers, // 请求头
    };

    // 发起代理请求
    const proxy = http.request(options, (targetRes) => {
      res.writeHead(targetRes.statusCode, targetRes.headers);
      targetRes.pipe(res);
    });

    req.pipe(proxy);
    // 处理代理请求的错误
    proxy.on('error', (err) => {
      console.error('Proxy error:', err);
      res.end();
    });

    // 读取目标响应的内容
    proxy.on('data', (chunk) => {
      console.log(`Proxy data: ${chunk}`);
    });
  });

  server.listen(listenPort, () => {
    console.log(`Proxy server listening on port ${port}`);
  });

  return server;
}

function closeProxyServer(server) {
  server.close();
}

// 创建反向代理服务器
const server = createProxyServer('www.runoob.com', 10086, 80);

// 在需要关闭服务器时调用 closeProxyServer 函数
closeProxyServer(server);
```
