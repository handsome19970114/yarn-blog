---
title: 绘矩形框实现框选
---

# 矩形框选功能

## 1. 实现思路

1. 监听鼠标按下事件
2. 记录鼠标按下时的坐标
3. 监听鼠标移动事件
4. 计算鼠标移动的距离
5. 根据距离绘制矩形框
6. 监听鼠标松开事件
7. 清除矩形框

## 2. 代码实现

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        html,body{
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        .box{
            width: calc(100% - 100px);
            height: calc(100% - 100px);
            background-color: #0a0901;
            margin: 50px auto 0;
            position: relative;
        }

        .extent{
            border: 2px #409eff dashed;
            position: absolute;
            z-index: 99999;
            left: -100000px;
            top: -100000px;
            width: 2px;
            height: 2px;
        }
    </style>
</head>
<body>
    <div class="box">
        <svg data-v-3205162b="" data-v-1e8f1f1e="" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="grid"><defs data-v-3205162b=""><pattern data-v-3205162b="" id="smallGrid" width="7.236328125" height="7.236328125" patternUnits="userSpaceOnUse"><path data-v-3205162b="" d="M 7.236328125 0 L 0 0 0 7.236328125" fill="none" stroke="#CFCFCF4D" stroke-width="1"></path></pattern><pattern data-v-3205162b="" id="grid" width="36.181640625" height="36.181640625" patternUnits="userSpaceOnUse"><rect data-v-3205162b="" width="36.181640625" height="36.181640625" fill="url(#smallGrid)"></rect><path data-v-3205162b="" d="M 36.181640625 0 L 0 0 0 36.181640625" fill="none" stroke="rgba(255,255,255, 0.8)" stroke-width="1"></path></pattern></defs><rect data-v-3205162b="" width="100%" height="100%" fill="url(#grid)"></rect></svg>
        <div class="extent"></div>
    </div>
    <script>
        let doms = {
            box: document.querySelector('.box'),
            extent: document.querySelector('.extent')
        }
        
        let boxSty = {};

        function setStyle(element,styles){
            for (let key in styles) {
                if (styles.hasOwnProperty(key)) {
                    element.style[key] = styles[key];
                }
            }
        }

        doms.box.onmousedown = function(e){
            if(e.button == 2) return;
            let startX = e.clientX;
            let startY = e.clientY;
            let rectInfo = doms.box.getBoundingClientRect();
            let extentSty = getComputedStyle(doms.extent);
            let extentBorderWdith = parseInt(extentSty.borderLeftWidth) + parseInt(extentSty.borderRightWidth);
            boxSty.left =startX - rectInfo.x + 'px';
            boxSty.top = startY - rectInfo.y + 'px';

            function move(e){
                let width = 0;
                let height = 0;
                let left = 0;
                let top = 0;
                
                let moveX = e.clientX - startX;
                let moveY = e.clientY - startY;

                //从右向左 左边界
                if(moveX < 0){
                    if(Math.abs(moveX) > startX - rectInfo.x){
                        width = startX - rectInfo.x - extentBorderWdith;
                        left = 0;
                    }else{
                        width = Math.abs(moveX) - extentBorderWdith;
                        left = e.clientX - rectInfo.x;
                    }
                }else{
                    // 从左向右 右边界
                    left = startX - rectInfo.x;
                    if(moveX > rectInfo.x + rectInfo.width - startX){
                        width = rectInfo.x + rectInfo.width - startX - extentBorderWdith;
                    }else{
                        width = moveX - extentBorderWdith;
                    }
                }

                if(moveY < 0){
                    // 从下向上 上边界
                    if(Math.abs(moveY) > startY - rectInfo.y){
                        height = startY - rectInfo.y - extentBorderWdith;
                        top = 0;
                    }else{
                        height = Math.abs(moveY) - extentBorderWdith;
                        top = e.clientY - rectInfo.y;
                    }
                }else{
                    // 从上向下 下边界
                    top = startY - rectInfo.y;
                    if(moveY > rectInfo.y + rectInfo.height - startY){
                        height = rectInfo.y + rectInfo.height - startY - extentBorderWdith;
                    }else{
                        height = moveY - extentBorderWdith;
                    }
                }
                
                boxSty.width = width + 'px';
                boxSty.height = height + 'px';
                boxSty.left = left + 'px';
                boxSty.top = top + 'px';

                setStyle(doms.extent,boxSty)
            }

            function up(e){
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',up);
                setStyle(doms.extent,{width:'0px',height:'0px',left:'-100000px',top:'-100000px'})
            }
            
            document.addEventListener('mousemove',move);
            document.addEventListener('mouseup',up);
        }
    </script>
</body>
</html>
```


## 3. 部分优化

```javascript
function move(e){
    let width = 0;
    let height = 0;
    let left = 0;
    let top = 0;
    
    let moveX = e.clientX - startX;
    let moveY = e.clientY - startY;

    //从右向左 左边界
    if(moveX < 0){
        width = Math.min(Math.abs(moveX) - extentBorderWdith, startX - rectInfo.x - extentBorderWdith);
        left = Math.max(e.clientX - rectInfo.x, 0);
    }else{
        // 从左向右 右边界
        left = Math.max(startX - rectInfo.x, 0);
        width = Math.min(moveX - extentBorderWdith, rectInfo.x + rectInfo.width - startX - extentBorderWdith);
    }

    if(moveY < 0){
        // 从下向上 上边界
        height = Math.min(Math.abs(moveY) - extentBorderWdith, startY - rectInfo.y - extentBorderWdith);
        top = Math.max(e.clientY - rectInfo.y, 0);
    }else{
        // 从上向下 下边界
        top = Math.max(startY - rectInfo.y, 0);
        height = Math.min(moveY - extentBorderWdith, rectInfo.y + rectInfo.height - startY - extentBorderWdith);
    }
    
    boxSty.width = width + 'px';
    boxSty.height = height + 'px';
    boxSty.left = left + 'px';
    boxSty.top = top + 'px';
    setStyle(doms.extent,boxSty)
}
```
