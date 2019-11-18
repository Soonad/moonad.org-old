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
  size       = [0, 0];
  data       = null;
  hash       = 0;
  canvas     = null;
  context2d  = null;
  image_data = null;
  image_u8   = null;
  image_u32  = null;

  constructor(props) {
    super(props);

    this.size = props.size;
    this.data = props.data;
    this.hash = hash(this.data);

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.size[0];
    this.canvas.height = this.size[1];
    this.context2d = this.canvas.getContext("2d");
    this.image_data = this.context2d.getImageData(0, 0, this.size[0], this.size[1]);
    this.image_u8 = this.image_data.data.buffer;
    this.image_u32 = new Uint32Array(this.image_u8);
  }

  componentWillReceiveProps(props) {
    this.size = props.size;
    this.data = props.data;
    this.hash = hash(this.data);
  }

  render() {

    for (var i = 0; i < this.image_u32.length; ++i) {
      this.image_u32[i] = this.data([i % this.size[0], Math.floor(i / this.size[0])]);
    }
    this.image_data.data.set(this.image_u8);
    this.context2d.putImageData(this.image_data, 0, 0);

    return h("div", {
      key: String(this.hash),
      ref: (e) => {
        if (e) {
          e.appendChild(this.canvas);
        }
      }
    }, []);
  }
}
