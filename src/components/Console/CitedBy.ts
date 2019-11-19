import { h } from "inferno-hyperscript"
import { LoadFile, CitedByParent } from "../../assets/Constants";

export interface Props {
  parents: CitedByParent;
  load_file: LoadFile;
}

const CitedBy = ({parents, load_file }: Props) => {
  console.log("Cited by!! Parents: "+parents);
  return h(
    "ul",
    { 
      className: "Cited by component",
      style: {
        "padding": "0px"
      } },
      parents.map( (parent: string) =>
        h("li", { 
          style: {
            "list-style": "none",
            "text-decoration": "underline",
            "cursor": "pointer"
          }, 
          onClick: () => load_file(parent) }, parent)
    )
  );
}

export default CitedBy;