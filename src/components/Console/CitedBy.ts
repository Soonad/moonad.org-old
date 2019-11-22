import { h } from "inferno-hyperscript"
import { LoadFile, CitedByParent } from "../../assets/Constants";

export interface Props {
  parents: CitedByParent;
  load_file: LoadFile;
}

const CitedBy = ({parents, load_file }: Props) => {
  // console.log("Cited by!! Parents: "+parents.toString);
  if (parents.length > 0) {
    return h(
      "ul",
      { 
        desc: "Cited by component",
        style: {
          "padding": "0px"
        } },
        parents.map( (parent: string) =>
          h("li", { 
            style: {
              "list-style": "none",
              "text-decoration": "underline",
              "cursor": "pointer",
              "padding-top": "5px",
              "font-family": "monospace",
              "font-size": "12px"
            }, 
            onClick: () => load_file(parent) }, parent)
      )
    );
  } else {
    return h("div")
  }
}

export default CitedBy;