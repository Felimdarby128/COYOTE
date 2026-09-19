/* =========================================================
   COYOTE
   CAPA 1 + ESTRUCTURA PARA CAPAS FUTURAS
========================================================= */


/* =========================================================
   VARIABLES
========================================================= */

let map;

let userLocation = null;

let userMarker = null;

let selectedRadius = 10;


/* =========================================================
   SEGUIR PUNTO DENTRO DE COYOTE
========================================================= */

let followWatchId = null;

let followUserMarker = null;

let followLine = null;

let followedSellerPoint = null;


/*
 * Puntos comerciales.
 *
 * Por ahora se almacenan localmente.
 *
 * Más adelante:
 * Firebase / Supabase / backend.
 */

let commercialPoints = [];


/* =========================================================
   INICIALIZAR MAPA
========================================================= */

function initializeMap() {

    map = L.map("map").setView(
        [-12.025, -76.925],
        14
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    loadSavedSeller();

}


/* =========================================================
   ACTIVAR PUNTO
========================================================= */

document
    .getElementById("activateButton")
    .addEventListener(
        "click",
        activateSeller
    );


function activateSeller() {

    if (!navigator.geolocation) {

        updateStatus(
            "❌ Tu navegador no permite utilizar ubicación."
        );

        return;
    }


    updateStatus(
        "📍 Buscando tu ubicación..."
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            userLocation = {
                lat: lat,
                lng: lng
            };


            map.setView(
                [lat, lng],
                17
            );


            document
                .getElementById("sellerForm")
                .classList
                .remove("hidden");


            document
                .getElementById("activateButton")
                .classList
                .add("hidden");


            updateStatus(
                "📍 Ubicación encontrada.<br>" +
                "Ahora indica qué vendes."
            );

        },

        function(error) {

            if (error.code === 1) {

                updateStatus(
                    "❌ Debes permitir el acceso a tu ubicación."
                );

            } else {

                updateStatus(
                    "❌ No se pudo obtener tu ubicación."
                );

            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


/* =========================================================
   CONFIRMAR COMERCIANTE
========================================================= */

document
    .getElementById("confirmSellerButton")
    .addEventListener(
        "click",
        createSellerPoint
    );


function createSellerPoint() {

    if (!userLocation) {

        updateStatus(
            "❌ Primero necesitamos tu ubicación."
        );

        return;
    }


    const input =
        document.getElementById(
            "productInput"
        );


    const product =
        input.value.trim();


    if (!product) {

        input.focus();

        updateStatus(
            "⚠️ Escribe qué vendes."
        );

        return;
    }


    const point = {

        id:
            Date.now(),

        lat:
            userLocation.lat,

        lng:
            userLocation.lng,

        product:
            product,

        active:
            true,

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "coyote_seller_point",
        JSON.stringify(point)
    );


    showGreenPoint(point);


    document
        .getElementById("sellerForm")
        .classList
        .add("hidden");


    updateStatus(
        "🟢 <strong>Punto activo.</strong><br>" +
        "COYOTE sabe dónde estás y qué vendes."
    );

}


/* =========================================================
   MOSTRAR PUNTO VERDE
========================================================= */

function showGreenPoint(point) {

    if (userMarker) {

        map.removeLayer(
            userMarker
        );
    }


    const greenIcon =
        L.divIcon({

            className: "",

            html:
                '<div class="green-marker"></div>',

            iconSize:
                [22, 22],

            iconAnchor:
                [11, 11],

            popupAnchor:
                [0, -12]

        });


    userMarker =
        L.marker(
            [
                point.lat,
                point.lng
            ],
            {
                icon:
                    greenIcon
            }
        )
        .addTo(map);


    const date =
        new Date(
            point.createdAt
        );


    const time =
        date.toLocaleString(
            "es-PE",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );


    const popup = `

        <div>

            <div class="popup-title">
                🟢 Punto Comercial
            </div>

            <div class="popup-product">
                🛒 Vende:
                <strong>
                    ${escapeHTML(point.product)}
                </strong>
            </div>

            <div class="popup-distance">
                Activo desde:
                ${time}
            </div>

            <br>


            <button
                onclick="followSellerPoint()"
                style="
                    border:none;
                    border-radius:8px;
                    padding:8px;
                    margin-right:6px;
                    background:#2980b9;
                    color:white;
                    cursor:pointer;
                "
            >
                🧭 Seguir punto
            </button>


            <button
                onclick="deactivateSeller()"
                style="
                    border:none;
                    border-radius:8px;
                    padding:8px;
                    background:#e74c3c;
                    color:white;
                    cursor:pointer;
                "
            >
                Desactivar
            </button>

        </div>

    `;


    userMarker.bindPopup(
        popup
    );

}


/* =========================================================
   DESACTIVAR
========================================================= */

function deactivateSeller() {

    stopFollowingSeller(false);


    localStorage.removeItem(
        "coyote_seller_point"
    );


    if (userMarker) {

        map.removeLayer(
            userMarker
        );

        userMarker = null;
    }


    document
        .getElementById("activateButton")
        .classList
        .remove("hidden");


    updateStatus(
        "⚪ Punto desactivado."
    );

}


/* =========================================================
   CARGAR PUNTO GUARDADO
========================================================= */

function loadSavedSeller() {

    const saved =
        localStorage.getItem(
            "coyote_seller_point"
        );


    if (!saved) {
        return;
    }


    try {

        const point =
            JSON.parse(saved);


        if (
            point &&
            point.active
        ) {

            userLocation = {

                lat:
                    point.lat,

                lng:
                    point.lng

            };


            showGreenPoint(
                point
            );


            map.setView(
                [
                    point.lat,
                    point.lng
                ],
                17
            );


            updateStatus(
                "🟢 <strong>Tu punto está activo.</strong><br>" +
                "Vendes: " +
                escapeHTML(
                    point.product
                )
            );

        }

    } catch (error) {

        console.error(
            "Error cargando punto:",
            error
        );

    }

}


/* =========================================================
   SELECCIÓN DE RADIO
========================================================= */

const rangeButtons =
    document.querySelectorAll(
        ".range-button"
    );


rangeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                rangeButtons.forEach(
                    b =>
                        b.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                selectedRadius =
                    Number(
                        this.dataset.radius
                    );


                updateReference();

            }
        );

    }
);


/* =========================================================
   REFERENCIA TERRITORIAL
========================================================= */

function updateReference() {

    const reference =
        document.getElementById(
            "referenceText"
        );


    let text = "";


    if (selectedRadius === 1) {

        text =
            "📍 Aproximadamente tu zona inmediata.";

    }

    else if (selectedRadius === 3) {

        text =
            "📍 Aproximadamente varios sectores cercanos.";

    }

    else if (selectedRadius === 10) {

        text =
            "📍 Una zona amplia alrededor de ti.";

    }

    else if (selectedRadius === 20) {

        text =
            "📍 Varias zonas de tu entorno.";

    }


    reference.innerHTML =
        "🔎 " +
        selectedRadius +
        " km<br>" +
        text;

}


/* =========================================================
   BUSCADOR
========================================================= */

document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        searchProducts
    );


