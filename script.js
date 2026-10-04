/* =========================================================
   MAHPE v1
   JUEGO + SIMULADOR EMPRESARIAL
   COYOTE = MOTOR TERRITORIAL
========================================================= */


/* =========================================================
   ESTADO MAHPE
========================================================= */

const DEFAULT_STATE = {

    mahpes: 1250,

    companies: [],

    posts: [],

    interactions: {}

};


let mahpeState =
    loadMahpeState();


let currentCompanyId =
    mahpeState.companies.length
        ? mahpeState.companies[0].id
        : null;


/* =========================================================
   EMPRESA DEMO
========================================================= */

const demoCompany = {

    id: "surano-demo",

    name: "SURANO",

    category: "Moda",

    description:
        "Marca conceptual de moda que está probando su identidad y primera colección dentro de MAHPE.",

    product:
        "Colección urbana",

    price: 180,

    audience:
        "Jóvenes interesados en moda y diseño",

    stage:
        "En desarrollo",

    followers: 84,

    interested: 21,

    committed: 6,

    value: 2850,

    capital: 1000,

    demo: true

};


const demoPost = {

    id: "surano-post",

    companyId:
        "surano-demo",

    companyName:
        "SURANO",

    category:
        "Moda",

    title:
        "Nueva colección",

    text:
        "Estamos probando una nueva identidad visual para la primera colección de SURANO.",

    views: 328,

    interactions: 84,

    interested: 21,

    committed: 6,

    demo: true

};


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadMahpeState() {

    const saved =
        localStorage.getItem(
            "mahpe_state_v1"
        );


    if (!saved) {

        return JSON.parse(
            JSON.stringify(
                DEFAULT_STATE
            )
        );

    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "No se pudo cargar MAHPE:",
            error
        );


        return JSON.parse(
            JSON.stringify(
                DEFAULT_STATE
            )
        );

    }

}


function saveMahpeState() {

    localStorage.setItem(
        "mahpe_state_v1",
        JSON.stringify(
            mahpeState
        )
    );


    updateGlobalUI();

}


/* =========================================================
   UTILIDADES
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text ?? "";

    return div.innerHTML;

}


function generateId(prefix) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() * 100000
        )
    );

}


function getCurrentCompany() {

    return mahpeState.companies.find(
        company =>
            company.id ===
            currentCompanyId
    ) || null;

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

const appViews =
    document.querySelectorAll(
        ".app-view"
    );


const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


function openView(viewId) {

    appViews.forEach(view => {

        view.classList.remove(
            "active"
        );

    });


    const target =
        document.getElementById(
            viewId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    navButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.view ===
                viewId
        );

    });


    if (viewId === "mapView") {

        setTimeout(() => {

            if (map) {

                map.invalidateSize();

            }

        }, 120);

    }


    if (viewId === "companyView") {

        renderCompanyDashboard();

    }


    if (viewId === "profileView") {

        updateProfile();

    }

}


navButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            openView(
                this.dataset.view
            );

        }
    );

});


/* =========================================================
   FEED
========================================================= */

function getAllPosts() {

    return [
        demoPost,
        ...mahpeState.posts
            .slice()
            .reverse()
    ];

}


