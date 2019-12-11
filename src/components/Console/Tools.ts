import { Component } from "inferno";
import { h } from "inferno-hyperscript";
import { DisplayMode, LayoutConstants, LoadFile, LocalFile, LocalFileManager } from "../../assets/Constants"; 
import { ClickableList, ClickableListDeletion} from "../ClickableList";
import ToolsButton from "./ToolsButton";

interface Props{
  manager: LocalFileManager;
}

const icon_save = "../assets/icons/icon_save.png";

const Tools = ({file, save_local_file, load_local_file, delete_local_file}: LocalFileManager) => {

  const show_local_files = () => {
    const files = window.localStorage.getItem("saved_local");
    if(files && files !== "[]") {
      const obj_files = JSON.parse(files);
      const file_names = obj_files.map( ({code, file_name}: LocalFile) => file_name );
      const clickable_list = ClickableListDeletion(file_names, load_local_file, "Local file", delete_local_file);
      return h("div", {descr: "code name"}, clickable_list );
    }  // There are no local files
    return h("div", {desc: "empty local file"}, [ 
        h("span", "There are no local files."),
        h("p", "Try editing a code and then click the 'save' button.")
    ]);
  }

  return h("div", {
    style: {
      "display": "flex",
      "flex-direction": "row",
      "height": "180px",
      "overflow": "hidden"
    }
  }, [
    h("div", {
      desc: "Tools buttons div", 
      style: {
        // "background-color": LayoutConstants.medium_gray_color,
        "width": "150px",
        "margin-top": "-10px",
        "display": "flex",
        "align-items": "center",
        "flex-direction": "column",
        "justify-content": "flex-start",
        "overflow": "hidden"
      }
    }, h("div", {style: {"margin-top": "20px"}}, [
      h(ToolsButton, {icon: icon_save, title: "Save local", onClick: () => save_local_file(file.file_name)})
    ]) ),
    h("div", {
      desc: "Tools display view",
      style: {
        "margin-left": "10px",
        "margin-top": "5px",
        "flex-grow": 1,
      }
    }, show_local_files())
  ]);

}

export {Tools};