function searchProducts() {

    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .trim()
            .toLowerCase();


    if (!search) {

        updateStatus(
            "⚠️ Escribe qué estás buscando."
        );

        return;
    }


    const savedSeller =
        localStorage.getItem(
            "coyote_seller_point"
        );


    let points = [];


    if (savedSeller) {

        try {

            points.push(
                JSON.parse(
                    savedSeller
                )
            );

        } catch (error) {

            console.error(error);

        }

    }


    let matches = [];


    points.forEach(
        point => {

            if (
                point.product
                    .toLowerCase()
                    .includes(search)
            ) {

                matches.push(
                    point
                );

            }

        }
    );


    document
        .getElementById(
            "offerText"
        )
        .textContent =
            matches.length +
            " punto(s)";


    const intensity =
        Math.min(
            100,
            20 +
            matches.length * 20
        );


    document
        .getElementById(
            "demandBar"
        )
        .style
        .width =
            intensity + "%";


    document
        .getElementById(
            "demandText"
        )
        .textContent =
            intensity > 60
                ? "Alta actividad"
                : "Actividad inicial";


    if (matches.length > 0) {

        updateStatus(
            "🟢 Encontramos " +
            matches.length +
            " punto(s) que ofrecen " +
            escapeHTML(search) +
            "."
        );


        /*
         * Abrimos automáticamente el punto encontrado
         * para que el comprador pueda pulsar
         * "SEGUIR PUNTO".
         */

        const point =
            matches[0];


        map.setView(
            [
                point.lat,
                point.lng
            ],
            17
        );


        if (userMarker) {

            userMarker.openPopup();

        }

    } else {

        updateStatus(
            "🔎 No encontramos puntos de " +
            escapeHTML(search) +
            " todavía."
        );

    }

}


