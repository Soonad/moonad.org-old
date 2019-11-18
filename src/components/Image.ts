import {Component} from "inferno"
import {h} from "inferno-hyperscript"

function hash(nums) {
  var hash = 0;
  for (var i = 0; i < nums.length; i++) {
    hash = ((hash<<5)-hash)+nums[i];
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

var cache = {};

export default class Image extends Component {
  size    = [0, 0];
  data    = null;
  hash    = 0;
  canvas  = null;
  context = null;

  constructor(props) {
    super(props);

    this.size = props.size;
    this.data = props.data;
    this.hash = hash(this.data);

    if (!cache[this.hash]) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.size[0];
      this.canvas.height = this.size[1];
      this.context = this.canvas.getContext("2d");

      var image_data = this.context.getImageData(0, 0, this.size[0], this.size[1]);
      var image_u8   = image_data.data.buffer;
      var image_u32  = new Uint32Array(image_u8);
      for (var i = 0; i < image_u32.length; ++i) {
        image_u32[i] = this.data([i % this.size[0], Math.floor(i / this.size[0])]);
      }
      image_data.data.set(image_u8);
      this.context.putImageData(image_data, 0, 0);
      //cache[this.hash] = {canvas: this.canvas};
    } else {
      this.canvas = cache[this.hash];
      this.context = this.canvas.getContext("2d");
    }
  }

  render() {
    return h("div", {
      ref: (e) => {
        if (e) {
          e.appendChild(this.canvas);
        }
      }
    }, []);
  }
}
