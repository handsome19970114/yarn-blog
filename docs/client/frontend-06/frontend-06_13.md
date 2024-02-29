---
title: 自动滚动
---

# 自动滚动

## 1. 实现思路

1. 获取滚动容器
2. 判断是否需要滚动, 需要则进行数据复制,然后设置定时器
3. 设置滚动容器的 margin-top 属性
4. 设置边界判断

## 2. 代码实现

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>auto-scroll</title>
    </head>
    <body>
        <div class="auto-scroll">
            <h1>自动滚动demo</h1>
            <div class="auto-scroll-wrapper">
                <ul class="auto-scroll-content"></ul>
            </div>
            <div class="auto-height-line"></div>
        </div>

        <script>
            // 关闭鼠标滚轮
            function stopWheel() {
                doms.content.addEventListener('wheel', function (e) {
                    e.preventDefault();
                });
            }

            // 生成uuid
            function uuid() {
                var d = new Date().getTime();
                if (window.performance && typeof window.performance.now === 'function') {
                    d += performance.now(); //use high-precision timer if available
                }
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
                });
                return uuid;
            }

            // 数据生成
            function generateData(num) {
                return Array(num)
                    .fill(null)
                    .map((item, index) => ({uuid: uuid(), text: `这是第${index + 1}条数据`}));
            }

            // 插入数据
            function appendData(data) {
                const domStr = data.map((item) => `<li class="auto-scroll-item" data-uuid="${item.uuid}">${item.text}</li>`).join('');
                doms.content.innerHTML = domStr;
            }

            // 定时任务
            function intervalFn() {
                if (!isScroll) return;
                timer = setInterval(function () {
                    marginTop -= 1;
                    if (Math.abs(marginTop) >= doms.content.scrollHeight / 2) {
                        setMarginTop(0);
                        marginTop = 0;
                    } else {
                        setMarginTop(marginTop);
                    }
                }, speed);
            }

            function clearIntervalFn() {
                timer && clearInterval(timer);
            }

            function leaveFn() {
                clearIntervalFn();
                intervalFn();
            }

            // 设置 marginTop
            function setMarginTop(marginTop) {
                doms.content.style.marginTop = `${marginTop}px`;
            }

            // 开启自动滚动
            function autoScroll() {
                let wrapperRect = doms.wrapper.getBoundingClientRect();
                let liTotalHeight = rowH * data.length;
                // 判断是否需要滚动
                if (wrapperRect.height < liTotalHeight) {
                    isScroll = true;
                    let doubleData = [...data, ...data];
                    appendData(doubleData);
                    clearIntervalFn();
                    intervalFn();
                    doms.content.addEventListener('mouseenter', clearIntervalFn);
                    doms.content.addEventListener('mouseleave', leaveFn);
                } else {
                    isScroll = false;
                    marginTop = 0;
                    setMarginTop(0);
                    appendData(data);
                    clearIntervalFn();
                    doms.content.removeEventListener('mouseenter', clearIntervalFn);
                    doms.content.removeEventListener('mouseleave', leaveFn);
                }
            }

            // 线条摁下,改变wrapper高度
            function lineMouseDown(dom) {
                if (!dom || !(dom instanceof HTMLElement)) {
                    throw new Error('dom is empty or is not a Element');
                }
                dom.addEventListener('mousedown', function (event) {
                    let startY = event.clientY;
                    let wrapperHeight = doms.wrapper.getBoundingClientRect().height;
                    let move = function (event) {
                        let moveY = event.clientY - startY;
                        let height = wrapperHeight + moveY;
                        height = height < mixH ? mixH : height > maxH ? maxH : height;
                        changeWrapperHeight(height);
                    };
                    let up = function () {
                        document.removeEventListener('mousemove', move);
                        document.removeEventListener('mouseup', up);
                        autoScroll();
                    };
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', up);
                });
            }

            // 修改wrapper高度
            function changeWrapperHeight(height) {
                doms.wrapper.style.height = height + 'px';
            }

            // 全局变量
            let isScroll = false;
            let maxH = 500;
            let mixH = 240;
            let rowH = 40;
            let speed = 100;
            let marginTop = 0;
            let timer = null;
            let dataCount = 10;
            let doms = {
                content: document.querySelector('.auto-scroll-content'),
                line: document.querySelector('.auto-height-line'),
                wrapper: document.querySelector('.auto-scroll-wrapper'),
            };
            let data = generateData(dataCount);

            // 函数执行
            lineMouseDown(doms.line);
            stopWheel();
            document.addEventListener('DOMContentLoaded', autoScroll);
        </script>

        <style>
            * {
                margin: 0;
                padding: 0;
            }
            html,
            body {
                width: 100%;
                height: 100%;
            }

            ul,
            li {
                list-style: none;
            }

            body::before {
                content: '';
                display: table;
            }
            .auto-scroll {
                width: 80vw;
                margin: 100px auto 0;
                user-select: none;
                position: relative;
            }
            .auto-scroll:hover .auto-height-line {
                visibility: visible;
            }
            h1 {
                text-align: center;
                font-size: 18px;
                line-height: 42px;
                background-color: rgba(61, 89, 159, 0.6);
            }
            .auto-scroll-wrapper {
                height: 300px;
                background-color: rgba(61, 89, 159, 0.8);
                overflow: auto;
            }
            .auto-scroll-wrapper::-webkit-scrollbar {
                width: 0;
            }
            .auto-scroll-item {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #ccc;
                box-sizing: border-box;
                font-size: 16px;
                color: #fff;
                text-align: center;
            }
            .auto-height-line {
                width: 100%;
                height: 8px;
                background-color: #409eff;
                position: absolute;
                left: 0;
                bottom: -4px;
                visibility: hidden;
                cursor: s-resize;
            }
        </style>
    </body>
</html>
```

## 3. 视频展示

<video width="100%" height="auto" muted autoplay loop src="http://47.99.166.47:8080/files/video/20240118_095138.mp4" />