/* =========================================================
   SEGUIR PUNTO — NAVEGACIÓN INTERNA COYOTE
========================================================= */

function followSellerPoint() {

    const saved =
        localStorage.getItem(
            "coyote_seller_point"
        );


    if (!saved) {

        updateStatus(
            "⚠️ Este punto ya no está disponible."
        );

        return;
    }


    try {

        followedSellerPoint =
            JSON.parse(saved);

    } catch (error) {

        updateStatus(
            "⚠️ No se pudo leer la ubicación del vendedor."
        );

        return;
    }


    if (!navigator.geolocation) {

        updateStatus(
            "❌ Tu navegador no permite utilizar ubicación."
        );

        return;
    }


    stopFollowingSeller(false);


    updateStatus(
        "🧭 Buscando tu ubicación..."
    );


    followWatchId =
        navigator.geolocation.watchPosition(

            function(position) {

                const buyerLat =
                    position.coords.latitude;

                const buyerLng =
                    position.coords.longitude;


                /*
                 * Volvemos a consultar la ubicación
                 * almacenada del vendedor.
                 */

                const latestSaved =
                    localStorage.getItem(
                        "coyote_seller_point"
                    );


                if (latestSaved) {

                    try {

                        const latestPoint =
                            JSON.parse(
                                latestSaved
                            );


                        if (
                            latestPoint &&
                            latestPoint.active
                        ) {

                            followedSellerPoint =
                                latestPoint;

                        }

                    } catch (error) {

                        console.error(error);

                    }

                }


                if (!followedSellerPoint) {

                    stopFollowingSeller(false);

                    updateStatus(
                        "⚠️ El vendedor ya no está disponible."
                    );

                    return;
                }


                const sellerLat =
                    followedSellerPoint.lat;

                const sellerLng =
                    followedSellerPoint.lng;


                /* =========================
                   MARCADOR DEL COMPRADOR
                ========================= */

                if (!followUserMarker) {

                    followUserMarker =
                        L.circleMarker(

                            [
                                buyerLat,
                                buyerLng
                            ],

                            {
                                radius: 7,
                                weight: 3,

                                color:
                                    "#2980b9",

                                fillColor:
                                    "#ffffff",

                                fillOpacity:
                                    1
                            }

                        )
                        .addTo(map)
                        .bindTooltip(
                            "Tú",
                            {
                                direction:
                                    "top"
                            }
                        );

                } else {

                    followUserMarker
                        .setLatLng(
                            [
                                buyerLat,
                                buyerLng
                            ]
                        );

                }


                /* =========================
                   LÍNEA HACIA EL VENDEDOR
                ========================= */

                if (!followLine) {

                    followLine =
                        L.polyline(

                            [
                                [
                                    buyerLat,
                                    buyerLng
                                ],

                                [
                                    sellerLat,
                                    sellerLng
                                ]
                            ],

                            {
                                weight: 4,
                                opacity: 0.85,

                                dashArray:
                                    "9 8"
                            }

                        )
                        .addTo(map);

                } else {

                    followLine
                        .setLatLngs(

                            [
                                [
                                    buyerLat,
                                    buyerLng
                                ],

                                [
                                    sellerLat,
                                    sellerLng
                                ]
                            ]

                        );

                }


                /* =========================
                   DISTANCIA
                ========================= */

                const distance =
                    calculateDistanceKm(

                        buyerLat,
                        buyerLng,

                        sellerLat,
                        sellerLng

                    );


                const distanceText =

                    distance < 1

                        ? Math.round(
                            distance * 1000
                        ) + " m"

                        : distance.toFixed(1) +
                          " km";


                updateStatus(

                    "🧭 <strong>Siguiendo Punto Verde</strong><br>" +

                    "Distancia aproximada: " +

                    "<strong>" +
                    distanceText +
                    "</strong>" +

                    "<br><br>" +

                    '<button ' +
                    'onclick="stopFollowingSeller()" ' +
                    'style="' +
                    'border:none;' +
                    'border-radius:7px;' +
                    'padding:7px 9px;' +
                    'background:#333;' +
                    'color:white;' +
                    'cursor:pointer;' +
                    '">' +

                    "⏹ DETENER SEGUIMIENTO" +

                    "</button>"

                );


                /* =========================
                   MOSTRAR AMBOS EN MAPA
                ========================= */

                const bounds =
                    L.latLngBounds(

                        [
                            [
                                buyerLat,
                                buyerLng
                            ],

                            [
                                sellerLat,
                                sellerLng
                            ]
                        ]

                    );


                map.fitBounds(

                    bounds,

                    {
                        padding:
                            [60, 60],

                        maxZoom:
                            17
                    }

                );

            },


            function(error) {

                stopFollowingSeller(false);


                if (error.code === 1) {

                    updateStatus(
                        "❌ Permite tu ubicación para seguir el punto."
                    );

                } else {

                    updateStatus(
                        "❌ No se pudo obtener tu ubicación."
                    );

                }

            },


            {
                enableHighAccuracy:
                    true,

                maximumAge:
                    3000,

                timeout:
                    12000
            }

        );

}


