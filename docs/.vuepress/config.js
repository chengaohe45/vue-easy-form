module.exports = {
  title: 'esForm文档',
  description: '后台自动化平台',
  base: "/vue-easy-form-docs/dist/",
  themeConfig: {
    // lastUpdated: '最后更新',
    nav: [
      { text: 'esForm例子', link: 'https://chengaohe45.github.io/vue-easy-form-docs/demo/#/form-simple' }
    ],
    sidebar: {
      '/': [
        {
          title: '指南',
          collapsable: false,
          children: [
            '',
            'base/install',
            'base/settings',
            'base/explain',
            'base/form',
            'base/form-value',
            'base/array',
            'base/com-standard',
            'base/schema'
          ]
        },
        {
          title: '可组件化属性详解',
          collapsable: false,
          children: [
            'base/label',
            'base/component',
            'base/title',
            'base/rules',
            'base/help',
            'base/unit',
            'base/desc'
          ]
        }
      ]
    }
  }
};
