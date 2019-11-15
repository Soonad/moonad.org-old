const render = require("inferno").render;
const h = require("inferno-hyperscript").h;
const Moonad = require("./components/Moonad.js");

window.onload = () => {
  render(h(Moonad, {}), document.getElementById("main"));
};
