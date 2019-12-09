// Moonad: a Formality browser and application player

import {Component, render} from "inferno"
import {h} from "inferno-hyperscript"

import fm from "formality-lang";

// Components
import CodeEditor from "./CodeEditor"
import CodePlayer from "./CodePlayer"
import CodeRender from "./CodeRender"
import {Console} from "./Console/Console"
import Pathbar from "./Pathbar"
import TopMenu from "./TopMenu"

import { Bool, CitedByParent, Defs, DisplayMode, ExecCommand, Tokens, LocalFileManager, LocalFile, LoadFile } from "../assets/Constants";

const loader = async (file: string) => {
  return fm.forall.with_local_storage_cache(fm.forall.load_file)(file);
}

const load_file = async (file: string) => {
  return await loader(file);
}

interface LoadedFileResponse {code: string}
interface CheckTerm {
  mode: fm.lang.TypecheckMode,
  term_name: string, 
  opts: any
}
type Check_norm = (term: CheckTerm) => fm.core.Term

const type_check_term = async ({mode, term_name, opts}: CheckTerm) => {
  let type;
  let is_success;
  try {
    type = fm.lang.run(mode, term_name, opts);
    is_success = true;
  } catch (e) {
    type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
    is_success = false;
  }
  return {type, is_success};
}

// Normalizes a definition
// TODO: not working. Check what Victor wants to do here
const reduce = (term_name: string, defs: Defs, opts: any) => {
  let reduced : any;
  try {
    // norm = fm.lang.show(fm.lang.norm(defs[term_name], defs, {}));
    // reduced = fm.lang.show(fm.lang.reduce(term, opts))
    reduced = fm.lang.show(fm.lang.run("REDUCE_OPTIMAL", term_name, {}));
  } catch (e) {
    reduced = "<unable_to_normalize>";
  }
  return reduced;
}

const load_local_file = (file_name: string) => {
  const files_string = window.localStorage.getItem("saved_local");
  if(files_string) {
    const files_parsed: LocalFile[] = JSON.parse(files_string);
    for (let i = 0; i < files_parsed.length; i++){
      if(files_parsed[i].file_name === file_name){
        return files_parsed[i];
      }
    }
    return null; // File name not found
  } else { // There are no files
    return null;
  }
}

const BaseAppPath = "App#A_HX";

class Moonad extends Component {

  // Application state
  public version  : string        = "2";    // change to clear the user's caches
  public file     : string        = "";     // name of the current file being rendered
  public code     : string        = "";     // contents of the current file
  public tokens?  : Tokens        = [];     // chunks of code with syntax highlight info
  public cited_by : CitedByParent = [];     // files that import the current file
  public history  : string[]      = [];     // previous files
  public defs     : Defs          = {};     // loaded formality token
  public mode     : DisplayMode   = "VIEW"; // are we editing, playing or viewing this file?

  constructor(props: any) {
    super(props);
    this.load_file((window.location.pathname.slice(1) + window.location.hash) || "Base#");
    let local_files: string | null = window.localStorage.getItem("saved_local");
  }

  public componentDidMount() {
    const cached_fm_version = window.localStorage.getItem("cached_fm_version");
    const cached_moonad_version = window.localStorage.getItem("cached_moonad_version");
    if (cached_fm_version !== fm.lang.version || cached_moonad_version !== this.version) {
      window.localStorage.clear();
      window.localStorage.setItem("cached_moonad_version", this.version);
      window.localStorage.setItem("cached_fm_version", fm.lang.version);
    }

    window.onpopstate = (e: any) => {
      this.load_file(e.state, false);
    }
  }

  // Re-parses the code to build defs and tokens
  public async parse() {
    // old: const parsed = await fm.lang.parse(this.file, this.code, true, this.loader);
    const parsed = await fm.lang.parse(this.code, {file: this.file, loader, tokenify: true});
    this.defs = parsed.defs;
    this.tokens = parsed.tokens;
    this.forceUpdate();
  }

  // Loads a file (ex: "Data.Bool#xxxx")
  public async load_file(file: string, push_history: boolean = true) {
    if(push_history) {
      this.history.push(file);
      window.history.pushState(file, file, file);
    }
    this.mode = "VIEW";
    this.file = file;
    this.cited_by = [];

    try {
      this.code = await load_file(file);
    } catch (e) {
      this.code = "";
    }
    this.parse();
    this.cited_by = await fm.forall.load_file_parents(file);
    this.forceUpdate();
  }

  public async load_local_file(file: string) {
    const found_file: LocalFile | null = load_local_file(file);
    if(found_file !== null){
      this.code = found_file.code;
      this.file = file;
      this.mode = "EDIT";
      this.forceUpdate();
    }
  }

