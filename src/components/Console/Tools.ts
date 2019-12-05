import { Component } from "inferno";
import { LocalFile, LoadFile, LocalFileManager } from "../../assets/Constants"; 
import { h } from "inferno-hyperscript";
import ClickableList from "../ClickableList";

interface Props{
  manager: LocalFileManager
}

class Tools extends Component<Props> {

  code = "";
  file_name = "";

  constructor(props: Props){
    super(props);
    // this.code = this.props.file.code;
    // this.file_name = this.props.file.file_name;
    let local_files: string | null = window.localStorage.getItem("saved_local");
    // console.log("[tools] local files: ", local_files);
    // console.log("[tools] will mount code: "+ this.file_name);
    console.log("[tools] mng: ");
    console.log(this.props.manager);
  }

  componentDidMount() {
    console.log("[tools] did mount: ");
    console.log(this.props.manager);
  }

  saveLocalFile(file?: LocalFile) {
    // this.props.saveLocalFile(file);
    // const file3: LocalFile = {code: "this is my second code", file_name: "Third file"};
    // this.saveLocalFile(file3);
    // console.log("add new file ");
    this.forceUpdate();

  }

  showLocalFiles(){
    const files = window.localStorage.getItem("saved_local");
    // console.log("[tools] files: ");
    // console.log(files);
    const style = {
      "font-size": "12px"
    }
    
    if(files !== null) {
      const obj_files = JSON.parse(files);
      const file_names = obj_files.map( ({code, file_name}: LocalFile) => {return file_name;} );
      // console.log(JSON.stringify(files));
      // const list = ClickableList(file_names, this.props.manager.loadLocalFile, style, "Cited by component");
      if (obj_files.length > 1){
        return h("div", {descr: "code name", style: {
          "margin-top": "30px"
        }}, "go project, run!");
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
    // const code = this.props.manager.file.code;
    // const file_name = this.props.manager.file.file_name;
    console.log("[tools-render] manager: "+ this.props.manager);
    // console.log("[tools - render] Is there any code? ", code? true : false);
    return this.showLocalFiles();
  };

}

export {Tools};