// Moonad: a Formality browser and application player

import {Component, render} from "inferno"
import {h} from "inferno-hyperscript"

// import fm from "formality-lang"; // using .d.ts
declare var require: any
const fm = require("formality-lang");

// Components
import CodeEditor from "./CodeEditor"
import {CodePlayer} from "./CodePlayer"
import CodeRender from "./CodeRender"
import Console from "./Console/Console"
import Pathbar from "./Pathbar"
import TopMenu from "./TopMenu"

import { Bool, CitedByParent, Defs, DisplayMode, ExecCommand,
         LoadFile, LocalFile, LocalFileManager, Tokens } from "../assets/Constants";

// :::::::::::::
// : Formality :
// :::::::::::::

const load_file = async (file_name: string) => {
  return await fm.loader.with_local_storage_cache(fm.loader.load_file)(file_name);
}

const parse_file = async (code: string, file_name: string, tokenify: boolean) => {
  const parsed = await fm.parse(code, {file: file_name, tokenify: true, loader: load_file})
  return {defs: parsed.defs, tokens: parsed.tokens};
}

const load_file_parents = async (file_name: string) => {
  const response: string[] = await fm.loader.load_file_parents(file_name);
  return response;
}

interface CheckTerm {
  term_name: string;
  expect: any;
  defs?: {};
  opts?: {};
}

const type_check_term = async ({term_name, expect = null, defs, opts}: CheckTerm) => {
  let type;
  let show_type;
  let is_success;
  try {
    type = fm.core.typecheck(term_name, expect, defs, opts);
    show_type = fm.stringify(type);
    is_success = true;
  } catch (e) {
    type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
    is_success = false;
  }
  return {type, is_success};
}

// Normalizes a definition
// TODO: reduce not working
const reduce = (term: any, defs: Defs, opts: any) => {
  let reduced : any;
  try {
    const erased_term = fm.core.erase(term);
    reduced = fm.core.reduce(erased_term, defs);
  } catch (e) {
    reduced = "<unable_to_normalize>";
  }
  return reduced;
}

const can_run_app = (defs: Defs, file_name: string) => {
  let import_app = false;
  for(let def in defs){
    const temp = def.split("#")[0];
    if(temp === "App"){
      import_app = true;
      break;
    }
  }
  return import_app && file_name !== "Base#" && file_name !== "Base";
}

// :::::::::::::::::
// : Local Storage :
// :::::::::::::::::
const load_local_file = (file_name: string) => {
  const files_string: string | null = window.localStorage.getItem("saved_local");
  if(files_string) {
    const files_parsed: LocalFile[] = JSON.parse(files_string);
    for (const element of files_parsed){
      if(element.file_name === file_name){
        return element;
      }
    }
  }
  return null;
}

const get_local_files = () => {
  return window.localStorage.getItem("saved_local");
}

const save_local_file = (file: LocalFile, input_name?: () => string) => {

  if(file){
    const local_files = get_local_files();
    const load_result: LocalFile | null = load_local_file(file.file_name);
    if (!local_files) {
      if(input_name){
        file.file_name = input_name();
      }
      window.localStorage.setItem("saved_local", JSON.stringify([file]));
    } else { 
      const new_files: LocalFile[] = JSON.parse(local_files);
      window.localStorage.removeItem("saved_local");
      if (!load_result){ // There's not file with this name
        if(input_name){
          file.file_name = input_name();
        }
        new_files.push(file);
      } else { // File exists
        // Find and update file
        for(let i = 0; i <= new_files.length; i++){
          if(new_files[i].file_name === file.file_name){
            new_files[i].code = file.code;
            break;
          }
        }
      } 
      window.localStorage.setItem("saved_local", JSON.stringify(new_files));
    }
    // After saving a file, confirms if it exists
    return load_local_file(file.file_name) ? file : false;
  }
  return false;
}

const delete_local_file = (file_name: string) => {
  const files_string = window.localStorage.getItem("saved_local");
  if(files_string) {
    let files_parsed: LocalFile[] = JSON.parse(files_string);
    const old_lenght = files_parsed.length;
    files_parsed = files_parsed.filter((item: LocalFile) => item.file_name !== file_name);
    // Update local files
    window.localStorage.removeItem("saved_local");
    window.localStorage.setItem("saved_local", JSON.stringify(files_parsed));
    // if false, file name was not found
    return (old_lenght - files_parsed.length) !== 0 ? true : false; 
  } 
  // There are no files saved locally
  return false;
}
// If a file imports App, it can run.
const BaseAppPath = "App#VjZN";

class Moonad extends Component {

