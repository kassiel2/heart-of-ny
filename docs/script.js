let bounds = L.latLngBounds(
  [40.8821, -79.8127],
  [43.3267, -72.1127]
);

let map = L.map('map', {
  center: [42.1044, -75.9127],
  minZoom: 8,
  maxBounds: bounds,
  maxBoundsViscosity: 0.9,
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
  //const SERVER_ADDRESS = 'http://129.158.201.205:8080';

  try {
    // add tile layer to map
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 15,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    map.fitBounds(bounds);
    window.onresize = () => map.fitBounds(bounds);

    const [DB_COUNTIES, DB_SOCIETIES, COUNTIES_GEOJSON] = await Promise.all([
      fetch(`assets/all_counties.json`).then(res => res.json()),  // fetch the counties stored in Heart of NY database
      fetch(`assets/all_societies.json`).then(res => res.json()), // fetch the county societies stored in Heart of NY database
      fetch("assets/counties_ny.geojson").then(res => res.json())
    ]);

    console.log(DB_COUNTIES)
    // filter GeoJSON data to only include counties that are in the database
    const FILTERED_COUNTIES_GEOJSON = COUNTIES_GEOJSON.features.filter(
      (feature) => DB_COUNTIES.map((county) => county.county_name).includes(feature.properties.name)
    );

    // pre-fetch db lookups
    const countyMap = Object.fromEntries(DB_COUNTIES.map(c => [c.county_name, c]));
    const societyMap = Object.fromEntries(DB_SOCIETIES.map(s => [s.county_id, s]));

    const infoPanel = document.getElementById("info-container");
    const closeButton = document.getElementById("info-close");
    closeButton.onclick = () => hideInfo();

    function showInfo(name) {
      infoPanel.classList.remove("hidden");

      const county = countyMap[name];
      const society = societyMap[county.county_id];

      const infoName = document.getElementById("info-name");
      const infoSociety = document.getElementById("info-society");
      infoName.innerHTML = county.county_name;
      infoSociety.innerHTML = `<a href=${society.website} target="_blank" rel="noopener noreferrer">${society.society_name} </a>`;
    }

    function hideInfo() {
      infoPanel.classList.add("hidden");

      const infoName = document.getElementById("info-name");
      const infoSociety = document.getElementById("info-society");
      infoName.innerHTML = ""
      infoSociety.innerHTML = ""
    }

    map.on("click", hideInfo);

    function onEachFeature(feature, layer) {
      let name = L.tooltip({
        content: feature.properties.name,
        className: "label",
        direction: "center",
        opacity: 1
      });

      layer.bindTooltip(name);

      layer.on({
        mouseover: (e) => e.target.setStyle(hoveredStyle),
        mouseout: (e) => e.target.setStyle(overlayStyle),
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          showInfo(feature.properties.name);
        },
      });
    }

    // add county overlay layer
    L.geoJSON(FILTERED_COUNTIES_GEOJSON, {
      style: overlayStyle,
      onEachFeature: onEachFeature
    }).addTo(map);

    // add marker at TechWorks!
    L.marker([42.10442541105549, -75.91265528372267]).addTo(map).bindPopup('TechWorks!').openPopup();
  } catch (err) {
    console.error(err);
    alert("Failed to load county data. Please try again later.");
  }
}


main();
