import { Component } from "inferno";
import { LocalFile } from "../../assets/Constants"; 
import { h } from "inferno-hyperscript";

interface Props{
  file: LocalFile;
  saveLocalFile: (file: LocalFile) => void;
}

class Tools extends Component<Props> {

  code = "";
  file_name = "";

  constructor(props: Props){
    super(props);
    this.code = this.props.file.code;
    this.file_name = this.props.file.file_name;
    let local_files: string | null = window.localStorage.getItem("saved_local");
    console.log("[tools] local files: ", local_files);
    console.log("[tools] will mount code: "+ this.file_name);
    console.log("[tools] will mount props code: "+ this.props.file.code);
  }

  saveLocalFile(file?: LocalFile) {
    // this.props.saveLocalFile(file);
    const file3: LocalFile = {code: "this is my second code", file_name: "Third file"};
    this.saveLocalFile(file3);
    console.log("add new file ");
    this.forceUpdate();
  }

  showLocalFiles(){
    const files = window.localStorage.getItem("saved_local");
    console.log("[tools] files: ");
    console.log(files);
    if(files !== null) {
      // console.log(JSON.stringify(files));
      var obj_files = JSON.parse(files);
      console.log("parsed JSON: ", obj_files);
      if (obj_files.length > 1){
        return h("div", {descr: "code name", style: {
          "margin-top": "30px"
        }}, obj_files[0].file_name);
      } else {
        return h("div", {descr: "code name", style: {
          "margin-top": "30px"
        }}, obj_files.length);
      }
    } else {
      return h("div", {desc: "empty local file"}, "else case");
    }
    this.forceUpdate();
  }

  public render(){
    // console.log("[tools-render] file_name: "+ this.props.file.file_name);
    console.log("[tools - render] Is there any code? ", this.props.file.code? true : false);
    return this.showLocalFiles();
  };

}

export {Tools};