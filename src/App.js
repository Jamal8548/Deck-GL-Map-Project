import React, { useEffect, useState } from "react";
import DeckGL, { MapController } from "deck.gl";
import { renderLayers } from "./RenderLayers";
import { csv } from "d3-fetch";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMaximize,
  faSquareMinus,
  faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import toggleFullscreen, {
  fullscreenChange,
  isFullscreen,
} from "toggle-fullscreen";
const DATA_URL = "./heatmap-data.csv";

const App = () => {
  const [data, setData] = useState({});

  //loadfdata
  useEffect(() => {
    const fetchData = async () => {
      const result = await csv(DATA_URL);
      const points = result.map(function (d) {
        return { position: [+d.lng, +d.lat] };
      });
      setData(points);
    };

    fetchData();
  }, []);

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    longitude: -3.2943888952729092,
    latitude: 53.63605986631115,
    zoom: 6,
    maxZoom: 16,
    pitch: 65,
    bearing: 0,
  });

  //resize
  useEffect(() => {
    const handleResize = () => {
      setViewport((v) => {
        return {
          ...v,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  function experiments() {
    const mapi = document.getElementById("root");

    toggleFullscreen(mapi)
      .then(() => {
        return fullscreenChange(() => {
          const isFullScreen = isFullscreen();
          if (isFullScreen) {
            mapi.addEventListener("click", () => {});
          } else {
          }
        });
      })
      .then(() => {
        console.log("successed!");
      })
      .catch(() => {
        console.log("failed!");
      });
  }
  function zoomIn() {
    setViewport({ ...viewport, zoom: viewport.zoom + 0.3 });
  }
  function zoomOut() {
    setViewport({ ...viewport, zoom: viewport.zoom - 0.3 });
  }
  return (
    <div className="App">
      <DeckGL
        layers={renderLayers({
          data: data,
        })}
        controller={{ type: MapController, dragRotate: false }}
        initialViewState={viewport}
      />
      <div className="attribution">
        <a
          href="http://www.openstreetmap.org/about/"
          target="_blank"
          rel="noopener noreferrer"
        >
          © OpenStreetMap
        </a>
      </div>
      <div
        className="button-group "
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginRight: "20px",
        }}
      >
        <div
          className="ein"
          onClick={zoomIn}
          style={{
            margin: 40,
            position: "absolute",
            zIndex: 1,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon size="2x" icon={faSquarePlus} />
        </div>
        <div
          className=" bt-two"
          onClick={zoomOut}
          style={{
            margin: 40,
            marginTop: 69,
            position: "absolute",
            zIndex: 1,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon size="2x" icon={faSquareMinus} />
        </div>
        <div
          className=" bt-three"
          onClick={() => experiments()}
          style={{
            margin: 40,
            marginTop: 98,
            position: "absolute",
            zIndex: 1,
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon size="2x" icon={faMaximize} />
        </div>
      </div>
      <footer>
        <p>By &copy; 2022-JAMAL ASHRAF.</p>
      </footer>
    </div>
  );
};

export default App;

