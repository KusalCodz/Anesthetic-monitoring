import React, { useRef, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function ZoomableLineChart({
  data,
  options = {},
  width = 3000,
  height = 500,
  minZoom = 0.2,
  maxZoom = 3,
}) {
  const [chartZoom, setChartZoom] = useState(1);
  const [chartHeight, setChartHeight] = useState(height);
  const containerRef = useRef();

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;
    let lastDist = null;
    let wheelTimeout = null;

    function handleWheel(e) {
      if (e.ctrlKey) {
        e.preventDefault();
        setChartZoom(z => {
          let next = z + (e.deltaY < 0 ? 0.1 : -0.1);
          next = Math.min(Math.max(next, minZoom), maxZoom);
          return Number(next.toFixed(2));
        });
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => { lastDist = null; }, 300);
      }
    }
    function getTouchDist(touches) {
      if (touches.length < 2) return null;
      const [a, b] = touches;
      return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
    }
    function handleTouchStart(e) {
      if (e.touches.length === 2) {
        lastDist = getTouchDist(e.touches);
      }
    }
    function handleTouchMove(e) {
      if (e.touches.length === 2 && lastDist != null) {
        const dist = getTouchDist(e.touches);
        if (!dist) return;
        if (Math.abs(dist - lastDist) > 7) {
          setChartZoom(z => {
            let next = z * (dist > lastDist ? 1.08 : 0.92);
            next = Math.min(Math.max(next, minZoom), maxZoom);
            return Number(next.toFixed(2));
          });
          lastDist = dist;
        }
        e.preventDefault();
      }
    }
    function handleTouchEnd(e) {
      if (e.touches.length < 2) lastDist = null;
    }

    ref.addEventListener("wheel", handleWheel, { passive: false });
    ref.addEventListener("touchstart", handleTouchStart, { passive: false });
    ref.addEventListener("touchmove", handleTouchMove, { passive: false });
    ref.addEventListener("touchend", handleTouchEnd);
    return () => {
      ref.removeEventListener("wheel", handleWheel, { passive: false });
      ref.removeEventListener("touchstart", handleTouchStart, { passive: false });
      ref.removeEventListener("touchmove", handleTouchMove, { passive: false });
      ref.removeEventListener("touchend", handleTouchEnd);
    };
  }, [minZoom, maxZoom]);

  return (
    <div
      ref={containerRef}
      className="zoomable-chart-container"
      style={{
        background: "#fff",
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        overflowX: "auto",
        touchAction: "pinch-zoom",
        userSelect: "none"
      }}
    >
      <div
        style={{
          width: `${width * chartZoom}px`,
          height: chartHeight,
          minWidth: 600,
          transition: "width 0.15s, height 0.15s"
        }}
      >
        <Line
          data={data}
          options={{ ...options, animation: false }}
          width={width * chartZoom}
          height={chartHeight}
        />
      </div>
      <div style={{margin:"8px 0 0 0", textAlign:"center"}}>
        <button type="button" onClick={() => setChartZoom(z => Math.max(minZoom, +(z-0.1).toFixed(2)))} style={{marginRight:8}}>−</button>
        <button type="button" onClick={() => setChartZoom(z => Math.min(maxZoom, +(z+0.1).toFixed(2)))} style={{marginRight:16}}>+</button>
        <span style={{fontSize:13, color:"#666"}}>Zoom: {(chartZoom*100).toFixed(0)}%</span>
        <button type="button" onClick={() => setChartHeight(h => Math.max(200, h-50))} style={{margin:"0 8px"}}>↓</button>
        <button type="button" onClick={() => setChartHeight(h => Math.min(1200, h+50))}>↑</button>
        <span style={{fontSize:13, color:"#666", marginLeft:6}}>Height: {chartHeight}px</span>
      </div>
    </div>
  );
}
