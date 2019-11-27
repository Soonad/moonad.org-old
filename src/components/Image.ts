import {Component} from "inferno"
import {h} from "inferno-hyperscript"

function hash(nums: any) {
  let hash = 0;
  // tslint:disable-next-line
  for (let i = 0; i < nums.length; i++) {
    hash = ((hash<<5)-hash)+nums[i];
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const cache = {};

export default class Image extends Component {
  public size          = [0, 0];
  public data: any     = null;
  public hash: number  = 0;
  public image_u8: any = null;
  public canvas: HTMLCanvasElement;
  public context2d: CanvasRenderingContext2D | null  = null;
  public image_data: ImageData  | null  = null;
  public image_u32: Uint32Array | null  = null;

  constructor(props: any) {
    super(props);

    this.size = props.size;
    this.data = props.data;
    this.hash = hash(this.data);

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.size[0];
    this.canvas.height = this.size[1];
    this.context2d = this.canvas.getContext("2d");
    if (this.context2d !== null && this.context2d !== undefined) {
      this.image_data = this.context2d.getImageData(0, 0, this.size[0], this.size[1]);
      this.image_u8 = this.image_data.data.buffer;
    }
    this.image_u32 = new Uint32Array(this.image_u8);
  }

  public componentWillReceiveProps(props: any) {
    this.size = props.size;
    this.data = props.data;
    this.hash = hash(this.data);
  }

  public render() {
    if(this.image_u32 && this.image_data && this.context2d){
      for (let i = 0; i < this.image_u32.length; ++i) {
        this.image_u32[i] = this.data([i % this.size[0], Math.floor(i / this.size[0])]);
      }
      this.image_data.data.set(this.image_u8);
      this.context2d.putImageData(this.image_data, 0, 0);
    }

    return h("div", {
      key: String(this.hash),
      ref: (e: any) => {
        if (e) {
          e.appendChild(this.canvas);
        }
      }
    }, []);
  }
}
