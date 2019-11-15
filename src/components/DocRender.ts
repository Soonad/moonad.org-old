// Converts a `Doc` value from Formality to an Inferno element

import {h} from "inferno-hyperscript"

const DocRender = (doc) => {
  const case_text = (value) => {
    var str = "";
    (function go(value) {
      const case_nil = "";
      const case_cons = (head) => (tail) => {
        str += String.fromCharCode(head);
        go(tail);
      };
      value(case_nil)(case_cons);
    })(value);
    return h("span", {}, str);
  };
  const case_numb = (value) => {
    return h("span", {}, String(value));
  };
  const case_many = (value) => {
    var arr = [];
    (function go(value) {
      const case_nil = null;
      const case_cons = (head) => (tail) => {
        arr.push(h("div", {}, DocRender(head)));
        go(tail);
      };
      value(case_nil)(case_cons);
    })(value);
    return h("div", {}, arr);
  };
  return doc(case_text)(case_numb)(case_many);
};

export default DocRender
