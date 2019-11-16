// Moonad: a Formality browser and application player

import {Component, render} from "inferno"
import {h} from "inferno-hyperscript"

// TODO: how to improve this?
declare var require: any
const fm = require("formality-lang");

// Components
import CodeEditor from "./CodeEditor"
import CodePlayer from "./CodePlayer"
import CodeRender from "./CodeRender"
import Console from "./Console"
import TopMenu from "./TopMenu"

type Tokens = Array<[string, [string, string]]>;
type Defs = {[key : string] : any}; // `any` is a Formality Term
type Bool = true | false;
type Mode = "EDIT" | "PLAY" | "VIEW";

class Moonad extends Component {

  // Application state
  version  : string        = "2";    // change to clear the user's caches
  file     : string        = null;   // name of the current file being rendered
  code     : string        = null;   // contents of the current file
  tokens   : Tokens        = null;   // chunks of code with syntax highlight info
  cited_by : Array<string> = null;   // files that import the current file
  history  : Array<string> = [];     // previous files
  defs     : Defs          = null;   // loaded formality token
  mode     : Mode          = "VIEW"; // are we editing, playing or viewing this file?
  
  constructor(props) {
    super(props);
    this.load_file((window.location.pathname.slice(1) + window.location.hash) || "Base#");
  }

  componentDidMount() {
    const cached_fm_version = window.localStorage.getItem("cached_fm_version");
    const cached_moonad_version = window.localStorage.getItem("cached_moonad_version");
    if (cached_fm_version !== fm.lang.version || cached_moonad_version !== this.version) {
      window.localStorage.clear();
      window.localStorage.setItem("cached_moonad_version", this.version);
      window.localStorage.setItem("cached_fm_version", fm.lang.version);
    }
    window.onpopstate = (e) => {
      this.load_file(e.state, false);
    }
  }

  // Loads file/code from propps
  componentWillReceiveProps(props) {
    if (props.code) this.load_code(props.code);
    if (props.file) this.load_file(props.file);
  }

  loader(file) {
    return fm.forall.with_local_storage_cache(fm.forall.load_file)(file);
  }

  // Re-parses the code to build defs and tokens
  async parse() {
    const parsed = await fm.lang.parse(this.code, {file: this.file, tokenify: true, loader: this.loader});
    this.defs = parsed.defs;
    this.tokens = parsed.tokens;
    this.forceUpdate();
  }

  // Loads a file (ex: "Data.Bool#xxxx")
  async load_file(file, push_history = true) {
    if (file.slice(-3) === ".fm") {
      file = file.slice(0, -3);
    }
    if (file.indexOf("#") === -1) {
      file = file + "#";
    }
    if (push_history) {
      this.history.push(file);
      window.history.pushState(file, file, file);
    }
    this.mode = "VIEW";
    this.file = file;
    try {
      this.cited_by = [];
      this.code = await this.loader(this.file);
      this.parse();
      this.cited_by = await fm.forall.load_file_parents(file);
    } catch (e) {
      console.log(e);
      this.code = "<error>";
      this.forceUpdate();
    }
  }

  // Loads a code without a file (local)
  async load_code(code) {
    this.file = "local";
    this.code = code;
    this.parse();
  }

  // Type-checks a definition 
  typecheck(name) {
    try {
      var type = fm.lang.run("TYPE", name, "TYPE", {defs: this.defs});
      var good = true;
    } catch (e) {
      var type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
      var good = false;
    }
    var text = ":: Type ::\n";
    if (good) {
      text += "✓ " + fm.lang.show(type);
    } else {
      text += "✗ " + type;
    }
    try {
      var norm = fm.lang.run("REDUCE_DEBUG", name, {defs: this.defs, erased: true, unbox: true, logging: true});
      text += "\n\n:: Output ::\n";
      text += fm.lang.show(norm, [], {full_refs: false});
    } catch (e) {};
    alert(text);
  }

  // Normalizes a definition
  normalize(name) {
    var norm : any;
    try {
      norm = fm.lang.show(fm.lang.norm(this.defs[name], this.defs, "DEBUG", {}));
    } catch (e) {
      norm = "<unable_to_normalize>";
    };
    alert(norm);
  }

  // Event when user clicks a definition 
  on_click_def(path) {
    return e => {
      if (!e.shiftKey) {
        return this.typecheck(path);
      } else {
        return this.normalize(path);
      }
    }
  }

  // Event when user clicks a reference
  on_click_ref(path) {
    return e => {
      this.load_file(path.slice(0, path.indexOf("/")));
    }
  }

  // Event when user clicks an import
  on_click_imp(file) {
    return e => {
      this.load_file(file);
    }
  }
  
  on_click_view() {
    this.mode = "VIEW";
    this.load_code(this.code);
    this.forceUpdate();
  }

  on_click_edit() {
    this.mode = "EDIT";
    this.forceUpdate();
  }

  on_click_play() {
    this.mode = "PLAY";
    this.forceUpdate();
  }

  on_input_code(code) {
    this.code = code;
    this.forceUpdate();
  }

  async on_click_save() {
    var file = prompt("File name:");
    try {
      if (file) {
        var unam = await fm.forall.save_file(file, this.code);
        this.load_file(unam);
      } else {
        throw "";
      }
    } catch (e) {
      console.log(e);
      alert("Couldn't save file.");
    }
  }

  // Renders the interface
  render() {
    // Creates bound variables for states and local methods
    const mode = this.mode;
    const file = this.file;
    const defs = this.defs;
    const code = this.code;
    const tokens = this.tokens;
    const cited_by = this.cited_by;
    const load_file = (file, push) => this.load_file(file, push);
    const on_click_view = () => this.on_click_view();
    const on_click_edit = () => this.on_click_edit();
    const on_click_save = () => this.on_click_save();
    const on_click_play = () => this.on_click_play();
    const on_click_def = (path) => this.on_click_def(path);
    const on_click_imp = (path) => this.on_click_imp(path);
    const on_click_ref = (path) => this.on_click_ref(path);
    const on_input_code = (code) => this.on_input_code(code);

    // Renders the site
    return h("div", {
      style: {
        "font-family": "Gotham Book",
        "display": "flex",
        "flex-flow": "column nowrap",
        "height": "100%",
        "background": "rgb(253,253,254)"
    }}, [
      // Top of the site
      TopMenu({mode, file, on_click_view, on_click_edit, on_click_save, on_click_play, load_file}),

      // Middle of the site
      ( this.mode === "EDIT" ? CodeEditor({code, on_input_code})
      : this.mode === "VIEW" ? CodeRender({code, tokens, on_click_def, on_click_imp, on_click_ref})
      : this.mode === "PLAY" ? h(CodePlayer, {defs, file})
      : null),

      // Bottom of the site
      Console({load_file, cited_by})
    ]);
  }
}

export default Moonad
