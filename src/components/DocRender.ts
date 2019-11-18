// Converts a `Doc` value from Formality to an Inferno element

import {h} from "inferno-hyperscript"
import Image from "./Image"

const read_string = value => {
  var str = "";
  (function go(value) {
    const case_nil = "";
    const case_cons = (head) => (tail) => {
      str += String.fromCharCode(head);
      go(tail);
    };
    value(case_nil)(case_cons);
  })(value);
  return str;
};

const DocRender = (doc) => {
  const case_txt = (value) => {
    return h("span", {}, read_string(value));
  };

  const case_num = (value) => {
    return h("span", {}, String(value));
  };

  const case_img = (size) => (data) => {
    return h(Image, {size, data}, []);
  };

  const case_box = (tag) => (props) => (child) => {
    var props_obj : any = {};
    var child_arr : any = [];

    // Builds tag
    var tag_str = read_string(tag);

    // Builds props
    (function go(props) {
      const case_nil = null;
      const case_cons = (head) => (tail) => {
        var key = read_string(head[0]);
        var val = read_string(head[1]);
        props_obj[key] = val;
        go(tail);
      };
      props(case_nil)(case_cons);
    })(props);

    // Builds child
    (function go(child) {
      const case_nil = null;
      const case_cons = (head) => (tail) => {
        child_arr.push(DocRender(head));
        go(tail);
      };
      child(case_nil)(case_cons);
    })(child);

    // Adds styles
    props_obj.style = {};
    if (props_obj.border) props_obj.style.border = props_obj.border;

    return h(tag_str, props_obj, child_arr);
  };
  return doc(case_txt)(case_num)(case_img)(case_box);
};

export default DocRender
