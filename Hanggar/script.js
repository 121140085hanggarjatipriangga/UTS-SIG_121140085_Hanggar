var map = L.map('map').setView([-4.8404177,104.92896], 8.5); // Inisialisasi peta dan set view ke Lampung

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Menambahkan ikon khusus untuk stasiun
var stasiunIcon = L.icon({
    iconUrl: 'stasiun.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

// Variabel untuk menyimpan layer stasiun
var stationsLayer;

// Load data rel dan stasiun
fetch('data/rel.geojson')
    .then(response => response.json())
    .then(data => {
        stationsLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, { icon: stasiunIcon });
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties && feature.properties.nama) {
                    var popupContent = feature.properties.nama;
                    layer.bindPopup(popupContent);
                    // Menambahkan nama stasiun ke daftar di bawah peta
                    var stationNamesList = document.getElementById('station-names');
                    var listItem = document.createElement('li');
                    listItem.textContent = feature.properties.nama +feature.properties.kab;
                    stationNamesList.appendChild(listItem);
                }
            }
        }).addTo(map);
    });

fetch('data/lampung.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    });

// Fungsi pencarian stasiun
function searchStation() {
    var searchTerm = document.getElementById('search-input').value.toLowerCase();
   
    // Lakukan pencarian di data rel.geojson untuk mencocokkan nama stasiun
    fetch('data/rel.geojson')
        .then(response => response.json())
        .then(data => {
            var found = false;
            if (data.features && data.features.length > 0) {
                data.features.forEach(feature => {
                    if (feature.properties && feature.properties.nama) {
                        var stationName = feature.properties.nama.toLowerCase();
                        if (stationName.includes(searchTerm)) {
                            var coordinates = feature.geometry.coordinates.reverse(); // Ambil koordinat stasiun
                            map.setView(coordinates, 13); // Zoom ke lokasi stasiun
                            L.popup()
                                .setLatLng(coordinates)
                                .setContent(feature.properties.nama)
                                .openOn(map);
                            found = true;
                        }
                    }
                });
            }
            if (!found) {
                alert('Stasiun tidak ditemukan.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Menambahkan event listener untuk menampilkan popup saat klik pada peta
map.on('click', function(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent('Koordinat: ' + e.latlng.toString())
        .openOn(map);
});