function renderFeed() {

    const container =
        document.getElementById(
            "feedContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    getAllPosts().forEach(post => {

        const company =
            post.demo
                ? demoCompany
                : mahpeState.companies
                    .find(
                        item =>
                            item.id ===
                            post.companyId
                    );


        if (!company) {
            return;
        }


        const article =
            document.createElement(
                "article"
            );


        article.className =
            "post";


        article.innerHTML = `

            <div class="post-header">

                <div class="company-avatar">
                    ${escapeHTML(
                        company.name.charAt(0)
                    )}
                </div>

                <div class="post-company">

                    <strong>
                        ${escapeHTML(
                            company.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            company.category
                        )}
                        ·
                        ${escapeHTML(
                            company.stage
                        )}
                    </span>

                </div>

                <button
                    class="follow-button"
                    data-company="${company.id}"
                >
                    Seguir
                </button>

            </div>


            <div class="post-visual">

                <div class="visual-brand">
                    ${escapeHTML(
                        company.name
                    )}
                </div>

                <strong>
                    ${escapeHTML(
                        post.title
                    )}
                </strong>

                <p>
                    ${escapeHTML(
                        post.text
                    )}
                </p>

            </div>


            <div class="post-body">

                <p class="post-description">

                    <strong>
                        ${escapeHTML(
                            company.name
                        )}
                    </strong>

                    ·

                    ${escapeHTML(
                        post.text
                    )}

                </p>


                <div class="signals">

                    <button
                        class="signal-button"
                        data-post="${post.id}"
                        data-signal="view"
                    >

                        <span>👁</span>

                        <strong>
                            ${post.views || 0}
                        </strong>

                        <small>
                            Vistas
                        </small>

                    </button>


                    <button
                        class="signal-button"
                        data-post="${post.id}"
                        data-signal="interaction"
                    >

                        <span>♡</span>

                        <strong>
                            ${post.interactions || 0}
                        </strong>

                        <small>
                            Interacción
                        </small>

                    </button>


                    <button
                        class="signal-button"
                        data-post="${post.id}"
                        data-signal="interest"
                    >

                        <span>🔥</span>

                        <strong>
                            ${post.interested || 0}
                        </strong>

                        <small>
                            Interesado
                        </small>

                    </button>


                    <button
                        class="signal-button"
                        data-post="${post.id}"
                        data-signal="commitment"
                    >

                        <span>💰</span>

                        <strong>
                            ${post.committed || 0}
                        </strong>

                        <small>
                            Comprometido
                        </small>

                    </button>

                </div>

            </div>

        `;


        container.appendChild(
            article
        );

    });


    bindFeedEvents();

}


/* =========================================================
   INTERACCIONES FEED
========================================================= */

function bindFeedEvents() {

    document
        .querySelectorAll(
            ".follow-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    this.classList.toggle(
                        "following"
                    );


                    const following =
                        this.classList.contains(
                            "following"
                        );


                    this.textContent =
                        following
                            ? "Siguiendo"
                            : "Seguir";


                    if (following) {

                        mahpeState.mahpes +=
                            2;

                        saveMahpeState();

                    }

                }
            );

        });


    document
        .querySelectorAll(
            ".signal-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    const postId =
                        this.dataset.post;

                    const signal =
                        this.dataset.signal;


                    if (
                        signal ===
                        "view"
                    ) {

                        return;

                    }


                    const interactionKey =
                        postId +
                        "-" +
                        signal;


                    if (
                        mahpeState
                            .interactions[
                                interactionKey
                            ]
                    ) {

                        return;

                    }


                    mahpeState
                        .interactions[
                            interactionKey
                        ] = true;


                    this.classList.add(
                        "selected"
                    );


                    applySignal(
                        postId,
                        signal
                    );

                }
            );

        });

}


/* =========================================================
   MOTOR SOCIAL COYOTE
========================================================= */

function applySignal(
    postId,
    signal
) {

    const post =
        mahpeState.posts.find(
            item =>
                item.id === postId
        );


    /*
     * SURANO es demo.
     * Permitimos interacción visual,
     * pero no modifica una empresa
     * real del usuario.
     */

    if (!post) {

        mahpeState.mahpes += 1;

        saveMahpeState();

        renderFeed();

        return;

    }


    const company =
        mahpeState.companies.find(
            item =>
                item.id ===
                post.companyId
        );


    if (!company) {
        return;
    }


    if (
        signal ===
        "interaction"
    ) {

        post.interactions += 1;

        company.interactions += 1;

        company.value += 5;

    }


    if (
        signal ===
        "interest"
    ) {

        post.interested += 1;

        company.interested += 1;

        company.value += 20;

    }


    if (
        signal ===
        "commitment"
    ) {

        post.committed += 1;

        company.committed += 1;

        company.value += 50;

        company.capital += 10;

    }


    recalculateCompanyStage(
        company
    );


    mahpeState.mahpes += 1;


    saveMahpeState();

    renderFeed();

}


/* =========================================================
   ETAPAS DE EMPRESA
========================================================= */

