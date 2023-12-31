
mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
    container: 'show-map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({
    color: "#FF0000",
}).setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 15 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl())