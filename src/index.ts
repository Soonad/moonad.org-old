import {render} from "inferno"
import {h} from "inferno-hyperscript"
import {Moonad} from "./components/Moonad"

window.onload = () => {
  render(h(Moonad, {}), document.getElementById("main"));
};