function recalculateCompanyStage(
    company
) {

    if (
        company.value >=
        10000
    ) {

        company.stage =
            "Consolidada";

    }

    else if (
        company.value >=
        5000
    ) {

        company.stage =
            "En crecimiento";

    }

    else if (
        company.value >=
        2500
    ) {

        company.stage =
            "Lanzada";

    }

    else if (
        company.value >=
        1000
    ) {

        company.stage =
            "En desarrollo";

    }

    else {

        company.stage =
            "Idea";

    }

}


/* =========================================================
   CREAR EMPRESA
========================================================= */

document
    .getElementById(
        "createCompanyButton"
    )
    .addEventListener(
        "click",
        createCompany
    );


function createCompany() {

    const name =
        document
            .getElementById(
                "companyNameInput"
            )
            .value
            .trim();


    const category =
        document
            .getElementById(
                "companyCategoryInput"
            )
            .value;


    const description =
        document
            .getElementById(
                "companyDescriptionInput"
            )
            .value
            .trim();


    const product =
        document
            .getElementById(
                "companyProductInput"
            )
            .value
            .trim();


    const price =
        Number(
            document
                .getElementById(
                    "companyPriceInput"
                )
                .value
        ) || 0;


    const audience =
        document
            .getElementById(
                "companyAudienceInput"
            )
            .value
            .trim();


    const status =
        document.getElementById(
            "createCompanyStatus"
        );


    if (!name) {

        status.textContent =
            "Escribe el nombre de la empresa.";

        return;

    }


    const company = {

        id:
            generateId(
                "company"
            ),

        name,

        category,

        description:
            description ||
            "Empresa creada dentro de MAHPE.",

        product:
            product ||
            "Producto en desarrollo",

        price,

        audience:
            audience ||
            "Por definir",

        stage:
            "Idea",

        followers: 0,

        interactions: 0,

        interested: 0,

        committed: 0,

        value: 500,

        capital: 500,

        createdAt:
            new Date()
                .toISOString()

    };


    mahpeState
        .companies
        .push(
            company
        );


    currentCompanyId =
        company.id;


    /*
     * Recompensa por crear
     * una empresa.
     */

    mahpeState.mahpes +=
        100;


    saveMahpeState();


    status.textContent =
        "✓ Empresa creada. +100 Mahpes";


    clearCompanyForm();


    renderCompanyDashboard();

    updateProfile();


    setTimeout(
        function() {

            openView(
                "companyView"
            );

        },
        400
    );

}


function clearCompanyForm() {

    [
        "companyNameInput",
        "companyDescriptionInput",
        "companyProductInput",
        "companyPriceInput",
        "companyAudienceInput"
    ]
    .forEach(id => {

        document
            .getElementById(id)
            .value = "";

    });

}


/* =========================================================
   DASHBOARD EMPRESA
========================================================= */

function renderCompanyDashboard() {

    const container =
        document.getElementById(
            "companyDashboard"
        );


    const company =
        getCurrentCompany();


    if (!company) {

        container.innerHTML = `

            <section class="form-card">

                <span class="eyebrow">
                    SIN EMPRESA
                </span>

                <h1>
                    Todavía no tienes una empresa
                </h1>

                <p class="muted">
                    Ve a Crear y construye tu
                    primera empresa dentro de MAHPE.
                </p>

                <button
                    class="primary-button big"
                    onclick="openView('createView')"
                >
                    CREAR EMPRESA
                </button>

            </section>

        `;

        return;

    }


    container.innerHTML = `

        <section class="company-hero">

            <div class="company-hero-top">

                <div class="company-big-avatar">

                    ${escapeHTML(
                        company.name.charAt(0)
                    )}

                </div>

                <div>

                    <h1>
                        ${escapeHTML(
                            company.name
                        )}
                    </h1>

                    <div class="company-stage">

                        ${escapeHTML(
                            company.stage
                        )}

                    </div>

                </div>

            </div>


            <p class="company-description">

                ${escapeHTML(
                    company.description
                )}

            </p>

        </section>


        <section class="stats-grid">

            <div class="stat-card">

                <span>📈</span>

                <strong>
                    ${company.value}
                </strong>

                <small>
                    Valor MAHPE
                </small>

            </div>


            <div class="stat-card">

                <span>◈</span>

                <strong>
                    ${company.capital}
                </strong>

                <small>
                    Capital virtual
                </small>

            </div>


            <div class="stat-card">

                <span>🔥</span>

                <strong>
                    ${company.interested}
                </strong>

                <small>
                    Interesados
                </small>

            </div>


            <div class="stat-card">

                <span>💰</span>

                <strong>
                    ${company.committed}
                </strong>

                <small>
                    Comprometidos
                </small>

            </div>

        </section>


        <section class="company-card">

            <span class="eyebrow">
                PRODUCTO
            </span>

            <h2>
                ${escapeHTML(
                    company.product
                )}
            </h2>

            <p class="muted">

                Precio estimado:
                S/
                ${company.price}

                <br><br>

                Público:
                ${escapeHTML(
                    company.audience
                )}

            </p>

        </section>


        <section class="publisher">

            <span class="eyebrow">
                PUBLICAR
            </span>

            <h2>
                Lanza una prueba al mercado
            </h2>


            <label>
                Título
            </label>

            <input
                id="postTitleInput"
                placeholder="Ej. Nueva colección"
            >


            <label>
                ¿Qué quieres mostrar?
            </label>

            <textarea
                id="postTextInput"
                placeholder="Describe el producto, diseño o avance..."
            ></textarea>


            <button
                class="primary-button big"
                onclick="publishCompanyPost()"
            >
                PUBLICAR
            </button>

        </section>

    `;

}


