// The bottom console of the site, with cited_by, output, tools, etc.

const h = require("inferno-hyperscript").h;

const Console = ({load_file, cited_by}) => {
  // Builds the cited_by links
  var links = [];
  if (cited_by) {
    for (var i = 0; i < cited_by.length; ++i) {
      let parent_file = cited_by[i];
      links.push(h("div", {
        "onClick": e => {
          load_file(parent_file);
        },
        "style": {
          "cursor": "pointer",
          "text-decoration": "underline"
        }
      }, parent_file));
    }
  }

  return h("div", {
    "style": {
      "padding": "8px",
      "border-left": "1px dashed gray",
      "background-color": "rgb(240,240,240)",
      "overflow-bottom": "scroll"
    }
  }, [
    h("div", {
      "style": {
        "font-weight": "bold"
      }
    }, "Cited by:"),
    links
  ]);
};

module.exports = Console;
