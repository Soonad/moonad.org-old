import { Component } from "inferno";
import { h } from "inferno-hyperscript"
import { ElementsId, ExecCommand, LayoutConstants } from "../../assets/Constants";

export interface Props {
  result_cmd : string[];
  file: string;
  exec_command : ExecCommand;
}

interface HistoryRow {is_command: boolean, info: string}
type History = HistoryRow[];

// TODO: 
// - add scroll after receiving a response from Formality
// - after pressing enter, continues to focus on input field
class Terminal extends Component<Props> {

  public is_editing = false;
  public command = "";
  public result_cmd: string[] = new Array<string>();
  public history: History = new Array<HistoryRow>();
  public scrollTo: any;

  constructor(props: Props) {
    super(props);
  }

  public onClick() {
    this.is_editing = true;
    this.forceUpdate();
  }

  public onInput(e: InputEvent) {
    const evt = e as InputEvent;
    if (this.is_editing && evt.target) {
      const ele = evt.target as HTMLInputElement;
      this.is_editing = true;
      this.command = ele.value;
    }
    this.forceUpdate();
  }

  // TODO: after pressing enter, the focus must continue on the input field
  public onKeyDown(e: KeyboardEvent) {
    // tslint:disable-next-line
    if (e.keyCode === 13 && this.is_editing) {
      this.is_editing = false;
      this.history.push( {is_command: true, info: this.command} )
      
      const input_field = document.getElementById(ElementsId.console_input_id);
      this.exec_command_result();
      this.forceUpdate();
    }
  }

  public async exec_command_result() {
    this.result_cmd = await this.props.exec_command(this.command);
    if (this.result_cmd !== undefined) {
      this.result_cmd.map( (result: string) => {
        this.history.push({is_command: false, info: result});
      } );
    }
    this.onHistoryUpdate();
    this.forceUpdate();
    
  }

  public onHistoryUpdate() {
    console.log("Trying to scroll. History lenght: "+this.history.length);
    if(document.getElementById("div_view_n_input")){
    //   console.log("element exists");
      // let scroll = document.getElementById("div_view_n_input"); 
      // scroll.scrollTop = 800;
      console.log(this.scrollTo);
    //   // scroll.scrollTo(ElementsId.console_input_id)
    // scroll.scrollTo(0, this.scrollTo.offsetTop)
    }
  }

  public render() {
    const onClick: () => void = () => this.onClick();
    const onKeydown = (e: KeyboardEvent) => this.onKeyDown(e);
    const onInput = (e: InputEvent) => this.onInput(e);

    const div_input = (is_editing: boolean, onClick: () => void) => {
      if (is_editing) {
        return h("input", {
          id: ElementsId.console_input_id,
          ref: scrollTo,
          style: {
            "type": "text",
            "border": "none",
            "background": "transparent",
            "outline": "none",
            "font-family": "monospace",
            "flex-grow": 1,
            "height": "20px",
            "padding-left": "5px",
            "padding-right": "5px",
          },
          onClick,
          onKeydown,
          onInput,
          autofocus: true,
        }, this.command); 
      } 
        return h("div", {
          style: {
            "color": LayoutConstants.dark_gray_color, 
            "user-select": "none",
            "margin-left": "5px",
            "flex-grow": 1,
          }, 
          onClick 
        }, h("div", {
          desc: "input placeholder",
          style: {
            "width": "6px", 
            "height": "10px",
            "margin-top": "5px",
            "background": LayoutConstants.dark_gray_color 
          }} )
        );
      
    };

    const div_view = (history: History) => {
      return h("div", {
        id: "console-terminal-view",
        desc: "Terminal view",
        style: {
          "padding-top": "5px",
          "flex-direction": "row-reverse",
          "overflow": "scroll"
        },
      }, [
          history.map( ({is_command, info}: HistoryRow) => {
            if (is_command) {
              return h("p", {}, [result_aux, info])
            } 
            return h("p", {}, info)
          },
          )
      ]);
    };

    return h("div", {
      id: "div_view_n_input",
      desc: "div_view + div_input",
      style: {
        "font-family": "monospace",
        "font-size": "10px",
        "padding-left": "20px",
        "padding-right": "20px",
        "justify-content": "flex-end",
        "flex-grow": 1,
        "margin-top": "25px"
      },
      // scrollTop: 800
    }, [ 
      div_view(this.history), 
      h("div", {
        desc: "Terminal input div",
        style: {
          "height": "18px",
          "padding-bottom": "5px",
          "display": "flex",
          "flex-direction": "row",
          "align-items": "center"
        },
      }, [
        result_aux,
        div_input(this.is_editing, onClick)
      ]),
    ]);
  
  }
}

const result_aux = h("span", {style: {
  "color": LayoutConstants.secondary_color, 
  "font-family": "monospace", 
  "font-size": "8px",
}}, "► ");

export default Terminal;