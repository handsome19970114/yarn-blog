---
title: css边框重合问题解决
---

# css 边框重合问题解决

## 代码

```html
<div class="box">
  <div class="item"></div>
  ...
  <!--中间省略无数个-->
  <div style="clear: both"></div>
  <!--清除浮动-->
</div>
```

```css
.box {
  width: 100vw;
}
.item {
  width: 12.5%;
  float: left;
  height: 120px;
  line-height: 120px;
  margin-right: -1px;
  border-top: 1px solid #eaeefb;
  border-left: 1px solid #eaeefb;
  border-bottom: 1px solid #eaeefb;
  margin-bottom: -1px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;

  &:nth-last-child(2) {
    border-right: 1px solid #eaeefb;
  }

  &:nth-of-type(8n + 8) {
    border-right: 1px solid #eaeefb;
  }
}
```

## 效果图

![image-20231026165702143.png](https://s2.loli.net/2023/10/26/9j2GLAwWZH7zKJd.png)
