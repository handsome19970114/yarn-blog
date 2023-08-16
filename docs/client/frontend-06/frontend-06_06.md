---
title: 鼠标摁下,改变盒子高度
---

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>鼠标拖动改变盒子的大小</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        width: 100%;
        height: 100%;
        background: #426ab3;
      }
      .box {
        width: 100%;
        height: 400px;
        background: #9b95c9;
        position: absolute;
        bottom: 0;
        left: 0;
      }

      .box-line {
        width: 100%;
        height: 2px;
        background-color: red;
        cursor: n-resize;
      }
    </style>
  </head>
  <body>
    <div class="box" id="box">
      <div class="box-line" id="box-line"></div>
    </div>

    <script>
      let boxLine = document.getElementById('box-line');
      let box = document.getElementById('box');
      let minHeight = 400;
      let maxHeight = 800;
      let height = minHeight;

      boxLine.onmousedown = function (event) {
        const hanldeMouseUp = () => {
          document.removeEventListener('mouseup', hanldeMouseUp);
          document.removeEventListener('mousemove', hanldeMouseMove);
        };

        const hanldeMouseMove = (event) => {
          const documentH = document.documentElement.clientHeight;
          const nowH = documentH - event.clientY;
          if (nowH >= maxHeight) {
            height = maxHeight;
          } else if (nowH <= minHeight) {
            height = minHeight;
          } else {
            height = nowH;
          }

          box.style.height = height + 'px';
        };

        document.addEventListener('mouseup', hanldeMouseUp);
        document.addEventListener('mousemove', hanldeMouseMove);
      };
    </script>
  </body>
</html>
```
