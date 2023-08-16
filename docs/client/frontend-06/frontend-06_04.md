---
title: js实现歌词滚动
---

1. html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>歌词滚动</title>

    <style>
      * {
        margin: 0;
        padding: 0;
        user-select: none;
      }
      html {
        height: 100%;
      }

      body {
        color: #009ad6;
        text-align: center;
        height: 100%;
        background-image: url(./assets/dengziqi.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: -400px;
        overflow: hidden;
      }
      .lrc-container {
        height: calc(100vh - 360px);
        overflow: hidden;
        margin-top: 180px;
      }

      ul,
      li {
        padding: 0;
        margin: 0;
        list-style: none;
        transition: 0.6s;
      }

      .play-ico {
        display: block;
        width: 36px;
        height: 36px;
        background-image: url(./assets/mcbg.png);
        background-repeat: no-repeat;
        background-size: 100%;
        position: fixed;
        right: 50px;
        top: 50px;
      }
      audio {
        width: 100%;
        height: 100%;
        opacity: 0;
        display: none;
      }

      .lrc-container ul > li {
        height: 36px;
        line-height: 36px;
        font-size: 18px;
        font-family: '楷体' !important;
        transition: 0.6s;
      }
      .lrc-container ul > li.active {
        color: #fff;
        transform: scale(1.2);
      }

      @-webkit-keyframes rotataZ {
        0% {
          -webkit-transform: rotateZ(0deg);
        }
        100% {
          -webkit-transform: rotateZ(360deg);
        }
      }

      .stop {
        background-position: left bottom;
      }

      .on {
        background-position: 0px 1px;
        animation: rotataZ 1.2s linear infinite;
      }
    </style>
  </head>
  <body>
    <span class="play-ico">
      <audio src="./assets/taohuanuo.mp3" controls></audio>
    </span>

    <!-- <button id="clickBtn">点击</button> -->
    <div class="lrc-container">
      <ul></ul>
    </div>
    <script src="./js/data.js"></script>
    <script src="./js/lrc.js"></script>
  </body>
</html>
```

2. js

```js
/**
 * @desc 歌词滚动的整体实现
 */
(function () {
  'use strict';
  /**
   * @desc 处理歌词数据,字符串转化成对象
   * @param { String }  lrc
   * @returns {Array<object>} 返回值为[object,object,object]
   */
  function parseLrcs(lrc) {
    const result = [];
    const lines = lrc.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parseLrc = line.split(']');
      const lrcObj = {};
      lrcObj.time = parseTime(parseLrc[0].substring(1));
      lrcObj.words = parseLrc[1];

      result.push(lrcObj);
    }
    return result;
  }

  /**
   * @desc 创建 li标签 插入到元素中形成列表
   */
  function createElement() {
    let frag = document.createDocumentFragment();
    for (let i = 0, len = parseLrcData.length; i < len; i++) {
      const li = document.createElement('li');
      li.textContent = parseLrcData[i].words;
      frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
  }

  /**
   * @desc 时间字符串转化成数值
   * @param { String }  字符串
   * @returns { Number } 计算过后的Number
   */
  function parseTime(time) {
    const timeArr = time.split(':');
    return +timeArr[0] * 60 + +timeArr[1];
  }

  /**
   * @desc 通过对比找到当前时间所在的区间索引
   * @param { Number } currTime 当前播放的时间
   * @returns { Number } 当前时间对应歌词数据的索引位置
   */
  function findCurrentIndex(currTime) {
    for (let i = 0; i < parseLrcData.length; i++) {
      const element = parseLrcData[i];
      if (currTime < element.time) {
        return i - 1;
      }
    }
    return parseLrcData.length - 1;
  }

  /**
   * @desc 设置偏移量
   */
  function setOffset(index) {
    let offset = index * liHeight + liHeight / 2 - containerHeight / 2;
    let maxOffset = doms.ul.clientHeight - containerHeight;

    if (offset < 0) {
      offset = 0;
    }

    if (offset >= maxOffset) {
      offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;

    let li = doms.ul.querySelector('.active');
    if (li) {
      li.classList.remove('active');
    }
    li = doms.ul.children[index];
    if (li) {
      li.classList.add('active');
    }
  }

  // get need operate domain
  const doms = {
    lrcContainer: document.querySelector('.lrc-container'),
    ul: document.querySelector('.lrc-container ul'),
    audio: document.querySelector('audio'),
    clickBtn: document.querySelector('.play-ico'),
  };

  const parseLrcData = parseLrcs(lrc1); // 处理过后的歌词数据

  createElement(); //create element appended to parent node

  const liHeight = doms.ul.children[0].clientHeight;
  const containerHeight = doms.lrcContainer.clientHeight;
  doms.audio.addEventListener('timeupdate', function (event) {
    const currentTime = event.target.currentTime;
    const currIndex = findCurrentIndex(currentTime);
    setOffset(currIndex);
  });

  doms.clickBtn.addEventListener('click', function () {
    let paused = doms.audio.paused;
    if (paused) {
      doms.audio.play();
      doms.clickBtn.classList.remove('stop');
      doms.clickBtn.classList.add('on');
    } else {
      doms.audio.pause();
      doms.clickBtn.classList.add('stop');
      doms.clickBtn.classList.remove('on');
    }
  });
})();
```

3. 数据 js 文件

```js
var lrc1 = `[00:00.000] 作词 : 张赢
[00:00.500] 作曲 : 罗锟
[00:01.000] 编曲 : 罗锟/陈雪燃
[00:01.500] 制作人 : 张赢/陈雪燃
[00:02.00]制作人（美国）：Xueran Chen
[00:02.36]制作人（中国）：张赢
[00:02.72]人声录音师：姚海毅
[00:03.05]和音：赵贝尔
[00:03.27]管弦乐团：Hungarian symphonic orchestras
[00:03.56]吉他：Jacob Boyd
[00:03.74]中国笛：Chris Bleth
[00:03.96]大提琴：Ro Rowan
[00:04.17]缩混工程师：NEM Studios
[00:04.46]母带工程师：Randy Merrill
[00:04.75]监制：宋鹏飞
[00:04.97]音乐出品发行公司：听见时代传媒
[00:05.80]
[00:19.71]初见若缱绻 誓言 风吹云舒卷
[00:26.17]
[00:26.98]岁月间 问今夕又何年
[00:32.00]
[00:33.44]心有犀但愿 执念 轮回过经年
[00:39.93]
[00:40.81]弹指间 繁花开落多少遍
[00:45.39]
[00:47.17]这一世牵绊 纠结 触动了心弦
[00:53.49]
[00:54.43]下一世 不知可否再见
[00:59.52]
[01:00.95]留一片桃花 纪念 了却浮生缘
[01:07.47]
[01:08.22]眉目间 还有我的思念
[01:13.01]
[01:15.02]一寸土 一年木 一花一树一贪图
[01:20.86]
[01:21.81]情是种 爱偏开在迷途
[01:27.16]
[01:28.68]忘前路 忘旧物 忘心忘你忘最初
[01:34.79]
[01:35.44]花斑斑 留在爱你的路
[01:41.15]
[01:55.85]这一世牵绊 纠结 触动了心弦
[02:02.19]
[02:02.91]下一世 不知可否再见
[02:08.08]
[02:09.37]留一片桃花 纪念 了却浮生缘
[02:16.02]
[02:16.60]眉目间 还有我的思念
[02:21.71]
[02:23.57]一寸土 一年木 一花一树一贪图
[02:29.52]
[02:30.32]情是种 爱偏开在迷途
[02:35.58]
[02:37.17]忘前路 忘旧物 忘心忘你忘最初
[02:43.30]
[02:43.94]花斑斑 留在爱你的路
[02:48.92]
[02:50.53]虔诚夙愿 来世路
[02:53.59]
[02:54.30]一念桃花因果渡
[02:56.99]
[02:57.65]那一念 几阙时光在重复
[03:03.46]
[03:04.67]听雨书 望天湖 人间寥寥情难诉
[03:11.37]回忆斑斑 留在爱你的路`;
```

4. mp3 文件

   > tips:如果需要去 git 自取,网址在下方

5. 图片文件

   > tips:如果需要去 git 自取,网址在下方

6. 网址

   > https://gitee.com/handsome19970114/lrc-scroll

7. 整体代码目录
   ![d165c570b25f4fe1932a0730e87d5bac.png](https://s2.loli.net/2023/08/16/zDjMgHsTGE8Zxbu.png)
