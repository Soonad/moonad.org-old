import { h } from "inferno-hyperscript";
import { LoadFile } from "../assets/Constants"

const delete_icon = "../assets/icons/icon_delete.png";

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

const ClickableListDeletion = (content: string[], onClick: LoadFile, desc: string = "list", onDelete: (file_name: string) => any) => {
  
  const delete_btn = (item: string) => {
    return h("div", {descr: "delete icon", 
      style: {
        "width": "16px", 
        "cursor": "pointer",
        "margin-right": "10px"
      }, onClick: () => onDelete(item)}, [
        h("img", {
          "src": delete_icon,
          style: {
            "width": "16px",
            "height": "16px",
          }
        })
      ])
  }

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
            onClick: () => onClick(element)
            }, h("div", {style: {
              "display": "flex",
              "flex-direction": "row",
              "align-items": "center"
            }}, [
              delete_btn(element),
              h("span", element)
            ])
          )
        )
    );
  } else {
    return h("div");
  }
}

export { ClickableList, ClickableListDeletion };