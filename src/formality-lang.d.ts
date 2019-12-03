declare module "formality-lang" {
  import core, { Defs, Term } from "formality-lang/fm-core";
  import lang from "formality-lang/fm-lang";
  import net from "formality-lang/fm-net";
  import to_js from "formality-lang/fm-to-js";
  import to_net from "formality-lang/fm-to-net";
  import forall from "formality-lang/forall";

  export { Defs, core, lang, net, to_net, to_js, forall };
}

declare module "formality-lang/fm-core" {
  type VarTerm = ["Var", { index: number }, Memo];
  function Var(index: number): VarTerm;

  type TypTerm = ["Typ", {}, Memo];
  function Typ(): TypTerm;

  type TidTerm = ["Tid", { expr: Term }, Memo];
  function Tid(expr: Term): TidTerm;

  type AllTerm = [
    "All",
    { name: string; bind: Term; body: Term; eras: boolean },
    Memo
  ];
  function All(name: string, bind: Term, body: Term, eras: boolean): AllTerm;

  type LamTerm = [
    "Lam",
    { name: string; bind: Term; body: Term; eras: boolean },
    Memo
  ];
  function Lam(name: string, bind: Term, body: Term, eras: boolean): LamTerm;

  type AppTerm = ["App", { func: Term; argm: Term; eras: boolean }, Memo];
  function App(func: Term, argm: Term, eras: boolean): AppTerm;

  type BoxTerm = ["Box", { expr: Term }, Memo];
  function Box(expr: Term): BoxTerm;

  type PutTerm = ["Put", { expr: Term }, Memo];
  function Put(expr: Term): PutTerm;

  type TakTerm = ["Tak", { expr: Term }, Memo];
  function Tak(expr: Term): TakTerm;

  type DupTerm = ["Dup", { name: string; expr: Term; body: Term }, Memo];
  function Dup(name: string, expr: Term, body: Term): DupTerm;

  type WrdTerm = ["Wrd", {}, Memo];
  function Wrd(): WrdTerm;

  type NumTerm = ["Num", { numb: number }, Memo];
  function Num(numb: number): NumTerm;

  type Op1Term = ["Op1", { func: string; num0: Term; num1: Term }, Memo];
  function Op1(func: string, num0: Term, num1: Term): Op1Term;

  type Op2Term = ["Op2", { func: string; num0: Term; num1: Term }, Memo];
  function Op2(func: string, num0: Term, num1: Term): Op2Term;

  type IteTerm = ["Ite", { cond: Term; pair: Term }, Memo];
  function Ite(cond: Term, pair: Term): IteTerm;

  type CpyTerm = ["Cpy", { name: string; numb: Term; body: Term }, Memo];
  function Cpy(name: string, numb: Term, body: Term): CpyTerm;

  type SigTerm = [
    "Sig",
    { name: string; typ0: Term; typ1: Term; eras: number },
    Memo
  ];
  function Sig(name: string, typ0: Term, typ1: Term, eras: number): SigTerm;

  type ParTerm = ["Par", { val0: Term; val1: Term; eras: number }, Memo];
  function Par(val0: Term, val1: Term, eras: number): ParTerm;

  type FstTerm = ["Fst", { pair: Term; eras: number }, Memo];
  function Fst(pair: Term, eras: number): FstTerm;

  type SndTerm = ["Snd", { pair: Term; eras: number }, Memo];
  function Snd(pair: Term, eras: number): SndTerm;

  type PrjTerm = [
    "Prj",
    { nam0: string; nam1: string; pair: Term; body: Term; eras: number },
    Memo
  ];
  function Prj(
    nam0: string,
    nam1: string,
    pair: Term,
    body: Term,
    eras: number
  ): PrjTerm;

  type EqlTerm = ["Eql", { val0: Term; val1: Term }, Memo];
  function Eql(val0: Term, val1: Term): EqlTerm;

  type RflTerm = ["Rfl", { expr: Term }, Memo];
  function Rfl(expr: Term): RflTerm;

  type SymTerm = ["Sym", { prof: Term }, Memo];
  function Sym(prof: Term): SymTerm;

  type CngTerm = ["Cng", { func: Term; prof: Term }, Memo];
  function Cng(func: Term, prof: Term): CngTerm;

  type EtaTerm = ["Eta", { expr: Term }, Memo];
  function Eta(expr: Term): EtaTerm;

  type RwtTerm = [
    "Rwt",
    { name: string; type: Term; prof: Term; expr: Term },
    Memo
  ];
  function Rwt(name: string, type: Term, prof: Term, expr: Term): RwtTerm;

  type CstTerm = ["Cst", { prof: Term; val0: Term; val1: Term }, Memo];
  function Cst(prof: Term, val0: Term, val1: Term): CstTerm;

  type SlfTerm = ["Slf", { name: string; type: Term }, Memo];
  function Slf(name: string, type: Term): SlfTerm;

  type NewTerm = ["New", { type: Term; expr: Term }, Memo];
  function New(type: Term, expr: Term): NewTerm;

  type UseTerm = ["Use", { expr: Term }, Memo];
  function Use(expr: Term): UseTerm;

