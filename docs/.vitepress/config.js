const BASE = 'yarn-blog';
module.exports = {
  title: '勤奋自强/谦虚谨慎',
  description: 'vue vitepress JavaScript blog',
  head: [['link', { rel: 'icon', href: `/${BASE}/images/favicon.ico` }]],
  base: `/${BASE}/`,
  lastUpdated: true,
  themeConfig: {
    siteTitle: 'yarn',
    logo: '/images/yarn.png',
    search: {
      provider: 'local',
      // options: {
      //   locales: {
      //     root: {
      //       translations: {
      //         button: {
      //           buttonText: '搜索文档',
      //           buttonAriaLabel: '搜索文档',
      //         },
      //         modal: {
      //           noResultsText: '无法找到相关结果',
      //           resetButtonTitle: '清除查询条件',
      //           footer: {
      //             selectText: '选择',
      //             navigateText: '切换',
      //             closeText: '关闭',
      //             // searchByText: '搜索提供者',
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },

    nav: [
      { text: '服务端', link: '/server/nodejs/proxy' },
      { text: '客户端', link: '/client/diff-html' },
    ],

    sidebar: {
      '/server/': [
        {
          text: '服务端参考',
          items: [
            {
              text: 'NodeJS',
              items: [
                {
                  text: 'nodejs配置代理',
                  link: '/server/nodejs/proxy',
                },
                {
                  text: 'Vue+Nodejs+Express+Minio 实现本地图片上传',
                  link: '/server/nodejs/minio-upload',
                },
              ],
            },
            {
              text: 'Python',
              items: [
                {
                  text: 'python学习',
                  link: '/server/python/',
                },
              ],
            },
          ],
        },
      ],
      '/client/': [
        {
          text: '客户端参考',
          items: [{ text: '不同的html加载公共js文件', link: '/client/diff-html' }],
        },
      ],
    },

    lastUpdatedText: '最近更新',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    footer: {
      message: '今天起来看见太阳光，心里有一点高兴。',
      copyright: 'Copyright © 2023 yarn',
    },

    outline: 'deep',
    outlineTitle: '当前页导航',
  },
};
