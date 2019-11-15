// Moonad: a Formality browser and application player

import {Component, render} from "inferno"
import {h} from "inferno-hyperscript"
import fm from "formality-lang"

// Components
import CodeEditor from "./CodeEditor"
import CodeRender from "./CodeRender"
import Console from "./Console"
import TopMenu from "./TopMenu"

type Tokens = Array<[string, [string, string]]>;
type Defs = {[key : string] : any}; // `any` is a Formality Term
type Bool = true | false;

class Moonad extends Component {

  // Application state
  version  : string        = "0";   // change to clear the user's caches
  file     : string        = null;  // name of the current file being rendered
  code     : string        = null;  // contents of the current file
  tokens   : Tokens        = null;  // chunks of code with syntax highlight info
  cited_by : Array<string> = null;  // files that import the current file
  history  : Array<string> = null;  // previous files
  defs     : Defs          = null;  // loaded formality token
  editing  : Bool          = false; // are we editing this file?
  
  constructor(props) {
    super(props);
    this.load_file(window.location.pathname.slice(1) || "Base@0");
  }

  componentDidMount() {
    const cached_fm_version = window.localStorage.getItem("cached_fm_version");
    const cached_moonad_version = window.localStorage.getItem("cached_moonad_version");
    if (cached_fm_version !== fm.lang.version || cached_moonad_version !== this.version) {
      window.localStorage.clear();
      window.localStorage.setItem("cached_moonad_version", this.version);
      window.localStorage.setItem("cached_fm_version", fm.lang.version);
    }
    window.onpopstate = (e) => this.load_file(e.state, false);
  }

  // Loads file/code from propps
  componentWillReceiveProps(props) {
    if (props.code) this.load_code(props.code);
    if (props.file) this.load_file(props.file);
  }

  // Loads a file (ex: "Data.Bool@0")
  async load_file(file, push_history = true) {
    if (file.slice(-3) === ".fm") {
      file = file.slice(0, -3);
    }
    if (file.indexOf("@") === -1) {
      file = file + "@0";
    }
    if (push_history) {
      this.history.push(file);
      window.history.pushState(file, file, file);
    }
    this.editing = false;
    this.file = file;
    try {
      this.cited_by = [];
      await this.load_code(await fm.forall.with_local_storage_cache(fm.forall.load_file)(file));
      this.cited_by = await fm.forall.load_file_parents(file);
    } catch (e) {
      console.log(e);
      this.code = "<error>";
    }
    this.forceUpdate();
  }

  // Loads a code
  async load_code(code) {
    this.code = code;
    var loader = fm.forall.with_local_storage_cache(fm.forall.load_file);
    var {defs, tokens} = await fm.lang.parse(this.code, {file: this.file, tokenify: true, loader});
    this.defs = defs;
    this.tokens = tokens;
    this.forceUpdate();
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
    try {
      var norm = fm.lang.show(fm.lang.norm(this.defs[name], this.defs, "DEBUG", {}));
    } catch (e) {
      var norm = "<unable_to_normalize>";
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

  on_click_edit() {
    if (!this.editing) {
      this.file = "local";
      this.editing = true;
    } else {
      this.editing = false;
      this.load_code(this.code);
    }
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
        var unam = await fm.lang.save_file(file, this.code);
        this.load_file(unam);
      } else {
        throw "";
      }
    } catch (e) {
      alert("Couldn't save file.");
    }
  }

  // Renders the interface
  render() {
    // Creates bound variables for states and local methods
    const editing = this.editing;
    const file = this.file;
    const code = this.code;
    const tokens = this.tokens;
    const cited_by = this.cited_by;
    const load_file = (file, push) => this.load_file(file, push);
    const on_click_edit = () => this.on_click_edit();
    const on_click_save = () => this.on_click_save();
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
      TopMenu({editing, file, on_click_edit, on_click_save, load_file}),

      // Middle of the site
      this.editing
        ? CodeEditor({code, on_input_code})
        : CodeRender({code, tokens, on_click_def, on_click_imp, on_click_ref}),

      // Bottom of the site
      Console({load_file, cited_by})
    ]);
  }
}

export default Moonad