/* =========================================================
   PUBLICAR
========================================================= */

function publishCompanyPost() {

    const company =
        getCurrentCompany();


    if (!company) {
        return;
    }


    const titleInput =
        document.getElementById(
            "postTitleInput"
        );


    const textInput =
        document.getElementById(
            "postTextInput"
        );


    const title =
        titleInput.value.trim();


    const text =
        textInput.value.trim();


    if (!title || !text) {

        return;

    }


    const post = {

        id:
            generateId(
                "post"
            ),

        companyId:
            company.id,

        companyName:
            company.name,

        category:
            company.category,

        title,

        text,

        views:
            Math.floor(
                10 +
                Math.random() * 35
            ),

        interactions: 0,

        interested: 0,

        committed: 0,

        createdAt:
            new Date()
                .toISOString()

    };


    mahpeState.posts.push(
        post
    );


    /*
     * Actividad empresarial
     * genera crecimiento inicial.
     */

    company.value += 25;

    mahpeState.mahpes += 10;


    recalculateCompanyStage(
        company
    );


    saveMahpeState();


    renderFeed();

    renderCompanyDashboard();


    openView(
        "feedView"
    );

}


/* =========================================================
   PERFIL
========================================================= */

function updateProfile() {

    document
        .getElementById(
            "profileMahpes"
        )
        .textContent =
            mahpeState.mahpes;


    document
        .getElementById(
            "profileCompanies"
        )
        .textContent =
            mahpeState
                .companies
                .length;


    const totalInterest =
        mahpeState
            .companies
            .reduce(
                (
                    total,
                    company
                ) =>
                    total +
                    company.interested,
                0
            );


    const totalCommitment =
        mahpeState
            .companies
            .reduce(
                (
                    total,
                    company
                ) =>
                    total +
                    company.committed,
                0
            );


    document
        .getElementById(
            "profileInterest"
        )
        .textContent =
            totalInterest;


    document
        .getElementById(
            "profileCommitment"
        )
        .textContent =
            totalCommitment;

}


/* =========================================================
   UI GLOBAL
========================================================= */

function updateGlobalUI() {

    const wallet =
        document.getElementById(
            "walletBalance"
        );


    if (wallet) {

        wallet.textContent =
            mahpeState.mahpes;

    }


    updateProfile();

}


/* =========================================================
   COYOTE — MAPA
========================================================= */

let map;

let userLocation = null;

let userMarker = null;

let selectedRadius = 10;

let followWatchId = null;

let followUserMarker = null;

let followLine = null;

let followedSellerPoint = null;


/* =========================================================
   INICIALIZAR MAPA
========================================================= */

function initializeMap() {

    map =
        L.map(
            "map"
        )
        .setView(
            [
                -12.025,
                -76.925
            ],
            14
        );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    ).addTo(
        map
    );


    loadSavedSeller();

}


