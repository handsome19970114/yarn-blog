module.exports = {
  title: '勤奋自强/谦虚谨慎',
  description: 'vue vitepress JavaScript blog',
  head: [['link', { rel: 'icon', href: '/images/favicon.ico' }]],
  base: '/yarn-blog/',
  themeConfig: {
    siteTitle: 'yarn',
    logo: '/images/yarn.png',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            //这里是个大坑，zh是不生效的，改为root即可
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeTitle: '1111111',
                },
              },
            },
          },
        },
      },
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
  },
};
