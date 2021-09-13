const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {

    telemetry: false,
    loading: false,
    buildDir: process.env.NODE_ENV === 'development' ? '.nuxt' : 'build',

    /*
    ** Electron Settings
    */
    electron: {
        width: 700,
        height: 500
    },

    modules: [
        '@nuxtjs/axios',
        'bootstrap-vue/nuxt'
    ],

    buildModules: [
        '@nuxtjs/fontawesome',
    ],

    fontawesome: {
        component: 'fa',
        icons: {
            solid: [
                'faTimes',
                'faWindowMinimize',
                'faWindowMaximize',
                'faWindowClose',
                'faBars',
                'faFileExcel',
                'faCircle',
                'faDownload',
                'faCaretLeft'
            ]
        }
    },

    axios: {
        // proxyHeaders: false
    },

    build: {
        plugins: [],
        extend(config, {isClient, isDev}) {
            if (!config.plugins) {
                config.plugins = [];
            }
            // Extend only webpack config for client-bundle
            if (isClient) {
                config.target = 'electron-renderer'
            }
            if (!isDev) {
                config.plugins.push(
                  new WebpackObfuscator ({
                      rotateStringArray: true
                  }, ['excluded_file.js'])
                )
            }
        }
    }
}
