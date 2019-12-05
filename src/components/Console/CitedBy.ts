import { h } from "inferno-hyperscript"
import { CitedByParent, LoadFile } from "../../assets/Constants";
import ClickableList from "../ClickableList";

export interface Props {
  parents: CitedByParent;
  load_file: LoadFile;
}

const CitedBy = ({parents, load_file }: Props) => {
  const style = {
    "padding": "0px"
  }
  return ClickableList(parents, load_file, style, "Cited by component");
}

export default CitedBy;