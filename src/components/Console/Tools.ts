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
    // console.log("Tools, file: "+props.file)
    // this.code = props.file.code;
    // this.file_name = props.file.file_name;
    // console.log("Receiving code on Tools. File_name: "+this.file_name);
  }

  componentDidMount(){
    this.code = this.props.file.code;
    this.file_name = this.props.file.file_name;

    if (this.code) {
      const file: LocalFile = {code: this.code, file_name: this.file_name};
      // this.saveLocalFile(file);
    } else {
      console.log("no code to save");
    }
    
  }

  saveLocalFile(file: LocalFile) {
    this.props.saveLocalFile(file);
    this.forceUpdate();
  }

  showLocalFiles(){
    let files = window.localStorage.getItem("saved_local");
    console.log("Show local files: ", files);
    if(files !== null) {
      var obj_files = JSON.parse(files);
      console.log(obj_files);
      return h("div", {descr: "code name", style: {
        "margin-top": "30px"
      }}, "I have files");
    } else {
      return h("div", {desc: "empty local file"});
    }
  }

  public render(){
    return this.showLocalFiles();
  };

}

export {Tools};