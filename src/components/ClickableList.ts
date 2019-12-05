import { h } from "inferno-hyperscript";
import { LoadFile } from "../assets/Constants"

const ClickableList = (content: string[], onClick: LoadFile, style: any, desc: string = "list") => {
  if(content.length > 0) {
    return h(
      "ul", {desc: desc, style: style},
        content.map( (element: string) =>
          h("li", { 
            style: {
              "list-style": "none",
              "text-decoration": "underline",
              "cursor": "pointer",
              "padding-top": "5px",
            }, 
            onClick: () => onClick}, element
          )
        )
    );
  } else {
    return h("div");
  }
}

export default ClickableList;