/* =========================================================
   DETENER SEGUIMIENTO
========================================================= */

function stopFollowingSeller(
    showMessage = true
) {

    if (
        followWatchId !== null
    ) {

        navigator.geolocation
            .clearWatch(
                followWatchId
            );

        followWatchId =
            null;

    }


    if (
        followUserMarker &&
        map.hasLayer(
            followUserMarker
        )
    ) {

        map.removeLayer(
            followUserMarker
        );

    }


    if (
        followLine &&
        map.hasLayer(
            followLine
        )
    ) {

        map.removeLayer(
            followLine
        );

    }


    followUserMarker =
        null;

    followLine =
        null;

    followedSellerPoint =
        null;


    if (showMessage) {

        updateStatus(
            "🧭 Seguimiento detenido."
        );

    }

}


/* =========================================================
   CALCULAR DISTANCIA
========================================================= */

function calculateDistanceKm(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const R =
        6371;


    const toRad =
        value =>
            value *
            Math.PI /
            180;


    const dLat =
        toRad(
            lat2 - lat1
        );


    const dLng =
        toRad(
            lng2 - lng1
        );


    const a =

        Math.sin(
            dLat / 2
        ) ** 2 +

        Math.cos(
            toRad(lat1)
        ) *

        Math.cos(
            toRad(lat2)
        ) *

        Math.sin(
            dLng / 2
        ) ** 2;


    return (

        2 *
        R *
        Math.asin(
            Math.sqrt(a)
        )

    );

}


/* =========================================================
   ESTADO
========================================================= */

function updateStatus(message) {

    document
        .getElementById(
            "status"
        )
        .innerHTML =
            message;

}


/* =========================================================
   SEGURIDAD DE TEXTO
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =========================================================
   INICIAR COYOTE
========================================================= */

initializeMap();
