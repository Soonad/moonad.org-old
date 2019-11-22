import { h } from "inferno-hyperscript"
import { LayoutConstants, ElementsId } from "../../assets/Constants";
import { Component } from "inferno";

export interface Props {
  result_cmd : Array<string>;
  file: string;
}

type HistoryRow = {is_command: boolean, info: string};
type History = Array<HistoryRow>;
// export interface History {
//   rows?: [HistoryRow];
// }

// - input field
//   - executar ação do Formality
// - display view
// - não vai carregar arquivo mas carrega uma ação do Moonad
class Terminal extends Component<Props> {

  is_editing = false;
  command = "";
  history: History = new Array<HistoryRow>();
  
  constructor(props: Props) {
    super(props);
    if (this.props.result_cmd !== []) {
      this.history = this.props.result_cmd.map( (info: string) => {return {is_command: false, info: info}} )
    } else {
      console.log("Termianl receiving empty answer")
    }
    
  }

  onClick() {
    this.is_editing = true;
    this.forceUpdate();
  }

  onInput(e) {
    const evt = e as InputEvent;
    if (this.is_editing && evt.target) {
      const ele = evt.target as HTMLInputElement;
      this.is_editing = true;
      this.command = ele.value;
    }
    this.forceUpdate();
  }

  onKeyDown(e) {
    if (e.keyCode === 13 && this.is_editing) {
      this.is_editing = false;
      this.history.push( {is_command: true, info: this.command} )
      var input_field = document.getElementById(ElementsId.console_input_id);
      // window.setTimeout(function () { 
        console.log("Input focus")
        // this.is_editing = true;
        input_field.focus();
      // }, 0);
      // // TEST ONLY
      // this.history.push({is_command: false, info: "0. that cool"});
      // this.history.push( {is_command: false, info: "1. wooow"});
    }
    this.forceUpdate();
  }

  render() {
    const onClick = () => this.onClick();
    const onKeydown = (e) => this.onKeyDown(e);
    const onInput = (e) => this.onInput(e);

    const div_input = (is_editing: boolean, onClick) => {
      if (is_editing) {
        return h("input", {
          id: ElementsId.console_input_id,
          style: {
            "type": "text",
            "border": "none",
            "background": "transparent",
            "outline": "none",
            "font-family": "monospace",
            "flex-grow": 1,
            "width": "90%",
          },
          onClick,
          onKeydown,
          onInput,
          autofocus: true,
        }, this.command); 
      } else {
        return h("span", {
          style: {
            "color": LayoutConstants.dark_gray_color, 
            "user-select": "none" 
          }, 
          onClick 
        }, "█")
      }
      
    };

    const div_view = (history: History) => {
      return h("div", {
        desc: "Terminal view",
        style: {
          "padding-top": "5px",
          "flex-direction": "row-reverse",
          "overflow": "scroll"
        }
      }, [
          history.map( ({is_command, info}: HistoryRow) => {
            if (is_command) {
              return h("p", {}, [result_aux, info])
            } 
            return h("p", {}, info)
          } )  
      ])
    };


    return h("div", {
      style: {
        "font-family": "monospace",
        "font-size": "10px",
        "padding-left": "20px",
        "padding-right": "20px",
        "justify-content": "flex-end",
        "flex-grow": 1,
      }
    }, [ 
      div_view(this.history), 
      h("div", {
        desc: "Terminal input div",
        style: {
          "height": "35px",
          "padding-bottom": "5px",
          // "padding-top": "5px",
        },
      }, [
        result_aux,
        div_input(this.is_editing, onClick)
      ])
    ]);
  
  }
}



const result_aux = h("span", {style: {"color": LayoutConstants.secondary_color}}, "► ");

export default Terminal;