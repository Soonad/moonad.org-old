import {Component} from "inferno"
import {h} from "inferno-hyperscript"

import { Defs } from "../assets/Constants";
import DocRender from "./DocRender"

declare var require: any
const fm = require("formality-lang");

interface Props {
  defs: Defs;
  file: string;
}

/* tslint:disable */

const compile = ({defs, file}: Props) => {

  const main = defs[`${file}/main`] || defs[`${file}/app`] || defs[`${file}/demo_app`];
  const app_lib = find_app_prefix(defs);

  if (defs && main && app_lib) {
    const get_state = eval(fm.js.compile(fm.core.erase(defs[`${app_lib}/get_state`]), defs));
    const get_render = eval(fm.js.compile(fm.core.erase(defs[`${app_lib}/get_render`]), defs));
    const get_update = eval(fm.js.compile(fm.core.erase(defs[`${app_lib}/get_update`]), defs));
    const mouseclick = eval(fm.js.compile(fm.core.erase(defs[`${app_lib}/mouseclick`]), defs));
    const mousemove = eval(fm.js.compile(fm.core.erase(defs[`${app_lib}/mousemove`]), defs));
    const keypress = eval(fm.js.compile(fm.core.erase(defs[`${app_lib}/keypress`]), defs));

    const erased_term = fm.core.erase(main);
    const app = eval(fm.js.compile(erased_term, defs));
    const app_state = get_state(app);
    const app_render = get_render(app);
    const app_update = get_update(app);

    return {
      mouseclick,
      mousemove,
      keypress,
      state: app_state,
      render: app_render,
      update: app_update,
    };

  } else {
    return null;
  }
}

const find_app_prefix = (defs: Defs) => {
  for (const key in defs) {
    if (key.slice(0,4) === "App#") {
      return key.slice(0, key.indexOf("/"));
    }
  }
  return null;
}

// Plays an application
class CodePlayer extends Component<Props> {
  public app_error: string = "";
  public app_state: any    = null; // TODO: add the correct type
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

  public compile(){
    const res = compile(this.props);
    if(res){
      this.app_state = res.state;
      this.app_funcs = res;
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

    const style = {
      "flex-grow": 1, 
      "font-family": "monospace",
      "font-size": "14px",
      "padding": "8px"
    };

    const onMouseMove = (e: any) => {
      if (typeof app_funcs !== null || app_funcs !== undefined) {
        this.app_state = app_funcs.update(app_funcs.mousemove(e.pageX)(e.pageY))(app_state);
        this.forceUpdate();
      }
    };

    const onClick = (e: any) => {
      this.app_state = app_funcs.update(app_funcs.mouseclick(e.pageX)(e.pageY))(app_state);
      this.forceUpdate();
    };

    const onKeyPress = (e: any) => {
      this.app_state = app_funcs.update(app_funcs.keypress(e.keyCode))(app_state);
      this.forceUpdate();
    };

    const onKeyDown = (e: any) => {
      this.app_state = app_funcs.update(app_funcs.keypress(e.keyCode))(app_state);
      this.forceUpdate();
    };

    const onKeyUp = (e: any) => {
      this.app_state = app_funcs.update(app_funcs.keypress(e.keyCode))(app_state);
      this.forceUpdate();
    };

    if (this.app_error) {
      return h("div", {style}, this.app_error);
    }  if (app_state === null || app_funcs === null) {
      return h("div", {style}, "Compiling application...");
    } 
      return h("div", {
        style: {
          "flex-grow": 1,
          "padding": "0px"
        },
        tabindex: 0,
        onMouseMove,
        onClick,
        onKeyPress,
        onKeyDown,
        onKeyUp,
      }, DocRender(app_funcs.render(app_state)));
    
  }
}

export {CodePlayer, compile};
