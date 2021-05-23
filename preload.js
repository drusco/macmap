/*
scripts that use node features such as 'require' should be placed here
properties set to the 'window' global can be accessed later by the main.js scripts
https://www.electronjs.org/docs/api/context-bridge#exposing-node-global-symbols
*/

const project = require('~/package.json')
const { contextBridge, ipcRenderer } = require('electron')

const sendChannels = ['toMain']
const receiveChannels = ['fromMain']

contextBridge.exposeInMainWorld('api', {
  example() {
    return 'can be accessed through window[api]'
  },
  name() {
    return project.name
  },
  version() {
    return project.version
  },
  send: (channel, data) => {
    // whitelist channels
    if (sendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (receiveChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
})