import { h } from "inferno-hyperscript"
import { LayoutConstants, LoadFile, Mode } from "../assets/Constants";
import Pathbar from "./Pathbar";
import TopMenuButton from "./TopMenuButton";

// Assets
// import logo from "../assets/moonad_logo.png";

export interface Props {
  mode: Mode;
  file: string;
  load_file: LoadFile;
  on_click_view: () => any;
  on_click_edit: () => any;
  on_click_play: () => any;
}

const TopMenu = ({mode, file, load_file, on_click_view, on_click_edit, on_click_play}: Props) => {
  return h("div", {
    style: {
      "background": LayoutConstants.primary_color,
      "min-height": "65px",
      "font-family": "monospace",
      "font-size": "16px",
      "display": "flex",
      "user-select": "none",
      "flex-flow": "row nowrap",
      "justify-content": "space-between"
    }
  }, [
    h("div", {
      style: {
        "width": "50%",
        "display": "flex",
        "flex-direction": "row"
      }
    }, [
        h("img", {
          style: {
            "width": "50px",
            "height": "40px",
            "margin-top": "18px",
            "margin-left": "10%",
            "cursor": "pointer"
          }, 
          src: new URL('https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?cs=srgb&dl=animal-animal-photography-cat-57416.jpg&fm=jpg'), 
          alt: "logo", 
          onClick: () => { load_file("Base#") } }),
        h(Pathbar, {load_file, path: file}),
       ]
    ),
    h("div", {className: "Buttons div", 
      style: {
        "width": "230px",
        "height": "100%", 
        "display": "flex",
        "flex-direction": "row",
        "justify-content": "space-between",
        "margin-right": "5%",
        "user-select": "none"
      }}, [
        h(TopMenuButton, {icon: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?cs=srgb&dl=animal-animal-photography-cat-57416.jpg&fm=jpg",
          title: "EDIT",
          onClick: () => on_click_edit(),
        }), 
        h(TopMenuButton, {icon: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?cs=srgb&dl=animal-animal-photography-cat-57416.jpg&fm=jpg",
          title: "CONSOLE",
          onClick: () => on_click_view(),
        }), 
        h(TopMenuButton, {icon: "https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?cs=srgb&dl=animal-animal-photography-cat-57416.jpg&fm=jpg",
          title: "PLAY",
          onClick: () => on_click_play(),
        }), 
      ]
    )
  ]);
};

export default TopMenu
