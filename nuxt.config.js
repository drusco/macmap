module.exports = {

    telemetry: false,
    loading: false,

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
        extend(config, {isClient}) {
            // Extend only webpack config for client-bundle
            if (isClient) {
                config.target = 'electron-renderer'
            }
        }
    }
}
