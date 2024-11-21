"use strict";
const electron = require("electron");
const electronAPI = {};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
