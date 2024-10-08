const {generateFileTree} = require('./utils');
const path = require('path');
const basePath = path.resolve(__dirname, '..');

function getPath(name) {
    return {
        path: path.join(basePath, name),
        name: name,
    };
}

const BASE = 'blog';
module.exports = {
    title: '勤奋自强/谦虚谨慎',
    description: 'vue vitepress JavaScript blog',
    head: [
        ['link', {rel: 'icon', href: `/${BASE}/images/favicon.ico`}],
        ['script', {src: `/${BASE}/js/sakura.js`}],
    ],
    base: `/${BASE}/`,
    lastUpdated: true,
    appearance: true, //设置用户主题
    themeConfig: {
        siteTitle: '为中华之崛起而读书',
        logo: '/images/yarn.png',
        colors: {
            primary: '#646cff',
            footerBg: '#001529',
        },
        search: {
            provider: 'local',
            options: {
                locales: {
                    root: {
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
                                    closeText: '关闭',
                                    // searchByText: '搜索提供者',
                                },
                            },
                        },
                    },
                },
            },
        },

        nav: [
            {text: '服务端', link: '/server/nodejs-01/nodejs-01_01'},
            {text: '客户端', link: '/client/frontend-06/frontend-06_02'},
        ],

        sidebar: {
            '/server/': generateFileTree(getPath('server')),
            '/client/': generateFileTree(getPath('client')),
        },

        lastUpdatedText: '最近更新',
        docFooter: {
            prev: '上一篇',
            next: '下一篇',
        },

        footer: {
            message: '今天起来看见太阳光，心里有一点高兴。',
            copyright: `乖让我来抱抱 © 2019-${new Date().getFullYear()} <a href="https://beian.miit.gov.cn/">豫ICP备2024086889号</a>`,
        },

        outline: 'deep',
        outlineTitle: '当前页导航',
    },
};
