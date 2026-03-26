import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { getScoreColor } from '../../utils/constants'

function HeatmapChart({ cities, sector }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!cities || !chartRef.current) return

    // Simple grid-based visualization for now
    // TODO: Implement D3.js GeoJSON map once geo-data is available
    const width = 1000
    const height = 600

    const svg = d3.select(chartRef.current)
      .html('')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid #e0e0e0')

    const gridSize = 50
    const rows = 6
    const cols = 8

    // Create grid background
    svg.selectAll('rect')
      .data(cities)
      .enter()
      .append('rect')
      .attr('x', (d, i) => (i % cols) * gridSize)
      .attr('y', (d, i) => Math.floor(i / cols) * gridSize)
      .attr('width', gridSize - 2)
      .attr('height', gridSize - 2)
      .attr('fill', d => getScoreColor(d.ecosystem_score || 50))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function(e, d) {
        d3.select(this)
          .attr('stroke-width', 3)
          .style('cursor', 'pointer')
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 2)
      })

    // Add city labels
    svg.selectAll('text')
      .data(cities)
      .enter()
      .append('text')
      .attr('x', (d, i) => ((i % cols) * gridSize) + gridSize / 2)
      .attr('y', (d, i) => (Math.floor(i / cols) * gridSize) + gridSize / 2)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#000')
      .text(d => d.name.substring(0, 3))

  }, [cities])

  return <div ref={chartRef} className="heatmap-chart"></div>
}

export default HeatmapChart
