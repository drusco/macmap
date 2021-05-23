<template>
  <!-- main wrapper -->
  <main class="position-absolute overflow-hidden w-100 h-100">
    <!-- columns wrapper -->
    <div class="row no-gutters h-100 flex-column flex-sm-row">
      <!-- column -->
      <div class="col h-100">
        <!-- content wrapper -->
        <section class="bg-white h-100 d-flex flex-column">
          <!-- header -->
          <header class="bg-darker text-muted pl-3 pr-3 p-1">
            <div class="row">
              <div class="col draggable">
                <button class="btn btn-sm text-white font-weight-bold">
                  <span class="text-capitalize">{{ info.name }}</span> v{{ info.version }}
                </button>
              </div>
              <div class="col-2">
                <div class="btn-group btn-group-sm float-right">
                  <button class="btn" @click="windowMinimize()" style="font-size:.7em">
                    <fa icon="window-minimize" class="text-white"/>
                  </button>
                  <button class="btn" @click="windowMaximize()" style="font-size:.7em">
                    <fa icon="window-maximize" class="text-white"/>
                  </button>
                  <button class="btn" @click="windowClose()" style="font-size:.7em">
                    <fa icon="window-close" class="text-white"/>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <!-- article -->
          <article class="d-flex flex-1 flex-column h-100">
            <!-- scrollable -->
            <section class="position-relative h-100 w-100 m-auto overflow-auto d-flex align-items-center">
              <!-- content wrapper -->
              <section :class="{'loading loading-dark': starting}" class="h-100 w-100 position-absolute">
                <!-- inner wrapper  -->
                <div class="d-flex flex-column h-100">
                  <!-- custom content -->
                  <div class="row no-gutters h-100 flex-column flex-sm-row">
                    <!-- column -->
                    <div v-if="showMenu && !downloading" class="text-white col-12 col-sm-4 col-md-3 h-100 w-75">
                      <!-- content wrapper -->
                      <section class="bg-dark h-100 d-flex flex-column">
                        <!-- header -->
                        <header class="bg-primary header-main p-3 pl-4 pr-4" style="z-index:9">
                          <div class="btn-group w-100 rounded">
                            <button
                                type="button"
                                class="btn btn-primary"
                                :class="{'active': countryTab === 1}"
                                @click="countryTab = 1"
                            >
                              Importador
                            </button>
                            <button
                                type="button"
                                class="btn btn-primary"
                                :class="{'active': countryTab === 2}"
                                @click="countryTab = 2"
                            >
                              Exportador
                            </button>
                          </div>
                        </header>

                        <div class="countries pl-3 pr-3 shadow shadow-lg border-bottom"
                             style="border-color:#252525!important;">

                          <div v-if="countryTab===1" class="custom-control custom-checkbox">
                            <input
                                id="tab1All"
                                v-model="tab1All"
                                type="checkbox"
                                class="custom-control-input"
                                @change="checkAllCountries(1)"
                            >
                            <label class="custom-control-label" for="tab1All">Todos</label>
                          </div>

                          <div v-if="countryTab===2" class="custom-control custom-checkbox">
                            <input
                                id="tab2All"
                                v-model="tab2All"
                                type="checkbox"
                                class="custom-control-input"
                                @change="checkAllCountries(2)"
                            >
                            <label class="custom-control-label" for="tab2All">Todos</label>
                          </div>
                        </div>

                        <!-- aside -->
                        <aside class="countries d-flex flex-column flex-1 h-100">

                          <!-- scrollable -->
                          <section v-show="countryTab === 1"
                                   class="darkscroll position-relative h-100 w-100 m-auto overflow-auto">
                            <!-- content wrapper -->
                            <section class="mh-100 w-100 position-absolute">
                              <!-- inner wrapper  -->
                              <div class="d-flex flex-column">
                                <!-- custom content -->
                                <ul v-show="countryTab === 1" class="list-group">
                                  <li
                                      v-for="(country, index) in filteredimporter"
                                      :key="index"
                                      class="pl-4 pr-4"
                                      :class="{
                                        'list-group-item': true,
                                        'active': country.active
                                      }"
                                  >
                                    <div class="custom-control custom-checkbox">
                                      <input
                                          :id="'tab1_'+index"
                                          v-model="country.active"
                                          type="checkbox"
                                          class="custom-control-input"
                                      >
                                      <label class="custom-control-label" :for="'tab1_'+index" :title="country.name">{{
                                          country.name
                                        }}</label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </section>
                          </section>

                          <!-- scrollable -->
                          <section v-show="countryTab === 2"
                                   class="darkscroll position-relative h-100 w-100 m-auto overflow-auto">
                            <!-- content wrapper -->
                            <section class="mh-100 w-100 position-absolute">
                              <!-- inner wrapper  -->
                              <div class="d-flex flex-column">
                                <!-- custom content -->
                                <ul v-show="countryTab === 2" class="list-group">
                                  <li
                                      v-for="(country, index) in filteredExporter"
                                      :key="index"
                                      class="pl-4 pr-4"
                                      :class="{
                                        'list-group-item': true,
                                        'active': country.active
                                      }"
                                  >
                                    <div class="custom-control custom-checkbox">
                                      <input
                                          :id="'tab2_'+index"
                                          v-model="country.active"
                                          type="checkbox"
                                          class="custom-control-input"
                                      >
                                      <label class="custom-control-label" :for="'tab2_'+index" :title="country.name">{{
                                          country.name
                                        }}</label>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </section>
                          </section>

                        </aside>
                        <!-- fixed-end footer -->
                        <footer class="footer-dark p-3">
                          <div v-if="countryTab === 1" class="input-group">
                            <input
                                v-model="searchImporter"
                                type="text"
                                class="form-control bg-dark border-dark"
                                placeholder="Buscar Importador..."
                            >
                            <div class="input-group-append">
                              <button class="btn btn-dark" @click="searchImporter = ''" style="font-size:.8em">
                                <fa icon="times" class="text-muted"/>
                              </button>
                            </div>
                          </div>
                          <div v-if="countryTab === 2" class="input-group">
                            <input
                                v-model="searchExporter"
                                type="text"
                                class="form-control bg-dark border-dark"
                                placeholder="Buscar Exportador..."
                            >
                            <div class="input-group-append">
                              <button class="btn btn-dark" @click="searchExporter = ''" style="font-size:.8em">
                                <fa icon="times" class="text-muted"/>
                              </button>
                            </div>
                          </div>
                        </footer>
                      </section>
                    </div>
                    <!-- column -->
                    <div v-if="!downloading" class="col h-100">
                      <!-- content wrapper -->
                      <section class="bg-white h-100 d-flex flex-column">
                        <!-- header -->
                        <header class="header-main bg-light p-3 border-bottom">
                          <div class="input-group">
                            <div class="input-group-prepend ml-2 mr-4">
                              <a class="mt-2 text-dark" @click="toggleMenu">
                                <fa icon="bars"/>
                              </a>
                            </div>
                            <input
                                v-model="productKeywords"
                                type="text"
                                class="form-control pr-5 rounded"
                                placeholder="Buscar producto por nombre o código SA6"
                                @keyup="getProductsBySearch"
                            >
                            <div class="input-group-append"/>
                          </div>
                        </header>

                        <!-- article -->
                        <article class="d-flex flex-1 flex-column p-4 h-100">

                          <ul class="nav nav-tabs text-muted">
                            <li class="nav-item">
                              <div class="nav-link" :class="{'active font-weight-bold': tab === 1}" @click="tab = 1">
                                <span class="badge badge-light badge-pill text-muted border mr-1">{{
                                    products.length
                                  }}</span>
                                Resultados
                              </div>
                            </li>
                            <li class="nav-item">
                              <div class="nav-link"
                                   :class="{'active font-weight-bold': tab === 2, 'disabled': !selectedProducts.length}"
                                   @click="tab = 2">
                                <span style="font-size:.5em" v-if="selectedProducts.length">
                                  <fa icon="circle" class="mr-1 text-primary"/>
                                </span>
                                Productos
                              </div>
                            </li>
                          </ul>

                          <div class="h-100 border border-top-0 rounded-bottom p-2">
                            <!-- scrollable -->
                            <section
                                class="position-relative h-100 w-100 m-auto overflow-auto d-flex align-items-center border rounded">
                              <!-- content wrapper -->
                              <section class="h-100 w-100 position-absolute">
                                <!-- inner wrapper  -->
                                <div class="d-flex flex-column">
                                  <!-- custom content -->

                                  <div v-if="tab === 1">
                                    <table class="table table-hover" :class="{'loading': searchingProducts}">
                                      <tbody>
                                      <tr
                                          v-for="(product, index) in products"
                                          :key="index"
                                          class="clickable"
                                          @click="selectProduct(product)"
                                      >
                                        <td>
                                            <span
                                                class="badge badge-pill"
                                                :class="{
                                          'badge-primary': selectedProducts.filter(p => p.Code === product.Code).length,
                                          'badge-light border': !selectedProducts.filter(p => p.Code === product.Code).length
                                        }"
                                            >{{ product.Code }}</span>
                                        </td>
                                        <td>
                                          {{ product.Name }}
                                        </td>
                                      </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  <div v-if="tab === 2">
                                    <div v-if="selectedProducts.length">

                                      <table class="table table-hover" :class="{'loading': searchingProducts}">
                                        <tbody>
                                        <tr
                                            v-for="(product, index) in selectedProducts"
                                            :key="index"
                                            @click="selectProduct(product)"
                                            class="clickable"
                                        >
                                          <td>
                                            <span class="badge badge-primary badge-pill">{{ product.Code }}</span>
                                          </td>
                                          <td>
                                            {{ product.Name }}
                                          </td>
                                        </tr>
                                        </tbody>
                                      </table>

                                    </div>
                                  </div>

                                </div>
                              </section>
                            </section>
                          </div>

                        </article>

                        <!-- fixed-end footer -->
                        <footer class="footer">
                          <div v-if="tab === 2 && selectedProducts.length" class="bg-light p-3 pl-4 pr-4 border-top">
                            <button class="btn btn-primary" @click="download()">
                              <fa icon="download" class="mr-1"></fa>
                              Descargar
                            </button>
                            <span class="ml-2 text-muted text-sm">/ {{ totalFiles }} Archivos en zip</span>
                          </div>
                        </footer>
                      </section>
                    </div>
                    <!-- downloads -->
                    <div v-if="downloading" class="col h-100">
                      <!-- content wrapper -->
                      <section :class="{'loading loading-dark': totalFiles === downloadCount}" class="bg-darker h-100 d-flex flex-column">
                        <!-- header -->
                        <header class="bg-primary text-white p-3 pl-4 pr-4" style="z-index:9">
                          <h5 class="m-0">
                            <span class="clickable float-right" @click="cancelRequests()">
                              <fa icon="times"/>
                            </span>
                            Descargando...
                          </h5>
                        </header>

                        <!-- article -->
                        <article class="d-flex flex-column flex-1 h-100 p-3">
                          <div class="p-2 h-100 border border-dark rounded">
                            <!-- scrollable -->
                            <section id="descargas"
                                     class="darkscroll position-relative h-100 w-100 m-auto overflow-auto">
                              <!-- content wrapper -->
                              <section class="h-100 w-100 position-absolute">
                                <!-- inner wrapper  -->
                                <div class="d-flex flex-column h-100">
                                  <!-- custom content -->
                                  <div class="p-2 h-100" style="font-family: monospace">
                                    <div class="h-100 rounded text-white">
                                      <span class="d-block mb-1" v-for="log in downloadLogs">
                                        {{ log.text }}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            </section>
                          </div>
                        </article>
                        <footer class="footer-dark border-top border-secondary p-3">
                          <div class="">
                            <span class="text-white mr-3 float-left mt-n1 font-weight-bold">
                              {{ ((downloadCount * 100) / totalFiles).toFixed(1) }}<span
                                style="font-size:.8em">%</span>
                            </span>
                            <b-progress :max="totalFiles" height=".8rem" style="padding:2px"
                                        class="bg-darker border rounded-pill border-secondary">
                              <b-progress-bar :value="downloadCount" class="rounded-pill"/>
                            </b-progress>
                          </div>
                        </footer>
                      </section>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </article>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>