/* =========================================================
   ACTIVAR PUNTO
========================================================= */

document
    .getElementById(
        "activateButton"
    )
    .addEventListener(
        "click",
        activateSeller
    );


function activateSeller() {

    if (
        !navigator.geolocation
    ) {

        updateStatus(
            "❌ Tu navegador no permite utilizar ubicación."
        );

        return;

    }


    updateStatus(
        "📍 Buscando tu ubicación..."
    );


    navigator
        .geolocation
        .getCurrentPosition(

            function(position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                userLocation = {
                    lat,
                    lng
                };


                map.setView(
                    [
                        lat,
                        lng
                    ],
                    17
                );


                document
                    .getElementById(
                        "sellerForm"
                    )
                    .classList
                    .remove(
                        "hidden"
                    );


                document
                    .getElementById(
                        "activateButton"
                    )
                    .classList
                    .add(
                        "hidden"
                    );


                updateStatus(
                    "📍 Ubicación encontrada. Ahora indica qué vendes."
                );

            },


            function(error) {

                if (
                    error.code === 1
                ) {

                    updateStatus(
                        "❌ Debes permitir el acceso a tu ubicación."
                    );

                }

                else {

                    updateStatus(
                        "❌ No se pudo obtener tu ubicación."
                    );

                }

            },


            {

                enableHighAccuracy:
                    true,

                timeout:
                    10000,

                maximumAge:
                    0

            }

        );

}


/* =========================================================
   CREAR PUNTO VERDE
========================================================= */

document
    .getElementById(
        "confirmSellerButton"
    )
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

        return;

    }


    const point = {

        id:
            Date.now(),

        lat:
            userLocation.lat,

        lng:
            userLocation.lng,

        product,

        active:
            true,

        createdAt:
            new Date()
                .toISOString()

    };


    localStorage.setItem(
        "coyote_seller_point",
        JSON.stringify(
            point
        )
    );


    showGreenPoint(
        point
    );


    document
        .getElementById(
            "sellerForm"
        )
        .classList
        .add(
            "hidden"
        );


    updateStatus(
        "🟢 <strong>Punto activo.</strong><br>" +
        escapeHTML(product)
    );

}


/* =========================================================
   MOSTRAR PUNTO
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


    const popup = `

        <div>

            <strong>
                🟢 Punto MAHPE
            </strong>

            <br><br>

            Vende:

            <strong>
                ${escapeHTML(
                    point.product
                )}
            </strong>

            <br><br>

            <button
                onclick="followSellerPoint()"
            >
                🧭 Seguir
            </button>

            <button
                onclick="deactivateSeller()"
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
   CARGAR PUNTO
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
            JSON.parse(
                saved
            );


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


            updateStatus(
                "🟢 Tu Punto Verde está activo."
            );

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   DESACTIVAR
========================================================= */

function deactivateSeller() {

    stopFollowingSeller(
        false
    );


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
        .getElementById(
            "activateButton"
        )
        .classList
        .remove(
            "hidden"
        );


    updateStatus(
        "⚪ Punto desactivado."
    );

}


/* =========================================================
   RADIO
========================================================= */

const rangeButtons =
    document.querySelectorAll(
        ".range-button"
    );


rangeButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            rangeButtons
                .forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


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

});


function updateReference() {

    let text =
        "Una zona amplia alrededor de ti.";


    if (
        selectedRadius === 1
    ) {

        text =
            "Tu zona inmediata.";

    }


    if (
        selectedRadius === 3
    ) {

        text =
            "Varios sectores cercanos.";

    }


    if (
        selectedRadius === 20
    ) {

        text =
            "Varias zonas de tu entorno.";

    }


    document
        .getElementById(
            "referenceText"
        )
        .innerHTML =

            "🔎 " +
            selectedRadius +
            " km<br>" +
            text;

}


/* =========================================================
   BUSCAR
========================================================= */

