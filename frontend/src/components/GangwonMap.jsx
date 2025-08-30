import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import geoData from "../assets/gangwon.json";
import "./GangwonMap.css";
export const GangwonMap = ({ onRegionClick }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 300;
    const height = 350;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    svg.selectAll("*").remove();
    svg
      .selectAll("path")
      .data(geoData.features)
      .join("path")
      .attr("d", pathGenerator)
      .attr("class", "region")
      .on("click", function (event, d) {
        const name = d.properties.name || d.properties.SIG_KOR_NM;
        onRegionClick(name);
      });
    svg
      .selectAll("text")
      .data(geoData.features)
      .join("text")
      .text((d) => d.properties.name || d.properties.SIG_KOR_NM)
      .attr("x", (d) => pathGenerator.centroid(d)[0])
      .attr("y", (d) => pathGenerator.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#000")
      .attr("pointer-events", "none");
  }, [onRegionClick]);

  return <svg ref={svgRef} className="gangwon-map" />;
};
