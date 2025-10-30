let map = L.map('map', {
  center: [42.1044, -75.9127],
  zoom: 8,
  minZoom: 8,
  maxBounds: L.latLngBounds([40.8821, -79.8127], [43.3267, -72.1127]),
  maxBoundsViscosity: 0.9
});

let overlayStyle = {
  "color": "#dcae25",
  "weight": 2,
  "opacity": 0.5,
  "fillColor": "#ffffff",
  "fillOpacity": 0
};

let hoveredStyle = {
  "color": "#ff0000",
  "weight": 2,
  "opacity": 0,
  "fillColor": "#dcae25",
  "fillOpacity": 1
};


async function main() {
  const SERVER_ADDRESS = "http://localhost:3000"

  const [DB_COUNTIES, DB_SOCIETIES, COUNTIES_GEOJSON] = await Promise.all([
    fetch(`${SERVER_ADDRESS}/api/counties`).then(res => res.json()),  // fetch the counties stored in Heart of NY database
    fetch(`${SERVER_ADDRESS}/api/societies`).then(res => res.json()), // fetch the county societies stored in Heart of NY database
    fetch("assets/counties_ny.geojson").then(res => res.json())
  ]);

  // filter GeoJSON data to only include counties that are in the database
  const FILTERED_COUNTIES_GEOJSON = COUNTIES_GEOJSON.features.filter(
    (feature) => DB_COUNTIES.map((county) => county.county_name).includes(feature.properties.name)
  );

  function onEachFeature(feature, layer) {
    let name = L.tooltip({
      content: feature.properties.name,
      className: "label",
      direction: "center",
      opacity: 1
    });

    layer.bindTooltip(name);

    function showInfo() {
      const container = document.getElementById("info-container");
      container.setAttribute("show", "true");

      const close = document.getElementById("info-close");
      close.onclick = () => hideInfo();

      const county = DB_COUNTIES.find((county) => county.county_name === feature.properties.name);
      const society = DB_SOCIETIES.find((society) => society.county_id === county.county_id);

      const infoName = document.getElementById("info-name");
      const infoSociety = document.getElementById("info-society");
      infoName.innerHTML = county.county_name;
      infoSociety.innerHTML = `<a href=${society.website}>${society.society_name}</a>`;
    }

    function hideInfo() {
      const container = document.getElementById("info-container");
      container.setAttribute("show", "false");
    }

    function onMouseOver(e) {
      e.target.setStyle(hoveredStyle);
    }

    function onMouseOut(e) {
      e.target.setStyle(overlayStyle);
    }

    function onMouseClick(layer) {
      showInfo(layer);
    }

    layer.on({
      mouseover: onMouseOver,
      mouseout: onMouseOut,
      click: onMouseClick
    });
  }

  // add tile layer to map
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // add county overlay layer
  L.geoJSON(FILTERED_COUNTIES_GEOJSON, {
    style: overlayStyle,
    onEachFeature: onEachFeature
  }).addTo(map);

  // add marker at TechWorks!
  L.marker([42.10442541105549, -75.91265528372267]).addTo(map).bindPopup('TechWorks!').openPopup();
}


main();
