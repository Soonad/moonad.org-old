import { Defs } from "../assets/Constants";
import {compile} from "../components/CodePlayer";
import {can_run_app, load_file_test, parse_file_test} from "../components/Moonad";

// Obs: in package.json, change "jest" -> "verbose": false to be able to
// console.log on the tests.
describe("CodePlayer", () => {

  test("An application importing App can be runned", async () => {
    const file_name = "DemoApp#g_fl";
    const code: string = await load_file_test(file_name);
    const parsed_file: any = await parse_file_test(code, file_name, true);

    expect(can_run_app(parsed_file.defs, file_name)).toBeTruthy();
  }, 8000);

  // TODO: use the code from CodePlayer? 
  test("An App can run", async () => {
    const file_name = "DemoApp#g_fl";
    const code: string = await load_file_test(file_name);
    const defs: Defs = await parse_file_test(code, file_name, true);

    let res = null;
    if(can_run_app(defs, file_name)){
      res = compile({defs, file: file_name});
      console.log(res);
    }
    expect(res).not.toBeNull();
  }, 8000);

});