import {Component} from "inferno"
import {h} from "inferno-hyperscript"

import DocRender from "./DocRender"
import { Defs } from "../../docs/assets/Constants";

declare var require: any
const fm = require("formality-lang");

interface Props {
  defs: Defs;
  file: string;
}

/* tslint:disable */

// Plays an application
class CodePlayer extends Component<Props> {
  public app_error: string = "";
  public app_state: any      = null; // TODO: add the correct type
  public app_funcs: any    = null; // TODO: add the correct type
  public defs: Defs        = {};
  public file: string      = "";

  constructor(props: Props) {
    super(props);
    this.defs = props.defs;
    this.file = props.file;
  }

  public async componentDidMount() {
    this.compile();
  }

  public find_app_prefix() {
    for (const key in this.defs) {
      if (key.slice(0,4) === "App#") {
        return key.slice(0, key.indexOf("/"));
      }
    }
    return null;
  }

  public compile() {
    const defs = this.defs;
    const file = this.file;

    const main = defs[`${file}/main`] || defs[`${file}/app`] || defs[`${file}/demo_app`];
    const app_lib = this.find_app_prefix();

    if (defs && main && app_lib) {
      const get_state = fm.to_js.compile(fm.lang.erase(defs[`${app_lib}/get_state`]), {defs});
      const get_render = fm.to_js.compile(fm.lang.erase(defs[`${app_lib}/get_render`]), {defs});
      const get_update = fm.to_js.compile(fm.lang.erase(defs[`${app_lib}/get_update`]), {defs});
      const mouseclick = fm.to_js.compile(fm.lang.erase(defs[`${app_lib}/mouseclick`]), {defs});
      const mousemove = fm.to_js.compile(fm.lang.erase(defs[`${app_lib}/mousemove`]), {defs});
      const keypress = fm.to_js.compile(fm.lang.erase(defs[`${app_lib}/keypress`]), {defs});

      const app = fm.to_js.compile(fm.lang.erase(main), {defs});
      const app_state = get_state(app);
      const app_render = get_render(app);
      const app_update = get_update(app);

      this.app_funcs = {
        mouseclick,
        mousemove,
        keypress,
        state: app_state,
        render: app_render,
        update: app_update,
      };

      this.app_state = app_state;
    } else {
      this.app_error = "Error compiling App.";
    }
    this.forceUpdate();
  }

  public render() {
    const app_state = this.app_state;
    const app_funcs = this.app_funcs;
    const defs = this.defs;
    const file = this.file;

    const style = {"flex-grow": 1};

    const onMouseMove = (e: MouseEvent) => {
      if (typeof app_funcs !== null || app_funcs !== undefined) {
        this.app_state = app_funcs.update(app_funcs.mousemove(e.pageX)(e.pageY))(app_state);
        this.forceUpdate();
      }
    };

    const onClick = (e: MouseEvent) => {
      this.app_state = app_funcs!.update(app_funcs!.mouseclick(e.pageX)(e.pageY))(app_state);
      this.forceUpdate();
    };

    const onKeyPress = (e: KeyboardEvent) => {
      this.app_state = app_funcs.update(app_funcs.keypress(e.keyCode))(app_state);
      this.forceUpdate();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      this.app_state = app_funcs.update(app_funcs.keypress(e.keyCode))(app_state);
      this.forceUpdate();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      this.app_state = app_funcs.update(app_funcs.keypress(e.keyCode))(app_state);
      this.forceUpdate();
    };

    if (this.app_error) {
      return h("div", {style}, this.app_error);
    }  if (app_state === null || app_funcs === null) {
      return h("div", {style}, "Compiling application...");
    } 
      return h("div", {
        tabindex: 0,
        style,
        onMouseMove,
        onClick,
        onKeyPress,
        onKeyDown,
        onKeyUp
      }, DocRender(app_funcs.render(app_state)));
    
  }
}

export default CodePlayer;
