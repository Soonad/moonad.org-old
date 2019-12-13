
import {load_local_file, save_local_file, get_local_files} from "../components/Moonad"
import {LocalFile} from "../assets/Constants";



describe("Local files", () => {

  // var prompt = jest.fn();
  // Object.defineProperty(window, 'prompt', prompt);

  const globalAny:any = global;
  globalAny.prompt = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'prompt', {value: "teste"});
    const item0: LocalFile = {code: "import Base# main 'Hello, World!'", file_name: "item0"};
    // const res = save_local_file(item0);
    window.localStorage.setItem("saved_local", JSON.stringify([item0]));
    // console.log(res);
  })

  test("Can load a local file if it exists", () => {
    const res = load_local_file("item0");
    expect(res).toEqual({ code: "import Base# main 'Hello, World!'", file_name: 'item0' });
  });

  test("Should return null if a file doesn't exist", () => {
    const res = load_local_file("item");
    expect(res).toBeNull();
  });

  test("Can get all local files", () => {
    const item0: LocalFile = {code: "import Base# main 'Hello, World!'", file_name: "item0"};
    const item1: LocalFile = {code: "import Base# main 'Hello, World!'", file_name: "item1"};
    const new_files: LocalFile[] = [item0, item1];
    window.localStorage.setItem("saved_local", JSON.stringify(new_files));

    const res = get_local_files();
    expect(res).toBe([{code: "import Base# main 'Hello, World!'", file_name: "item0"},
    {code: "import Base# main 'Hello, World!'", file_name: "item1"} ]);

  })

  // test("It should create a new array if item doesn't exist", () => {

  // }, 5000);

})