const React = require('react');
const d3 = require('d3');



const selectionColor = 'rgb(128, 191, 255,0.5)';
let x = 0; // define the Offset of the Triangle
let y = 0; // define the Offset of the Triangle
let lineHeight = 5;
let values = [];
let lineCount = 10;
let dataUp = {};

function triangle(parent) {
  this.svg = d3
    .select(parent.node())
    .append('svg')
    .attr('id', 'triangle_svg')
    .attr("width", (lineCount * lineHeight) * 0.5 + (lineHeight * 0.5))
    .attr("height", lineCount * lineHeight + y + lineHeight)

  this.svg
    .append('defs')
    .append('filter')
    .attr('id', 'hovershadow')
    .attr('x', -3)
    .attr('y', -3)
    .attr('width', '500%')
    .attr('height', '500%')
  d3.select('#hovershadow')
    .append('feOffset')
    .attr('result', 'offOut')
    .attr('in', 'SourceGraphic')
    .attr('dx', 3)
    .attr('dy', 3)
  d3.select('#hovershadow')
    .append('feColorMatrix')
    .attr('result', 'matrixOut')
    .attr('in', 'offOut')
    .attr('type', 'matrix')
    .attr('values', '0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.3 0')
  d3.select('#hovershadow')
    .append('feGaussianBlur')
    .attr('result', 'blurOut')
    .attr('in', 'matrixOut')
    .attr('stdDeviation', 2)
  d3.select('#hovershadow')
    .append('feBlend')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blurOut')
    .attr('mode', 'normal')

  this.svg.select('defs')
    .append('pattern')
    .attr('id', 'spinner')
    .attr('patternUnits', 'objectBoundingBox')
    .attr('width', 1)
    .attr('heigth', 1)
    .append('image')
    .attr('id', 'spinnerimage')
    // .attr('xlink:href','three-bar-loader4.gif')
    .attr('href', 'data:image/gif;base64,R0lGODlhkAGQAZECAPX19f///////wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMzZhNTdlMy1iNWE2LTRjYmUtYjM2My00MWU1MzkxYWM0NzIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTlDRDQ5QjY0QTY5MTFFOUFGNjQ4Q0Q5QzNEOTdBQ0EiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTlDRDQ5QjU0QTY5MTFFOUFGNjQ4Q0Q5QzNEOTdBQ0EiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpkNDQwODJlOS0xNDUxLTQ2ZmMtOTU2OC02ZjlkNWUxODk0YjAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmMzNiODRkNS1jMzU0LTg0NDUtODhkMC1hMmViMDVjYmY1N2EiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRm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')

  // .append('pattern')

  this.g = (id) => {
    d3.select('#triangle_svg').append('g')
      .attr("id", id)
      .classed('grp-element', true)
  }

  this.updateSquare = function (id, value) {

    if (value) {
      d3.select(`#sq-${id}`)
        .attr('fill', this.color(value))
        .attr('stroke', this.color(value))
        .attr('stroke-width', 0);
      d3.select(`#txt-${id}`).text(`${Math.round(value * 100)}%`);
    } else {
      // d3.select(`#txt-${id}`).text(`XXX%`);
      d3.select(`#sq-${id}`)
        .attr('fill', 'url(#spinner)')

      d3.select(`#spinnerimage`)
        .attr('x', 50 * (-9 / 50))
        .attr('y', 50 * (-10 / 50))
        .attr('width', 50 * (70 / 50))
        .attr('height', 50 * (70 / 50));
    }

  }

  this.square = (x, y, w, h, id = '', q = false, destinationId) => {

    id = (id !== '')
      ? id
      : Math.random().toString(36).substr(2, 9)

    const dest = (destinationId)
      ? d3.select(`#${destinationId}`).append('polygon')
      : this.svg.append('polygon');

    w = w * 0.5;
    h = h * 0.5;

    const qLines = (q)
      ? `${x},${y + (h * 2)} ${x},${y}`
      : `${x},${y + h}`;

    dest.attr("id", id)
      .attr("stroke", 'rgb(255,255,255,0)')
      .attr("fill", 'rgb(255,255,255,0.2)')
      .attr('points', `${x + w},${y} ${x + (w * 2)},${y + h} ${x + w},${y + (h * 2)} ${qLines}`)
      .classed(id.split('-')[0], true)
      .on("click", function (d, i) { selected(this.id); })
      .on("mouseenter", function (d, i) { onmouseenter(id); })
      .on("mouseleave", function (d, i) { onmouseleave(id); })
  }

  this.text = (x = this.props.x, y = this.props.y, size, id, txt, destinationId) => {

    const dest = (destinationId) ? d3.select(`#${destinationId}`).append('text') : this.svg.append('text');

    dest.attr('id', id)
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .attr('class', 'txt')
      .attr('style', `font: normal ${size}px sans-serif;`)
      .style('font', `normal ${size}px sans-serif`)
      .style('-webkit-user-select', 'none')
      .style('-moz-user-select', 'none')
      .style('-ms-user-select', 'none')
      .style('user-select', 'none')
      .text(txt);
    // .text(`${destinationId}`);
  }

  this.buildSquareset = (x = this.props.x, y = this.props.y, lines, height) => {

    this.g("grp-0-0");

    d3.select(`#grp-0-0`).append('polygon')
      .attr('fill', '#f6f6f6')
      .attr('id', 'sq-0-0')
      .attr('points', `${+x},${+y} ${+x},${+y + height} ${+x + height * 0.5},${+y + height} ${+x + height * 0.5},${y}`)
      .classed('sq', true);

    d3.select(`#grp-0-0`).append('polygon')
      .attr('id', 'sel-0-0')
      .attr('stroke', 'rgb(255,255,255,0)')
      .attr('fill', 'rgb(255,255,255,0)')
      .attr('points', `${+x},${+y} ${+x},${+y + height} ${+x + height * 0.5},${+y + height} ${+x + height * 0.5},${y}`)
      .classed('sel', true);

    for (var ii = 1; ii < lines; ii++) {

      let xs = 0;
      let ys = 0;

      for (var i = 0; i < lines - ii; i++) {

        const id = (ii === (ii + i)) ? `0-${i + ii}` : `${ii}-${i + ii}`;

        xs = +x + (i * height * 0.5);
        ys = +y + (i * +height * 0.5) + (+height * (ii - 1)) + +height;

        this.g(`grp-${id}`);
        this.square(xs, ys, height, height, `sq-${id}`, (i === 0), `grp-${id}`);
        this.updateSquare(id, null);

        let xst = xs + (height * 0.5);
        let yst = ys + (height * 0.59);
        const size = height * 0.25;
        // xst = ((ii) === i + ii) ? xst - (height * 0.1375) : xst; // xOffset erste Col
        xst = (i === 0) ? xst - (height * 0.1375) : xst; // xOffset erste Col

        this.text(xst, yst, size, `txt-${id}`, ``, `grp-${id}`);
        this.square(xs, ys, height, height, `sel-${id}`, (i === 0), `grp-${id}`);
      }
    }

    Object.keys(values).forEach((p) => {
      Object.keys(values[p]).forEach((c) => {
        this.updateSquare(`${p}-${c}`, values[p][c]);
      })
    })


  }

  this.color = d3.scaleLinear().domain([0, 0.30, 0.8, 1])
    .interpolate(d3.interpolateRgb)
    .range([d3.rgb("#f6f6f6"), d3.rgb('#eee'), d3.rgb('#b3ffb3'), d3.rgb('#00e600'),]);


  this.init = function (object) {

    lineCount = values.length;
    // console.log("lineCount: " + lineCount);

    this.svg
      .attr("width", (lineCount * object.lineHeight) * 0.5 + (+object.lineHeight * 0.5))
      .attr("height", lineCount * object.lineHeight + +object.y + +object.lineHeight)

    this.buildSquareset(x, y, lineCount, object.lineHeight);
  }


  this.updateAllSquares = (props) => {

    let values = props.values;

    Object.keys(values).forEach((p) => {
      Object.keys(values[p]).forEach((c) => {
        this.updateSquare(`${p}-${c}`, values[p][c]);
        // console.log(`update: ${p}-${c}`);
      })
    })

  }


} // triangle


