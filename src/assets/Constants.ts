const LayoutConstants = {
  primary_color: "#003F63",
  primary_shadow_color: "#003452",
  secondary_color: "#1FB0D5",
  light_gray_color: "#F2F2F2",
  light_gray_shadow_color: "#F6F6F6",
  dark_gray_color: "#4A4A4A",
  medium_gray_color: "#A9A9A9"
}

const ElementsId = {
  console_id: "console",
  layout_id: "layout-root"
}

// Common Types
type Tokens = Array<[string, [string, string]]>;
type Defs = {[key : string] : any}; // `any` is a Formality Term
type Bool = true | false;
type Mode = "EDIT" | "PLAY" | "VIEW";
type LoadFile = (module_or_term: string, push_history?: boolean) => any;
type CitedByParent = Array<string>;

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


export { 
  LayoutConstants, 
  ElementsId, 
  Tokens, Defs, Bool, Mode, CitedByParent, 
  LoadFile}