const LayoutConstants = {
  primary_color: "#003F63",
  primary_shadow_color: "#003452",
  secondary_color: "#1FB0D5",
  light_gray_color: "#F2F2F2",
  light_gray_shadow_color: "#F6F6F6",
  dark_gray_color: "#4A4A4A",
  medium_gray_color: "#C5C5C5"
}

const ElementsId = {
  console_id: "console",
  layout_id: "layout_root",
  console_input_id: "console_input",
}

// Common Types
type Tokens = Array<[string, [string, string]]>;
type Bool = true | false;
type DisplayMode = "EDIT" | "PLAY" | "VIEW";
type LoadFile = (file: string, push_history?: boolean) => Promise<void>;
type CitedByParent = string[];
type ExecCommand = (cmd: string, code?: string) => any;

interface Defs {[key : string] : any} // `any` is a Formality Term

export interface LocalFile {
  code: string;
  file_name: string;
}

export interface Module {
  path: string;
  cited_by: CitedByParent;
  tokens: Tokens[];
  code: string;
  // term: (term_name: string) => Term;
}

export interface ConsoleTabs {
  is_on_focus: boolean;
  title: string;
  onClick: () => void;
}

export interface LocalFileManager {
  file: LocalFile;
  save_local_file: any;
  load_local_file: any;
  delete_local_file: any;
  publish: any;
}

export { 
  LayoutConstants, 
  ElementsId, 
  Tokens, Defs, Bool, DisplayMode, CitedByParent, 
  LoadFile, ExecCommand}