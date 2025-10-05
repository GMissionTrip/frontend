"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import geoData from "@/assets/gangwon.json";
import "./styles.css";

interface GangwonMapProps {
  onRegionClick?: (regionName: string) => void;
  selectedRegion?: string;
}

export const GangwonMap: React.FC<GangwonMapProps> = ({ 
  onRegionClick,
  selectedRegion 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 350;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // @ts-ignore - d3 타입 이슈
    const projection = d3.geoMercator().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    // 기존 요소 제거
    svg.selectAll("*").remove();

    // 지역 그리기
    svg
      .selectAll("path")
      // @ts-ignore
      .data(geoData.features)
      .join("path")
      // @ts-ignore
      .attr("d", pathGenerator)
      .attr("class", (d: any) => {
        const name = d.properties.name || d.properties.SIG_KOR_NM;
        return `region ${selectedRegion === name ? 'selected' : ''}`;
      })
      .attr("fill", (d: any) => {
        const name = d.properties.name || d.properties.SIG_KOR_NM;
        return selectedRegion === name ? "var(--color-primary-500, #FF6B6B)" : "#E5E5E5";
      })
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 2)
      .on("click", function (event: any, d: any) {
        const name = d.properties.name || d.properties.SIG_KOR_NM;
        if (onRegionClick) {
          onRegionClick(name);
        }
      })
      .on("mouseover", function() {
        d3.select(this)
          .attr("opacity", 0.8)
          .style("cursor", "pointer");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("opacity", 1);
      });

    // 지역명 텍스트
    svg
      .selectAll("text")
      // @ts-ignore
      .data(geoData.features)
      .join("text")
      .text((d: any) => d.properties.name || d.properties.SIG_KOR_NM)
      // @ts-ignore
      .attr("x", (d: any) => pathGenerator.centroid(d)[0])
      // @ts-ignore
      .attr("y", (d: any) => pathGenerator.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "500")
      .attr("fill", (d: any) => {
        const name = d.properties.name || d.properties.SIG_KOR_NM;
        return selectedRegion === name ? "#FFFFFF" : "#666666";
      })
      .attr("pointer-events", "none");
  }, [onRegionClick, selectedRegion]);

  return (
    <div className="gangwon-map-container">
      <svg ref={svgRef} className="gangwon-map" />
    </div>
  );
};
