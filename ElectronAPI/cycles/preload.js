const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld('api', {
    node: () => process.versions.node,
})