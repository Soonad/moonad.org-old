import {Component} from "inferno"
import {h} from "inferno-hyperscript"

import DocRender from "./DocRender"

declare var require: any
const fm = require("formality-lang");

// Plays an application
class CodePlayer extends Component {
  app_error = null;
  app_state = null;
  app_funcs = null;
  defs      = null;
  file      = null;

  constructor(props) {
    super(props);
    this.defs = props.defs;
    this.file = props.file;
  }

  async componentDidMount() {
    this.compile();
  }

  compile() {
    const defs = this.defs;
    const file = this.file;

    if (defs && defs[`${file}/main`]) {
      var get_state = fm.to_js.compile(fm.lang.erase(defs[`App@0/get_state`]), {defs});
      var get_render = fm.to_js.compile(fm.lang.erase(defs[`App@0/get_render`]), {defs});
      var get_update = fm.to_js.compile(fm.lang.erase(defs[`App@0/get_update`]), {defs});

      var app = fm.to_js.compile(fm.lang.erase(defs[`${file}/main`]), {defs});
      var app_state = get_state(app);
      var app_render = get_render(app);
      var app_update = get_update(app);

      this.app_funcs = {
        state: app_state,
        render: app_render,
        update: app_update,
      };

      this.app_state = app_state;

      this.forceUpdate();
    } else {
      this.app_error = "No main found.";
    }
  }

  render() {
    const app_state = this.app_state;
    const app_funcs = this.app_funcs;
    const defs = this.defs;
    const file = this.file;

    const style = {"flex-grow": 1};

    const onClick = () => {
      this.app_state = app_funcs.update(null)(app_state);
      this.forceUpdate();
    };
    
    if (this.app_error) {
      return h("div", {style}, this.app_error);
    } else if (app_state === null || app_funcs === null) {
      return h("div", {style}, "Compiling application...");
    } else {
      return h("div", {style, onClick}, DocRender(app_funcs.render(app_state)));
    }
  }
};

export default CodePlayer;
