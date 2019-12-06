import { h } from "inferno-hyperscript";
import { LoadFile } from "../assets/Constants"

const ClickableList = (content: string[], onClick: LoadFile, desc: string = "list") => {
  if(content.length > 0) {
    return h(
      "ul", {desc: desc, style: {"padding": "0px"}},
        content.map( (element: string) =>
          h("li", { 
            style: {
              "list-style": "none",
              "text-decoration": "underline",
              "cursor": "pointer",
              "padding-top": "5px",
              "font-size": "10px"
            }, 
            onClick: () => onClick(element)}, element
          )
        )
    );
  } else {
    return h("div");
  }
}

export default ClickableList;