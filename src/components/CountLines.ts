import { h } from "inferno-hyperscript";
import { LayoutConstants } from "../assets/Constants";


const CountLines = (qtd_lines) => {
  
  var lines = []; 

  for (let i = 1; i <= qtd_lines; i++){
    lines.push(h("p", {style: {"height": "14px"}}, i ));
  }
  
  return h("div", {
    desc: "Count lines div",
    style: {
      "userinteract": "none",
      "color": LayoutConstants.medium_gray_color,
      "font-size": "10px",
      "width": "20px",
      "height": "100px"
    }, 
  }, lines);
}

export default CountLines;