  type AnnTerm = ["Ann", { type: Term; expr: Term; done: boolean }, Memo];
  function Ann(): AnnTerm;

  type LogTerm = ["Log", { msge: Term; expr: Term }, Memo];
  function Log(msge: Term, expr: Term): LogTerm;

  type HolTerm = ["Hol", { name: string }, Memo];
  function Hol(name: string): HolTerm;

  type RefTerm = ["Ref", { name: string; eras?: boolean }, Memo];
  function Ref(name: string, eras?: boolean): RefTerm;

  type Term =
    | VarTerm
    | TypTerm
    | TidTerm
    | AllTerm
    | LamTerm
    | AppTerm
    | BoxTerm
    | PutTerm
    | TakTerm
    | DupTerm
    | WrdTerm
    | NumTerm
    | Op1Term
    | Op2Term
    | IteTerm
    | CpyTerm
    | SigTerm
    | ParTerm
    | FstTerm
    | SndTerm
    | PrjTerm
    | EqlTerm
    | RflTerm
    | SymTerm
    | CngTerm
    | EtaTerm
    | RwtTerm
    | CstTerm
    | SlfTerm
    | NewTerm
    | UseTerm
    | AnnTerm
    | LogTerm
    | HolTerm
    | RefTerm;

  // TODO: Type Context better
  type Context = any;

  interface Defs {
    [key: string]: Term;
  }

  function shift(term: Term, inc: number, depth: number): Term;
  function subst(term: Term, val: Term, depth: number): Term;
  function subst_many(term: Term, vals: Term[], depth: number): Term;
  function put_float_on_word(num: number): number;
  function get_float_on_word(num: number): number;

  interface NormOpts {
    unbox?: boolean;
    logging?: boolean;
    weak?: boolean;
  }

  function erase(term: Term): Term;
  function uses(term: Term, depth: number): number;

  type ShowFn = (term: Term, ctx: Context) => string;

  type NormFn = (term: Term, defs: Defs, opts: NormOpts) => Term;
  type EqualFn = (a: Term, b: Term, defs: Defs) => boolean;
  type BoxCheckFn = (term: Term, defs: Defs, ctx: Context) => void;

  type TypeCheckFn = (
    term: Term,
    expect: Term | null,
    defs: Defs,
    ctx?: Context,
    inside?: Term,
    debug?: boolean
  ) => Term;

  function norm(show: ShowFn): NormFn;
  function equal(show: ShowFn): EqualFn;
  function typecheck(show: ShowFn): TypeCheckFn;
  function boxcheck(show: ShowFn): BoxCheckFn;

  // TODO: type ctx_new, ctx_ext, ctx_get, ctx_str, ctx_names

  type Memo = boolean | string;
  type Opts = {weak: boolean, unbox: boolean, logging: boolean, eta: boolean}
}

declare module "formality-lang/fm-lang" {
  import {
    Defs,
    Term,
    Var,
    Typ,
    Tid,
    All,
    Lam,
    App,
    Box,
    Put,
    Tak,
    Dup,
    Wrd,
    Num,
    Op1,
    Op2,
    Ite,
    Cpy,
    Sig,
    Par,
    Fst,
    Snd,
    Prj,
    Eql,
    Rfl,
    Sym,
    Cng,
    Eta,
    Rwt,
    Cst,
    Slf,
    New,
    Use,
    Ann,
    Log,
    Hol,
    Ref,
    NormFn,
    BoxCheckFn,
    TypeCheckFn,
    Opts as OptsCore,
    equal,
    shift,
    subst,
    subst_many,
    erase,
  } from "formality-lang/fm-core";

  import { Loader } from "formality-lang/forall";

  type Tokens = Array<[string, [string, string]]>;

  interface Adt {
    adt_pram: [string, Term, boolean][];
    adt_indx: [string, Term, boolean][];
    adt_ctor: [string, [string, Term, boolean][], Term];
    adt_name: string;
  }

  interface OpenImports {
    [key: string]: true;
  }

  interface QualImports {
    [key: string]: string;
  }

  interface LocalImports {
    [key: string]: true;
  }

  interface Adts {
    [key: string]: Adt;
  }

  interface Unbx {
    [key: string]: { depth: number };
  }

  interface Parsed {
    defs: Defs;
    adts: Adts;
    unbx: Unbx;
    tokens?: Tokens;
    local_imports: LocalImports;
    qual_imports: QualImports;
    open_imports: OpenImports;
  }

  interface Reduce {
    term: Term,
    opts: OptsCore
  }

  interface Opts {
    file: string,
    loader?: Loader,
    tokenify: boolean
  }

  function parse(
    code: string,
    opts: Opts
    // > These props were removed due to a parse problem when
    // > using the function on Moonad.ts
    // file: string,
    // tokenify: boolean,
    // loader?: Loader,
    // root?: boolean,
    // loaded?: { [key: string]: Parsed }
  ): Promise<Parsed>;

  const norm: NormFn;
  const boxcheck: BoxCheckFn;
  const typecheck: TypeCheckFn;
  const version: string;