document
    .getElementById(
        "searchButton"
    )
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


    const saved =
        localStorage.getItem(
            "coyote_seller_point"
        );


    let matches = [];


    if (saved) {

        try {

            const point =
                JSON.parse(
                    saved
                );


            if (
                point.active &&
                point.product
                    .toLowerCase()
                    .includes(
                        search
                    )
            ) {

                matches.push(
                    point
                );

            }

        }

        catch (error) {

            console.error(
                error
            );

        }

    }


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
            matches.length *
            30
        );


    document
        .getElementById(
            "demandBar"
        )
        .style
        .width =

            intensity +
            "%";


    document
        .getElementById(
            "demandText"
        )
        .textContent =

            matches.length
                ? "Actividad detectada"
                : "Actividad inicial";


    if (
        matches.length
    ) {

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


        updateStatus(
            "🟢 Encontramos un punto de " +
            escapeHTML(
                search
            ) +
            "."
        );

    }

    else {

        updateStatus(
            "🔎 Todavía no encontramos puntos de " +
            escapeHTML(
                search
            ) +
            "."
        );

    }

}


/* =========================================================
   SEGUIR PUNTO
========================================================= */

function followSellerPoint() {

    const saved =
        localStorage.getItem(
            "coyote_seller_point"
        );


    if (!saved) {

        updateStatus(
            "⚠️ Punto no disponible."
        );

        return;

    }


    try {

        followedSellerPoint =
            JSON.parse(
                saved
            );

    }

    catch {

        return;

    }


    if (
        !navigator.geolocation
    ) {

        return;

    }


    stopFollowingSeller(
        false
    );


    updateStatus(
        "🧭 Iniciando seguimiento..."
    );


    followWatchId =
        navigator
            .geolocation
            .watchPosition(

                function(position) {

                    const buyerLat =
                        position
                            .coords
                            .latitude;


                    const buyerLng =
                        position
                            .coords
                            .longitude;


                    const sellerLat =
                        followedSellerPoint
                            .lat;


                    const sellerLng =
                        followedSellerPoint
                            .lng;


                    if (
                        !followUserMarker
                    ) {

                        followUserMarker =
                            L.circleMarker(

                                [
                                    buyerLat,
                                    buyerLng
                                ],

                                {

                                    radius: 7,

                                    weight: 3

                                }

                            )
                            .addTo(
                                map
                            );

                    }

                    else {

                        followUserMarker
                            .setLatLng(
                                [
                                    buyerLat,
                                    buyerLng
                                ]
                            );

                    }


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

                                    dashArray:
                                        "9 8"

                                }

                            )
                            .addTo(
                                map
                            );

                    }

                    else {

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
                                distance *
                                1000
                            ) +
                            " m"

                            : distance
                                .toFixed(1) +
                            " km";


                    updateStatus(

                        "🧭 <strong>Siguiendo Punto Verde</strong>" +

                        "<br>" +

                        "Distancia: " +

                        "<strong>" +
                        distanceText +
                        "</strong>"

                    );


                    map.fitBounds(

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

                            padding:
                                [60, 60],

                            maxZoom:
                                17

                        }

                    );

                },


                function() {

                    stopFollowingSeller(
                        false
                    );


                    updateStatus(
                        "❌ No pudimos seguir tu ubicación."
                    );

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
        followWatchId !==
        null
    ) {

        navigator
            .geolocation
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


    if (showMessage) {

        updateStatus(
            "🧭 Seguimiento detenido."
        );

    }

}


/* =========================================================
   DISTANCIA
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
            lat2 -
            lat1
        );


    const dLng =
        toRad(
            lng2 -
            lng1
        );


    const a =

        Math.sin(
            dLat / 2
        ) ** 2 +

        Math.cos(
            toRad(
                lat1
            )
        ) *

        Math.cos(
            toRad(
                lat2
            )
        ) *

        Math.sin(
            dLng / 2
        ) ** 2;


    return (

        2 *
        R *
        Math.asin(
            Math.sqrt(
                a
            )
        )

    );

}


/* =========================================================
   ESTADO COYOTE
========================================================= */

function updateStatus(message) {

    const element =
        document.getElementById(
            "status"
        );


    if (element) {

        element.innerHTML =
            message;

    }

}


/* =========================================================
   ARRANQUE
========================================================= */

initializeMap();

renderFeed();

renderCompanyDashboard();

updateGlobalUI();

openView(
    "feedView"
);


console.log(
    "MAHPE v1 iniciado."
);

console.log(
    "COYOTE activo como motor territorial."
);
