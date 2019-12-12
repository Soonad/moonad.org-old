// import fm from "formality-lang";
import { Defs } from "../assets/Constants";
import {BaseAppPath, load_file, load_file_parents, parse_file, reduce, type_check_term} from "../components/Moonad"

declare var require: any
const fm = require("formality-lang");

// Obs: in package.json, change "jest" -> "verbose": false to be able to
// console.log on the tests.
describe("Moonad", () => {

  let file: string;
  let code: string;

  beforeAll(async () => {
    file = "Base#"
    code = await load_file(file);
  });

  test("App name didn't change", () => {
    expect(BaseAppPath).toEqual("App#U2k7");
  }, 5000);

  test("Can load Base file v0.1.209", async () => {
    // This test does not accept white spaces
    const expectedResult = 
`import App#U2k7
import Bits#N.K4
import Bool#2GZZ
import DemoApp#VUOm
import Either#V9Yb
import Empty#qpku
import Equal#HPWi
import Function#3v.K
import List#shzw
import Map#G49r
import Maybe#rXzW
import Nat#n.D3
import Pair#g.Jv
import Parse#Joc1
import Sigma#Ofmh
import String#A3b_
import Subset#Sva9
import Unit#ZcZV
`;

    expect(code).toContain(expectedResult);
  }, 1000);

  test("Can parse a file ", async () => {
    const parsed = await parse_file(code, file, true);
    expect(parsed).not.toBeNull();
  }, 1000);

  test("Can load parents of a file", async () => {
    const file = "App#U2k7"
    const parents = await load_file_parents(file);
    expect(parents).toContain("DemoApp#VUOm");
  }, 1000);

});

describe("Type check term", () => {
  const file = "List#shzw"
  const term_name = "List#shzw/head";
  // let parsed: fm.lang.Parsed;  // allows to get "def" and "tokens"
  let parsed: any;
  let code: string;

  beforeAll(async () => {
    code = await load_file(file);
    parsed = await parse_file(code, file, true);
  });
  
  test("Can typecheck a term", async () => {
    const res = await type_check_term({term_name, expect: null, defs: parsed.defs});
    expect(fm.lang.show(res.type)).toEqual("(A : Type; x : A, xs : List(A)) -> A")
  });

  // test("Can normalize a term", async () => {
  //   let norm = null;
  //   let text = "";
  //   try {
  //     // norm = await type_check_term({term_name, expect: null, defs: parsed.defs, erased: true, unbox: true, logging: true}});
  //     // text = await fm.lang.show(norm.type, [], {full_refs: false});
  //   } catch(e) { }
  //   expect(text).toEqual("(x, xs) => xs(x, (xs.head, xs.tail) => xs.head)");
  // });

});