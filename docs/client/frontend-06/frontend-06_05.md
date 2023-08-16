---
title: webworker的基本使用案例
---

1. 文件目录如下

![384aeaa8f69644338a50bf54b42e0233.png](https://s2.loli.net/2023/08/16/qpF3ly8PjXCL62x.png)

2. 代码按照顺序分别如下

   - webworker.html

     ```html
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="utf-8" />
         <meta http-equiv="X-UA-Compatible" content="IE=edge" />
         <meta name="viewport" content="width=device-width" />

         <title>Web Workers basic example</title>
         <link rel="stylesheet" href="./css/style.css" />
       </head>

       <body>
         <h1>Web<br />Workers<br />basic<br />example</h1>

         <div class="controls" tabindex="0">
           <form>
             <div>
               <label for="number1">上传: </label>
               <input type="file" id="file-upload" />
             </div>
             <div>
               <label for="number1">数字1: </label>
               <input type="text" id="number1" value="0" />
             </div>
             <div>
               <label for="number2">数字2: </label>
               <input type="text" id="number2" value="0" />
             </div>

             <div>
               <button type="button">计算hash</button>
             </div>
           </form>

           <p class="result">结果: 0</p>
         </div>
         <script src="./js/main.js"></script>
       </body>
     </html>
     ```

   - style.css

     ```css
     html {
       background-color: #7d2663;
       font-family: sans-serif;
     }

     h1 {
       margin: 0;
       font-size: 20vmin;
       letter-spacing: -0.2rem;
       position: absolute;
       top: 0;
       z-index: -1;
     }

     p {
       margin: 0;
     }

     .controls {
       padding: 4vw;
       width: 75%;
       margin: 10vw auto;
       background-color: rgba(255, 255, 255, 0.7);
       border: 5px solid black;
       opacity: 1;
       transition: 1s all;
     }

     .controls:hover,
     .controls:focus {
       opacity: 1;
     }

     .controls label,
     .controls p,
     .controls input {
       font-size: 3vw;
     }

     .controls div {
       padding-bottom: 1rem;
     }
     ```

   - main.js

     ```javascript
     const first = document.querySelector('#number1');
     const second = document.querySelector('#number2');
     const fileUplaod = document.querySelector('#file-upload');

     const result = document.querySelector('.result');
     const CHUNKS_SIZE = 1 * 1024 * 1024;

     if (window.Worker) {
       const myWorker = new Worker('./js/webworker.js', { name: 1 });

       // 文件分片
       const filefragment = (file, size = CHUNKS_SIZE) => {
         let curr = 0;
         const chunks = [];
         while (curr < file.size) {
           chunks.push({ index: curr, file: file.slice(curr, curr + size) });
           curr += size;
         }
         return chunks;
       };

       // 计算hash
       const calcHash = (chunks) => {
         return new Promise((resolve, reject) => {
           myWorker.postMessage({ chunks });
           myWorker.onmessage = (e) => {
             const { hash } = e.data;
             if (hash) {
               resolve(hash);
             } else {
               reject();
             }
           };
         });
       };

       first.onchange = function () {
         myWorker.postMessage([first.value, second.value]);
         console.log('数字1发生了变化');
       };

       second.onchange = function () {
         myWorker.postMessage([first.value, second.value]);
         console.log('数字2发生了变化');
       };

       fileUplaod.onchange = async function (e) {
         const file = e.target.files[0];
         if (!file) return;
         const chunks = filefragment(file);
         const hash = await calcHash(chunks);
         console.log(hash);
       };

       myWorker.onmessage = function (e) {
         result.textContent = e.data;
         console.log('接收返回结果');
       };
     } else {
       console.log('您的浏览器不支持webworker');
     }
     ```

   - spak-md5.js 由于代码太长,这边提供下载链接

     ```js
     // https://www.bootcdn.cn/spark-md5/
     ```

   - webworker.js

     ```javascript
     self.importScripts('./spark-md5.js');

     self.onmessage = function (e) {
       const { chunks } = e.data;
       const spark = new self.SparkMD5.ArrayBuffer();

       let count = 0;

       const loadNext = (index) => {
         const reader = new FileReader();
         reader.readAsArrayBuffer(chunks[index].file);
         reader.onload = (e) => {
           count++;
           spark.append(e.target.result);
           if (count == chunks.length) {
             self.postMessage({
               hash: spark.end(),
             });
           } else {
             loadNext(count);
           }
         };
       };
       loadNext(0);
     };
     ```

3. 大致的使用方法如上,如果想更详细的了解的话,请转至[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