  // Application state
  public version  : string        = "3";    // change to clear the user's caches
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
  }

  public componentDidMount() {
    const cached_fm_version = window.localStorage.getItem("cached_fm_version");
    const cached_moonad_version = window.localStorage.getItem("cached_moonad_version");
    if (cached_fm_version !== fm.version || cached_moonad_version !== this.version) {
      window.localStorage.clear();
      window.localStorage.setItem("cached_moonad_version", this.version);
      window.localStorage.setItem("cached_fm_version", fm.version);
      this.code = "Loading code from FPM. This could take a while."
    }

    window.onpopstate = (e: any) => {
      this.load_file(e.state, false);
    }
  }

  // Re-parses the code to build defs and tokens
  public async parse() {
    const parsed = await parse_file(this.code, this.file, true);
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
      if(window.location.pathname === "/Base"){
        this.file = "Base#";
        this.code = await load_file("Base#");
      } else {
        this.code = await load_file(file);
      }
    } catch (e) {
      console.log("An error ocurred while loading the file: ", e);
      this.code = "An error ocurred while loading this file.";
    }
    this.parse();
    this.cited_by = await load_file_parents(this.file);
    this.forceUpdate();
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

  public async save_code(file_name: string, code: string) {
    this.code = code;
    this.parse();
    this.file = fm.loades.save_file(file_name, code);
    // this.file = await fm.forall.save_file(this.file.slice(0, this.file.indexOf("#")), this.code);
    this.parse();
  }

  // Type-checks a definition 
  public async typecheck(name: string) {
    const res = await type_check_term({term_name: name, expect: null, defs: this.defs});
    let text = ":: Type ::\n";
    if (res.is_success) {
      text += "✓ " + fm.stringify(res.type);
    } else {
      text += "✗ " + res.type;
    }
    try {
      const reduced = reduce(this.defs[name], this.defs, {});
      text += "\n\n:: Normal form ::\n";
      text += fm.stringify(reduced);
    } catch (e) {
      console.log("[moonad] Problems while normalizing the term: ", e);
    }
    alert(text);
  }

  // Normalizes a definition
  public reduce(term_name: string) {
    const norm = reduce(this.defs[term_name], this.defs, {});
    alert(fm.stringify(norm));
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
    // this.save_code(this.code);
    this.forceUpdate();
  }

  // Event when user clicks on Edit button
  public on_click_edit() {
    this.mode = "EDIT";
    this.forceUpdate();
  }

  // Event when users clicks on Play button
  public async on_click_play() {
    if(can_run_app(this.defs, this.file)) {
      console.log("[moonad] Can run app");
      this.mode = "PLAY";
      this.forceUpdate();
    } else {
      alert("This file is not an app, so it can't be played");
    }
  }

  public on_input_code(code: string) {
    this.code = code;
    this.forceUpdate();
  }

  public async publish_file() {
    if(this.mode === "EDIT"){
      const file = prompt("File name: ");
      try {
        if (file) {
          const file_name = await fm.loader.save_file(file, this.code);
          this.load_file(file_name);
          console.log("[moonad] pushish success: "+file_name);
        } else {
          throw new Error("");
        }
      } catch (e) {
        console.log("[moonad] Error on saving file: ",e);
        alert("There was a problem. I couldn't save the file.");
      }
    } else {
      console.log("[moonad] I'm only able to publish a file on EDIT mode.");
    }
  }

  // :::::::::
  // : LOCAL :
  // :::::::::
  public getLocalFileManager() {
    const load_local_file = (file_name: string) => this.load_local_file(file_name);
    const delete_local_file = (file_name: string) => this.delete_local_file(file_name);
    const save_local_file = () => this.save_local_file();
    const publish = () => this.publish_file();
    const mng: LocalFileManager = {
      file: {code: this.code, file_name: this.file},
      save_local_file,
      load_local_file,
      delete_local_file,
      publish
    }
    return mng;
  }

  public async load_local_file(file: string) {
    const found_file: LocalFile | null = load_local_file(file);
    if(found_file){
      this.code = found_file.code;
      this.file = file;
      this.mode = "EDIT";
      this.forceUpdate();
    }
  }

  // TODO: instead of an alert, I wish to present a small
  // message inside Tools. Future plans.
  public save_local_file() {
    // Only saves a file in editing mode
    if(this.mode === "EDIT"){
      const save: LocalFile = {code: this.code, file_name: this.file};
      const get_name = () => {
        const name = prompt("Please enter the file name", "");
        if(name) {
          return name;
        } 
          return "empty_string";
        
      }
      const saved_file = save_local_file(save, get_name);
      if(saved_file !== false) {
        this.code = saved_file.code;
        this.file = saved_file.file_name;
        this.forceUpdate();
        // alert("File saved with success");
        console.log("[moonad] File saved with success!");
      } else {
        alert("I'm not able to save this file.");
        console.log("[moonad] I'm not able to save this file.");
      }
    } else {
      alert("I'm only able to save a file on EDIT mode.");
      console.log("[moonad] I'm only able to save a file on EDIT mode.");
    }
  }

  // TODO: update return
  public delete_local_file(file_name: string) {
    const resp = delete_local_file(file_name);
    if(resp) {
      // If deleting the current file, loads Base
      if(this.file === file_name){
        this.load_file("Base#");
      }
      console.log("[moonad] Ok, file deleted.");
    } else {
      alert("I couldn't find the file to be deleted.");
      console.log("[moonad] I couldn't find the file to be deleted.");
    }
    this.forceUpdate();
  }

  // Renders the interface
  public render() {
    // Creates bound vagit riables for states and local methods
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

export {Moonad, load_file, parse_file, load_file_parents, type_check_term, 
  reduce, BaseAppPath,
  save_local_file, load_local_file, get_local_files, delete_local_file,
  can_run_app }