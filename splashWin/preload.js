const { ipcRenderer } = require("electron");

window.onload = () => {
  document.addEventListener("DOMContentLoaded", () => {
    ipcRenderer.invoke("getVer").then((version) => {
      document.getElementById("appVer").innerText = `VVC v${version}`;
      console.log(`VVC v${version}`);
    });
  });
};