function selected(tagid) {

  const id = tagid.split('-');

  dataUp({
    line1: id[1],
    line2: id[2]
  });

  //---------
  // Clear all selctions
  d3.selectAll('.sel')
    .attr('fill', 'rgb(255,255,255,0)')
    .attr("stroke-width", 0);
  d3.selectAll(`.txt`).style('font-weight', "normal");
  d3.selectAll(".grp-exeption-selection").remove()


  //---------
  if (+id[1] === 0) {
    d3.select(`#${tagid}`)
      .attr('stroke-width', 3)
      .attr('stroke', selectionColor)
      .attr('fill', selectionColor);

    d3.select(`#sel-0-0`)
      .attr('stroke-width', 3)
      .attr('stroke', selectionColor)
      .attr('fill', selectionColor);

    // alert('null');

    return;
  }

  //---------
  // show connection Line->Selection

  for (var ii = 1; ii <= id[2]; ii++) {
    d3.select(`#sel-${id[1]}-${ii}`)
      .attr('fill', selectionColor);
  }
  for (ii = lineCount; ii >= id[1]; ii--) {
    d3.select(`#sel-${ii}-${id[2]}`)
      .attr('fill', selectionColor);
  }
  d3.select(`#sel-0-${id[1]}`)
    .attr('fill', selectionColor);
  d3.select(`#sel-0-${id[2]}`)
    .attr('fill', selectionColor);

  //---------
  // Style of the Selection

  d3.select(`#${tagid}`)
    .attr('fill', 'rgb(255,255,255,0)')
    .attr('stroke-width', 3)
    .attr('stroke', selectionColor)
    ;

  d3.select(`#txt-${id[1]}-${id[2]}`)
    .style('font-weight', "bold")
    ;
}

function onmouseleave(tagid) {

  const id = tagid.split('-');
  const idSq = `#sq-${id[1]}-${id[2]}`;

  d3.select(`${idSq}`)
    .attr("stroke-width", 0)
    .attr("filter", 'none')
    ;
}

function onmouseenter(tagid) {

  const id = tagid.split('-');
  const idSq = `#sq-${id[1]}-${id[2]}`;

  // moveG(`${id[1]}-${id[2]}`);

  d3.select(`${idSq}`)
    .attr("stroke-width", 2)
    .attr("filter", 'url(#hovershadow)')
    ;

  d3.select(`#grp-${id[1]}-${id[2]}`)
    .moveToFront()
    ;

}


d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

class CorrelationTriangle extends React.Component {
  constructor(props) {
    super(props);

    x = props.x;
    y = props.y;
    values = props.values;
    lineHeight = props.lineHeight;

    dataUp = props.dataToParent;
  }

  componentDidMount() {
    this.svg = new triangle(d3.select(this.triangle));
    this.svg.init(this.props);
  }

  componentDidUpdate(nextProps) {
    // this.svg.plot(nextProps)
    // console.log(nextProps);
    // this.updateAllSquares(nextProps);
    this.svg.updateAllSquares(nextProps);
  }

  render() {
    return (
      <div
        ref={ref => {
          this.triangle = ref
        }}
      />
    )
  }
}

// EXPORT
export default CorrelationTriangle;
