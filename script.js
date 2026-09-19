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


            /*
             * Centrar mapa
             */

            map.setView(
                [lat, lng],
                17
            );


            /*
             * Mostrar formulario
             */

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


    /*
     * Guardar punto localmente
     */

    localStorage.setItem(
        "coyote_seller_point",
        JSON.stringify(point)
    );


    /*
     * Mostrar punto
     */

    showGreenPoint(point);


    /*
     * Actualizar interfaz
     */

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


    /*
     * Por ahora usamos una explicación
     * general.
     *
     * Después podemos conectar esto
     * con lugares reales cercanos.
     */

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


    /*
     * En esta primera versión,
     * buscamos solamente entre
     * los puntos disponibles
     * en este navegador.
     *
     * Luego será una búsqueda
     * global.
     */

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


    /*
     * Actualizar indicadores.
     */

    document
        .getElementById(
            "offerText"
        )
        .textContent =
            matches.length +
            " punto(s)";


    /*
     * Por ahora la intensidad
     * representa la actividad
     * de búsqueda local.
     */

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


    /*
     * Mensaje.
     */

    if (matches.length > 0) {

        updateStatus(
            "🟢 Encontramos " +
            matches.length +
            " punto(s) que ofrecen " +
            escapeHTML(search) +
            "."
        );

    } else {

        updateStatus(
            "🔎 No encontramos puntos de " +
            escapeHTML(search) +
            " todavía."
        );

    }

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