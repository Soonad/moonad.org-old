import { h } from "inferno-hyperscript"
import { CitedByParent, LoadFile } from "../../assets/Constants";
import ClickableList from "../ClickableList";

export interface Props {
  parents: CitedByParent;
  load_file: LoadFile;
}

const CitedBy = ({parents, load_file }: Props) => {
  return ClickableList(parents, load_file, "Cited by component");
}

export default CitedBy;