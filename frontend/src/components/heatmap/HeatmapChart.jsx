import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getScoreColor } from '../../utils/constants'

function HeatmapChart({ cities, sector }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!cities || !cities.length || !chartRef.current) return

    // Simple grid-based visualization
    const width = 600
    const height = 400

    const svg = d3.select(chartRef.current)
      .html('')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('border', '1px solid rgba(255,255,255,0.05)')
      .style('border-radius', '8px')

    const cols = Math.ceil(Math.sqrt(cities.length * (width / height)))
    const rows = Math.ceil(cities.length / cols)
    const gridSizeX = width / cols
    const gridSizeY = height / rows

    // Create grid background
    svg.selectAll('rect')
      .data(cities)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % cols) * gridSizeX)
      .attr('y', (d, i) => Math.floor(i / cols) * gridSizeY)
      .attr('width', gridSizeX - 2)
      .attr('height', gridSizeY - 2)
      .attr('fill', d => getScoreColor(d.score || 50))
      .attr('opacity', 0.8)
      .attr('rx', 4)
      .on('mouseover', function(e, d) {
        d3.select(this)
          .attr('opacity', 1)
          .style('cursor', 'pointer')
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.8)
      })

    // Add city labels
    svg.selectAll('text')
      .data(cities)
      .enter()
      .append('text')
      .attr('x', (d, i) => ((i % cols) * gridSizeX) + gridSizeX / 2)
      .attr('y', (d, i) => (Math.floor(i / cols) * gridSizeY) + gridSizeY / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .text(d => d.name.substring(0, 3).toUpperCase())

  }, [cities])

  return <div ref={chartRef} className="heatmap-chart" style={{ width: '100%', height: '100%' }}></div>
}

export default HeatmapChart