  type RenamerFn = (name: String, depth: number) => any;
  type Mode = "TYPE" | "DEBUG"| "REDUCE_DEBUG";
  type TypecheckMode = "REDUCE_DEBUG" | "REDUCE_NATIVE" | "REDUCE_OPTIMAL" | "TYPECHECK";
  function replace_refs(term: Term, renamer: RenamerFn): Term;

  function show(ast: Term, nams?: [], opts?: {}): string;
  function gen_name(n: number): string;

  function derive_adt_type(file: string, adt: Adt): Term;
  function derive_adt_ctor(file: string, adt: Adt, c: number): Term;

  function run(
    mode: TypecheckMode,
    term_name: string | Term,
    opts: any
  ): Term;

  function reduce(
    term: Term, 
    opts: OptsCore
  ): any;

  export {
    Var,
    Typ,
    All,
    Lam,
    App,
    Box,
    Put,
    Tak,
    Dup,
    Wrd,
    Num,
    Op1,
    Op2,
    Ite,
    Cpy,
    Sig,
    Par,
    Fst,
    Snd,
    Prj,
    Eql,
    Rfl,
    Sym,
    Cng,
    Eta,
    Rwt,
    Cst,
    Slf,
    New,
    Use,
    Ann,
    Log,
    Hol,
    Ref,
    Mode,
    TypecheckMode,
    Parsed,
    Reduce,
    shift,
    subst,
    subst_many,
    norm,
    erase,
    equal,
    boxcheck,
    typecheck,
    parse,
    gen_name,
    show,
    replace_refs,
    derive_adt_type,
    derive_adt_ctor,
    version,
    run,
    reduce
  };
}

declare module "formality-lang/forall" {
  function load_file_parents(path: string): Promise<string[]>;
  function save_file(name: string, code: string): Promise<string>;

  type Loader = (path: string) => Promise<string>;
  const load_file: Loader;
  const with_file_system_cache: (
    loader: Loader,
    cache_dir_path?: string
  ) => Loader;
  const with_local_files: (loader: Loader, local_dir_path?: string) => Loader;
  const with_local_storage_cache: (loader: Loader, prefix?: string) => Loader;

  export {
    Loader,
    load_file_parents,
    load_file,
    save_file,
    with_file_system_cache,
    with_local_files,
    with_local_storage_cache
  };
}

declare module "formality-lang/fm-net" {
  // TODO: Type better which numbers are what
  const Pointer: (addr: number, port: number) => number;
  const addr_of: (ptr: number) => number;
  const slot_of: (ptr: number) => number;
  const Numeric: (numb: number) => number;
  const numb_of: (numb: number) => number;
  const type_of: (ptrn: number) => number;

  // PtrNum types
  type PtrNumType = typeof PTR | typeof NUM;
  const PTR: 0;
  const NUM: 1;

  // Node types
  type NodeType = typeof NOD | typeof OP1 | typeof OP2 | typeof ITE;
  const NOD: 0;
  const OP1: 1;
  const OP2: 2;
  const ITE: 3;

  interface Stats {
    rewrites: number;
    loops: number;
    max_len: number;
  }

  interface Path {
    head: number;
    tail: Path | null;
  }

  class Net {
    alloc_node(type: NodeType, kind: number): number;
    free_node(addr: number): void;
    is_free(addr: number): boolean;
    is_numeric(addr: number, slot: number): boolean;
    set_port(addr: number, slot: number, ptrn: number): void;
    get_port(addr: number, slot: number): number;
    type_of(addr: number): number;
    set_type(addr: number, type: number): void;
    kind_of(addr: number): number;
    enter_port(ptrn: number): number;
    link_ports(a_ptrn: number, b_ptrn: number): void;
    unlink_port(ptrn: number): void;
    rewrite(a_addr: number): void;
    reduce_strict(stats: Stats): void;
    reduce_lazy(stats: Stats): void;
    denote(ptrn?: number, exit?: Path[]): string;
    to_string(): string;
  }

  export {
    Pointer,
    addr_of,
    slot_of,
    Numeric,
    numb_of,
    type_of,
    Net,
    NUM,
    PTR,
    NOD,
    OP1,
    OP2,
    ITE,
    // TypeScript Types
    Stats
  };
}

declare module "formality-lang/fm-to-net" {
  import { Net, Stats } from "formality-lang/fm-net";
  import { Defs, Term } from "formality-lang/fm-core";

  const compile: (term: Term, defs?: Defs) => Net;
  const decompile: (net: Net) => Term;
  const norm_with_stats: (
    term: Term,
    defs?: Defs,
    lazy?: boolean
  ) => { norm: Term; stats: Stats };
  const norm: (term: Term, defs?: Defs, lazy?: boolean) => Term;
}

declare module "formality-lang/fm-to-js" {
  import { Defs, Term } from "formality-lang/fm-core";
  type Lambda = (a: Lambda) => Lambda | number | [Lambda, Lambda];

  // Until TS recursive types hit mainstream, we have to type as any...
  type Vars = undefined | [number, any];

  const compile: (term: Term, defs: Defs, vars: Vars) => Lambda;
  const decompile: (func: Lambda) => Term;
}