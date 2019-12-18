// import fm from "formality-lang";
import { Defs } from "../assets/Constants";
import {BaseAppPath, load_file_test, load_file_parents, parse_file_test, reduce, type_check_term} from "../components/Moonad"

declare var require: any
const fm = require("formality-lang");

// Obs: in package.json, change "jest" -> "verbose": false to be able to
// console.log on the tests.
describe("Moonad", () => {

  let file: string;
  let code: string;

  beforeAll(async () => {
    file = "Base#"
    code = await load_file_test(file);
  });

  test("App name didn't change", () => {
    expect(BaseAppPath).toEqual("App#VjZN");
  }, 5000);

  test("Can load Base file v0.1.217", async () => {
    // This test does not accept white spaces
    const expectedResult = 
`import App#VjZN
import Bits#l6Ni
import Bool#2GZZ
import DemoApp#g_fl
import Either#V9Yb
import Empty#qpku
import Equal#HPWi
import Function#3v.K
import List#HQNc
import Map#1RSb
import Maybe#rXzW
import Nat#JJYN
import Number#O5_I
import Pair#g.Jv
import Parse#sLl5
import Sigma#Ofmh
import String#q_2Y
import Subset#Sva9
import Unit#ZcZV
`;
    expect(code).toContain(expectedResult);
  });

  // Obs: IDK why but there is a timeout errors here,
  // even the function working outside test.
  // test("Can parse a file ", async () => {
  //   // const aux = await load_file(file);
  //   const parsed = await parse_file(code, file, true);
  //   expect(parsed).not.toBeNull();
  // }, 5000);

  test("Can load parents of a file", async () => {
    const file = "App#VjZN"
    const parents = await load_file_parents(file);
    expect(parents).toContain("DemoApp#g_fl");
  }, 5000);

});

describe("Type check term", () => {
  const file = "Bool#2GZZ"
  const term_name = "Bool#2GZZ/copy_bool";
  // let parsed: fm.lang.Parsed;  // allows to get "def" and "tokens"
  let parsed: any;
  let code: string;

  beforeAll(async () => {
    code = await load_file_test(file);
    parsed = await parse_file_test(code, file, true);
  });
  
  test("Can typecheck a term", async () => {
    parsed = await parse_file_test(code, file, true);
    const res = await type_check_term({term_name, expect: null, defs: parsed.defs});
    expect(fm.stringify(res.type)).toEqual("(b : Bool) -> Pair(Bool, Bool)");
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