.countries .list-group-item {
  background-color: transparent;
  border-color: #3d454c;
  border-radius: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.btn-round {
  border-radius: 50px;
}

.countries .list-group-item.active {
}

.countries .custom-control-input:not(:checked) ~ .custom-control-label::before {
  border-color: #606060;
  background-color: transparent;
}

.countries .custom-control-label::before,
.countries .custom-control-label::after {
  margin-top: 10px;
}

.countries .custom-control-label {
  cursor: pointer;
  padding: 10px;
  width: 100%;
}

.footer-dark {
  box-shadow: 0 0 100px 10px #101010;
  background-color: #252525;
}

.footer-dark input[type=text] {
  color: white;
  box-shadow: none !important;
}

.footer-dark input[type=text]::placeholder {
  color: #808080;
}

.btn:focus {
  box-shadow: none !important;
}

</style>

<script>

import info from '~/package.json'
import electron from 'electron'

const API = 'https://macmap.org/api'
const renderer = electron.ipcRenderer

export default {
  data() {
    return {
      info,
      tab: 1,
      tab1All: true,
      tab2All: false,
      searchImporter: '',
      searchExporter: '',
      productKeywords: '',
      showMenu: true,
      starting: true,
      cancelToken: null,
      currentCancelToken: null,
      cancelCurrentToken: null,
      searchingProducts: false,
      downloading: false,
      downloadCount: 0,
      downloadLogs: [],
      countryTab: 1,
      exporter: [],
      importer: [],
      results: [],
      products: [],
      selectedProducts: [],
      settings: {
        importer: [],
        exporter: ['032']
      }
    }
  },
  computed: {
    totalFiles() {
      return this.exporters// * this.selectedProducts.length
    },
    exporters() {
      return this.exporter.filter(e => e.active).length
    },
    importers() {
      return this.importer.filter(e => e.active).length
    },
    filteredExporter() {
      return this.exporter.filter((country) => {
        return country.name.toLowerCase().includes(this.searchExporter.toLowerCase())
      })
    },
    filteredimporter() {
      return this.importer.filter((country) => {
        return country.name.toLowerCase().includes(this.searchImporter.toLowerCase())
      })
    }
  },
  created() {
    this.cancelToken = this.$axios.CancelToken
    this.getProductById().then((data) => {
      data.ImporterViewData.forEach((country) => {
        this.exporter.push({name: country.CountryName, code: country.CountryCode, active: false})
        this.importer.push({name: country.CountryName, code: country.CountryCode, active: false})
      })
      this.exporter.unshift({name: 'Argentina', code: '032', active: false})
      this.importer.unshift({name: 'Argentina', code: '032', active: false})
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      this.starting = false
      this.loadSettings()
    })
  },
  methods: {
    cancelRequests() {
      this.cancelCurrentToken()
      this.downloading = false
    },
    exit() {
      alert('\nError en el servidor: ' + API + '\nIntenta mas tarde...')
      renderer.send('window-close')
    },
    windowClose() {
      renderer.send('window-close')
    },
    windowMinimize() {
      renderer.send('window-minimize');
    },
    windowMaximize() {
      renderer.send('window-maximize')
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    loadSettings() {
      const settings = this.settings

      this.importer.map(country => {
        country.active = settings.importer.indexOf(country.code) >= 0
      })

      this.exporter.map(country => {
        country.active = settings.exporter.indexOf(country.code) >= 0
      })

      if (this.tab1All) this.checkAllCountries(1)
      if (this.tab2All) this.checkAllCountries(2)

    },
    checkAllCountries(tab) {
      if (tab === 1) {
        // importer
        this.importer.map(importer => {
          importer.active = this.tab1All;
        })
      } else if (tab === 2) {
        // exporters
        this.exporter.map(exporter => {
          exporter.active = this.tab2All;
        })
      }
    },
    download() {

      if (this.downloading) return

      const scope = this

      this.currentCancelToken = new this.cancelToken(function (c) {
        // An executor function receives a cancel function as a parameter
        scope.cancelCurrentToken = c;
      })

      this.downloadCount = 0
      this.downloadLogs = []
      this.downloading = true

      const currentProductIds = this.selectedProducts.map(p => ({
        code: p.Code,
        name: p.Name
      }))

      const currentExporters = this.exporter.filter(country => country.active).map(country => ({
        name: country.name,
        code: country.code
      }))

      const currentImporters = this.importer.filter(country => country.active).map(country => ({
        name: country.name,
        code: country.code
      }))

      const results = []

      currentExporters.forEach((country, cx) => {
        results.push({
          name: country.name,
          code: country.code,
          data: []
        })
        const ix = results.length - 1
        currentProductIds.forEach((p, index) => {
          let error
          this.getProductById(p.code, country.code)
              .catch(e => error = e)
              .then(data => {
                if (!data) return
                results[ix].data.push({
                  name: p.name,
                  code: p.code,
                  data: data.ImporterViewData.filter((country) => {
                    // delete country.ReporterName
                    return currentImporters.filter((importer) => {
                      return importer.code === country.CountryCode
                    }).length
                  })
                })
              })
              .finally(() => {

                if (index === currentProductIds.length - 1) {
                  this.downloadCount++
                  this.downloadLogs.unshift({text: (error ? ' × ' : ' ✔ ') + country.name})
                  if(cx === currentExporters.length-1){
                    // the end
                    if(!this.downloading) return
                    setTimeout(() => {

                      renderer.send('download', results)

                      let loop = setInterval(() => {
                        let percent = renderer.sendSync('get-download-progress')
                        if(percent === 1) {
                          this.downloading = false
                          clearInterval(loop)
                        }
                      }, 500)

                    }, 1000)
                  }
                }
              })
        })
      })

    },
    selectProduct(product) {
      let index = -1;
      const exists = this.selectedProducts.filter((p, i) => {
        if (p.Code === product.Code) {
          index = i;
          return true;
        }
      }).length > 0

      if (exists) {
        this.selectedProducts.splice(index, 1)
      } else {
        this.selectedProducts.push(product)
      }

    },
    async getProductsBySearch() {
      if (this.productKeywords.length < 2) {
        return
      }
      this.searchingProducts = true
      const data = await this.$axios.$get(API + '/products-all-level?countryCode=All&level=6&keyword=' + this.productKeywords).catch(err => {
        this.exit()
      })
      this.products = data
      this.searchingProducts = false
      return data
    },
    async getProductById(id = '01', partner = '032') {
      return await this.$axios.$get(API + '/results/importerview?reporter=All&partner=' + partner + '&product=' + id, {
        cancelToken: this.currentCancelToken
      }).catch(err => {
        if (this.starting) this.exit()
      })
    }
  }
}
</script>