  public async exec_command( cmd: string, code?: string ) {
    const output_result: string[] = new Array<string>();
    output_result.push("Formality");
    output_result.push("");
    output_result.push("Usage: fm [options] [args]");
    output_result.push("");
    output_result.push("Evaluation modes (default: -d):");
    output_result.push("-d <file>/<term> debug (using HOAS interpreter)");
    output_result.push("  -X don't erase types");
    output_result.push("  -B don't erase boxes");
    output_result.push("  -W stop on weak head normal form");
    output_result.push("  -0 don't reduce anything");
    output_result.push("-o <file>/<term> optimal (using interaction nets, lazy)");
    output_result.push("-O <file>/<term> optimal (using interaction nets, strict)");
    output_result.push("-j <file>/<term> JavaScript (using native functions)");
    output_result.push("");
    output_result.push("Type-checking modes:");
    output_result.push("-t <file>/<term> performs a type check");
    output_result.push("");
    // Show fm commands
    if (cmd === "fm") { 
      return output_result;
    }
    this.forceUpdate();
  }

  // Loads a code without a file (local)
  public async save_code(code: string) {
    this.code = code;
    this.parse();
    this.file = await fm.forall.save_file(this.file.slice(0, this.file.indexOf("#")), this.code);
    this.parse();
  }

  // Type-checks a definition 
  public async typecheck(name: string) {
    const res = await type_check_term({mode: "TYPECHECK", term_name: name, opts: {defs: this.defs} });
    let text = ":: Type ::\n";
    if (res.is_success) {
      text += "✓ " + fm.lang.show(res.type);
    } else {
      text += "✗ " + res.type;
    }
    try {
      const norm = await type_check_term({mode: "REDUCE_DEBUG", term_name: name, opts: {defs: this.defs, erased: true, unbox: true, logging: true}});
      text += "\n\n:: Output ::\n";
      text += fm.lang.show(norm.type, [], {full_refs: false});
    } catch (e) {
      alert("Problems while normalizing the term.");
    }
    alert(text);
  }

  // Normalizes a definition
  public reduce(term_name: string) {
    const norm = reduce(this.defs[term_name], this.defs, {});
    alert(norm);
  }

  // Event when user clicks a definition 
  public on_click_def(path: string) {
    return (e: any) => {
      if (!e.shiftKey) {
        return this.typecheck(path);
      } 
        return this.reduce(path);
    }
  }

  // Event when user clicks a reference
  public on_click_ref(path: string) {
    return (e: any) => {
      this.load_file(path.slice(0, path.indexOf("/")));
    }
  }

  // Event when user clicks an import
  public on_click_imp(file: string) {
    return (e: any) => {
      this.load_file(file);
    }
  }
  
  public on_click_view() {
    this.mode = "VIEW";
    this.save_code(this.code);
    this.forceUpdate();
  }

  public on_click_edit() {
    this.mode = "EDIT";
    this.forceUpdate();
  }

  public async on_click_play() {
    const app_files = await fm.forall.load_file_parents(BaseAppPath);
    if (app_files.includes(this.file)) {
      this.mode = "PLAY";
      this.forceUpdate();
    } else {
      window.alert("This file is not an app, so it can't be played");
    } 
  }

  public on_input_code(code: string) {
    this.code = code;
    this.forceUpdate();
  }

  public getLocalFileManager() {
    const load_local_file = (file: string) => this.load_local_file(file);
    const mng: LocalFileManager = {
      file: {code: this.code, file_name: this.file},
      saveLocalFile: () => { console.log("[moonad] save local file"); },
      loadLocalFile: load_local_file
    }
    return mng;
  }

  // async on_click_save() {
    // var file = prompt("File name:");
    // try {
      // if (file) {
        // var unam = await fm.forall.save_file(file, this.code);
        // this.load_file(unam);
      // } else {
        // throw "";
      // }
    // } catch (e) {
      // console.log(e);
      // alert("Couldn't save file.");
    // }
  // }

  // Renders the interface
  public render() {
    // Creates bound variables for states and local methods
    const mode = this.mode;
    const file = this.file;
    const defs = this.defs;
    const code = this.code;
    const tokens = this.tokens;
    const cited_by = this.cited_by;
    const local_file_manager = this.getLocalFileManager();
    const load_file = (file: string, push_history?: boolean) => this.load_file(file, push_history);
    const on_click_view = () => this.on_click_view();
    const on_click_edit = () => this.on_click_edit();
    const on_click_play = () => this.on_click_play();
    const on_click_def = (path: string) => this.on_click_def(path);
    const on_click_imp = (path: string) => this.on_click_imp(path);
    const on_click_ref = (path: string) => this.on_click_ref(path);
    const on_input_code = (code: string) => this.on_input_code(code);
    const exec_command = (cmd: string) => this.exec_command(cmd);

    // Renders the site
    return h("div", {
      style: {
        "font-family": "Gotham Book",
        "display": "flex",
        "flex-flow": "column nowrap",
        "height": "100%",
    }}, [
      // Top of the site
      TopMenu({mode, file, on_click_view, on_click_edit, on_click_play, load_file}),

      // Middle of the site
      ( this.mode === "EDIT" ? CodeEditor({code, on_input_code})
      : this.mode === "VIEW" ? CodeRender({code, tokens, on_click_def, on_click_imp, on_click_ref})
      : this.mode === "PLAY" ? h(CodePlayer, {defs, file})
      : null),

      // Bottom of the site
      h(Console, {load_file, cited_by, mode, exec_command, local_file_manager})
    ]);
  }
}

export {Moonad, loader, load_file, type_check_term, reduce, BaseAppPath }
