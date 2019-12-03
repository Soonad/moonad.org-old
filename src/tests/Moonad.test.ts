import fm from "formality-lang";
import { Defs } from "../assets/Constants";
import {load_file, loader, normalize, type_check_term} from "../components/Moonad"

// Obs: in package.json, change "jest" -> "verbose": false to be able to
// console.log on the tests.
describe("Moonad", () => {

  let file: string;
  let code: string;

  beforeAll(async () => {
    file = "Base#"
    code = await load_file(file);
  });

  test("Can load Base file v0.1.200", async () => {
    // This test does not accept white spaces
    const expectedResult = 
`import And#hYci
import App#A_HX
import DemoApp#WyZs
import Bits#YpJx
import Bool#a.Ng
import Empty#qpku
import Equal#Gj.0
import Function#iZLd
import JSON#D6DK
import List#xoeT
import Map#51R5
import Maybe#wDJM
import Nat#JZ3T
import Or#U3qv
import Parse#x39s
import String#mn7K
import Unit#ZcZV
`;

    expect(code).toContain(expectedResult);
  });

  test("Can parse a file ", async () => {
    const parsed = await fm.lang.parse(code, {file, loader, tokenify: true});
    expect(parsed).not.toBeNull();
  }, 8000);

  // Not working!
  // test("Can normalize a term", async () => {
  //   jest.setTimeout(8000);
  //   const parsed = await fm.lang.parse(code, {file, loader, tokenify: true});
  //   const defs = parsed.defs;
  //   const tokens = parsed.tokens;
  //   // const norm = await normalize("Map#51R5/lookup", defs, {});
  //   const norm = await normalize("Base#", defs, {});

  //   console.log(parsed);
  //   console.log(">>>>>>> Norm");
  //   console.log(norm);
  // })

  test("Can load parents of a file", async () => {
    const file = "And#hYci"
    const parents = await fm.forall.load_file_parents(file);

    expect(parents).toContain("Base#13R0");
  });

});

describe("Type check term", () => {
  const file = "List#xoeT"
  const term_name = "List#xoeT/head";
  let parsed: fm.lang.Parsed;  // allows to get "def" and "tokens"
  let code: string;

  beforeAll(async () => {
    code = await load_file(file);
    parsed = await fm.lang.parse(code, {file, loader, tokenify: true});
  });
  
  test("Can typecheck a term", async () => {
    const res = await type_check_term({mode: "TYPECHECK", term_name, opts: {defs: parsed.defs} });
    expect(fm.lang.show(res.type)).toEqual("(A : Type; x : A, xs : List(A)) -> A")
  });

  test("Can normalize a term", async () => {
    let norm = null;
    let text = "";
    try {
      norm = await type_check_term({mode: "REDUCE_DEBUG", term_name, opts: {defs: parsed.defs, erased: true, unbox: true, logging: true}});
      text = await fm.lang.show(norm.type, [], {full_refs: false});
    } catch(e) { }
    expect(text).toEqual("(x, xs) => xs(x, (xs.head, xs.tail) => xs.head)");
  });

});