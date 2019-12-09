import { Component } from "inferno";
import { LocalFile, LoadFile, LocalFileManager } from "../../assets/Constants"; 
import { h } from "inferno-hyperscript";
import ClickableList from "../ClickableList";

interface Props{
  manager: LocalFileManager
}

const Tools = ({file, saveLocalFile, loadLocalFile}: LocalFileManager) => {

  const showLocalFiles = () => {
    const files = window.localStorage.getItem("saved_local");

    if(files !== null) {
      const obj_files = JSON.parse(files);
      const file_names = obj_files.map( ({code, file_name}: LocalFile) => {return file_name;} );
      const clickable_list = ClickableList(file_names, loadLocalFile, "Local file");
      
      return h("div", {descr: "code name"}, clickable_list );

    } else { // There is no local files
      return h("div", {desc: "empty local file"}, "No local files. Try editing a code and then click the 'save' button.");
    }
  }

  return showLocalFiles();

}

export {Tools};