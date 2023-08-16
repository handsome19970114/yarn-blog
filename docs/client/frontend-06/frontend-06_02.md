> tips:例如有两个 html 文件,main.html,index.html,每个 html 文件都需要引入很多公共的资源文件,难道我需要多个复制吗>,不需要只需要如下操作

1. 创建一个 js 文件

```js
loadSource.js; //自定义命名
```

2. loadSource.js 内容如下,举例如下

```js
(function () {
  document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">');
  document.write('<script src="https://cdn.bootcdn.net/ajax/libs/axios/1.3.3/axios.js"></script>');
})();
```

3. 使用,在 html 文件中引入这个文件,这样的话,提升了美观,减少了代码

```html
<script src="./js/loadSource.js"></script>
```
