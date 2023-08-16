---
title: 输入框限制输入数字
---

```html
<el-input v-model="scope.row.userYear" @click.native.stop oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')"></el-input>
```
