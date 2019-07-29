import React from 'react';
import d3 from 'd3';

const componentWidth = 320
const styles = {
  chart: {
    width: '' + componentWidth,
    height: '' + componentWidth,
  },
  histogram: {
    fill: '#40C4FF',
  },
  donut: {
    ok: { fill: '#64FFDA' },
    warning: { fill: '#FF4081' },
    backgroundArc: { fill: '#E5E4E4' },
  },
  spot: {
    big: { fill: 'black' },
    small: { fill: 'white' },
  },
  text: {
    fontSize: '61px',
    // fontFamily: 'Verdana',
    // fill: 'black'
  },
}

function statusDonut(parent) {
  this.margin = {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  }
  this.width = styles.chart.width - this.margin.left - this.margin.right
  this.height = styles.chart.height - this.margin.top - this.margin.bottom

  this.donutWidth = componentWidth / 20
  this.histogramHeight = this.height / 3
  this.padding = 2

  this.svg = d3
    .select(parent.node())
    .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)

  this.svg
    .append('defs')
    .append('clipPath')
    .attr('id', 'circle')
    .append('circle')
    .attr('cx', this.width / 2)
    .attr('cy', this.height / 2)
    .attr('r', this.width / 2 - this.donutWidth)

  this.svg
    .append('g')
    .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
    .append('g')
    .attr('id', 'histo')
    .attr('clip-path', 'url(#circle)')

  this.svg
    .select('g')
    .append('g')
    .attr('id', 'donut')
    .attr('transform', `translate(${this.width / 2},${this.height / 2})`)

  this.arc = d3
    .arc()
    .innerRadius(this.width / 2 - this.donutWidth)
    .outerRadius(this.width / 2)

  this.svg
    .select('#donut')
    .append('path')
    .attr('d', this.arc({ startAngle: 0, endAngle: Math.PI * 2 }))
    .style('fill', d => styles.donut.backgroundArc.fill)

  this.init = function(object) {
    const circles = [
      { r: this.donutWidth * 0.75, color: styles.spot.big.fill },
      { r: this.donutWidth * 0.2, color: styles.spot.small.fill },
    ]

    const domain = d3.extent(object.data, d => d.value)
    const [min, max] = domain
    // Maximum number of bars should be 8;
    const bars = object.data.length
    const threshold = (max - min) / bars
    const thresholds = Array.apply(null, { length: bars }).map((i, key) => {
      return min + threshold * key
    })

    this.histogram = d3
      .histogram()
      // .domain([0, 1])
      .domain(domain)
      .thresholds(thresholds)
      .value(d => d.value)

    this.histVals = this.histogram(object.data)

    this.scaleX = d3.scaleLinear()

    this.scaleX
      // .domain([0, 1])
      .domain(d3.extent(object.data, d => d.value))
      .range([this.donutWidth, this.width - this.donutWidth])
      .ticks(20)

    this.scaleY = d3
      .scaleLinear()
      .range([0, this.histogramHeight])
      .domain([0, d3.max(this.histVals.map(d => d.length))])

    this.bars = this.svg
      .select('#histo')
      .selectAll('.bar')
      .data(this.histVals)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('x', d => this.scaleX(d.x0) + 0.5)
      .attr('y', d => this.height - this.donutWidth - this.scaleY(d.length))
      // .attr('width', d => this.scaleX(d.x1) - this.scaleX(d.x0) - 1)
      .attr('width', d => (this.scaleX(d.x1) - this.scaleX(d.x0)) * 0.9)
      .attr('height', d => this.scaleY(d.length))
      .style('fill', styles.histogram.fill)

    this.donutArc = this.svg
      .select('#donut')
      .append('path')
      .attr(
        'd',
        this.arc({
          startAngle: 0,
          endAngle: this.donutScale(object.level / 100) * Math.PI * 2,
        })
      )
      .style(
        'fill',
        object.warning ? styles.donut.warning.fill : styles.donut.ok.fill
      )

    this.spot = this.svg
      .select('#donut')
      .append('g')
      .attr('transform', `rotate(${this.donutScale(object.level / 100) * 360})`)

    this.spot
      .selectAll('circle')
      .data(circles)
      .enter()
      .append('circle')
      .attr('cy', -this.height / 2 + this.donutWidth / 2)
      .attr('r', d => d.r)
      .style('fill', d => d.color)

    this.text = this.svg
      .select('#donut')
      .append('text')
      .text(`${Math.max(Math.round(object.level), 0)} %`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', styles.text.fontSize)
      .style('font-family', styles.text.fontFamily)
      .style('fill', styles.text.fill)
  }

  this.donutScale = function(x) {
    return x < 1
      ? x > 0
        ? 14.881 * Math.pow(x, 5) -
          37.202 * Math.pow(x, 4) +
          35.268 * Math.pow(x, 3) -
          15.699 * Math.pow(x, 2) +
          3.753 * Math.pow(x, 1)
        : 0
      : 1
  }

  this.plot = object => {
    this.donutArc
      .transition() // no real transition for arc, only delay
      .duration(250)
      .on('end', () => {
        // because d3 has bug with arc transition
        this.donutArc
          .style(
            'fill',
            object.warning ? styles.donut.warning.fill : styles.donut.ok.fill
          )
          .attr(
            'd',
            this.arc({
              startAngle: 0,
              endAngle: this.donutScale(object.level / 100) * Math.PI * 2,
            })
          )
      })

    this.histVals = this.histogram(object.data)

    this.scaleY.domain([0, d3.max(this.histVals.map(d => d.length))])

    this.bars
      .data(this.histVals)
      .transition()
      .duration(500)
      .attr('y', d => this.height - this.donutWidth - this.scaleY(d.length))
      .attr('height', d => this.scaleY(d.length))

    this.svg
      .select('#histo')
      .selectAll('.bar')
      .exit()
      .remove()

    this.spot
      .transition()
      .duration(500)
      .attr('transform', `rotate(${this.donutScale(object.level / 100) * 360})`)

    this.spot
      .selectAll('circle')
      .transition()
      .duration(300)
      // .attr('r', d => d.r * 1.05)
      .attr('r', d => d.r * 1.2)
      .transition()
      .duration(100)
      // .attr('r', d => d.r * 0.95)
      .attr('r', d => d.r * 0.8)
      .transition()
      .duration(100)
      .attr('r', d => d.r)

    this.text.text(`${Math.max(Math.round(object.level), 0)} %`)
  }
}

class HistogramDonut extends React.Component {
  componentDidMount() {
    this.parent = d3.select(this.chart)
    this.svg = new statusDonut(this.parent)

    this.svg.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.svg.plot(nextProps)
  }

  render() {
    return (
      <div
        ref={ref => {
          this.chart = ref
        }}
      />
    )
  }
}

// EXPORT
export default HistogramDonut;
