/* =========================================================
   MAHPE v1.2
   JUEGO + SIMULADOR EMPRESARIAL

   PARTE 1/4

   - Estado global
   - Migración
   - Identidad de marca
   - Productos
   - Imágenes
   - Navegación
   - Actividad
   - Feed
========================================================= */


/* =========================================================
   1. ESTADO MAHPE
========================================================= */

const DEFAULT_STATE = {

    mahpes: 1250,

    companies: [],

    products: [],

    posts: [],

    interactions: {},

    following: {},

    followRewards: {},

    events: [],

    decisionHistory: []

};


let mahpeState =
    loadMahpeState();


let currentCompanyId =
    mahpeState.companies.length
        ? mahpeState.companies[0].id
        : null;


let currentFeedMode =
    "explore";


let currentCompanyTab =
    "summary";


let editingProductId =
    null;


let productEditorImages =
    [];


let productEditorCoverIndex =
    0;


/* =========================================================
   2. EMPRESA DEMO — SURANO
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

    interactions: 84,

    interested: 21,

    committed: 6,

    value: 2850,

    capital: 1000,

    brandImage: null,

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

    productId: null,

    image: null,

    demo: true

};


/* =========================================================
   3. LOCAL STORAGE
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

        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed.companies)) {

            parsed.companies = [];

        }


        if (!Array.isArray(parsed.products)) {

            parsed.products = [];

        }


        if (!Array.isArray(parsed.posts)) {

            parsed.posts = [];

        }


        if (
            !parsed.interactions ||
            typeof parsed.interactions !==
                "object"
        ) {

            parsed.interactions = {};

        }


        if (
            !parsed.following ||
            typeof parsed.following !==
                "object"
        ) {

            parsed.following = {};

        }


        if (
            !parsed.followRewards ||
            typeof parsed.followRewards !==
                "object"
        ) {

            parsed.followRewards = {};

        }


        if (!Array.isArray(parsed.events)) {

            parsed.events = [];

        }


        if (
            !Array.isArray(
                parsed.decisionHistory
            )
        ) {

            parsed.decisionHistory = [];

        }


        if (
            typeof parsed.mahpes !==
            "number"
        ) {

            parsed.mahpes = 1250;

        }


        return parsed;

    }

    catch (error) {

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


/* =========================================================
   4. GUARDAR ESTADO
========================================================= */

function saveMahpeState() {

    try {

        localStorage.setItem(
            "mahpe_state_v1",
            JSON.stringify(
                mahpeState
            )
        );

    }

    catch (error) {

        console.error(
            "MAHPE: no se pudo guardar el estado.",
            error
        );

        /*
           Normalmente esto ocurrirá si las imágenes
           almacenadas superan la capacidad de
           localStorage del navegador.
        */

    }


    updateGlobalUI();

}


/* =========================================================
   5. UTILIDADES
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
            Math.random() *
            100000
        )

    );

}


function clamp(
    value,
    min = 0,
    max = 100
) {

    return Math.max(

        min,

        Math.min(
            max,
            Math.round(
                Number(value) || 0
            )
        )

    );

}


function formatPrice(value) {

    const number =
        Number(value) || 0;


    return number.toLocaleString(
        "es-PE",
        {
            minimumFractionDigits:
                number % 1 === 0
                    ? 0
                    : 2,

            maximumFractionDigits: 2
        }
    );

}


function getCurrentCompany() {

    return (

        mahpeState.companies.find(

            company =>
                company.id ===
                currentCompanyId

        ) || null

    );

}


function getCompanyById(
    companyId
) {

    if (
        companyId ===
        demoCompany.id
    ) {

        return demoCompany;

    }


    return (

        mahpeState.companies.find(

            company =>
                company.id ===
                companyId

        ) || null

    );

}


function getProductById(
    productId
) {

    if (!productId) {

        return null;

    }


    return (

        mahpeState.products.find(

            product =>
                product.id ===
                productId

        ) || null

    );

}


function getCompanyProducts(
    companyId
) {

    return mahpeState.products.filter(

        product =>
            product.companyId ===
                companyId

    );

}


/* =========================================================
   6. MIGRACIÓN BUSINESS ENGINE
========================================================= */

function migrateCompanyBusinessData(
    company
) {

    if (!company) {

        return;

    }


    if (
        typeof company.activity !==
        "number"
    ) {

        company.activity = 20;

    }


    if (
        typeof company.marketResponse !==
        "number"
    ) {

        company.marketResponse = 20;

    }


    if (
        typeof company.locationStrength !==
        "number"
    ) {

        company.locationStrength = 20;

    }


    if (
        typeof company.risk !==
        "number"
    ) {

        company.risk = 15;

    }


    if (
        typeof company.designLevel !==
        "number"
    ) {

        company.designLevel = 20;

    }


    if (
        typeof company.productValidation !==
        "number"
    ) {

        company.productValidation = 10;

    }


    if (
        typeof company.marketKnowledge !==
        "number"
    ) {

        company.marketKnowledge = 10;

    }


    if (
        typeof company.campaignPower !==
        "number"
    ) {

        company.campaignPower = 0;

    }


    if (
        typeof company.interactions !==
        "number"
    ) {

        company.interactions = 0;

    }


    if (
        typeof company.interested !==
        "number"
    ) {

        company.interested = 0;

    }


    if (
        typeof company.committed !==
        "number"
    ) {

        company.committed = 0;

    }


    if (
        typeof company.followers !==
        "number"
    ) {

        company.followers = 0;

    }


    if (
        typeof company.value !==
        "number"
    ) {

        company.value = 500;

    }


    if (
        typeof company.capital !==
        "number"
    ) {

        company.capital = 500;

    }


    if (
        !Array.isArray(
            company.decisions
        )
    ) {

        company.decisions = [];

    }


    /*
       NUEVO:
       identidad visual.
    */

    if (
        typeof company.brandImage !==
        "string"
    ) {

        company.brandImage = null;

    }


    if (
        typeof company.brandImageUpdatedAt !==
        "string"
    ) {

        company.brandImageUpdatedAt =
            null;

    }

}


/* =========================================================
   7. MIGRACIÓN PRODUCTOS
========================================================= */

function migrateProductData(
    product
) {

    if (!product) {

        return;

    }


    if (!Array.isArray(product.images)) {

        product.images = [];

    }


    if (
        typeof product.coverIndex !==
        "number"
    ) {

        product.coverIndex = 0;

    }


    if (
        !product.metrics ||
        typeof product.metrics !==
            "object"
    ) {

        product.metrics = {};

    }


    if (
        typeof product.metrics.views !==
        "number"
    ) {

        product.metrics.views = 0;

    }


    if (
        typeof product.metrics.interactions !==
        "number"
    ) {

        product.metrics.interactions = 0;

    }


    if (
        typeof product.metrics.interested !==
        "number"
    ) {

        product.metrics.interested = 0;

    }


    if (
        typeof product.metrics.committed !==
        "number"
    ) {

        product.metrics.committed = 0;

    }


    if (
        typeof product.published !==
        "boolean"
    ) {

        product.published = false;

    }

}


/* =========================================================
   8. MIGRAR ESTADO COMPLETO
========================================================= */

function migrateMahpeBusinessState() {

    if (
        !Array.isArray(
            mahpeState.products
        )
    ) {

        mahpeState.products = [];

    }


    if (
        !Array.isArray(
            mahpeState.decisionHistory
        )
    ) {

        mahpeState.decisionHistory = [];

    }


    mahpeState.companies.forEach(
        migrateCompanyBusinessData
    );


    mahpeState.products.forEach(
        migrateProductData
    );


    try {

        localStorage.setItem(
            "mahpe_state_v1",
            JSON.stringify(
                mahpeState
            )
        );

    }

    catch (error) {

        console.error(
            "MAHPE: error durante migración.",
            error
        );

    }

}


/* =========================================================
   9. AVATAR / LOGO DE EMPRESA
========================================================= */

function renderCompanyAvatar(
    company,
    className =
        "company-avatar"
) {

    if (
        company &&
        company.brandImage
    ) {

        return `

            <div
                class="${className} has-image"
            >

                <img
                    src="${company.brandImage}"
                    alt="Logo de ${escapeHTML(
                        company.name
                    )}"
                >

            </div>

        `;

    }


    const initial =
        company &&
        company.name

            ? company.name
                .charAt(0)
                .toUpperCase()

            : "?";


    return `

        <div
            class="${className}"
        >

            ${escapeHTML(
                initial
            )}

        </div>

    `;

}


/* =========================================================
   10. OBTENER PORTADA DE PRODUCTO
========================================================= */

function getProductCover(
    product
) {

    if (
        !product ||
        !Array.isArray(
            product.images
        ) ||
        !product.images.length
    ) {

        return null;

    }


    const index =
        Math.max(

            0,

            Math.min(

                Number(
                    product.coverIndex
                ) || 0,

                product.images.length - 1

            )

        );


    return (
        product.images[index] ||
        product.images[0] ||
        null
    );

}


/* =========================================================
   11. COMPRESIÓN DE IMAGEN

   Para el MVP local:
   - máximo 1200 px
   - JPEG comprimido
   - evita llenar localStorage demasiado rápido
========================================================= */

