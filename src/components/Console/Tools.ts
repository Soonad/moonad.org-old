import { Component } from "inferno";
import { LocalFile, LoadFile, LocalFileManager, LayoutConstants, DisplayMode } from "../../assets/Constants"; 
import { h } from "inferno-hyperscript";
import { ClickableList, ClickableListDeletion} from "../ClickableList";
import ToolsButton from "./ToolsButton";

interface Props{
  manager: LocalFileManager;
}

const Tools = ({file, save_local_file, load_local_file, delete_local_file}: LocalFileManager) => {

  const show_local_files = () => {
    const files = window.localStorage.getItem("saved_local");
    if(files !== null) {
      const obj_files = JSON.parse(files);
      const file_names = obj_files.map( ({code, file_name}: LocalFile) => {return file_name;} );
      const clickable_list = ClickableListDeletion(file_names, load_local_file, "Local file", delete_local_file);    
      // const clickable_list = ClickableList(file_names, load_local_file, "Local file");
      return h("div", {descr: "code name"}, clickable_list );
    } else { // There are no local files
      return h("div", {desc: "empty local file"}, [ 
        h("span", "There are no local files."),
        h("p", "Try editing a code and then click the 'save' button.")
      ]);
    }
  }

  const example_file: LocalFile = {
    code: "hahaha code code code",
    file_name: "example1!"
  }

  return h("div", {
    style: {
      "display": "flex",
      "flex-direction": "row",
      "height": "180px",
    }
  }, [
    h("div", {
      desc: "Tools buttons div", 
      style: {
        "background-color": LayoutConstants.medium_gray_color,
        "width": "150px",
        "margin-top": "-10px",
        "flex-direction": "column",
        "justify-content": "center"
      }
    }, [
      h(ToolsButton, {icon: "", title: "Save local", onClick: () => save_local_file(example_file)}),
      h(ToolsButton, {icon: "", title: "Delete", onClick: () => delete_local_file("example2!")})
    ]),
    h("div", {
      desc: "Tools display view",
      style: {
        "margin-left": "10px",
        "flex-grow": 1
      }
    }, show_local_files())
  ]);

}

export {Tools};