// Inisialisasi peta
let map = L.map('map').setView([-5.4, 105.2], 9); // Pusatkan peta di Lampung

// Tambahkan peta dasar menggunakan OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Tambahkan data rel dan stasiun dari GeoJSON
fetch('data/rel.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {color: 'blue'}; // Atur warna rute kereta
            }
        }).addTo(map);
    });

fetch('data/lampung.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    });

// Fungsi untuk mencari stasiun
function searchStation() {
    let input = document.getElementById('search-input').value.toLowerCase();

    fetch('data/rel.geojson')
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                if (feature.properties.nama.toLowerCase() === input) {
                    let coordinates = feature.geometry.coordinates.reverse(); // Karena Leaflet menggunakan format [lat, lng]
                    map.setView(coordinates, 12); // Zoom ke stasiun
                    L.popup()
                        .setLatLng(coordinates)
                        .setContent(feature.properties.nama)
                        .openOn(map);
                }
            });
        });
}
