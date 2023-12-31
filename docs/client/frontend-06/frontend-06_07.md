---
title: 百度地图划区测量获取坐标
---

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <script type="text/javascript" src="https://api.map.baidu.com/api?type=webgl&v=1.0&ak=ak"></script>
    <link href="https://mapopen.cdn.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css" rel="stylesheet" />
    <script type="text/javascript" src="https://mapopen.bj.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.js"></script>
    <title>面积测量(GL)</title>
    <style type="text/css">
      body,
      html,
      #container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
        font-family: '微软雅黑';
      }
      ul li {
        list-style: none;
      }
      .info {
        z-index: 999;
        width: auto;
        min-width: 22rem;
        padding: 0.75rem 1.25rem;
        margin-left: 1.25rem;
        position: fixed;
        top: 1rem;
        background-color: #fff;
        border-radius: 0.25rem;
        font-size: 14px;
        color: #666;
        box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
      }
      .drawing-panel {
        z-index: 999;
        position: fixed;
        bottom: 2.5rem;
        right: 2.5rem;
        padding-left: 0;
        border-radius: 0.25rem;
        height: 47px;
        box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
      }
      .bmap-btn {
        border-right: 1px solid #d2d2d2;
        float: left;
        width: 64px;
        height: 100%;
        background-image: url(https://api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png);
        cursor: pointer;
      }
      .drawing-panel .bmap-marker {
        background-position: -65px 0;
      }
      .drawing-panel .bmap-polyline {
        background-position: 0 0;
      }
      .drawing-panel .bmap-rectangle {
        background-position: -325px 0;
      }
      .drawing-panel .bmap-polygon {
        background-position: -260px 0;
      }
      .drawing-panel .bmap-circle {
        background-position: -130px 0;
      }

      .map-container {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 400px;
        background-color: rgb(66, 106, 179, 0.39);
      }

      #overlay-location {
        width: 450px;
        height: auto;
        margin: 700px auto 0;
        border: 1px solid #5e87db;
        background-color: rgb(94, 135, 219, 0.2);
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div id="overlay-location" style="display: none"></div>
    <div class="map-container">
      <div id="container"></div>
      <ul class="drawing-panel">
        <li class="bmap-btn bmap-polyline" id="polyline" onclick="clearAll"></li>
        <li class="bmap-btn bmap-rectangle" id="rectangle" onclick="draw(this)"></li>
        <li class="bmap-btn bmap-polygon" id="polygon" onclick="draw(this)"></li>
        <li class="bmap-btn bmap-circle" id="circle" onclick="draw(this)"></li>
      </ul>
    </div>
  </body>
</html>
<script type="text/javascript">
  var overlays = [];
  var map = new BMapGL.Map('container', { enableMapClick: false }); // 创建Map实例,GL版命名空间为BMapGL(鼠标右键控制倾斜角度)
  map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 16); // 初始化地图,设置中心点坐标和地图级别
  map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

  var styleOptions = {
    strokeColor: '#5E87DB', // 边线颜色
    fillColor: '#5E87DB', // 填充颜色。当参数为空时，圆形没有填充颜色
    strokeWeight: 2, // 边线宽度，以像素为单位
    strokeOpacity: 1, // 边线透明度，取值范围0-1
    fillOpacity: 0.2, // 填充透明度，取值范围0-1
  };
  var labelOptions = {
    borderRadius: '2px',
    background: '#FFFBCC',
    border: '1px solid #E1E1E1',
    color: '#703A04',
    fontSize: '12px',
    letterSpacing: '0',
    padding: '5px',
  };

  // 实例化鼠标绘制工具
  var drawingManager = new BMapGLLib.DrawingManager(map, {
    enableCalculate: true, // 绘制是否进行测距测面
    enableSorption: true, // 是否开启边界吸附功能
    sorptiondistance: 20, // 边界吸附距离
    enableGpc: true, // 是否开启延边裁剪功能
    enableLimit: true, // 是否开启超限提示
    limitOptions: {
      area: 50000000, // 面积超限值
      distance: 30000, // 距离超限值
    },
    circleOptions: styleOptions, // 圆的样式
    polylineOptions: styleOptions, // 线的样式
    polygonOptions: styleOptions, // 多边形的样式
    rectangleOptions: styleOptions, // 矩形的样式
    labelOptions: labelOptions, // label样式
  });

  function draw(e) {
    clearAll();
    var arr = document.getElementsByClassName('bmap-btn');
    for (var i = 0; i < arr.length; i++) {
      arr[i].style.backgroundPositionY = '0';
    }
    e.style.backgroundPositionY = '-52px';
    switch (e.id) {
      case 'marker': {
        var drawingType = BMAP_DRAWING_MARKER;
        break;
      }
      case 'polyline': {
        var drawingType = BMAP_DRAWING_POLYLINE;
        break;
      }
      case 'rectangle': {
        var drawingType = BMAP_DRAWING_RECTANGLE;
        break;
      }
      case 'polygon': {
        var drawingType = BMAP_DRAWING_POLYGON;
        break;
      }
      case 'circle': {
        var drawingType = BMAP_DRAWING_CIRCLE;
        break;
      }
    }
    // 进行绘制
    if (drawingManager._isOpen && drawingManager.getDrawingMode() === drawingType) {
      drawingManager.close();
    } else {
      drawingManager.setDrawingMode(drawingType);
      drawingManager.open();
    }
  }

  // 清除区域
  function clearAll() {
    if (overlays.length) {
      for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
      }
      // 区域坐标置空
      overlays = [];
    }
  }

  // 绘制完成后获取相关的信息(面积等)
  drawingManager.addEventListener('overlaycomplete', function (e) {
    overlays.push(e.overlay);
    drawingManager.close();

    let overlaysLoactin = e.overlay.getPath().slice(0, 4);
    let overlayLocationDom = document.getElementById('overlay-location');
    overlayLocationDom.style.display = 'none';
    overlayLocationDom.innerHTML = '';

    for (const overlayObj of overlaysLoactin) {
      let div = document.createElement('div');
      div.style = 'display:flex;justify-content:space-around';
      for (let i = 0; i < 2; i++) {
        let span = document.createElement('span');
        span.classList.add('overlay-location-item', `span-${i + 1}`);
        span.style = 'font-size:12px;width:50%;padding:5px;display:inline-block';
        span.innerText = i === 1 ? `纬度：${overlayObj.lat}` : `经度：${overlayObj.lng}`;
        div.appendChild(span);
      }
      overlayLocationDom.appendChild(div);
      overlayLocationDom.style.display = 'block';
    }
  });
</script>
```
