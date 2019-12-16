
import {LocalFile} from "../assets/Constants";
import {delete_local_file, get_local_files, load_local_file, save_local_file } from "../components/Moonad"



describe("Local files", () => {

  const globalAny:any = global;
  globalAny.prompt = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'prompt', {value: "teste"});
  })

  beforeAll(() => {
    const item0: LocalFile = {code: "import Base# main 'Hello, World!'", file_name: "item0"};
    const item1: LocalFile = {code: "import Base# main 'Hello, World!'", file_name: "item1"};
    const new_files: LocalFile[] = [item0, item1];
    window.localStorage.setItem("saved_local", JSON.stringify(new_files));
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
    const res = get_local_files();
    if (res) {
      const aux = JSON.parse(res);
      expect(aux).toEqual([{code: "import Base# main 'Hello, World!'", file_name: "item0"},
      {code: "import Base# main 'Hello, World!'", file_name: "item1"}]);
    }
    expect(res).not.toBeNull();
  });

  test("Can delete a local file", () => {
    const res = delete_local_file("item0");
    expect(res).toBeTruthy();
  });

  test("Cannot delete a local file that don't exist", () => {
    const res = delete_local_file("itemmm");
    expect(res).toBeFalsy();
  });

  test("Can save local file", () => {
    const item2: LocalFile = {code: "import Base# main 'Hello, World!'", file_name: "item2"};
    const input = () =>"item2"; // simulate an input function
    const res = save_local_file(item2, input);

    expect(res).toEqual(item2);
  });

  test("Can update an existing file", () => {
    const item1: LocalFile = {code: "import Base# main 'Greetings, Starfleet! I'm commander Riker, the Number One'", file_name: "item1"};
    const res = save_local_file(item1);

    expect(res).toEqual(item1);
  });


})