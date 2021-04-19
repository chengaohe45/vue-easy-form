# vue-easy-form

<p align="left">
  <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue"></a>
  <a href="https://www.npmjs.com/package/vue-easy-form"><img src="https://img.shields.io/npm/v/vue-easy-form.svg" alt="version"></a>
</p>

vue-easy-form: referred to as esForm, is an independent vue form component that does not rely on third-party libraries. Through a json configuration, the form that the user needs is dynamically output. Rich component layout, simple logic control, flexible event linkage, seamless connection with third-party class libraries, greatly improving user development efficiency.

## Documentation and source code
Check out our docs at [https://chengaohe45.github.io/vue-easy-form-docs/dist/](https://chengaohe45.github.io/vue-easy-form-docs/dist/)  
Check out our source code at [https://github.com/chengaohe45/vue-easy-form](https://github.com/chengaohe45/vue-easy-form)
## Project Development
### Node Version
[Node.js](https://nodejs.org/en/) >= 8.11; If you need to upgrade; you can use [nvm](https://github.com/nvm-sh/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows) Manage multiple Node versions.
### Install
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Source code directory structure
This project contains `esForm frame source code` and `example source code`, among which `esForm frame source code` exists independently in the `/src/package` folder. The specific structure of the entire project is as follows:

```js
├── dist                       # Build directory
├── public                     # Compile resources
│   │── favicon.ico            # favicon
│   └── index.html             # Html template
├── src                        # Source code
│   ├── assets                 # Static resources
│   ├── components             # Global common components
│   ├── libs                   # Tools
│   ├── package                # esform source code
│   ├── router                 # Menu configuration and routing configuration
│   ├── static                 # Global style
│   ├── views                  # page views, demo is here
│   ├── App.vue                # vue entry component
│   ├── main.js                # Entry file
├── tests                      # Test module
├── .eslintrc.js               # eslint configuration file
├── .gitignore                 # git ignore file
├── vue.config.js              # vue-cli3 scaffolding configuration
├── postcss.config.js          # postcss configuration
├── README.md                  # readme file
└── package.json               # package.json
```