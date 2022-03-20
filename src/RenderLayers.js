import {
  HexagonLayer,
  TileLayer,
  BitmapLayer,
  ArcLayer,
  CPUGridLayer,
  ColumnLayer,
  GeoJsonLayer,
  PointCloudLayer,
  S2Layer,
  IconLayer,
  PolygonLayer,
  COORDINATE_SYSTEM,
} from "deck.gl";

const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

export function renderLayers(props) {
  const { data } = props;

  const tileLayer = new TileLayer({
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",

    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });

  const layers = [
    new HexagonLayer({
      id: "hexagon-layer",
      data,
      colorRange,
      radius: 1000,
      extruded: true,
      elevationScale: 40,
      elevationRange: [0, 3000],
      getPosition: (d) => d.position,
    }),
    new ArcLayer({
      id: "ArcLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json",
      getSourceColor: (d) => [Math.sqrt(d.inbound), 140, 0],
      getSourcePosition: (d) => d.from.coordinates,
      getTargetColor: (d) => [Math.sqrt(d.outbound), 140, 0],
      getTargetPosition: (d) => d.to.coordinates,
      getWidth: 12,
      pickable: true,
    }),
    new ColumnLayer({
      id: "ColumnLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/hexagons.json",
      diskResolution: 12,
      elevationScale: 100,
      extruded: true,
      getElevation: (d) => d.value * 50,
      getFillColor: (d) => [48, 128, d.value * 255, 255],
      getLineColor: [0, 0, 0],
      getLineWidth: 20,
      getPosition: (d) => d.centroid,
      radius: 250,
      pickable: true,
    }),
    new CPUGridLayer({
      id: "CPUGridLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-bike-parking.json",
      cellSize: 200,
      elevationScale: 4,
      extruded: true,
      getPosition: (d) => d.COORDINATES,
      pickable: true,
    }),
    new GeoJsonLayer({
      id: "GeoJsonLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json",
      extruded: true,
      filled: true,
      getElevation: 30,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (f) => {
        const hex = f.properties.color;
        return hex
          ? hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16))
          : [0, 0, 0];
      },
      getLineWidth: 380,
      getPointRadius: 8,
      getText: (f) => f.properties.name,
      getTextSize: 12,
      lineWidthMinPixels: 2,
      pointRadiusUnits: "pixels",
      pointType: "circle+text",
      stroked: false,
      pickable: true,
    }),
    new PointCloudLayer({
      id: "PointCloudLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/pointcloud.json",
      getColor: (d) => d.color,
      getNormal: (d) => d.normal,
      getPosition: (d) => d.position,
      pointSize: 2,
      coordinateOrigin: [-122.4, 37.74],
      coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
      pickable: false,
    }),
    new PolygonLayer({
      id: "PolygonLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json",
      extruded: true,
      filled: true,
      getElevation: (d) => d.population / d.area / 10,
      getFillColor: (d) => [d.population / d.area / 60, 140, 0],
      getLineColor: [80, 80, 80],
      getLineWidth: (d) => 1,
      getPolygon: (d) => d.contour,
      lineWidthMinPixels: 1,
      stroked: true,
      wireframe: true,
      pickable: true,
    }),
    new IconLayer({
      id: "IconLayer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json",
      getColor: (d) => [Math.sqrt(d.exits), 140, 0],
      getIcon: (d) => "marker",
      getPosition: (d) => d.coordinates,
      getSize: (d) => 5,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping: {
        marker: {
          x: 0,
          y: 0,
          width: 128,
          height: 128,
          anchorY: 128,
          mask: true,
        },
      },
      sizeScale: 8,
      pickable: true,
    }),
    new S2Layer({
      id: "S2Layer",
      data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.s2cells.json",
      getS2Token: (d) => d.token,
      elevationScale: 1000,
      extruded: true,
      filled: true,
      getElevation: (d) => d.value,
      getFillColor: (d) => [
        d.value * 255,
        (1 - d.value) * 255,
        (1 - d.value) * 128,
      ],
      wireframe: false,
      pickable: true,
    }),
  ];

  return [tileLayer, layers];
}