function compressImageFile(
    file,
    options = {}
) {

    const maxDimension =
        Number(
            options.maxDimension ||
            1200
        );


    const quality =
        Number(
            options.quality ||
            0.78
        );


    return new Promise(
        (
            resolve,
            reject
        ) => {

            if (!file) {

                reject(
                    new Error(
                        "Archivo no disponible."
                    )
                );

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                reject(
                    new Error(
                        "El archivo seleccionado no es una imagen."
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const image =
                        new Image();


                    image.onload =
                        function() {

                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width >
                                    maxDimension ||
                                height >
                                    maxDimension
                            ) {

                                const ratio =
                                    Math.min(

                                        maxDimension /
                                            width,

                                        maxDimension /
                                            height

                                    );


                                width =
                                    Math.round(
                                        width *
                                        ratio
                                    );


                                height =
                                    Math.round(
                                        height *
                                        ratio
                                    );

                            }


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            if (!context) {

                                reject(
                                    new Error(
                                        "No se pudo procesar la imagen."
                                    )
                                );

                                return;

                            }


                            /*
                               Fondo blanco para imágenes
                               transparentes convertidas a JPEG.
                            */

                            context.fillStyle =
                                "#ffffff";


                            context.fillRect(
                                0,
                                0,
                                width,
                                height
                            );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            const dataURL =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    quality
                                );


                            resolve(
                                dataURL
                            );

                        };


                    image.onerror =
                        function() {

                            reject(
                                new Error(
                                    "No se pudo leer la imagen."
                                )
                            );

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "No se pudo cargar el archivo."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   12. NAVEGACIÓN
========================================================= */

const appViews =
    document.querySelectorAll(
        ".app-view"
    );


const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


function openView(
    viewId
) {

    appViews.forEach(
        view => {

            view.classList.remove(
                "active"
            );

        }
    );


    const target =
        document.getElementById(
            viewId
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    navButtons.forEach(
        button => {

            button.classList.toggle(

                "active",

                button.dataset.view ===
                    viewId

            );

        }
    );


    /*
       Si abandonamos Empresa,
       cerramos el editor independiente.
    */

    if (
        viewId !==
        "companyView"
    ) {

        closeProductEditor(
            false
        );

    }


    if (
        viewId ===
        "mapView"
    ) {

        setTimeout(
            function() {

                if (map) {

                    map.invalidateSize();

                }

            },
            150
        );

    }


    if (
        viewId ===
        "companyView"
    ) {

        renderCompanyDashboard();

    }


    if (
        viewId ===
        "profileView"
    ) {

        updateProfile();

    }

}


navButtons.forEach(
    button => {

        button.addEventListener(

            "click",

            function() {

                openView(
                    this.dataset.view
                );

            }

        );

    }
);


/* =========================================================
   13. ACTIVIDAD MAHPE
========================================================= */

function addMahpeEvent(
    type,
    message,
    companyId = null
) {

    if (
        !Array.isArray(
            mahpeState.events
        )
    ) {

        mahpeState.events = [];

    }


    mahpeState.events.unshift({

        id:
            generateId(
                "event"
            ),

        type,

        message,

        companyId,

        read: false,

        createdAt:
            new Date()
                .toISOString()

    });


    mahpeState.events =
        mahpeState.events.slice(
            0,
            30
        );

}


/* =========================================================
   14. ICONO DE ACTIVIDAD
========================================================= */

function getActivityIcon(
    type
) {

    const icons = {

        company: "🏢",

        post: "📣",

        follow: "👤",

        product: "📦",

        brand: "◈",

        signal: "🔥",

        decision: "⚡"

    };


    return (
        icons[type] ||
        "•"
    );

}


/* =========================================================
   15. RENDER BANDEJA DE ACTIVIDAD
========================================================= */

function renderActivityInbox() {

    const list =
        document.getElementById(
            "activityList"
        );


    const badge =
        document.getElementById(
            "activityBadge"
        );


    if (
        !list &&
        !badge
    ) {

        return;

    }


    const events =
        Array.isArray(
            mahpeState.events
        )

            ? mahpeState.events

            : [];


    const unread =
        events.filter(
            event =>
                !event.read
        ).length;


    if (badge) {

        badge.textContent =
            unread;


        badge.classList.toggle(
            "hidden",
            unread === 0
        );

    }


    if (!list) {

        return;

    }


    if (!events.length) {

        list.innerHTML = `

            <div
                class="activity-empty"
            >

                Todavía no hay novedades.

            </div>

        `;


        return;

    }


    list.innerHTML =
        events
            .slice(
                0,
                8
            )
            .map(
                event => `

                    <article
                        class="activity-item ${
                            event.read
                                ? ""
                                : "unread"
                        }"
                    >

                        <span
                            class="activity-icon"
                        >

                            ${getActivityIcon(
                                event.type
                            )}

                        </span>


                        <div
                            class="activity-copy"
                        >

                            <strong>

                                ${escapeHTML(
                                    event.message
                                )}

                            </strong>


                            <small>

                                ${new Date(
                                    event.createdAt
                                ).toLocaleString(
                                    "es-PE"
                                )}

                            </small>

                        </div>

                    </article>

                `
            )
            .join("");

}


/* =========================================================
   16. FEED — OBTENER PUBLICACIONES
========================================================= */

function getAllPosts() {

    return [

        demoPost,

        ...mahpeState.posts
            .slice()
            .reverse()

    ];

}


function getPostCompany(
    post
) {

    if (post.demo) {

        return demoCompany;

    }


    return getCompanyById(
        post.companyId
    );

}


function isFollowingCompany(
    companyId
) {

    return Boolean(

        mahpeState.following &&

        mahpeState.following[
            companyId
        ]

    );

}


function getFollowingCount() {

    return Object.values(

        mahpeState.following ||
        {}

    ).filter(
        Boolean
    ).length;

}


/* =========================================================
   17. MÉTRICAS VISIBLES
========================================================= */

function getDisplayedPostMetric(
    post,
    metric
) {

    let value =
        Number(
            post[metric] ||
            0
        );


    /*
       Los posts reales actualizan directamente
       sus métricas.

       SURANO es demo, así que sumamos
       visualmente la interacción local.
    */

    if (!post.demo) {

        return value;

    }


    const signalMap = {

        views:
            "view",

        interactions:
            "interaction",

        interested:
            "interest",

        committed:
            "commitment"

    };


    const signal =
        signalMap[
            metric
        ];


    if (
        signal &&
        mahpeState.interactions[
            post.id +
            "-" +
            signal
        ]
    ) {

        value += 1;

    }


    return value;

}


/* =========================================================
   18. PUNTUACIÓN DE TENDENCIA
========================================================= */

function getPostTrendScore(
    post
) {

    return (

        getDisplayedPostMetric(
            post,
            "views"
        ) *
        0.05 +

        getDisplayedPostMetric(
            post,
            "interactions"
        ) +

        getDisplayedPostMetric(
            post,
            "interested"
        ) *
        4 +

        getDisplayedPostMetric(
            post,
            "committed"
        ) *
        10

    );

}


/* =========================================================
   19. POSTS VISIBLES
========================================================= */

function getVisiblePosts() {

    const posts =
        getAllPosts();


    if (
        currentFeedMode ===
        "following"
    ) {

        return posts.filter(

            post =>
                isFollowingCompany(
                    post.companyId
                )

        );

    }


    if (
        currentFeedMode ===
        "trending"
    ) {

        return posts
            .slice()
            .sort(

                (
                    a,
                    b
                ) =>

                    getPostTrendScore(
                        b
                    ) -

                    getPostTrendScore(
                        a
                    )

            );

    }


    return posts;

}


/* =========================================================
   20. FEED SHELL

   IMPORTANTE:
   index.html YA contiene:
   Siguiendo | Descubrir | Tendencias

   JavaScript NO crea otra barra.
========================================================= */

function ensureFeedShell() {

    const feedContainer =
        document.getElementById(
            "feedContainer"
        );


    if (!feedContainer) {

        return;

    }


    const following =
        document.getElementById(
            "followingFeedButton"
        );


    const explore =
        document.getElementById(
            "exploreFeedButton"
        );


    const trending =
        document.getElementById(
            "trendingFeedButton"
        );


    if (
        !following ||
        !explore ||
        !trending
    ) {

        console.warn(
            "MAHPE: controles del feed no encontrados en index.html"
        );

    }

}


/* =========================================================
   21. CAMBIAR FEED
========================================================= */

function setFeedMode(
    mode
) {

    if (
        ![
            "explore",
            "following",
            "trending"
        ].includes(
            mode
        )
    ) {

        mode =
            "explore";

    }


    currentFeedMode =
        mode;


    updateFeedControls();


    renderFeed();

}


/* =========================================================
   22. INICIALIZAR TABS DEL FEED
========================================================= */

function initializeFeedTabs() {

    ensureFeedShell();


    document
        .querySelectorAll(
            ".feed-tab"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>

                        setFeedMode(
                            button.dataset.feedMode
                        );

            }
        );


    updateFeedControls();

}


/* =========================================================
   23. ACTUALIZAR TABS DEL FEED
========================================================= */

function updateFeedControls() {

    const counter =
        document.getElementById(
            "followingCount"
        );


    if (counter) {

        counter.textContent =
            getFollowingCount();

    }


    document
        .querySelectorAll(
            ".feed-tab"
        )
        .forEach(
            button => {

                button.classList.toggle(

                    "active",

                    button.dataset.feedMode ===
                        currentFeedMode

                );

            }
        );

}


/* =========================================================
   24. FEED VACÍO
========================================================= */

function renderEmptyFeed(
    container
) {

    let title =
        "Todavía no hay publicaciones";


    let text =
        "Las nuevas empresas aparecerán aquí.";


    if (
        currentFeedMode ===
        "following"
    ) {

        title =
            "Tu bandeja de Siguiendo está vacía";


        text =
            "Ve a Descubrir y sigue empresas para construir tu propio feed.";

    }


    else if (
        currentFeedMode ===
        "trending"
    ) {

        title =
            "Todavía no hay tendencias";


        text =
            "Las señales de mercado decidirán qué empresas suben aquí.";

    }


    container.innerHTML = `

        <section
            class="feed-empty"
        >

            <span
                class="eyebrow"
            >
                MAHPE
            </span>


            <h2>

                ${escapeHTML(
                    title
                )}

            </h2>


            <p class="muted">

                ${escapeHTML(
                    text
                )}

            </p>


            ${
                currentFeedMode ===
                "following"

                    ? `

                        <button
                            class="secondary-button"
                            type="button"
                            onclick="setFeedMode('explore')"
                        >

                            DESCUBRIR EMPRESAS

                        </button>

                    `

                    : ""
            }

        </section>

    `;

}


/* =========================================================
   25. VISUAL DE PUBLICACIÓN
========================================================= */

function renderPostVisual(
    post,
    company
) {

    const product =
        getProductById(
            post.productId
        );


    const image =
        post.image ||
        getProductCover(
            product
        );


    if (image) {

        const productName =
            product
                ? product.name
                : post.title;


        const price =
            product
                ? Number(
                    product.price
                ) || 0
                : Number(
                    post.price
                ) || 0;


        return `

            <div
                class="post-visual has-product-image"
            >

                <img
                    class="post-product-image"
                    src="${image}"
                    alt="${escapeHTML(
                        productName
                    )}"
                >


                <div
                    class="post-product-overlay"
                >

                    <div>

                        <small>
                            PRODUCTO
                        </small>


                        <strong>

                            ${escapeHTML(
                                productName
                            )}

                        </strong>

                    </div>


                    ${
                        price > 0

                            ? `

                                <span
                                    class="price"
                                >

                                    S/ ${formatPrice(
                                        price
                                    )}

                                </span>

                            `

                            : ""
                    }

                </div>

            </div>

        `;

    }


    return `

        <div
            class="post-visual"
        >

            <div
                class="visual-brand"
            >

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

    `;

}


/* =========================================================
   26. RENDER FEED
========================================================= */

function renderFeed() {

    const container =
        document.getElementById(
            "feedContainer"
        );


    if (!container) {

        return;

    }


    ensureFeedShell();


    updateFeedControls();


    const posts =
        getVisiblePosts();


    container.innerHTML =
        "";


    if (!posts.length) {

        renderEmptyFeed(
            container
        );

        return;

    }


    posts.forEach(
        post => {

            const company =
                getPostCompany(
                    post
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


            const viewKey =
                post.id +
                "-view";


            const interactionKey =
                post.id +
                "-interaction";


            const interestKey =
                post.id +
                "-interest";


            const commitmentKey =
                post.id +
                "-commitment";


            const following =
                isFollowingCompany(
                    company.id
                );


            article.innerHTML = `

                <div
                    class="post-header"
                >

                    ${renderCompanyAvatar(
                        company,
                        "company-avatar"
                    )}


                    <div
                        class="post-company"
                    >

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
                        class="follow-button ${
                            following
                                ? "following"
                                : ""
                        }"
                        data-company="${company.id}"
                        type="button"
                    >

                        ${
                            following
                                ? "Siguiendo"
                                : "Seguir"
                        }

                    </button>

                </div>


                ${renderPostVisual(
                    post,
                    company
                )}


                <div
                    class="post-body"
                >

                    <p
                        class="post-description"
                    >

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


                    <div
                        class="signals"
                    >

                        <button
                            class="signal-button ${
                                mahpeState.interactions[
                                    viewKey
                                ]
                                    ? "selected"
                                    : ""
                            }"
                            data-post="${post.id}"
                            data-signal="view"
                            type="button"
                        >

                            <span>👁</span>

                            <strong>

                                ${getDisplayedPostMetric(
                                    post,
                                    "views"
                                )}

                            </strong>

                            <small>
                                Vistas
                            </small>

                        </button>


                        <button
                            class="signal-button ${
                                mahpeState.interactions[
                                    interactionKey
                                ]
                                    ? "selected"
                                    : ""
                            }"
                            data-post="${post.id}"
                            data-signal="interaction"
                            type="button"
                        >

                            <span>♡</span>

                            <strong>

                                ${getDisplayedPostMetric(
                                    post,
                                    "interactions"
                                )}

                            </strong>

                            <small>
                                Interacción
                            </small>

                        </button>


                        <button
                            class="signal-button ${
                                mahpeState.interactions[
                                    interestKey
                                ]
                                    ? "selected"
                                    : ""
                            }"
                            data-post="${post.id}"
                            data-signal="interest"
                            type="button"
                        >

                            <span>🔥</span>

                            <strong>

                                ${getDisplayedPostMetric(
                                    post,
                                    "interested"
                                )}

                            </strong>

                            <small>
                                Interesado
                            </small>

                        </button>


                        <button
                            class="signal-button ${
                                mahpeState.interactions[
                                    commitmentKey
                                ]
                                    ? "selected"
                                    : ""
                            }"
                            data-post="${post.id}"
                            data-signal="commitment"
                            type="button"
                        >

                            <span>💰</span>

                            <strong>

                                ${getDisplayedPostMetric(
                                    post,
                                    "committed"
                                )}

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

        }
    );


    bindFeedEvents();

}


/* =========================================================
   27. SEGUIR / DEJAR DE SEGUIR
========================================================= */

function toggleCompanyFollow(
    companyId
) {

    if (!companyId) {

        return;

    }


    const company =
        getCompanyById(
            companyId
        );


    if (!company) {

        return;

    }


    const wasFollowing =
        isFollowingCompany(
            companyId
        );


    if (wasFollowing) {

        delete mahpeState.following[
            companyId
        ];


        if (!company.demo) {

            company.followers =
                Math.max(

                    0,

                    Number(
                        company.followers ||
                        0
                    ) -
                    1

                );

        }


        addMahpeEvent(

            "follow",

            "Dejaste de seguir a " +
            company.name +
            ".",

            companyId

        );

    }

    else {

        mahpeState.following[
            companyId
        ] = true;


        if (!company.demo) {

            company.followers =
                Number(
                    company.followers ||
                    0
                ) +
                1;


            company.value =
                Number(
                    company.value ||
                    0
                ) +
                4;

        }


        if (
            !mahpeState.followRewards[
                companyId
            ]
        ) {

            mahpeState.mahpes +=
                2;


            mahpeState.followRewards[
                companyId
            ] = true;

        }


        addMahpeEvent(

            "follow",

            "Ahora sigues a " +
            company.name +
            ".",

            companyId

        );

    }


    saveMahpeState();


    renderFeed();


    renderActivityInbox();

}


/* =========================================================
   28. EVENTOS DEL FEED
========================================================= */

function bindFeedEvents() {

    document
        .querySelectorAll(
            ".follow-button"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>

                        toggleCompanyFollow(
                            button.dataset.company
                        );

            }
        );


    document
        .querySelectorAll(
            ".signal-button"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        const postId =
                            button.dataset.post;


                        const signal =
                            button.dataset.signal;


                        const key =
                            postId +
                            "-" +
                            signal;


                        /*
                           Una señal por usuario local
                           para cada publicación/tipo.
                        */

                        if (
                            mahpeState.interactions[
                                key
                            ]
                        ) {

                            return;

                        }


                        mahpeState.interactions[
                            key
                        ] = true;


                        applySignal(
                            postId,
                            signal
                        );

                    };

            }
        );

}


/* =========================================================
   29. APLICAR SEÑAL
========================================================= */

function applySignal(
    postId,
    signal
) {

    const realPost =
        mahpeState.posts.find(

            item =>
                item.id ===
                postId

        );


    const post =
        realPost ||

        (
            postId ===
                demoPost.id

                ? demoPost
                : null
        );


    if (!post) {

        return;

    }


    const company =
        getPostCompany(
            post
        );


    if (!company) {

        return;

    }


    const product =
        realPost &&
        realPost.productId

            ? getProductById(
                realPost.productId
            )

            : null;


    if (product) {

        migrateProductData(
            product
        );

    }


    /* -------------------------
       👁 VISTA
    ------------------------- */

    if (
        signal ===
        "view"
    ) {

        if (realPost) {

            realPost.views =
                Number(
                    realPost.views ||
                    0
                ) +
                1;

        }


        if (product) {

            product.metrics.views +=
                1;

        }

    }


    /* -------------------------
       ♡ INTERACCIÓN
    ------------------------- */

    if (
        signal ===
        "interaction"
    ) {

        if (realPost) {

            realPost.interactions =
                Number(
                    realPost.interactions ||
                    0
                ) +
                1;


            migrateCompanyBusinessData(
                company
            );


            company.interactions +=
                1;


            company.activity =
                clamp(
                    company.activity +
                    1
                );


            company.value +=
                5;

        }


        if (product) {

            product.metrics.interactions +=
                1;

        }


        mahpeState.mahpes +=
            1;

    }


    /* -------------------------
       🔥 INTERESADO
    ------------------------- */

    if (
        signal ===
        "interest"
    ) {

        if (realPost) {

            realPost.interested =
                Number(
                    realPost.interested ||
                    0
                ) +
                1;


            migrateCompanyBusinessData(
                company
            );


            company.interested +=
                1;


            company.marketResponse =
                clamp(
                    company.marketResponse +
                    2
                );


            company.productValidation =
                clamp(
                    company.productValidation +
                    1
                );


            company.value +=
                20;

        }


        if (product) {

            product.metrics.interested +=
                1;

        }


        mahpeState.mahpes +=
            2;

    }


    /* -------------------------
       💰 COMPROMETIDO
    ------------------------- */

    if (
        signal ===
        "commitment"
    ) {

        if (realPost) {

            realPost.committed =
                Number(
                    realPost.committed ||
                    0
                ) +
                1;


            migrateCompanyBusinessData(
                company
            );


            company.committed +=
                1;


            company.marketResponse =
                clamp(
                    company.marketResponse +
                    4
                );


            company.productValidation =
                clamp(
                    company.productValidation +
                    3
                );


            company.value +=
                50;


            company.capital +=
                10;

        }


        if (product) {

            product.metrics.committed +=
                1;

        }


        mahpeState.mahpes +=
            3;

    }


    if (realPost) {

        recalculateCompanyStage(
            company
        );

    }


    saveMahpeState();


    renderFeed();


    renderCompanyDashboard();


    renderActivityInbox();

}


/* =========================================================
   30. FUNCIONES GLOBALES DEL FEED
========================================================= */

window.setFeedMode =
    setFeedMode;


/* =========================================================
   FIN PARTE 1/4

   NO PEGUES CÓDIGO ENTRE ESTA PARTE
   Y LA PARTE 2.

   PARTE 2/4 CONTINÚA CON:

   - Crear empresa
   - Logo / foto de marca
   - "Crea tu logo con IA"
   - links externos
   - Productos
   - 5 imágenes
   - portada
   - editor
   - publicar producto
========================================================= */
/* =========================================================
   MAHPE v1.2

   PARTE 2/4

   - Crear empresa
   - Identidad visual
   - Subir logo
   - Recursos externos para crear logo con IA
   - Productos
   - Galería de imágenes
   - Portada
   - Crear / editar / eliminar producto
   - Publicar producto en MAHPE
========================================================= */


/* =========================================================
   31. ELEMENTOS — CREAR EMPRESA
========================================================= */

const companyNameInput =
    document.getElementById(
        "companyNameInput"
    );


const companyCategoryInput =
    document.getElementById(
        "companyCategoryInput"
    );


const companyDescriptionInput =
    document.getElementById(
        "companyDescriptionInput"
    );


const companyProductInput =
    document.getElementById(
        "companyProductInput"
    );


const companyPriceInput =
    document.getElementById(
        "companyPriceInput"
    );


const companyAudienceInput =
    document.getElementById(
        "companyAudienceInput"
    );


const createCompanyButton =
    document.getElementById(
        "createCompanyButton"
    );


const createCompanyStatus =
    document.getElementById(
        "createCompanyStatus"
    );


/* =========================================================
   32. CREAR EMPRESA
========================================================= */

function createCompany() {

    const name =
        companyNameInput
            ? companyNameInput.value.trim()
            : "";


    const category =
        companyCategoryInput
            ? companyCategoryInput.value.trim()
            : "";


    const description =
        companyDescriptionInput
            ? companyDescriptionInput.value.trim()
            : "";


    const product =
        companyProductInput
            ? companyProductInput.value.trim()
            : "";


    const price =
        companyPriceInput
            ? Number(
                companyPriceInput.value
            )
            : 0;


    const audience =
        companyAudienceInput
            ? companyAudienceInput.value.trim()
            : "";


    if (
        !name ||
        !category ||
        !description
    ) {

        if (createCompanyStatus) {

            createCompanyStatus.textContent =
                "Completa el nombre, categoría y descripción.";

        }


        return;

    }


    const company = {

        id:
            generateId(
                "company"
            ),

        name,

        category,

        description,

        product,

        price:
            Number.isFinite(price)
                ? price
                : 0,

        audience,

        stage:
            "Idea",

        followers: 0,

        interactions: 0,

        interested: 0,

        committed: 0,

        value: 500,

        capital: 500,

        activity: 20,

        marketResponse: 20,

        locationStrength: 20,

        risk: 15,

        designLevel: 20,

        productValidation: 10,

        marketKnowledge: 10,

        campaignPower: 0,

        decisions: [],

        brandImage: null,

        brandImageUpdatedAt: null,

        createdAt:
            new Date()
                .toISOString()

    };


    mahpeState.companies.push(
        company
    );


    currentCompanyId =
        company.id;


    addMahpeEvent(

        "company",

        "Creaste " +
        company.name +
        ".",

        company.id

    );


    saveMahpeState();


    if (createCompanyStatus) {

        createCompanyStatus.textContent =
            "✓ Empresa creada. Ya puedes desarrollar su identidad y productos.";

    }


    if (companyNameInput) {

        companyNameInput.value =
            "";

    }


    if (companyCategoryInput) {

        companyCategoryInput.value =
            "";

    }


    if (companyDescriptionInput) {

        companyDescriptionInput.value =
            "";

    }


    if (companyProductInput) {

        companyProductInput.value =
            "";

    }


    if (companyPriceInput) {

        companyPriceInput.value =
            "";

    }


    if (companyAudienceInput) {

        companyAudienceInput.value =
            "";

    }


    renderActivityInbox();


    renderCompanyDashboard();


    updateProfile();


    openView(
        "companyView"
    );

}


/* =========================================================
   33. BOTÓN CREAR EMPRESA
========================================================= */

if (createCompanyButton) {

    createCompanyButton.addEventListener(

        "click",

        createCompany

    );

}


/* =========================================================
   34. IDENTIDAD DE MARCA
========================================================= */

function renderBrandIdentity(
    company
) {

    if (!company) {

        return "";

    }


    const avatar =
        company.brandImage

            ? `

                <div
                    class="brand-profile-image has-image"
                >

                    <img
                        src="${company.brandImage}"
                        alt="Logo de ${escapeHTML(
                            company.name
                        )}"
                    >

                </div>

            `

            : `

                <div
                    class="brand-profile-image"
                >

                    ${escapeHTML(
                        company.name
                            .charAt(0)
                            .toUpperCase()
                    )}

                </div>

            `;


    return `

        <section
            class="brand-identity-card"
        >

            <div
                class="brand-identity-header"
            >

                ${avatar}


                <div
                    class="brand-identity-copy"
                >

                    <span
                        class="eyebrow"
                    >
                        IDENTIDAD DE MARCA
                    </span>


                    <h3>

                        ${escapeHTML(
                            company.name
                        )}

                    </h3>


                    <p class="muted">

                        ${
                            company.brandImage

                                ? "Este logo representa tu empresa dentro de MAHPE."

                                : "Agrega un logo para que tu empresa sea reconocible."
                        }

                    </p>

                </div>

            </div>


            <div
                class="brand-identity-actions"
            >

                <label
                    class="secondary-button brand-upload-button"
                    for="brandLogoInput"
                >

                    ${
                        company.brandImage

                            ? "CAMBIAR LOGO"

                            : "SUBIR LOGO"
                    }

                </label>


                <input
                    id="brandLogoInput"
                    type="file"
                    accept="image/*"
                    hidden
                >


                ${
                    company.brandImage

                        ? `

                            <button
                                id="removeBrandLogoButton"
                                class="secondary-button"
                                type="button"
                            >

                                QUITAR

                            </button>

                        `

                        : ""
                }

            </div>


            <div
                id="brandUploadStatus"
                class="form-message"
                aria-live="polite"
            ></div>


            <div
                class="brand-ai-help"
            >

                <strong>
                    ¿Aún no tienes logo?
                </strong>


                <p>
                    Crea tu logo con IA:
                </p>


                <div
                    class="brand-ai-links"
                >

                    <a
                        href="https://chatgpt.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ChatGPT
                    </a>


                    <a
                        href="https://www.canva.com/ai-logo-generator/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Canva
                    </a>


                    <a
                        href="https://www.adobe.com/express/create/ai/logo"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Adobe Express
                    </a>


                    <a
                        href="https://looka.com/ai-logo-generator/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Looka
                    </a>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   35. CONECTAR IDENTIDAD DE MARCA
========================================================= */

function bindBrandIdentityEvents() {

    const input =
        document.getElementById(
            "brandLogoInput"
        );


    const removeButton =
        document.getElementById(
            "removeBrandLogoButton"
        );


    if (input) {

        input.onchange =
            handleBrandLogoUpload;

    }


    if (removeButton) {

        removeButton.onclick =
            removeBrandLogo;

    }

}


/* =========================================================
   36. SUBIR LOGO
========================================================= */

async function handleBrandLogoUpload(
    event
) {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {

        return;

    }


    const status =
        document.getElementById(
            "brandUploadStatus"
        );


    if (status) {

        status.textContent =
            "Procesando imagen...";

    }


    try {

        /*
           Logo:
           resolución menor que producto
           porque se utilizará principalmente
           como avatar.
        */

        const image =
            await compressImageFile(

                file,

                {

                    maxDimension: 700,

                    quality: 0.82

                }

            );


        company.brandImage =
            image;


        company.brandImageUpdatedAt =
            new Date()
                .toISOString();


        migrateCompanyBusinessData(
            company
        );


        company.designLevel =
            clamp(
                company.designLevel +
                4
            );


        company.value +=
            15;


        addMahpeEvent(

            "brand",

            "Actualizaste la identidad visual de " +
            company.name +
            ".",

            company.id

        );


        saveMahpeState();


        renderCompanyDashboard();


        renderFeed();


        renderActivityInbox();


        updateProfile();

    }

    catch (error) {

        console.error(
            error
        );


        if (status) {

            status.textContent =
                "No se pudo procesar el logo.";

        }

    }

}


/* =========================================================
   37. QUITAR LOGO
========================================================= */

function removeBrandLogo() {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    company.brandImage =
        null;


    company.brandImageUpdatedAt =
        null;


    addMahpeEvent(

        "brand",

        "Quitaste el logo de " +
        company.name +
        ".",

        company.id

    );


    saveMahpeState();


    renderCompanyDashboard();


    renderFeed();


    renderActivityInbox();

}


/* =========================================================
   38. ELEMENTOS DEL EDITOR DE PRODUCTO
========================================================= */

const productEditor =
    document.getElementById(
        "productEditor"
    );


const productEditorTitle =
    document.getElementById(
        "productEditorTitle"
    );


const productNameInput =
    document.getElementById(
        "productNameInput"
    );


const productCategoryInput =
    document.getElementById(
        "productCategoryInput"
    );


const productPriceInput =
    document.getElementById(
        "productPriceInput"
    );


const productDescriptionInput =
    document.getElementById(
        "productDescriptionInput"
    );


const productImagesInput =
    document.getElementById(
        "productImagesInput"
    );


const productImagePreview =
    document.getElementById(
        "productImagePreview"
    );


const cancelProductButton =
    document.getElementById(
        "cancelProductButton"
    );


const saveProductButton =
    document.getElementById(
        "saveProductButton"
    );


const productEditorStatus =
    document.getElementById(
        "productEditorStatus"
    );


/* =========================================================
   39. ABRIR EDITOR DE PRODUCTO
========================================================= */

function openProductEditor(
    productId = null
) {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    editingProductId =
        productId;


    productEditorImages =
        [];


    productEditorCoverIndex =
        0;


    if (productId) {

        const product =
            getProductById(
                productId
            );


        if (!product) {

            return;

        }


        if (productNameInput) {

            productNameInput.value =
                product.name || "";

        }


        if (productCategoryInput) {

            productCategoryInput.value =
                product.category || "";

        }


        if (productPriceInput) {

            productPriceInput.value =
                Number(
                    product.price
                ) || "";

        }


        if (productDescriptionInput) {

            productDescriptionInput.value =
                product.description ||
                "";

        }


        productEditorImages =
            Array.isArray(
                product.images
            )

                ? product.images.slice()

                : [];


        productEditorCoverIndex =
            Number(
                product.coverIndex
            ) || 0;


        if (productEditorTitle) {

            productEditorTitle.textContent =
                "Editar producto";

        }

    }

    else {

        if (productNameInput) {

            productNameInput.value =
                "";

        }


        if (productCategoryInput) {

            productCategoryInput.value =
                "";

        }


        if (productPriceInput) {

            productPriceInput.value =
                "";

        }


        if (productDescriptionInput) {

            productDescriptionInput.value =
                "";

        }


        if (productImagesInput) {

            productImagesInput.value =
                "";

        }


        if (productEditorTitle) {

            productEditorTitle.textContent =
                "Agregar producto";

        }

    }


    if (productEditorStatus) {

        productEditorStatus.textContent =
            "";

    }


    renderProductImagePreview();


    if (productEditor) {

        productEditor.classList.remove(
            "hidden"
        );


        setTimeout(
            () => {

                productEditor.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            },
            40
        );

    }

}


/* =========================================================
   40. CERRAR EDITOR
========================================================= */

function closeProductEditor(
    clear = true
) {

    if (productEditor) {

        productEditor.classList.add(
            "hidden"
        );

    }


    if (clear) {

        editingProductId =
            null;


        productEditorImages =
            [];


        productEditorCoverIndex =
            0;


        if (productImagesInput) {

            productImagesInput.value =
                "";

        }

    }

}


/* =========================================================
   41. CARGAR IMÁGENES DE PRODUCTO
========================================================= */

async function handleProductImages(
    event
) {

    const files =
        Array.from(
            event.target.files ||
            []
        );


    if (!files.length) {

        return;

    }


    const available =
        Math.max(

            0,

            5 -
            productEditorImages.length

        );


    if (available === 0) {

        if (productEditorStatus) {

            productEditorStatus.textContent =
                "Puedes guardar hasta 5 imágenes por producto.";

        }


        event.target.value =
            "";


        return;

    }


    const selectedFiles =
        files.slice(
            0,
            available
        );


    if (productEditorStatus) {

        productEditorStatus.textContent =
            "Procesando imágenes...";

    }


    for (
        const file of selectedFiles
    ) {

        try {

            const image =
                await compressImageFile(

                    file,

                    {

                        maxDimension:
                            1200,

                        quality:
                            0.76

                    }

                );


            productEditorImages.push(
                image
            );

        }

        catch (error) {

            console.error(
                "Imagen de producto:",
                error
            );

        }

    }


    if (
        productEditorCoverIndex >=
        productEditorImages.length
    ) {

        productEditorCoverIndex =
            0;

    }


    event.target.value =
        "";


    if (productEditorStatus) {

        if (
            files.length >
            available
        ) {

            productEditorStatus.textContent =
                "Se añadieron las imágenes disponibles hasta completar el máximo de 5.";

        }

        else {

            productEditorStatus.textContent =
                "";

        }

    }


    renderProductImagePreview();

}


/* =========================================================
   42. PREVISUALIZACIÓN DE IMÁGENES
========================================================= */

function renderProductImagePreview() {

    if (!productImagePreview) {

        return;

    }


    if (
        !productEditorImages.length
    ) {

        productImagePreview.innerHTML = `

            <div
                class="product-preview-empty"
            >

                Aún no has agregado imágenes.

            </div>

        `;


        return;

    }


    productImagePreview.innerHTML =
        productEditorImages
            .map(
                (
                    image,
                    index
                ) => `

                    <article
                        class="product-preview-item ${
                            index ===
                            productEditorCoverIndex

                                ? "is-cover"

                                : ""
                        }"
                    >

                        <div
                            class="product-preview-image"
                        >

                            <img
                                src="${image}"
                                alt="Imagen ${
                                    index + 1
                                } del producto"
                            >


                            ${
                                index ===
                                productEditorCoverIndex

                                    ? `

                                        <span
                                            class="cover-label"
                                        >

                                            PORTADA

                                        </span>

                                    `

                                    : ""
                            }

                        </div>


                        <div
                            class="product-preview-actions"
                        >

                            <button
                                class="product-cover-button"
                                type="button"
                                data-cover-index="${index}"
                            >

                                ${
                                    index ===
                                    productEditorCoverIndex

                                        ? "PORTADA"

                                        : "USAR DE PORTADA"
                                }

                            </button>


                            <button
                                class="product-remove-image"
                                type="button"
                                data-remove-index="${index}"
                                aria-label="Eliminar imagen"
                            >

                                ×

                            </button>

                        </div>

                    </article>

                `
            )
            .join("");


    productImagePreview
        .querySelectorAll(
            "[data-cover-index]"
        )
        .forEach(
            button => {

                button.onclick =
                    function() {

                        productEditorCoverIndex =
                            Number(
                                this.dataset.coverIndex
                            ) || 0;


                        renderProductImagePreview();

                    };

            }
        );


    productImagePreview
        .querySelectorAll(
            "[data-remove-index]"
        )
        .forEach(
            button => {

                button.onclick =
                    function() {

                        removeProductEditorImage(

                            Number(
                                this.dataset.removeIndex
                            )

                        );

                    };

            }
        );

}


/* =========================================================
   43. ELIMINAR IMAGEN DEL EDITOR
========================================================= */

function removeProductEditorImage(
    index
) {

    if (
        index < 0 ||
        index >=
            productEditorImages.length
    ) {

        return;

    }


    productEditorImages.splice(
        index,
        1
    );


    if (
        !productEditorImages.length
    ) {

        productEditorCoverIndex =
            0;

    }

    else if (
        index <
        productEditorCoverIndex
    ) {

        productEditorCoverIndex -=
            1;

    }

    else if (
        productEditorCoverIndex >=
        productEditorImages.length
    ) {

        productEditorCoverIndex =
            productEditorImages.length -
            1;

    }


    renderProductImagePreview();

}


/* =========================================================
   44. GUARDAR PRODUCTO
========================================================= */

function saveProduct() {

    const company =
        getCurrentCompany();


    if (!company) {

        if (productEditorStatus) {

            productEditorStatus.textContent =
                "Primero debes crear una empresa.";

        }


        return;

    }


    const name =
        productNameInput
            ? productNameInput.value.trim()
            : "";


    const category =
        productCategoryInput
            ? productCategoryInput.value.trim()
            : "";


    const price =
        productPriceInput
            ? Number(
                productPriceInput.value
            )
            : 0;


    const description =
        productDescriptionInput
            ? productDescriptionInput.value.trim()
            : "";


    if (
        !name ||
        !category ||
        !description
    ) {

        if (productEditorStatus) {

            productEditorStatus.textContent =
                "Completa el nombre, categoría y descripción.";

        }


        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        if (productEditorStatus) {

            productEditorStatus.textContent =
                "Ingresa un precio válido.";

        }


        return;

    }


    if (
        productEditorImages.length >
        5
    ) {

        if (productEditorStatus) {

            productEditorStatus.textContent =
                "El máximo es de 5 imágenes.";

        }


        return;

    }


    if (editingProductId) {

        const product =
            getProductById(
                editingProductId
            );


        if (!product) {

            return;

        }


        product.name =
            name;


        product.category =
            category;


        product.price =
            price;


        product.description =
            description;


        product.images =
            productEditorImages.slice();


        product.coverIndex =
            productEditorCoverIndex;


        product.updatedAt =
            new Date()
                .toISOString();


        migrateProductData(
            product
        );


        addMahpeEvent(

            "product",

            "Actualizaste " +
            product.name +
            ".",

            company.id

        );

    }

    else {

        const product = {

            id:
                generateId(
                    "product"
                ),

            companyId:
                company.id,

            name,

            category,

            price,

            description,

            images:
                productEditorImages.slice(),

            coverIndex:
                productEditorCoverIndex,

            metrics: {

                views: 0,

                interactions: 0,

                interested: 0,

                committed: 0

            },

            published:
                false,

            createdAt:
                new Date()
                    .toISOString(),

            updatedAt:
                new Date()
                    .toISOString()

        };


        mahpeState.products.push(
            product
        );


        migrateCompanyBusinessData(
            company
        );


        company.productValidation =
            clamp(
                company.productValidation +
                2
            );


        company.activity =
            clamp(
                company.activity +
                2
            );


        company.value +=
            15;


        addMahpeEvent(

            "product",

            "Creaste el producto " +
            product.name +
            ".",

            company.id

        );

    }


    recalculateCompanyStage(
        company
    );


    saveMahpeState();


    closeProductEditor();


    currentCompanyTab =
        "products";


    renderCompanyDashboard();


    renderActivityInbox();

}


/* =========================================================
   45. EDITAR PRODUCTO
========================================================= */

function editProduct(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        return;

    }


    currentCompanyTab =
        "products";


    openProductEditor(
        productId
    );

}


/* =========================================================
   46. ELIMINAR PRODUCTO
========================================================= */

function deleteProduct(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        return;

    }


    const company =
        getCompanyById(
            product.companyId
        );


    const confirmed =
        window.confirm(

            "¿Eliminar " +
            product.name +
            " de tu empresa?"

        );


    if (!confirmed) {

        return;

    }


    mahpeState.products =
        mahpeState.products.filter(

            item =>
                item.id !==
                productId

        );


    /*
       Las publicaciones históricas no se borran.

       Simplemente dejan de estar vinculadas
       a un producto activo.
    */

    mahpeState.posts.forEach(
        post => {

            if (
                post.productId ===
                productId
            ) {

                post.productId =
                    null;

            }

        }
    );


    if (company) {

        addMahpeEvent(

            "product",

            "Eliminaste " +
            product.name +
            ".",

            company.id

        );

    }


    saveMahpeState();


    renderCompanyDashboard();


    renderFeed();


    renderActivityInbox();

}


/* =========================================================
   47. PUBLICAR PRODUCTO EN MAHPE
========================================================= */

function publishProduct(
    productId
) {

    const product =
        getProductById(
            productId
        );


    if (!product) {

        return;

    }


    const company =
        getCompanyById(
            product.companyId
        );


    if (!company) {

        return;

    }


    const cover =
        getProductCover(
            product
        );


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

        title:
            product.name,

        text:
            product.description,

        productId:
            product.id,

        image:
            cover,

        price:
            Number(
                product.price
            ) || 0,

        views: 0,

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


    product.published =
        true;


    product.lastPublishedAt =
        post.createdAt;


    migrateCompanyBusinessData(
        company
    );


    company.activity =
        clamp(
            company.activity +
            3
        );


    company.value +=
        10;


    addMahpeEvent(

        "post",

        "Publicaste " +
        product.name +
        " en MAHPE.",

        company.id

    );


    recalculateCompanyStage(
        company
    );


    saveMahpeState();


    renderCompanyDashboard();


    renderFeed();


    renderActivityInbox();


    /*
       Después de publicar dejamos
       al usuario en Descubrir para que
       vea inmediatamente el resultado.
    */

    currentFeedMode =
        "explore";


    updateFeedControls();


    openView(
        "feedView"
    );


    renderFeed();

}


/* =========================================================
   48. PUNTUACIÓN DE PRODUCTO
========================================================= */

function getProductScore(
    product
) {

    if (!product) {

        return 0;

    }


    migrateProductData(
        product
    );


    return (

        product.metrics.views *
            0.05 +

        product.metrics.interactions *
            1 +

        product.metrics.interested *
            4 +

        product.metrics.committed *
            10

    );

}


/* =========================================================
   49. POTENCIAL DE PRODUCTO
========================================================= */

function getProductPotential(
    product
) {

    const score =
        getProductScore(
            product
        );


    if (
        score >=
        80
    ) {

        return {

            label:
                "ALTO",

            className:
                "high"

        };

    }


    if (
        score >=
        25
    ) {

        return {

            label:
                "MEDIO",

            className:
                "medium"

        };

    }


    return {

        label:
            "BAJO",

        className:
            "low"

    };

}


/* =========================================================
   50. TARJETA DE PRODUCTO
========================================================= */

function renderProductCard(
    product
) {

    const cover =
        getProductCover(
            product
        );


    const potential =
        getProductPotential(
            product
        );


    return `

        <article
            class="product-card"
            data-product-id="${product.id}"
        >

            <div
                class="product-card-image"
            >

                ${
                    cover

                        ? `

                            <img
                                src="${cover}"
                                alt="${escapeHTML(
                                    product.name
                                )}"
                            >

                        `

                        : `

                            <div
                                class="product-image-placeholder"
                            >

                                <span>
                                    +
                                </span>

                                <small>
                                    Sin imagen
                                </small>

                            </div>

                        `
                }


                ${
                    cover

                        ? `

                            <span
                                class="product-cover-badge"
                            >
                                PORTADA
                            </span>

                        `

                        : ""
                }


                <span
                    class="product-status ${
                        product.published
                            ? "published"
                            : ""
                    }"
                >

                    ${
                        product.published

                            ? "PUBLICADO"

                            : "BORRADOR"
                    }

                </span>

            </div>


            <div
                class="product-card-body"
            >

                <small
                    class="product-category"
                >

                    ${escapeHTML(
                        product.category
                    )}

                </small>


                <h3>

                    ${escapeHTML(
                        product.name
                    )}

                </h3>


                <strong
                    class="product-price"
                >

                    S/ ${formatPrice(
                        product.price
                    )}

                </strong>


                <p
                    class="product-description"
                >

                    ${escapeHTML(
                        product.description
                    )}

                </p>


                <div
                    class="product-signals"
                >

                    <span
                        class="product-signal"
                    >
                        👁
                        ${product.metrics.views}
                    </span>


                    <span
                        class="product-signal"
                    >
                        ♡
                        ${product.metrics.interactions}
                    </span>


                    <span
                        class="product-signal"
                    >
                        🔥
                        ${product.metrics.interested}
                    </span>


                    <span
                        class="product-signal"
                    >
                        💰
                        ${product.metrics.committed}
                    </span>

                </div>


                <div
                    class="product-potential"
                >

                    <small>
                        Potencial
                    </small>


                    <strong
                        class="product-potential-badge ${potential.className}"
                    >

                        ${potential.label}

                    </strong>

                </div>


                <div
                    class="product-card-actions"
                >

                    <button
                        class="product-publish-button"
                        type="button"
                        data-publish-product="${product.id}"
                    >

                        ${
                            product.published

                                ? "PUBLICAR DE NUEVO"

                                : "PUBLICAR EN MAHPE"
                        }

                    </button>


                    <button
                        class="product-edit-button"
                        type="button"
                        data-edit-product="${product.id}"
                    >

                        EDITAR

                    </button>


                    <button
                        class="product-delete-button"
                        type="button"
                        data-delete-product="${product.id}"
                        aria-label="Eliminar ${escapeHTML(
                            product.name
                        )}"
                    >

                        ×

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   51. VISTA PRODUCTOS
========================================================= */

function renderCompanyProducts(
    company
) {

    const products =
        getCompanyProducts(
            company.id
        );


    const totalViews =
        products.reduce(

            (
                total,
                product
            ) =>

                total +
                Number(
                    product.metrics.views ||
                    0
                ),

            0

        );


    const totalInterested =
        products.reduce(

            (
                total,
                product
            ) =>

                total +
                Number(
                    product.metrics.interested ||
                    0
                ),

            0

        );


    const totalCommitted =
        products.reduce(

            (
                total,
                product
            ) =>

                total +
                Number(
                    product.metrics.committed ||
                    0
                ),

            0

        );


    return `

        <section
            class="company-products-container"
        >

            <div
                class="products-header"
            >

                <div>

                    <span
                        class="eyebrow"
                    >
                        VITRINA
                    </span>


                    <h2>
                        Productos
                    </h2>


                    <p class="muted">

                        Prueba tus productos y observa
                        cómo responde el mercado.

                    </p>

                </div>


                <button
                    id="addProductButton"
                    class="add-product-button"
                    type="button"
                >

                    + AGREGAR PRODUCTO

                </button>

            </div>


            <div
                class="product-summary"
            >

                <article
                    class="product-summary-card"
                >

                    <strong>

                        ${products.length}

                    </strong>

                    <span>
                        Productos
                    </span>

                </article>


                <article
                    class="product-summary-card"
                >

                    <strong>

                        ${totalViews}

                    </strong>

                    <span>
                        Vistas
                    </span>

                </article>


                <article
                    class="product-summary-card"
                >

                    <strong>

                        ${totalInterested}

                    </strong>

                    <span>
                        Interesados
                    </span>

                </article>


                <article
                    class="product-summary-card"
                >

                    <strong>

                        ${totalCommitted}

                    </strong>

                    <span>
                        Comprometidos
                    </span>

                </article>

            </div>


            ${
                products.length

                    ? `

                        <div
                            class="products-grid"
                        >

                            ${products
                                .map(
                                    renderProductCard
                                )
                                .join("")}


                            <button
                                class="add-product-card"
                                type="button"
                                id="addProductCard"
                            >

                                <span>
                                    +
                                </span>

                                <strong>
                                    Agregar producto
                                </strong>

                            </button>

                        </div>

                    `

                    : `

                        <div
                            class="products-empty"
                        >

                            <span>
                                ◇
                            </span>


                            <h3>
                                Tu vitrina está vacía
                            </h3>


                            <p>

                                Agrega tu primer producto,
                                coloca sus imágenes y publícalo
                                para comenzar a medir interés.

                            </p>


                            <button
                                id="emptyAddProductButton"
                                class="primary-button"
                                type="button"
                            >

                                AGREGAR MI PRIMER PRODUCTO

                            </button>

                        </div>

                    `
            }

        </section>

    `;

}


/* =========================================================
   52. ESTADÍSTICAS DE PRODUCTOS
========================================================= */

function renderProductStatistics(
    company
) {

    const products =
        getCompanyProducts(
            company.id
        )
        .slice()
        .sort(

            (
                a,
                b
            ) =>

                getProductScore(
                    b
                ) -

                getProductScore(
                    a
                )

        );


    if (!products.length) {

        return `

            <section
                class="product-statistics"
            >

                <div
                    class="products-empty"
                >

                    <span>
                        ◇
                    </span>


                    <h3>
                        Todavía no hay datos
                    </h3>


                    <p>

                        Crea productos y publícalos
                        para comenzar a comparar
                        la respuesta del mercado.

                    </p>


                    <button
                        id="statisticsAddProductButton"
                        class="primary-button"
                        type="button"
                    >

                        CREAR PRODUCTO

                    </button>

                </div>

            </section>

        `;

    }


    const maximumScore =
        Math.max(

            1,

            ...products.map(
                product =>
                    getProductScore(
                        product
                    )
            )

        );


    return `

        <section
            class="product-statistics"
        >

            <div
                class="products-header"
            >

                <div>

                    <span
                        class="eyebrow"
                    >
                        RESPUESTA DEL MERCADO
                    </span>


                    <h2>
                        Rendimiento de productos
                    </h2>


                    <p class="muted">

                        Compara qué productos están
                        generando mejores señales.

                    </p>

                </div>

            </div>


            <div
                class="product-performance-list"
            >

                ${products
                    .map(
                        product => {

                            const cover =
                                getProductCover(
                                    product
                                );


                            const score =
                                getProductScore(
                                    product
                                );


                            const width =
                                Math.max(

                                    4,

                                    Math.round(

                                        score /
                                        maximumScore *
                                        100

                                    )

                                );


                            const potential =
                                getProductPotential(
                                    product
                                );


                            return `

                                <article
                                    class="product-performance-item"
                                >

                                    <div
                                        class="product-performance-image"
                                    >

                                        ${
                                            cover

                                                ? `

                                                    <img
                                                        src="${cover}"
                                                        alt="${escapeHTML(
                                                            product.name
                                                        )}"
                                                    >

                                                `

                                                : `

                                                    <span>
                                                        ${escapeHTML(
                                                            product.name
                                                                .charAt(0)
                                                                .toUpperCase()
                                                        )}
                                                    </span>

                                                `
                                        }

                                    </div>


                                    <div
                                        class="product-performance-copy"
                                    >

                                        <div
                                            class="product-performance-heading"
                                        >

                                            <div>

                                                <strong>

                                                    ${escapeHTML(
                                                        product.name
                                                    )}

                                                </strong>


                                                <small>

                                                    👁 ${product.metrics.views}

                                                    ·

                                                    ♡ ${product.metrics.interactions}

                                                    ·

                                                    🔥 ${product.metrics.interested}

                                                    ·

                                                    💰 ${product.metrics.committed}

                                                </small>

                                            </div>


                                            <span
                                                class="product-potential-badge ${potential.className}"
                                            >

                                                ${potential.label}

                                            </span>

                                        </div>


                                        <div
                                            class="product-performance-track"
                                        >

                                            <div
                                                class="product-performance-fill"
                                                style="width:${width}%"
                                            ></div>

                                        </div>

                                    </div>


                                    <strong
                                        class="product-performance-score"
                                    >

                                        ${Math.round(
                                            score
                                        )}

                                    </strong>

                                </article>

                            `;

                        }
                    )
                    .join("")}

            </div>

        </section>

    `;

}


/* =========================================================
   53. EVENTOS DE PRODUCTOS
========================================================= */

function bindProductEvents() {

    const addButton =
        document.getElementById(
            "addProductButton"
        );


    const addCard =
        document.getElementById(
            "addProductCard"
        );


    const emptyButton =
        document.getElementById(
            "emptyAddProductButton"
        );


    const statisticsButton =
        document.getElementById(
            "statisticsAddProductButton"
        );


    [
        addButton,
        addCard,
        emptyButton,
        statisticsButton
    ]
    .filter(Boolean)
    .forEach(
        button => {

            button.onclick =
                () =>

                    openProductEditor();

        }
    );


    document
        .querySelectorAll(
            "[data-edit-product]"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>

                        editProduct(
                            button.dataset.editProduct
                        );

            }
        );


    document
        .querySelectorAll(
            "[data-publish-product]"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>

                        publishProduct(
                            button.dataset.publishProduct
                        );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-product]"
        )
        .forEach(
            button => {

                button.onclick =
                    () =>

                        deleteProduct(
                            button.dataset.deleteProduct
                        );

            }
        );

}


/* =========================================================
   54. EVENTOS DEL EDITOR
========================================================= */

if (productImagesInput) {

    productImagesInput.addEventListener(

        "change",

        handleProductImages

    );

}


if (cancelProductButton) {

    cancelProductButton.addEventListener(

        "click",

        function() {

            closeProductEditor();

        }

    );

}


if (saveProductButton) {

    saveProductButton.addEventListener(

        "click",

        saveProduct

    );

}


/* =========================================================
   55. PUBLICACIÓN GENERAL DE EMPRESA

   Se conserva además del sistema de productos.
========================================================= */

function publishCompanyPost() {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    const postTextInput =
        document.getElementById(
            "companyPostInput"
        );


    let text =
        postTextInput

            ? postTextInput.value.trim()

            : "";


    if (!text) {

        text =
            company.description;

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

        title:
            company.product ||
            company.name,

        text,

        productId:
            null,

        image:
            null,

        views: 0,

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


    migrateCompanyBusinessData(
        company
    );


    company.activity =
        clamp(
            company.activity +
            3
        );


    company.value +=
        10;


    addMahpeEvent(

        "post",

        "Publicaste una actualización de " +
        company.name +
        ".",

        company.id

    );


    recalculateCompanyStage(
        company
    );


    saveMahpeState();


    if (postTextInput) {

        postTextInput.value =
            "";

    }


    currentFeedMode =
        "explore";


    renderCompanyDashboard();


    renderActivityInbox();


    updateFeedControls();


    openView(
        "feedView"
    );


    renderFeed();

}


/* =========================================================
   56. FUNCIONES GLOBALES DE PRODUCTOS
========================================================= */

window.openProductEditor =
    openProductEditor;


window.editProduct =
    editProduct;


window.deleteProduct =
    deleteProduct;


window.publishProduct =
    publishProduct;


window.publishCompanyPost =
    publishCompanyPost;


/* =========================================================
   FIN PARTE 2/4

   NO CIERRES EL ARCHIVO.

   PEGA PARTE 3/4 INMEDIATAMENTE DEBAJO.

   PARTE 3/4:
   - Mi Empresa
   - Resumen / Productos / Estadísticas
   - dashboard completo
   - Business Engine
   - decisiones empresariales
   - crecimiento
   - etapas
   - perfil MAHPE
   - conexión visual del logo
========================================================= */
/* =========================================================
   MAHPE v1.2

   PARTE 3/4

   - Dashboard Mi Empresa
   - Resumen / Productos / Estadísticas
   - Identidad visual integrada
   - Métricas
   - Crecimiento
   - Business Engine
   - Decisiones empresariales
   - Etapas
   - Perfil MAHPE
========================================================= */


/* =========================================================
   57. CAMBIAR PESTAÑA DE EMPRESA
========================================================= */

function setCompanyTab(tab) {

    const allowedTabs = [
        "summary",
        "products",
        "statistics"
    ];


    if (!allowedTabs.includes(tab)) {

        tab = "summary";

    }


    currentCompanyTab = tab;


    closeProductEditor(false);


    renderCompanyDashboard();

}


/* =========================================================
   58. TABS DE EMPRESA
========================================================= */

function renderCompanyTabs() {

    return `

        <nav
            class="company-tabs"
            aria-label="Secciones de empresa"
        >

            <button
                type="button"
                class="company-tab ${
                    currentCompanyTab === "summary"
                        ? "active"
                        : ""
                }"
                data-company-tab="summary"
            >

                Resumen

            </button>


            <button
                type="button"
                class="company-tab ${
                    currentCompanyTab === "products"
                        ? "active"
                        : ""
                }"
                data-company-tab="products"
            >

                Productos

            </button>


            <button
                type="button"
                class="company-tab ${
                    currentCompanyTab === "statistics"
                        ? "active"
                        : ""
                }"
                data-company-tab="statistics"
            >

                Estadísticas

            </button>

        </nav>

    `;

}


/* =========================================================
   59. CONECTAR TABS DE EMPRESA
========================================================= */

function bindCompanyTabs() {

    document
        .querySelectorAll(
            "[data-company-tab]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        setCompanyTab(
                            button.dataset.companyTab
                        );

                    };

            }
        );

}


/* =========================================================
   60. TOTAL DE MÉTRICAS DE PRODUCTOS
========================================================= */

function getCompanyProductMetrics(
    companyId
) {

    const products =
        getCompanyProducts(
            companyId
        );


    return products.reduce(

        (
            totals,
            product
        ) => {

            migrateProductData(
                product
            );


            totals.views +=
                Number(
                    product.metrics.views ||
                    0
                );


            totals.interactions +=
                Number(
                    product.metrics.interactions ||
                    0
                );


            totals.interested +=
                Number(
                    product.metrics.interested ||
                    0
                );


            totals.committed +=
                Number(
                    product.metrics.committed ||
                    0
                );


            return totals;

        },

        {

            views: 0,

            interactions: 0,

            interested: 0,

            committed: 0

        }

    );

}


/* =========================================================
   61. MEJOR PRODUCTO
========================================================= */

function getBestCompanyProduct(
    companyId
) {

    const products =
        getCompanyProducts(
            companyId
        );


    if (!products.length) {

        return null;

    }


    return products
        .slice()
        .sort(

            (
                a,
                b
            ) =>

                getProductScore(
                    b
                ) -

                getProductScore(
                    a
                )

        )[0];

}


/* =========================================================
   62. PUNTUACIÓN GENERAL DE EMPRESA
========================================================= */

function calculateCompanyGrowthScore(
    company
) {

    if (!company) {

        return 0;

    }


    migrateCompanyBusinessData(
        company
    );


    const productMetrics =
        getCompanyProductMetrics(
            company.id
        );


    const score =

        company.activity *
            0.15 +

        company.marketResponse *
            0.20 +

        company.locationStrength *
            0.10 +

        company.designLevel *
            0.10 +

        company.productValidation *
            0.20 +

        company.marketKnowledge *
            0.10 +

        company.campaignPower *
            0.05 +

        Math.min(
            20,
            Number(
                company.followers ||
                0
            ) *
            0.20
        ) +

        Math.min(
            15,
            productMetrics.interested *
            0.5
        ) +

        Math.min(
            20,
            productMetrics.committed *
            2
        ) -

        company.risk *
            0.10;


    return clamp(
        score,
        0,
        100
    );

}


/* =========================================================
   63. ETAPA DE EMPRESA
========================================================= */

function recalculateCompanyStage(
    company
) {

    if (!company) {

        return;

    }


    migrateCompanyBusinessData(
        company
    );


    const products =
        getCompanyProducts(
            company.id
        );


    const publishedProducts =
        products.filter(
            product =>
                product.published
        );


    const score =
        calculateCompanyGrowthScore(
            company
        );


    let stage =
        "Idea";


    if (
        products.length >= 1 ||
        company.activity >= 28
    ) {

        stage =
            "En desarrollo";

    }


    if (
        publishedProducts.length >= 1 &&
        (
            company.interactions >= 3 ||
            company.interested >= 2 ||
            score >= 35
        )
    ) {

        stage =
            "Lanzada";

    }


    if (
        company.interested >= 8 ||
        company.committed >= 3 ||
        company.followers >= 15 ||
        score >= 55
    ) {

        stage =
            "En crecimiento";

    }


    if (
        company.committed >= 12 &&
        company.followers >= 40 &&
        score >= 75
    ) {

        stage =
            "Consolidada";

    }


    company.stage =
        stage;

}


/* =========================================================
   64. TEXTO DE CRECIMIENTO
========================================================= */

function getGrowthLabel(
    score
) {

    if (
        score >= 75
    ) {

        return "Crecimiento fuerte";

    }


    if (
        score >= 55
    ) {

        return "Ganando tracción";

    }


    if (
        score >= 35
    ) {

        return "Validación inicial";

    }


    if (
        score >= 20
    ) {

        return "En construcción";

    }


    return "Etapa inicial";

}


/* =========================================================
   65. RESUMEN DE EMPRESA
========================================================= */

function renderCompanySummary(
    company
) {

    migrateCompanyBusinessData(
        company
    );


    const products =
        getCompanyProducts(
            company.id
        );


    const productMetrics =
        getCompanyProductMetrics(
            company.id
        );


    const bestProduct =
        getBestCompanyProduct(
            company.id
        );


    const growthScore =
        calculateCompanyGrowthScore(
            company
        );


    const growthLabel =
        getGrowthLabel(
            growthScore
        );


    return `

        <div
            class="company-summary-panel"
        >

            ${renderBrandIdentity(
                company
            )}


            <section
                class="company-stats"
            >

                <article
                    class="stat-card"
                >

                    <strong>

                        ${Number(
                            company.followers ||
                            0
                        )}

                    </strong>

                    <span>
                        Seguidores
                    </span>

                </article>


                <article
                    class="stat-card"
                >

                    <strong>

                        ${
                            Number(
                                company.interactions ||
                                0
                            ) +
                            productMetrics.interactions
                        }

                    </strong>

                    <span>
                        Interacciones
                    </span>

                </article>


                <article
                    class="stat-card"
                >

                    <strong>

                        ${
                            Number(
                                company.interested ||
                                0
                            ) +
                            productMetrics.interested
                        }

                    </strong>

                    <span>
                        Interesados
                    </span>

                </article>


                <article
                    class="stat-card"
                >

                    <strong>

                        ${
                            Number(
                                company.committed ||
                                0
                            ) +
                            productMetrics.committed
                        }

                    </strong>

                    <span>
                        Comprometidos
                    </span>

                </article>

            </section>


            <section
                class="company-growth-card"
            >

                <div
                    class="company-growth-heading"
                >

                    <div>

                        <span
                            class="eyebrow"
                        >
                            CRECIMIENTO
                        </span>


                        <h3>

                            ${escapeHTML(
                                growthLabel
                            )}

                        </h3>

                    </div>


                    <strong>

                        ${growthScore}%

                    </strong>

                </div>


                <div
                    class="company-growth-track"
                >

                    <div
                        class="company-growth-fill"
                        style="width:${growthScore}%"
                    ></div>

                </div>


                <p class="muted">

                    El crecimiento combina actividad,
                    respuesta del mercado, productos,
                    ubicación, conocimiento y riesgo.

                </p>

            </section>


            ${
                bestProduct

                    ? renderBestProductSummary(
                        bestProduct
                    )

                    : renderNoProductsSummary()
            }


            ${renderCompanyPublisher(
                company
            )}


            ${renderBusinessEngine(
                company
            )}

        </div>

    `;

}


/* =========================================================
   66. MEJOR PRODUCTO — RESUMEN
========================================================= */

function renderBestProductSummary(
    product
) {

    const cover =
        getProductCover(
            product
        );


    const potential =
        getProductPotential(
            product
        );


    return `

        <section
            class="best-product-card"
        >

            <div
                class="best-product-heading"
            >

                <div>

                    <span
                        class="eyebrow"
                    >
                        PRODUCTO DESTACADO
                    </span>


                    <h3>

                        ${escapeHTML(
                            product.name
                        )}

                    </h3>

                </div>


                <span
                    class="product-potential-badge ${potential.className}"
                >

                    ${potential.label}

                </span>

            </div>


            <div
                class="best-product-content"
            >

                ${
                    cover

                        ? `

                            <img
                                src="${cover}"
                                alt="${escapeHTML(
                                    product.name
                                )}"
                            >

                        `

                        : `

                            <div
                                class="product-image-placeholder"
                            >

                                ${escapeHTML(
                                    product.name
                                        .charAt(0)
                                        .toUpperCase()
                                )}

                            </div>

                        `
                }


                <div>

                    <strong
                        class="product-price"
                    >

                        S/ ${formatPrice(
                            product.price
                        )}

                    </strong>


                    <p>

                        ${escapeHTML(
                            product.description
                        )}

                    </p>


                    <small>

                        👁 ${product.metrics.views}

                        ·

                        ♡ ${product.metrics.interactions}

                        ·

                        🔥 ${product.metrics.interested}

                        ·

                        💰 ${product.metrics.committed}

                    </small>

                </div>

            </div>


            <button
                type="button"
                class="secondary-button"
                data-open-products="true"
            >

                VER PRODUCTOS

            </button>

        </section>

    `;

}


/* =========================================================
   67. SIN PRODUCTOS — RESUMEN
========================================================= */

function renderNoProductsSummary() {

    return `

        <section
            class="best-product-card"
        >

            <span
                class="eyebrow"
            >
                PRODUCTOS
            </span>


            <h3>
                Construye tu vitrina
            </h3>


            <p class="muted">

                Agrega productos con imágenes para
                probar cuáles generan mayor interés.

            </p>


            <button
                type="button"
                class="primary-button"
                data-create-product-summary="true"
            >

                + CREAR PRODUCTO

            </button>

        </section>

    `;

}


/* =========================================================
   68. PUBLICADOR DE EMPRESA
========================================================= */

function renderCompanyPublisher(
    company
) {

    return `

        <section
            class="publisher-card"
        >

            <span
                class="eyebrow"
            >
                PUBLICAR
            </span>


            <h3>
                Comparte una actualización
            </h3>


            <p class="muted">

                Publica avances, ideas o novedades
                de ${escapeHTML(
                    company.name
                )}.

            </p>


            <textarea
                id="companyPostInput"
                placeholder="¿Qué está pasando en tu empresa?"
            ></textarea>


            <button
                id="publishCompanyPostButton"
                class="primary-button"
                type="button"
            >

                PUBLICAR EN MAHPE

            </button>

        </section>

    `;

}


/* =========================================================
   69. BUSINESS ENGINE — DATOS
========================================================= */

const BUSINESS_DECISIONS = {

    improve_design: {

        title:
            "Mejorar diseño",

        description:
            "Invierte en mejorar la presentación e identidad del producto.",

        cost: 40,

        effects: {

            designLevel: 8,

            productValidation: 2,

            activity: 1,

            value: 25

        }

    },


    market_research: {

        title:
            "Investigar mercado",

        description:
            "Obtén más información antes de tomar decisiones.",

        cost: 35,

        effects: {

            marketKnowledge: 10,

            marketResponse: 3,

            risk: -3,

            value: 20

        }

    },


    launch_campaign: {

        title:
            "Lanzar campaña",

        description:
            "Aumenta temporalmente la exposición de la empresa.",

        cost: 70,

        effects: {

            campaignPower: 12,

            activity: 8,

            marketResponse: 4,

            risk: 2,

            value: 35

        }

    },


    validate_product: {

        title:
            "Validar producto",

        description:
            "Prueba la propuesta antes de invertir más recursos.",

        cost: 45,

        effects: {

            productValidation: 10,

            marketKnowledge: 4,

            marketResponse: 4,

            risk: -2,

            value: 30

        }

    },


    test_location: {

        title:
            "Probar ubicación",

        description:
            "Utiliza COYOTE para fortalecer tu lectura territorial.",

        cost: 30,

        effects: {

            locationStrength: 8,

            marketKnowledge: 3,

            activity: 2,

            value: 20

        }

    }

};


/* =========================================================
   70. RENDER BUSINESS ENGINE
========================================================= */

function renderBusinessEngine(
    company
) {

    migrateCompanyBusinessData(
        company
    );


    const decisions =
        Object.entries(
            BUSINESS_DECISIONS
        );


    return `

        <section
            class="business-engine"
        >

            <div
                class="business-engine-heading"
            >

                <div>

                    <span
                        class="eyebrow"
                    >
                        BUSINESS ENGINE
                    </span>


                    <h2>
                        Toma decisiones
                    </h2>


                    <p class="muted">

                        Cada decisión modifica el estado
                        de tu empresa.

                    </p>

                </div>


                <strong
                    class="business-capital"
                >

                    Capital:
                    S/ ${formatPrice(
                        company.capital
                    )}

                </strong>

            </div>


            <div
                class="business-metrics"
            >

                ${renderBusinessMetric(
                    "Actividad",
                    company.activity
                )}


                ${renderBusinessMetric(
                    "Respuesta",
                    company.marketResponse
                )}


                ${renderBusinessMetric(
                    "Ubicación",
                    company.locationStrength
                )}


                ${renderBusinessMetric(
                    "Diseño",
                    company.designLevel
                )}


                ${renderBusinessMetric(
                    "Validación",
                    company.productValidation
                )}


                ${renderBusinessMetric(
                    "Mercado",
                    company.marketKnowledge
                )}


                ${renderBusinessMetric(
                    "Campaña",
                    company.campaignPower
                )}


                ${renderBusinessMetric(
                    "Riesgo",
                    company.risk,
                    true
                )}

            </div>


            <div
                class="business-decisions"
            >

                ${decisions
                    .map(
                        (
                            [
                                decisionId,
                                decision
                            ]
                        ) => `

                            <article
                                class="decision-card"
                            >

                                <div>

                                    <strong>

                                        ${escapeHTML(
                                            decision.title
                                        )}

                                    </strong>


                                    <p>

                                        ${escapeHTML(
                                            decision.description
                                        )}

                                    </p>

                                </div>


                                <div
                                    class="decision-footer"
                                >

                                    <span>

                                        ${decision.cost}
                                        Mahpes

                                    </span>


                                    <button
                                        type="button"
                                        class="decision-button"
                                        data-business-decision="${decisionId}"
                                    >

                                        ELEGIR

                                    </button>

                                </div>

                            </article>

                        `
                    )
                    .join("")}

            </div>


            ${renderDecisionHistory(
                company
            )}

        </section>

    `;

}


/* =========================================================
   71. MÉTRICA BUSINESS ENGINE
========================================================= */

function renderBusinessMetric(
    label,
    value,
    inverse = false
) {

    const safeValue =
        clamp(
            value
        );


    return `

        <article
            class="business-metric"
        >

            <div
                class="business-metric-heading"
            >

                <span>

                    ${escapeHTML(
                        label
                    )}

                </span>


                <strong>

                    ${safeValue}

                </strong>

            </div>


            <div
                class="business-progress"
            >

                <div
                    class="business-progress-fill ${
                        inverse
                            ? "risk"
                            : ""
                    }"
                    style="width:${safeValue}%"
                ></div>

            </div>

        </article>

    `;

}


/* =========================================================
   72. HISTORIAL DE DECISIONES
========================================================= */

function renderDecisionHistory(
    company
) {

    const decisions =
        Array.isArray(
            company.decisions
        )

            ? company.decisions
                .slice()
                .reverse()
                .slice(
                    0,
                    5
                )

            : [];


    if (!decisions.length) {

        return `

            <div
                class="decision-history empty"
            >

                <strong>
                    Historial
                </strong>


                <p class="muted">

                    Tus decisiones aparecerán aquí.

                </p>

            </div>

        `;

    }


    return `

        <div
            class="decision-history"
        >

            <strong>
                Últimas decisiones
            </strong>


            <div
                class="decision-history-list"
            >

                ${decisions
                    .map(
                        decision => `

                            <article
                                class="decision-history-item"
                            >

                                <span>

                                    ${escapeHTML(
                                        decision.title
                                    )}

                                </span>


                                <small>

                                    -${Number(
                                        decision.cost ||
                                        0
                                    )}
                                    Mahpes

                                </small>

                            </article>

                        `
                    )
                    .join("")}

            </div>

        </div>

    `;

}


/* =========================================================
   73. EJECUTAR DECISIÓN
========================================================= */

function executeBusinessDecision(
    decisionId
) {

    const company =
        getCurrentCompany();


    const decision =
        BUSINESS_DECISIONS[
            decisionId
        ];


    if (
        !company ||
        !decision
    ) {

        return;

    }


    migrateCompanyBusinessData(
        company
    );


    if (
        mahpeState.mahpes <
        decision.cost
    ) {

        window.alert(
            "No tienes suficientes Mahpes para esta decisión."
        );


        return;

    }


    mahpeState.mahpes -=
        decision.cost;


    const effects =
        decision.effects ||
        {};


    Object.entries(
        effects
    )
    .forEach(
        (
            [
                key,
                amount
            ]
        ) => {

            if (
                key ===
                "value"
            ) {

                company.value =
                    Number(
                        company.value ||
                        0
                    ) +
                    Number(
                        amount ||
                        0
                    );


                return;

            }


            if (
                typeof company[key] ===
                "number"
            ) {

                company[key] =
                    clamp(

                        company[key] +
                        Number(
                            amount ||
                            0
                        )

                    );

            }

        }
    );


    const historyItem = {

        id:
            generateId(
                "decision"
            ),

        decisionId,

        title:
            decision.title,

        cost:
            decision.cost,

        createdAt:
            new Date()
                .toISOString()

    };


    company.decisions.push(
        historyItem
    );


    mahpeState.decisionHistory.unshift({

        ...historyItem,

        companyId:
            company.id,

        companyName:
            company.name

    });


    mahpeState.decisionHistory =
        mahpeState.decisionHistory.slice(
            0,
            50
        );


    addMahpeEvent(

        "decision",

        company.name +
        " tomó la decisión: " +
        decision.title +
        ".",

        company.id

    );


    recalculateCompanyStage(
        company
    );


    saveMahpeState();


    renderCompanyDashboard();


    renderActivityInbox();


    updateProfile();

}


/* =========================================================
   74. CONECTAR BUSINESS ENGINE
========================================================= */

function bindBusinessDecisionEvents() {

    document
        .querySelectorAll(
            "[data-business-decision]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        executeBusinessDecision(
                            button.dataset.businessDecision
                        );

                    };

            }
        );

}


/* =========================================================
   75. HERO DE EMPRESA
========================================================= */

function renderCompanyHero(
    company
) {

    const products =
        getCompanyProducts(
            company.id
        );


    return `

        <section
            class="company-hero"
        >

            ${renderCompanyAvatar(
                company,
                "company-big-avatar"
            )}


            <div
                class="company-hero-copy"
            >

                <span
                    class="eyebrow"
                >

                    MI EMPRESA

                </span>


                <h1>

                    ${escapeHTML(
                        company.name
                    )}

                </h1>


                <p>

                    ${escapeHTML(
                        company.description
                    )}

                </p>


                <div
                    class="company-meta"
                >

                    <span>

                        ${escapeHTML(
                            company.category
                        )}

                    </span>


                    <span>

                        ${escapeHTML(
                            company.stage
                        )}

                    </span>


                    <span>

                        ${products.length}
                        ${
                            products.length === 1
                                ? "producto"
                                : "productos"
                        }

                    </span>

                </div>

            </div>


            <div
                class="company-value"
            >

                <small>
                    Valor simulado
                </small>


                <strong>

                    S/ ${formatPrice(
                        company.value
                    )}

                </strong>

            </div>

        </section>

    `;

}


/* =========================================================
   76. DASHBOARD VACÍO
========================================================= */

function renderEmptyCompanyDashboard(
    dashboard
) {

    dashboard.innerHTML = `

        <section
            class="empty-state"
        >

            <span
                class="eyebrow"
            >
                MAHPE
            </span>


            <h2>
                Crea tu primera empresa
            </h2>


            <p>

                Cuando crees una empresa podrás
                construir su identidad, agregar
                productos, publicar y medir cómo
                responde el mercado.

            </p>


            <button
                id="goCreateCompanyButton"
                class="primary-button"
                type="button"
            >

                CREAR EMPRESA

            </button>

        </section>

    `;


    const button =
        document.getElementById(
            "goCreateCompanyButton"
        );


    if (button) {

        button.onclick =
            () =>

                openView(
                    "createView"
                );

    }

}


/* =========================================================
   77. RENDER PRINCIPAL — MI EMPRESA
========================================================= */

function renderCompanyDashboard() {

    const dashboard =
        document.getElementById(
            "companyDashboard"
        );


    const productsWorkspace =
        document.getElementById(
            "companyProductsWorkspace"
        );


    if (!dashboard) {

        return;

    }


    const company =
        getCurrentCompany();


    if (!company) {

        if (productsWorkspace) {

            productsWorkspace.classList.add(
                "hidden"
            );


            productsWorkspace.innerHTML =
                "";

        }


        renderEmptyCompanyDashboard(
            dashboard
        );


        return;

    }


    migrateCompanyBusinessData(
        company
    );


    recalculateCompanyStage(
        company
    );


    dashboard.innerHTML = `

        ${renderCompanyHero(
            company
        )}


        ${renderCompanyTabs()}


        <div
            id="companyTabContent"
            class="company-tab-content"
        ></div>

    `;


    const tabContent =
        document.getElementById(
            "companyTabContent"
        );


    if (productsWorkspace) {

        productsWorkspace.classList.add(
            "hidden"
        );


        productsWorkspace.innerHTML =
            "";

    }


    if (tabContent) {

        if (
            currentCompanyTab ===
            "summary"
        ) {

            tabContent.innerHTML =
                renderCompanySummary(
                    company
                );

        }


        else if (
            currentCompanyTab ===
            "products"
        ) {

            tabContent.innerHTML =
                renderCompanyProducts(
                    company
                );

        }


        else if (
            currentCompanyTab ===
            "statistics"
        ) {

            tabContent.innerHTML =
                renderProductStatistics(
                    company
                );

        }

    }


    bindCompanyTabs();


    bindCompanyDashboardEvents();


    bindBrandIdentityEvents();


    bindProductEvents();


    bindBusinessDecisionEvents();

}


/* =========================================================
   78. EVENTOS DEL DASHBOARD
========================================================= */

function bindCompanyDashboardEvents() {

    const publishButton =
        document.getElementById(
            "publishCompanyPostButton"
        );


    if (publishButton) {

        publishButton.onclick =
            publishCompanyPost;

    }


    document
        .querySelectorAll(
            "[data-open-products]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        setCompanyTab(
                            "products"
                        );

                    };

            }
        );


    document
        .querySelectorAll(
            "[data-create-product-summary]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        currentCompanyTab =
                            "products";


                        renderCompanyDashboard();


                        openProductEditor();

                    };

            }
        );

}


/* =========================================================
   79. CAMBIAR EMPRESA ACTUAL
========================================================= */

function selectCompany(
    companyId
) {

    const company =
        mahpeState.companies.find(

            item =>
                item.id ===
                companyId

        );


    if (!company) {

        return;

    }


    currentCompanyId =
        company.id;


    currentCompanyTab =
        "summary";


    renderCompanyDashboard();


    updateProfile();


    openView(
        "companyView"
    );

}


/* =========================================================
   80. MÉTRICAS GLOBALES DEL PERFIL
========================================================= */

function getProfileMetrics() {

    const companyTotals =
        mahpeState.companies.reduce(

            (
                totals,
                company
            ) => {

                totals.interactions +=
                    Number(
                        company.interactions ||
                        0
                    );


                totals.interested +=
                    Number(
                        company.interested ||
                        0
                    );


                totals.committed +=
                    Number(
                        company.committed ||
                        0
                    );


                return totals;

            },

            {

                interactions: 0,

                interested: 0,

                committed: 0

            }

        );


    const productTotals =
        mahpeState.products.reduce(

            (
                totals,
                product
            ) => {

                migrateProductData(
                    product
                );


                totals.interactions +=
                    Number(
                        product.metrics.interactions ||
                        0
                    );


                totals.interested +=
                    Number(
                        product.metrics.interested ||
                        0
                    );


                totals.committed +=
                    Number(
                        product.metrics.committed ||
                        0
                    );


                return totals;

            },

            {

                interactions: 0,

                interested: 0,

                committed: 0

            }

        );


    return {

        interactions:
            companyTotals.interactions +
            productTotals.interactions,

        interested:
            companyTotals.interested +
            productTotals.interested,

        committed:
            companyTotals.committed +
            productTotals.committed

    };

}


/* =========================================================
   81. ACTUALIZAR PERFIL
========================================================= */

function updateProfile() {

    const mahpesElement =
        document.getElementById(
            "profileMahpes"
        );


    const companiesElement =
        document.getElementById(
            "profileCompanies"
        );


    const interestElement =
        document.getElementById(
            "profileInterest"
        );


    const commitmentElement =
        document.getElementById(
            "profileCommitment"
        );


    const metrics =
        getProfileMetrics();


    if (mahpesElement) {

        mahpesElement.textContent =
            Number(
                mahpeState.mahpes ||
                0
            );

    }


    if (companiesElement) {

        companiesElement.textContent =
            mahpeState.companies.length;

    }


    if (interestElement) {

        interestElement.textContent =
            metrics.interested;

    }


    if (commitmentElement) {

        commitmentElement.textContent =
            metrics.committed;

    }


    renderProfileCompanies();

}


/* =========================================================
   82. LISTA DE EMPRESAS EN PERFIL
========================================================= */

function renderProfileCompanies() {

    /*
       Si el HTML actual no tiene este contenedor,
       simplemente no hacemos nada.

       Esto mantiene compatibilidad con el index.
    */

    const container =
        document.getElementById(
            "profileCompanyList"
        );


    if (!container) {

        return;

    }


    if (
        !mahpeState.companies.length
    ) {

        container.innerHTML = `

            <div
                class="empty-state compact"
            >

                Todavía no tienes empresas.

            </div>

        `;


        return;

    }


    container.innerHTML =
        mahpeState.companies
            .map(
                company => `

                    <button
                        type="button"
                        class="profile-company-card"
                        data-profile-company="${company.id}"
                    >

                        ${renderCompanyAvatar(
                            company,
                            "company-avatar"
                        )}


                        <span>

                            <strong>

                                ${escapeHTML(
                                    company.name
                                )}

                            </strong>


                            <small>

                                ${escapeHTML(
                                    company.stage
                                )}

                            </small>

                        </span>

                    </button>

                `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-profile-company]"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        selectCompany(
                            button.dataset.profileCompany
                        );

                    };

            }
        );

}


/* =========================================================
   83. ACTUALIZAR UI GLOBAL
========================================================= */

function updateGlobalUI() {

    const wallet =
        document.getElementById(
            "walletBalance"
        );


    if (wallet) {

        wallet.textContent =
            Number(
                mahpeState.mahpes ||
                0
            );

    }


    const followingCount =
        document.getElementById(
            "followingCount"
        );


    if (followingCount) {

        followingCount.textContent =
            getFollowingCount();

    }


    updateProfile();


    renderActivityInbox();

}


/* =========================================================
   84. MARCAR ACTIVIDAD COMO LEÍDA
========================================================= */

function markActivityAsRead() {

    if (
        !Array.isArray(
            mahpeState.events
        )
    ) {

        return;

    }


    let changed =
        false;


    mahpeState.events.forEach(
        event => {

            if (!event.read) {

                event.read =
                    true;


                changed =
                    true;

            }

        }
    );


    if (changed) {

        saveMahpeState();

    }


    renderActivityInbox();

}


/* =========================================================
   85. BANDEJA DE ACTIVIDAD
========================================================= */

function bindActivityInbox() {

    const inbox =
        document.getElementById(
            "activityInbox"
        );


    if (!inbox) {

        return;

    }


    /*
       Al interactuar con la bandeja,
       las novedades pasan a leídas.
    */

    inbox.addEventListener(

        "click",

        function() {

            markActivityAsRead();

        }

    );

}


/* =========================================================
   86. ESTADO DE EMPRESA PARA COYOTE
========================================================= */

function getCompanyCoyoteData() {

    const company =
        getCurrentCompany();


    if (!company) {

        return null;

    }


    migrateCompanyBusinessData(
        company
    );


    const products =
        getCompanyProducts(
            company.id
        );


    const bestProduct =
        getBestCompanyProduct(
            company.id
        );


    return {

        id:
            company.id,

        name:
            company.name,

        category:
            company.category,

        stage:
            company.stage,

        logo:
            company.brandImage ||
            null,

        product:
            bestProduct
                ? bestProduct.name
                : company.product ||
                  "",

        products:
            products.map(
                product => ({

                    id:
                        product.id,

                    name:
                        product.name,

                    category:
                        product.category,

                    price:
                        product.price,

                    cover:
                        getProductCover(
                            product
                        )

                })
            )

    };

}


/* =========================================================
   87. PREPARAR PRODUCTO PARA COYOTE
========================================================= */

function getDefaultCoyoteProduct() {

    const company =
        getCurrentCompany();


    if (!company) {

        return "";

    }


    const bestProduct =
        getBestCompanyProduct(
            company.id
        );


    if (bestProduct) {

        return bestProduct.name;

    }


    return (
        company.product ||
        ""
    );

}


/* =========================================================
   88. EXPONER FUNCIONES NECESARIAS
========================================================= */

window.setCompanyTab =
    setCompanyTab;


window.selectCompany =
    selectCompany;


window.executeBusinessDecision =
    executeBusinessDecision;


window.markActivityAsRead =
    markActivityAsRead;


/* =========================================================
   FIN PARTE 3/4

   PEGA PARTE 4/4 INMEDIATAMENTE DEBAJO.

   PARTE 4/4 COMPLETA EL ARCHIVO CON:

   - COYOTE / Leaflet
   - Punto Verde ON / OFF persistente
   - reactivación sin volver a llenar datos
   - búsqueda por producto
   - radios 1 / 3 / 10 / 20 km
   - IR A ESTE PUNTO
   - seguimiento
   - sincronización COYOTE ↔ empresa
   - arranque definitivo de MAHPE
   - validación del DOM
========================================================= */
/* =========================================================
   MAHPE v1.2

   PARTE 4/4 — FINAL

   - COYOTE / Leaflet
   - Punto Verde persistente
   - Activar / desactivar
   - Reactivar comercio guardado
   - Búsqueda por producto
   - Radio 1 / 3 / 10 / 20 km
   - Distancias
   - IR A ESTE PUNTO
   - Seguimiento
   - Sincronización COYOTE ↔ MAHPE
   - Validación
   - Arranque definitivo
========================================================= */


/* =========================================================
   89. ESTADO COYOTE

   IMPORTANTE:
   ESTA ES LA ÚNICA DECLARACIÓN DE map
   EN TODO EL SCRIPT NUEVO.
========================================================= */

let map = null;

let userLocation = null;

let userMarker = null;

let sellerMarker = null;

let searchCircle = null;

let followUserMarker = null;

let followLine = null;

let followWatchId = null;

let followedSellerPoint = null;

let selectedRadius = 10;

let commercialPoints = [];


/* =========================================================
   90. ELEMENTOS COYOTE
========================================================= */

const activateButton =
    document.getElementById(
        "activateButton"
    );


const sellerForm =
    document.getElementById(
        "sellerForm"
    );


const productInput =
    document.getElementById(
        "productInput"
    );


const confirmSellerButton =
    document.getElementById(
        "confirmSellerButton"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchButton =
    document.getElementById(
        "searchButton"
    );


const referenceText =
    document.getElementById(
        "referenceText"
    );


const offerText =
    document.getElementById(
        "offerText"
    );


const demandBar =
    document.getElementById(
        "demandBar"
    );


const demandText =
    document.getElementById(
        "demandText"
    );


/* =========================================================
   91. MAPA
========================================================= */

function initializeMap() {

    const mapElement =
        document.getElementById(
            "map"
        );


    if (
        !mapElement ||
        typeof L ===
            "undefined"
    ) {

        console.warn(
            "COYOTE: Leaflet o #map no disponible."
        );

        return;

    }


    if (map) {

        return;

    }


    /*
       Centro inicial aproximado de Lima.

       La ubicación real del usuario solamente
       se solicita cuando el navegador lo permite
       y el usuario da consentimiento.
    */

    map =
        L.map(
            "map",
            {
                zoomControl: true
            }
        )
        .setView(
            [
                -12.0464,
                -77.0428
            ],
            12
        );


    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap"

        }

    ).addTo(
        map
    );


    loadSavedSeller();


    locateUserSilently();


    updateReference();

}


/* =========================================================
   92. UBICACIÓN INICIAL DEL USUARIO
========================================================= */

function locateUserSilently() {

    if (
        !navigator.geolocation
    ) {

        return;

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            userLocation = {

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude

            };


            updateUserMarker(
                userLocation.lat,
                userLocation.lng
            );


            updateReference();

        },


        function() {

            /*
               No mostramos error aquí.

               El usuario puede seguir explorando
               el mapa sin compartir ubicación.
            */

        },


        {

            enableHighAccuracy: false,

            maximumAge: 60000,

            timeout: 6000

        }

    );

}


/* =========================================================
   93. MARCADOR DEL USUARIO
========================================================= */

function updateUserMarker(
    lat,
    lng
) {

    if (!map) {

        return;

    }


    if (!userMarker) {

        userMarker =
            L.circleMarker(

                [
                    lat,
                    lng
                ],

                {

                    radius: 7,

                    weight: 2,

                    color:
                        "#ffffff",

                    fillColor:
                        "#00e86d",

                    fillOpacity: 1

                }

            )
            .addTo(
                map
            )
            .bindPopup(
                "Tu ubicación"
            );

    }

    else {

        userMarker.setLatLng(
            [
                lat,
                lng
            ]
        );

    }

}


/* =========================================================
   94. RADIO DE BÚSQUEDA
========================================================= */

function drawSearchRadius() {

    if (
        !map ||
        !userLocation
    ) {

        return;

    }


    if (searchCircle) {

        try {

            map.removeLayer(
                searchCircle
            );

        }

        catch (error) {

            console.warn(
                error
            );

        }

    }


    searchCircle =
        L.circle(

            [
                userLocation.lat,
                userLocation.lng
            ],

            {

                radius:
                    selectedRadius *
                    1000,

                weight: 1,

                fillOpacity: 0.04

            }

        ).addTo(
            map
        );

}


/* =========================================================
   95. ACTUALIZAR REFERENCIA
========================================================= */

function updateReference() {

    if (referenceText) {

        referenceText.textContent =
            selectedRadius +
            " km";

    }


    drawSearchRadius();

}


/* =========================================================
   96. BOTONES DE RADIO
========================================================= */

function initializeRadiusButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-radius]"
        );


    buttons.forEach(
        button => {

            const radius =
                Number(
                    button.dataset.radius
                );


            button.classList.toggle(

                "active",

                radius ===
                    selectedRadius

            );


            button.onclick =
                function() {

                    const value =
                        Number(
                            this.dataset.radius
                        );


                    if (
                        !Number.isFinite(
                            value
                        )
                    ) {

                        return;

                    }


                    selectedRadius =
                        value;


                    buttons.forEach(
                        item => {

                            item.classList.toggle(

                                "active",

                                item ===
                                    this

                            );

                        }
                    );


                    updateReference();


                    searchCommercialPoints();

                };

        }
    );

}


/* =========================================================
   97. LEER PUNTO GUARDADO
========================================================= */

function getSavedSellerPoint() {

    try {

        const raw =
            localStorage.getItem(
                "coyote_seller_point"
            );


        if (!raw) {

            return null;

        }


        const point =
            JSON.parse(
                raw
            );


        if (
            !point ||
            !Number.isFinite(
                Number(
                    point.lat
                )
            ) ||
            !Number.isFinite(
                Number(
                    point.lng
                )
            )
        ) {

            return null;

        }


        return point;

    }

    catch (error) {

        console.error(
            "COYOTE: no se pudo leer el Punto Verde.",
            error
        );


        return null;

    }

}


/* =========================================================
   98. GUARDAR PUNTO
========================================================= */

function saveSellerPoint(
    point
) {

    try {

        localStorage.setItem(

            "coyote_seller_point",

            JSON.stringify(
                point
            )

        );

    }

    catch (error) {

        console.error(
            "COYOTE: no se pudo guardar el Punto Verde.",
            error
        );

    }

}


/* =========================================================
   99. UI DEL BOTÓN ACTIVAR / DESACTIVAR
========================================================= */

function updateSellerToggleUI(
    active
) {

    if (!activateButton) {

        return;

    }


    activateButton.textContent =
        active

            ? "DESACTIVAR PUNTO"

            : "ACTIVAR PUNTO";


    activateButton.classList.toggle(
        "is-active",
        active
    );


    activateButton.setAttribute(
        "aria-pressed",
        active
            ? "true"
            : "false"
    );

}


/* =========================================================
   100. MOSTRAR / OCULTAR FORMULARIO
========================================================= */

function showSellerForm(
    show
) {

    if (!sellerForm) {

        return;

    }


    sellerForm.classList.toggle(
        "hidden",
        !show
    );

}


/* =========================================================
   101. PRIMERA ACTIVACIÓN
========================================================= */

function requestFirstSellerActivation() {

    if (
        !navigator.geolocation
    ) {

        updateStatus(
            "⚠️ Tu navegador no permite obtener ubicación."
        );

        return;

    }


    updateStatus(
        "📍 Obteniendo tu ubicación..."
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            userLocation = {

                lat:
                    position.coords.latitude,

                lng:
                    position.coords.longitude

            };


            updateUserMarker(
                userLocation.lat,
                userLocation.lng
            );


            const defaultProduct =
                getDefaultCoyoteProduct();


            if (
                productInput &&
                !productInput.value.trim() &&
                defaultProduct
            ) {

                productInput.value =
                    defaultProduct;

            }


            showSellerForm(
                true
            );


            updateStatus(
                "📍 Ubicación lista. Indica qué estás ofreciendo y confirma tu Punto Verde."
            );


            if (productInput) {

                productInput.focus();

            }

        },


        function(error) {

            if (
                error &&
                error.code === 1
            ) {

                updateStatus(
                    "⚠️ Necesitas permitir ubicación para activar tu Punto Verde."
                );

            }

            else {

                updateStatus(
                    "⚠️ No pudimos obtener tu ubicación."
                );

            }

        },


        {

            enableHighAccuracy: true,

            maximumAge: 5000,

            timeout: 12000

        }

    );

}


/* =========================================================
   102. BOTÓN PRINCIPAL DEL PUNTO VERDE
========================================================= */

function handleSellerToggle() {

    const saved =
        getSavedSellerPoint();


    /*
       ESTADO 1:
       Punto actualmente activo.
    */

    if (
        saved &&
        saved.active
    ) {

        deactivateSeller();

        return;

    }


    /*
       ESTADO 2:
       Punto existe, pero está apagado.

       Se reactiva directamente usando
       las coordenadas y producto guardados.
    */

    if (
        saved &&
        !saved.active &&
        saved.product &&
        Number.isFinite(
            Number(
                saved.lat
            )
        ) &&
        Number.isFinite(
            Number(
                saved.lng
            )
        )
    ) {

        reactivateSavedSeller(
            saved
        );

        return;

    }


    /*
       ESTADO 3:
       Nunca creó un Punto Verde.
    */

    requestFirstSellerActivation();

}


/* =========================================================
   103. CONFIRMAR PRIMER PUNTO
========================================================= */

function confirmSellerPoint() {

    if (!userLocation) {

        updateStatus(
            "⚠️ Primero necesitamos tu ubicación."
        );

        return;

    }


    let product =
        productInput
            ? productInput.value.trim()
            : "";


    if (!product) {

        product =
            getDefaultCoyoteProduct();

    }


    if (!product) {

        updateStatus(
            "⚠️ Escribe qué producto estás ofreciendo."
        );

        return;

    }


    const company =
        getCurrentCompany();


    const point = {

        id:
            "local-seller",

        companyId:
            company
                ? company.id
                : null,

        companyName:
            company
                ? company.name
                : "Comerciante",

        category:
            company
                ? company.category
                : "",

        product,

        lat:
            userLocation.lat,

        lng:
            userLocation.lng,

        active: true,

        updatedAt:
            new Date()
                .toISOString()

    };


    saveSellerPoint(
        point
    );


    createSellerPoint(
        point
    );


    showSellerForm(
        false
    );


    updateSellerToggleUI(
        true
    );


    updateStatus(

        "🟢 Punto Verde activo. Estás visible para búsquedas cercanas."

    );


    syncCompanyWithCoyotePoint();

}


/* =========================================================
   104. REACTIVAR PUNTO GUARDADO
========================================================= */

function reactivateSavedSeller(
    saved
) {

    if (!saved) {

        return;

    }


    saved.active =
        true;


    saved.updatedAt =
        new Date()
            .toISOString();


    /*
       Si ahora existe una empresa activa,
       actualizamos la relación con ella.
    */

    const company =
        getCurrentCompany();


    if (company) {

        saved.companyId =
            company.id;


        saved.companyName =
            company.name;


        saved.category =
            company.category;


        if (
            !saved.product
        ) {

            saved.product =
                getDefaultCoyoteProduct();

        }

    }


    saveSellerPoint(
        saved
    );


    createSellerPoint(
        saved
    );


    showSellerForm(
        false
    );


    updateSellerToggleUI(
        true
    );


    updateStatus(
        "🟢 Punto Verde reactivado. Tu comercio vuelve a estar visible."
    );


    syncCompanyWithCoyotePoint();

}


/* =========================================================
   105. CREAR MARCADOR DE VENDEDOR
========================================================= */

function createSellerPoint(
    point
) {

    if (
        !map ||
        !point ||
        !point.active
    ) {

        return;

    }


    removeSellerMarker();


    commercialPoints = [
        point
    ];


    const markerIcon =
        L.divIcon({

            className:
                "coyote-green-marker",

            html:
                '<div class="coyote-green-dot"></div>',

            iconSize:
                [24, 24],

            iconAnchor:
                [12, 12]

        });


    sellerMarker =
        L.marker(

            [
                Number(
                    point.lat
                ),

                Number(
                    point.lng
                )
            ],

            {
                icon:
                    markerIcon
            }

        ).addTo(
            map
        );


    sellerMarker.bindPopup(
        buildSellerPopup(
            point
        )
    );


    map.setView(

        [
            Number(
                point.lat
            ),

            Number(
                point.lng
            )
        ],

        Math.max(
            map.getZoom(),
            15
        )

    );


    updateOfferMetrics(
        commercialPoints
    );

}


/* =========================================================
   106. POPUP DEL PUNTO VERDE
========================================================= */

function buildSellerPopup(
    point
) {

    const companyName =
        point.companyName ||
        "Comerciante";


    const category =
        point.category ||
        "Comercio";


    const product =
        point.product ||
        "Producto";


    return `

        <div
            class="coyote-popup"
        >

            <strong>

                ${escapeHTML(
                    companyName
                )}

            </strong>


            <small>

                ${escapeHTML(
                    category
                )}

            </small>


            <p>

                ${escapeHTML(
                    product
                )}

            </p>


            <button
                type="button"
                onclick="followSellerPoint('${point.id}')"
            >

                IR A ESTE PUNTO

            </button>


            ${
                point.id ===
                "local-seller"

                    ? `

                        <button
                            type="button"
                            onclick="deactivateSeller()"
                        >

                            DESACTIVAR

                        </button>

                    `

                    : ""
            }

        </div>

    `;

}


/* =========================================================
   107. QUITAR MARCADOR
========================================================= */

function removeSellerMarker() {

    if (
        sellerMarker &&
        map
    ) {

        try {

            if (
                map.hasLayer(
                    sellerMarker
                )
            ) {

                map.removeLayer(
                    sellerMarker
                );

            }

        }

        catch (error) {

            console.warn(
                error
            );

        }

    }


    sellerMarker = null;

}


/* =========================================================
   108. DESACTIVAR PUNTO VERDE
========================================================= */

function deactivateSeller() {

    stopFollowingSeller(
        false
    );


    const saved =
        getSavedSellerPoint();


    if (saved) {

        saved.active =
            false;


        saved.updatedAt =
            new Date()
                .toISOString();


        /*
           IMPORTANTE:
           NO eliminamos coyote_seller_point.

           Se conserva para poder reactivar
           posteriormente con un clic.
        */

        saveSellerPoint(
            saved
        );

    }


    removeSellerMarker();


    commercialPoints = [];


    showSellerForm(
        false
    );


    updateSellerToggleUI(
        false
    );


    updateOfferMetrics(
        commercialPoints
    );


    updateStatus(
        "Punto Verde desactivado. Tu comercio sigue guardado."
    );

}


/* =========================================================
   109. COMPATIBILIDAD — TOGGLE
========================================================= */

function toggleSellerPresence() {

    handleSellerToggle();

}


/* =========================================================
   110. CARGAR PUNTO GUARDADO
========================================================= */

function loadSavedSeller() {

    const point =
        getSavedSellerPoint();


    if (!point) {

        commercialPoints =
            [];


        updateSellerToggleUI(
            false
        );


        updateOfferMetrics(
            commercialPoints
        );


        return;

    }


    if (!point.active) {

        commercialPoints =
            [];


        removeSellerMarker();


        updateSellerToggleUI(
            false
        );


        updateOfferMetrics(
            commercialPoints
        );


        updateStatus(
            "Tu Punto Verde está guardado, pero actualmente está desactivado."
        );


        return;

    }


    createSellerPoint(
        point
    );


    updateSellerToggleUI(
        true
    );


    updateStatus(
        "🟢 Tu Punto Verde está activo."
    );

}


/* =========================================================
   111. BÚSQUEDA DE COMERCIOS
========================================================= */

function searchCommercialPoints() {

    const query =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const saved =
        getSavedSellerPoint();


    let availablePoints =
        [];


    /*
       Solo puntos ACTIVOS participan
       en las búsquedas.
    */

    if (
        saved &&
        saved.active
    ) {

        availablePoints.push(
            saved
        );

    }


    if (query) {

        availablePoints =
            availablePoints.filter(
                point => {

                    const searchable = [

                        point.product,

                        point.companyName,

                        point.category

                    ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                    return searchable.includes(
                        query
                    );

                }
            );

    }


    if (userLocation) {

        availablePoints =
            availablePoints.filter(
                point => {

                    const distance =
                        calculateDistanceKm(

                            userLocation.lat,

                            userLocation.lng,

                            Number(
                                point.lat
                            ),

                            Number(
                                point.lng
                            )

                        );


                    return (
                        distance <=
                        selectedRadius
                    );

                }
            );

    }


    commercialPoints =
        availablePoints;


    updateOfferMetrics(
        availablePoints
    );


    if (!availablePoints.length) {

        updateStatus(
            query
                ? "🔎 No encontramos puntos activos para esa búsqueda dentro del rango seleccionado."
                : "No hay Puntos Verdes activos dentro del rango."
        );


        return;

    }


    const point =
        availablePoints[0];


    createSellerPoint(
        point
    );


    if (
        sellerMarker
    ) {

        sellerMarker.openPopup();

    }


    updateStatus(

        "🔎 Encontramos " +
        availablePoints.length +
        (
            availablePoints.length === 1
                ? " Punto Verde."
                : " Puntos Verdes."
        )

    );

}


/* =========================================================
   112. MÉTRICAS DE OFERTA / DEMANDA
========================================================= */

function updateOfferMetrics(
    points
) {

    const count =
        Array.isArray(
            points
        )
            ? points.length
            : 0;


    if (offerText) {

        offerText.textContent =
            count === 0

                ? "Sin oferta visible"

                : count === 1

                    ? "1 punto activo"

                    : count +
                      " puntos activos";

    }


    /*
       Por ahora es una señal local del MVP.

       Cuando exista backend multiusuario,
       esta métrica utilizará demanda real.
    */

    const demand =
        Math.min(

            100,

            count *
            25

        );


    if (demandBar) {

        demandBar.style.width =
            demand +
            "%";

    }


    if (demandText) {

        if (
            demand >= 75
        ) {

            demandText.textContent =
                "ALTA";

        }

        else if (
            demand >= 35
        ) {

            demandText.textContent =
                "MEDIA";

        }

        else {

            demandText.textContent =
                "BAJA";

        }

    }

}


/* =========================================================
   113. ENCONTRAR PUNTO POR ID
========================================================= */

function getCommercialPointById(
    pointId
) {

    const local =
        commercialPoints.find(
            point =>
                String(
                    point.id
                ) ===
                String(
                    pointId
                )
        );


    if (local) {

        return local;

    }


    const saved =
        getSavedSellerPoint();


    if (
        saved &&
        saved.active &&
        String(
            saved.id
        ) ===
        String(
            pointId
        )
    ) {

        return saved;

    }


    return null;

}


/* =========================================================
   114. IR A ESTE PUNTO
========================================================= */

function followSellerPoint(
    pointId
) {

    const point =
        getCommercialPointById(
            pointId
        );


    if (!point) {

        updateStatus(
            "⚠️ Este Punto Verde ya no está disponible."
        );

        return;

    }


    if (!point.active) {

        updateStatus(
            "⚠️ Este Punto Verde está desactivado."
        );

        return;

    }


    startFollowingSeller(
        point
    );

}


/* =========================================================
   115. INICIAR SEGUIMIENTO
========================================================= */

function startFollowingSeller(
    point
) {

    if (
        !point ||
        !navigator.geolocation
    ) {

        updateStatus(
            "⚠️ Tu navegador no permite seguimiento por ubicación."
        );

        return;

    }


    stopFollowingSeller(
        false
    );


    followedSellerPoint =
        point;


    updateStatus(
        "🧭 Preparando ruta hacia el Punto Verde..."
    );


    followWatchId =
        navigator.geolocation.watchPosition(

            function(position) {

                const buyerLat =
                    position.coords.latitude;


                const buyerLng =
                    position.coords.longitude;


                userLocation = {

                    lat:
                        buyerLat,

                    lng:
                        buyerLng

                };


                updateUserMarker(
                    buyerLat,
                    buyerLng
                );


                updateFollowMap(

                    buyerLat,

                    buyerLng,

                    Number(
                        point.lat
                    ),

                    Number(
                        point.lng
                    )

                );

            },


            function(error) {

                if (
                    error &&
                    error.code === 1
                ) {

                    updateStatus(
                        "⚠️ Necesitas permitir ubicación para usar IR A ESTE PUNTO."
                    );

                }

                else {

                    updateStatus(
                        "⚠️ No pudimos actualizar tu ubicación."
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
   116. ACTUALIZAR MAPA DE SEGUIMIENTO
========================================================= */

function updateFollowMap(
    buyerLat,
    buyerLng,
    sellerLat,
    sellerLng
) {

    if (
        !map ||
        typeof L ===
            "undefined"
    ) {

        return;

    }


    if (!followUserMarker) {

        followUserMarker =
            L.circleMarker(

                [
                    buyerLat,
                    buyerLng
                ],

                {

                    radius: 7,

                    weight: 2,

                    color:
                        "#ffffff",

                    fillColor:
                        "#4f8cff",

                    fillOpacity: 1

                }

            ).addTo(
                map
            );


        followUserMarker.bindPopup(
            "Tu posición"
        );

    }

    else {

        followUserMarker.setLatLng(
            [
                buyerLat,
                buyerLng
            ]
        );

    }


    if (followLine) {

        try {

            map.removeLayer(
                followLine
            );

        }

        catch (error) {

            console.warn(
                error
            );

        }

    }


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

                color:
                    "#00e86d",

                weight: 3,

                opacity: 0.85,

                dashArray:
                    "8 8"

            }

        ).addTo(
            map
        );


    const distance =
        calculateDistanceKm(

            buyerLat,

            buyerLng,

            sellerLat,

            sellerLng

        );


    let distanceText;


    if (
        distance < 1
    ) {

        distanceText =
            Math.round(
                distance *
                1000
            ) +
            " m";

    }

    else {

        distanceText =
            distance
                .toFixed(2) +
            " km";

    }


    updateStatus(

        "🧭 Distancia al Punto Verde: <strong>" +

        escapeHTML(
            distanceText
        ) +

        "</strong>."

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

            maxZoom: 17

        }

    );

}


/* =========================================================
   117. DETENER SEGUIMIENTO
========================================================= */

function stopFollowingSeller(
    showMessage = true
) {

    if (
        followWatchId !== null &&
        navigator.geolocation
    ) {

        navigator.geolocation.clearWatch(
            followWatchId
        );


        followWatchId =
            null;

    }


    if (
        followUserMarker &&
        map
    ) {

        try {

            if (
                map.hasLayer(
                    followUserMarker
                )
            ) {

                map.removeLayer(
                    followUserMarker
                );

            }

        }

        catch (error) {

            console.warn(
                error
            );

        }

    }


    if (
        followLine &&
        map
    ) {

        try {

            if (
                map.hasLayer(
                    followLine
                )
            ) {

                map.removeLayer(
                    followLine
                );

            }

        }

        catch (error) {

            console.warn(
                error
            );

        }

    }


    followUserMarker = null;

    followLine = null;

    followedSellerPoint = null;


    if (showMessage) {

        updateStatus(
            "🧭 Seguimiento detenido."
        );

    }

}


/* =========================================================
   118. DISTANCIA HAVERSINE
========================================================= */

function calculateDistanceKm(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const earthRadiusKm =
        6371;


    const toRadians =
        degrees =>
            degrees *
            Math.PI /
            180;


    const dLat =
        toRadians(
            lat2 -
            lat1
        );


    const dLng =
        toRadians(
            lng2 -
            lng1
        );


    const a =

        Math.sin(
            dLat / 2
        ) ** 2 +

        Math.cos(
            toRadians(
                lat1
            )
        ) *

        Math.cos(
            toRadians(
                lat2
            )
        ) *

        Math.sin(
            dLng / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(

            Math.sqrt(a),

            Math.sqrt(
                1 - a
            )

        );


    return (
        earthRadiusKm *
        c
    );

}


/* =========================================================
   119. SINCRONIZAR COYOTE CON EMPRESA
========================================================= */

function syncCompanyWithCoyotePoint() {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    const point =
        getSavedSellerPoint();


    if (
        !point ||
        !point.active
    ) {

        return;

    }


    migrateCompanyBusinessData(
        company
    );


    company.locationStrength =
        clamp(

            company.locationStrength +
            3

        );


    company.marketKnowledge =
        clamp(

            company.marketKnowledge +
            2

        );


    company.value +=
        15;


    recalculateCompanyStage(
        company
    );


    addMahpeEvent(

        "company",

        company.name +
        " activó presencia comercial en COYOTE.",

        company.id

    );


    saveMahpeState();


    renderCompanyDashboard();


    renderActivityInbox();

}


/* =========================================================
   120. STATUS COYOTE
========================================================= */

function updateStatus(
    message
) {

    const status =
        document.getElementById(
            "status"
        );


    if (!status) {

        return;

    }


    status.innerHTML =
        message;

}


/* =========================================================
   121. REFRESCAR MAPA
========================================================= */

function refreshCoyoteMap() {

    if (!map) {

        return;

    }


    setTimeout(
        function() {

            map.invalidateSize();

        },
        80
    );


    setTimeout(
        function() {

            map.invalidateSize();

        },
        300
    );

}


/* =========================================================
   122. EVENTOS COYOTE
========================================================= */

function bindCoyoteEvents() {

    if (activateButton) {

        activateButton.onclick =
            handleSellerToggle;

    }


    if (confirmSellerButton) {

        confirmSellerButton.onclick =
            confirmSellerPoint;

    }


    if (searchButton) {

        searchButton.onclick =
            searchCommercialPoints;

    }


    if (searchInput) {

        searchInput.addEventListener(

            "keydown",

            function(event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();


                    searchCommercialPoints();

                }

            }

        );

    }


    initializeRadiusButtons();

}


/* =========================================================
   123. REDIMENSIONAR MAPA
========================================================= */

window.addEventListener(

    "resize",

    function() {

        const mapView =
            document.getElementById(
                "mapView"
            );


        if (
            mapView &&
            mapView.classList.contains(
                "active"
            )
        ) {

            refreshCoyoteMap();

        }

    }

);


/* =========================================================
   124. LIMPIEZA AL SALIR
========================================================= */

window.addEventListener(

    "beforeunload",

    function() {

        stopFollowingSeller(
            false
        );

    }

);


/* =========================================================
   125. FUNCIONES DE POPUP / COMPATIBILIDAD
========================================================= */

window.followSellerPoint =
    followSellerPoint;


window.startFollowingSeller =
    startFollowingSeller;


window.stopFollowingSeller =
    stopFollowingSeller;


window.deactivateSeller =
    deactivateSeller;


window.toggleSellerPresence =
    toggleSellerPresence;


window.handleSellerToggle =
    handleSellerToggle;


window.executeBusinessDecision =
    executeBusinessDecision;


window.openView =
    openView;


window.publishCompanyPost =
    publishCompanyPost;


/* =========================================================
   126. VALIDAR DOM
========================================================= */

function validateMahpeDOM() {

    const importantElements = [

        "feedView",

        "feedContainer",

        "mapView",

        "map",

        "createView",

        "companyView",

        "companyDashboard",

        "profileView",

        "walletBalance"

    ];


    const missing =
        importantElements.filter(
            id =>
                !document.getElementById(
                    id
                )
        );


    if (
        missing.length
    ) {

        console.warn(

            "MAHPE: faltan elementos HTML:",

            missing

        );

    }


    return missing;

}


/* =========================================================
   127. REPARAR EMPRESA ACTUAL
========================================================= */

function resolveCurrentCompany() {

    if (
        currentCompanyId &&
        mahpeState.companies.some(
            company =>
                company.id ===
                currentCompanyId
        )
    ) {

        return;

    }


    currentCompanyId =
        mahpeState.companies.length

            ? mahpeState.companies[0].id

            : null;

}


/* =========================================================
   128. VALIDAR PRODUCTOS HUÉRFANOS
========================================================= */

function cleanOrphanProducts() {

    if (
        !Array.isArray(
            mahpeState.products
        )
    ) {

        mahpeState.products = [];

        return;

    }


    mahpeState.products =
        mahpeState.products.filter(
            product => {

                if (
                    !product ||
                    !product.companyId
                ) {

                    return false;

                }


                return mahpeState.companies.some(
                    company =>
                        company.id ===
                        product.companyId
                );

            }
        );

}


/* =========================================================
   129. REPARAR POSTS ANTIGUOS
========================================================= */

function migratePosts() {

    mahpeState.posts.forEach(
        post => {

            if (
                typeof post.views !==
                "number"
            ) {

                post.views = 0;

            }


            if (
                typeof post.interactions !==
                "number"
            ) {

                post.interactions = 0;

            }


            if (
                typeof post.interested !==
                "number"
            ) {

                post.interested = 0;

            }


            if (
                typeof post.committed !==
                "number"
            ) {

                post.committed = 0;

            }


            if (
                typeof post.productId ===
                "undefined"
            ) {

                post.productId =
                    null;

            }


            if (
                typeof post.image ===
                "undefined"
            ) {

                post.image =
                    null;

            }

        }
    );

}


/* =========================================================
   130. PREPARACIÓN FINAL DEL ESTADO
========================================================= */

function prepareMahpeState() {

    migrateMahpeBusinessState();


    cleanOrphanProducts();


    migratePosts();


    resolveCurrentCompany();


    mahpeState.companies.forEach(
        company => {

            migrateCompanyBusinessData(
                company
            );


            recalculateCompanyStage(
                company
            );

        }
    );


    saveMahpeState();

}


/* =========================================================
   131. ARRANQUE MAHPE
========================================================= */

function initializeMahpe() {

    console.log(
        "MAHPE v1.2: iniciando..."
    );


    validateMahpeDOM();


    /*
       1. Reparar / migrar datos anteriores.
    */

    prepareMahpeState();


    /*
       2. Feed.

       IMPORTANTE:
       ensureFeedShell NO crea botones.
       Solamente usa los del index.html.
    */

    initializeFeedTabs();


    renderFeed();


    /*
       3. Empresa.
    */

    renderCompanyDashboard();


    /*
       4. Perfil / wallet / actividad.
    */

    updateGlobalUI();


    renderActivityInbox();


    bindActivityInbox();


    /*
       5. COYOTE.
    */

    bindCoyoteEvents();


    initializeMap();


    /*
       6. La aplicación abre en Inicio.
    */

    openView(
        "feedView"
    );


    console.log(
        "MAHPE v1.2: listo."
    );

}


/* =========================================================
   132. EJECUCIÓN SEGURA
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        initializeMahpe,

        {
            once: true
        }

    );

}

else {

    initializeMahpe();

}


/* =========================================================
   FIN MAHPE v1.2
   FIN PARTE 4/4
   FIN SCRIPT.JS
========================================================= */
