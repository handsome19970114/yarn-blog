---
title: Vue+Nodejs+Express+Minio 实现本地图片上传
---

1. 安装`Minio`,`Minio server`和`Minio client`都要下载可以自定义安装目录

   1. 安装完成之后,可以将 minio 配置成环境变量方便使用
      ![4cb603215d724994a8ae562071ed4527.png](https://s2.loli.net/2023/08/15/LFMeRKfrivpXg6H.png)

   2. 配置了环境变量启动命令式 `minio server start`,默认账号密码 minioadmin 和 minioadmin,点击 9000 端口的这个链接,即可访问客户端

![0b3fe3d8fab2401daf602b2f5f61ed94.png](https://s2.loli.net/2023/08/15/c2Ojxs1CD6gwXLS.png)

![e4192d08a8f54d87bfc73ce2d3872d26.png](https://s2.loli.net/2023/08/15/712wRfyTnmekurJ.png)

2. nodejs 连接 Minio,简易服务进行图片上传,比较简单,直接上代码

   ```js
   const express = require('express');
   const Minio = require('minio');
   const bodyParser = require('body-parser'); // 解析 req.body
   const multer = require('multer'); //formdata数据处理
   const cors = require('cors'); //设置允许跨域
   const upload = multer();

   const minioClient = new Minio.Client({
     endPoint: 'localhost',
     port: 9000,
     useSSL: false,
     accessKey: 'xxx', //这里换成自己的
     secretKey: 'xxx', //这里换成自己的
   });

   const app = express();
   app.use(cors());
   app.use(bodyParser.json());

   app.post('/upload', upload.single('file'), async (req, res) => {
     try {
       const file = req.file; // 获取上传文件
       const bucketName = 'xxx'; //自己创建的桶名
       const objectName = Date.now() + '_' + file.originalname; // 设置对象名称
       const data = await minioClient.putObject(bucketName, objectName, file.buffer); // 上传到MinIO
       console.log(data);
       res.send({
         code: 200,
         url: `http://localhost:9000/${bucketName}/${objectName}`, // 返回访问URL
       });
     } catch (err) {
       res.status(500).send(err);
     }
   });

   app.listen(8808, () => {
     console.log('listening on port 8808');
   });
   ```

![519d3ef64c3a4e5aa34160559fd6e050.png](https://s2.loli.net/2023/08/15/dLvkM9t4pgTFB6N.png)

3. Vue 前端代码

   1. 效果图如下

   ![59ec0b2256024db8a10a1cacd2fae3d3.png](https://s2.loli.net/2023/08/15/A1Mha7jxwyP8flZ.png)

   2. 代码

      ```js
      <template>
          <div class="minio-container common-container">
              <el-button icon="el-icon-upload2" type="primary" @click="handleUploadFile">上传</el-button>
              <transition name="transition-preview">
                  <div class="demo-image__preview" style="margin-top:20px" v-if="imageUrl">
                      <el-image style="width: 100px; height: 100px" :src="imageUrl" :preview-src-list="srcList">
                      </el-image>
                  </div>
              </transition>
          </div>
      </template>

      <script>
      import { Message } from "element-ui";
      import { isImage } from "@/utils";
      import { uploadImage } from "@/request/api";

      export default {
          data() {
              return {
                  imageUrl: "",
                  srcList: [],
              };
          },

          methods: {
              handleUploadFile() {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("multiple", "multiple");
                  input.setAttribute("accept", "image/*");
                  input.click();
                  const _this = this; // 如果不想使用这种语法,onchange的函数换成箭头函数,即可解决this指向问题
                  input.onchange = async function (event) {
                      const file = event.target.files[0];
                      if (!isImage(file)) {
                          return Message.error("不是可上传的图片格式");
                      }
                      const formData = new FormData();
                      formData.append("file", file);
                      const data = await uploadImage(formData);
                      if (data?.code && data.code == 200) {
                          _this.imageUrl = data.url;
                          _this.srcList = [].concat(data.url);
                      }
                  };
                  input.remove();
              },
          },
      };
      </script>

      <style lang='scss' scoped>
      .fold-height-enter-active,
      .fold-height-leave-active {
          transition: height 0.5s ease;
          overflow: hidden;
      }

      .fold-height-enter,
      .fold-height-leave-to {
          height: 0 !important;
      }
      </style>
      ```

   3. api.js

      ```js
      import request from './request';

      const URLS = {
        uploadImage: '/upload',
      };

      export const uploadImage = (data) => request({ method: 'post', url: URLS.uploadImage, data });
      ```

4. 配置快捷启动,使用 bat 文件脚本的形式,这样的话,直接双击 bat 文件,就可以启动本地 minio 服务了

   1. run.bat

   ```bat
   @REM 设置用户名
   set MINIO_ROOT_USER=yarn
   @REM 设置密码（8位）
   set MINIO_ROOT_PASSWORD=yarn
   minio.exe server --address :9000 --console-address :9001 ./data
   ```

   2. stop.bat

   ```bat
   @echo off

   rem 查找minio进程
   tasklist | find "minio.exe"

   if %errorlevel% equ 0 (
     rem 如果找到minio进程,则使用taskkill命令强制关闭
     taskkill /f /im minio.exe
     echo MinIO server stopped successfully.
   ) else (
     echo MinIO server is not running.
   )

   pause
   ```
