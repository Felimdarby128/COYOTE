/* =========================================================
   MAHPE v2.0
   Crea. Simula. Haz crecer.

   BLOQUE 1/4
   ---------------------------------------------------------
   NÚCLEO + INICIO + FEED

   - Estado global
   - Migraciones
   - Utilidades
   - Navegación
   - Actividad compacta
   - Feed
   - Siguiendo
   - Descubrir
   - Tendencias
   - Señales 👁 ♡ 🔥 💰
   - Mahpes
   - Productos conectados al feed
   - Preparación del nuevo Perfil
   ---------------------------------------------------------

   IMPORTANTE:
   Este archivo continúa con BLOQUE 2/4.
========================================================= */


/* =========================================================
   1. CONFIGURACIÓN GENERAL
========================================================= */

const MAHPE_STORAGE_KEY = "mahpe_state_v2";

const MAHPE_LEGACY_STORAGE_KEY = "mahpe_state_v1";

const MAHPE_PROFILE_STORAGE_KEY = "mahpe_profile_v1";


/* =========================================================
   2. ESTADO BASE
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

    decisionHistory: [],

    profile: {

        name: "Emprendedor MAHPE",

        username: "emprendedor",

        bio:
            "Construyendo ideas y probando empresas dentro de MAHPE.",

        location: "",

        photo: null,

        recommendations: [],

        createdAt: null

    }

};


/* =========================================================
   3. VARIABLES DE INTERFAZ
========================================================= */

let mahpeState =
    loadMahpeState();


let currentCompanyId =
    mahpeState.companies.length

        ? mahpeState.companies[0].id

        : null;


let currentFeedMode =
    "explore";


let currentCompanyTab =
    "products";


let editingProductId =
    null;


let productEditorImages =
    [];


let productEditorCoverIndex =
    0;


/* =========================================================
   4. EMPRESA DEMO — SURANO
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

    activity: 65,

    marketResponse: 61,

    locationStrength: 45,

    risk: 22,

    designLevel: 78,

    productValidation: 63,

    marketKnowledge: 51,

    campaignPower: 30,

    decisions: [],

    brandImage: null,

    brandImageUpdatedAt: null,

    demo: true

};


/* =========================================================
   5. PUBLICACIÓN DEMO
========================================================= */

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

    price: 180,

    views: 328,

    interactions: 84,

    interested: 21,

    committed: 6,

    productId: null,

    image: null,

    createdAt:
        new Date().toISOString(),

    demo: true

};


/* =========================================================
   6. CLONAR OBJETOS
========================================================= */

function cloneData(data) {

    return JSON.parse(
        JSON.stringify(data)
    );

}


/* =========================================================
   7. CARGAR ESTADO
========================================================= */

function loadMahpeState() {

    let raw =
        localStorage.getItem(
            MAHPE_STORAGE_KEY
        );


    /*
       Si todavía no existe v2,
       recuperamos automáticamente v1.
    */

    if (!raw) {

        raw =
            localStorage.getItem(
                MAHPE_LEGACY_STORAGE_KEY
            );

    }


    if (!raw) {

        return cloneData(
            DEFAULT_STATE
        );

    }


    try {

        const parsed =
            JSON.parse(raw);


        return migrateLoadedState(
            parsed
        );

    }

    catch (error) {

        console.error(
            "MAHPE: no se pudo cargar el estado.",
            error
        );


        return cloneData(
            DEFAULT_STATE
        );

    }

}


/* =========================================================
   8. MIGRAR ESTADO GENERAL
========================================================= */

function migrateLoadedState(
    state
) {

    const migrated =
        state &&
        typeof state === "object"

            ? state

            : {};


    if (
        typeof migrated.mahpes !==
        "number"
    ) {

        migrated.mahpes =
            DEFAULT_STATE.mahpes;

    }


    if (
        !Array.isArray(
            migrated.companies
        )
    ) {

        migrated.companies = [];

    }


    if (
        !Array.isArray(
            migrated.products
        )
    ) {

        migrated.products = [];

    }


    if (
        !Array.isArray(
            migrated.posts
        )
    ) {

        migrated.posts = [];

    }


    if (
        !migrated.interactions ||
        typeof migrated.interactions !==
            "object" ||
        Array.isArray(
            migrated.interactions
        )
    ) {

        migrated.interactions = {};

    }


    if (
        !migrated.following ||
        typeof migrated.following !==
            "object" ||
        Array.isArray(
            migrated.following
        )
    ) {

        migrated.following = {};

    }


    if (
        !migrated.followRewards ||
        typeof migrated.followRewards !==
            "object" ||
        Array.isArray(
            migrated.followRewards
        )
    ) {

        migrated.followRewards = {};

    }


    if (
        !Array.isArray(
            migrated.events
        )
    ) {

        migrated.events = [];

    }


    if (
        !Array.isArray(
            migrated.decisionHistory
        )
    ) {

        migrated.decisionHistory = [];

    }


    migrateProfileData(
        migrated
    );


    migrated.companies.forEach(
        migrateCompanyBusinessData
    );


    migrated.products.forEach(
        migrateProductData
    );


    migrated.posts.forEach(
        migratePostData
    );


    return migrated;

}


/* =========================================================
   9. MIGRACIÓN PERFIL
========================================================= */

function migrateProfileData(
    state
) {

    if (
        !state.profile ||
        typeof state.profile !==
            "object" ||
        Array.isArray(
            state.profile
        )
    ) {

        state.profile =
            cloneData(
                DEFAULT_STATE.profile
            );

    }


    const profile =
        state.profile;


    if (
        typeof profile.name !==
        "string"
    ) {

        profile.name =
            "Emprendedor MAHPE";

    }


    if (
        typeof profile.username !==
        "string"
    ) {

        profile.username =
            "emprendedor";

    }


    if (
        typeof profile.bio !==
        "string"
    ) {

        profile.bio =
            "Construyendo ideas dentro de MAHPE.";

    }


    if (
        typeof profile.location !==
        "string"
    ) {

        profile.location = "";

    }


    if (
        typeof profile.photo !==
        "string"
    ) {

        profile.photo = null;

    }


    if (
        !Array.isArray(
            profile.recommendations
        )
    ) {

        profile.recommendations = [];

    }


    if (
        typeof profile.createdAt !==
        "string"
    ) {

        profile.createdAt =
            null;

    }

}


/* =========================================================
   10. MIGRACIÓN EMPRESA
========================================================= */

function migrateCompanyBusinessData(
    company
) {

    if (!company) {

        return;

    }


    const numericDefaults = {

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

        campaignPower: 0

    };


    Object.entries(
        numericDefaults
    ).forEach(
        ([key, defaultValue]) => {

            if (
                typeof company[key] !==
                    "number" ||
                !Number.isFinite(
                    company[key]
                )
            ) {

                company[key] =
                    defaultValue;

            }

        }
    );


    if (
        !Array.isArray(
            company.decisions
        )
    ) {

        company.decisions = [];

    }


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


    if (
        typeof company.stage !==
        "string"
    ) {

        company.stage =
            "Idea";

    }


    if (
        typeof company.description !==
        "string"
    ) {

        company.description = "";

    }


    if (
        typeof company.category !==
        "string"
    ) {

        company.category =
            "Empresa";

    }

}


/* =========================================================
   11. MIGRACIÓN PRODUCTO
========================================================= */

function migrateProductData(
    product
) {

    if (!product) {

        return;

    }


    if (
        !Array.isArray(
            product.images
        )
    ) {

        product.images = [];

    }


    if (
        typeof product.coverIndex !==
        "number" ||
        !Number.isFinite(
            product.coverIndex
        )
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


    const metrics = {

        views: 0,

        interactions: 0,

        interested: 0,

        committed: 0

    };


    Object.entries(
        metrics
    ).forEach(
        ([key, value]) => {

            if (
                typeof product.metrics[key] !==
                    "number"
            ) {

                product.metrics[key] =
                    value;

            }

        }
    );


    if (
        typeof product.published !==
        "boolean"
    ) {

        product.published = false;

    }


    if (
        typeof product.name !==
        "string"
    ) {

        product.name =
            "Producto";

    }


    if (
        typeof product.description !==
        "string"
    ) {

        product.description = "";

    }


    if (
        typeof product.category !==
        "string"
    ) {

        product.category = "";

    }


    if (
        typeof product.price !==
        "number"
    ) {

        product.price =
            Number(
                product.price
            ) || 0;

    }

}


/* =========================================================
   12. MIGRACIÓN PUBLICACIÓN
========================================================= */

function migratePostData(
    post
) {

    if (!post) {

        return;

    }


    const metrics = [
        "views",
        "interactions",
        "interested",
        "committed"
    ];


    metrics.forEach(
        metric => {

            if (
                typeof post[metric] !==
                    "number"
            ) {

                post[metric] =
                    Number(
                        post[metric]
                    ) || 0;

            }

        }
    );


    if (
        typeof post.productId !==
        "string"
    ) {

        post.productId = null;

    }


    if (
        typeof post.image !==
        "string"
    ) {

        post.image = null;

    }


    if (
        typeof post.createdAt !==
        "string"
    ) {

        post.createdAt =
            new Date()
                .toISOString();

    }

}


/* =========================================================
   13. GUARDAR ESTADO
========================================================= */

function saveMahpeState() {

    try {

        localStorage.setItem(

            MAHPE_STORAGE_KEY,

            JSON.stringify(
                mahpeState
            )

        );


        /*
           Conservamos v1 durante esta etapa
           para no romper datos del prototipo.
        */

        localStorage.setItem(

            MAHPE_LEGACY_STORAGE_KEY,

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

    }


    updateGlobalUI();

}


/* =========================================================
   14. MIGRACIÓN INICIAL
========================================================= */

function migrateMahpeBusinessState() {

    mahpeState =
        migrateLoadedState(
            mahpeState
        );


    saveMahpeState();

}


/* =========================================================
   15. ESCAPAR HTML
========================================================= */

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}


/* =========================================================
   16. GENERAR ID
========================================================= */

function generateId(
    prefix = "item"
) {

    return (

        prefix +

        "-" +

        Date.now() +

        "-" +

        Math.floor(
            Math.random() *
            1000000
        )

    );

}


/* =========================================================
   17. CLAMP
========================================================= */

function clamp(
    value,
    min = 0,
    max = 100
) {

    const number =
        Number(value) || 0;


    return Math.max(

        min,

        Math.min(
            max,
            Math.round(
                number
            )
        )

    );

}


/* =========================================================
   18. PRECIO
========================================================= */

function formatPrice(
    value
) {

    const number =
        Number(value) || 0;


    return number.toLocaleString(

        "es-PE",

        {

            minimumFractionDigits:
                number % 1 === 0
                    ? 0
                    : 2,

            maximumFractionDigits:
                2

        }

    );

}


/* =========================================================
   19. FECHA RELATIVA
========================================================= */

function formatRelativeDate(
    isoDate
) {

    if (!isoDate) {

        return "";

    }


    const date =
        new Date(
            isoDate
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const difference =
        Date.now() -
        date.getTime();


    const minutes =
        Math.max(
            0,
            Math.floor(
                difference /
                60000
            )
        );


    if (minutes < 1) {

        return "Ahora";

    }


    if (minutes < 60) {

        return (
            "Hace " +
            minutes +
            " min"
        );

    }


    const hours =
        Math.floor(
            minutes /
            60
        );


    if (hours < 24) {

        return (
            "Hace " +
            hours +
            " h"
        );

    }


    const days =
        Math.floor(
            hours /
            24
        );


    if (days < 7) {

        return (
            "Hace " +
            days +
            " d"
        );

    }


    return date.toLocaleDateString(
        "es-PE"
    );

}


/* =========================================================
   20. EMPRESA ACTUAL
========================================================= */

function getCurrentCompany() {

    return (

        mahpeState.companies.find(

            company =>
                company.id ===
                currentCompanyId

        ) || null

    );

}


/* =========================================================
   21. EMPRESA POR ID
========================================================= */

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


/* =========================================================
   22. PRODUCTO POR ID
========================================================= */

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


/* =========================================================
   23. PRODUCTOS DE EMPRESA
========================================================= */

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
   24. PORTADA DE PRODUCTO
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
   25. AVATAR DE EMPRESA
========================================================= */

function renderCompanyAvatar(
    company,
    className = "company-avatar"
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
   26. COMPRESIÓN DE IMAGEN

   Se reutiliza para:
   - logo
   - foto de perfil
   - productos
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


                            resolve(

                                canvas.toDataURL(
                                    "image/jpeg",
                                    quality
                                )

                            );

                        };


                    image.onerror =
                        () =>

                            reject(
                                new Error(
                                    "No se pudo leer la imagen."
                                )
                            );


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                () =>

                    reject(
                        new Error(
                            "No se pudo cargar el archivo."
                        )
                    );


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   27. NAVEGACIÓN PRINCIPAL
========================================================= */

function getAppViews() {

    return document.querySelectorAll(
        ".app-view"
    );

}


function getNavButtons() {

    return document.querySelectorAll(
        ".nav-button"
    );

}


function openView(
    viewId
) {

    getAppViews().forEach(
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


    getNavButtons().forEach(
        button => {

            button.classList.toggle(

                "active",

                button.dataset.view ===
                    viewId

            );

        }
    );


    /*
       Estas funciones están definidas
       en los siguientes bloques.

       typeof evita errores mientras
       se construye el archivo completo.
    */

    if (
        viewId !==
            "companyView" &&
        typeof closeProductEditor ===
            "function"
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
            () => {

                if (
                    typeof map !==
                        "undefined" &&
                    map
                ) {

                    map.invalidateSize();

                }

            },
            150
        );

    }


    if (
        viewId ===
            "companyView" &&
        typeof renderCompanyDashboard ===
            "function"
    ) {

        renderCompanyDashboard();

    }


    if (
        viewId ===
            "profileView" &&
        typeof updateProfile ===
            "function"
    ) {

        updateProfile();

    }

}


/* =========================================================
   28. ACTIVIDAD MAHPE
========================================================= */

function addMahpeEvent(
    type,
    message,
    companyId = null,
    metadata = {}
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

        metadata,

        read: false,

        createdAt:
            new Date()
                .toISOString()

    });


    /*
       Evitamos crecimiento infinito
       de localStorage.
    */

    mahpeState.events =
        mahpeState.events.slice(
            0,
            50
        );

}


/* =========================================================
   29. ICONOS DE ACTIVIDAD
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

        decision: "⚡",

        profile: "●",

        coyote: "📍",

        recommendation: "★"

    };


    return (
        icons[type] ||
        "•"
    );

}


/* =========================================================
   30. ACTIVIDAD NO LEÍDA
========================================================= */

function getUnreadActivityCount() {

    return mahpeState.events.filter(

        event =>
            !event.read

    ).length;

}


/* =========================================================
   31. MARCAR ACTIVIDAD LEÍDA
========================================================= */

function markActivityAsRead() {

    mahpeState.events.forEach(
        event => {

            event.read =
                true;

        }
    );


    saveMahpeState();


    renderActivityInbox();

}


/* =========================================================
   32. BANDEJA COMPACTA

   Objetivo:
   NO ocupar media pantalla del Inicio.

   Muestra máximo 2 novedades.
========================================================= */

function renderActivityInbox() {

    const inbox =
        document.getElementById(
            "activityInbox"
        );


    const list =
        document.getElementById(
            "activityList"
        );


    const badge =
        document.getElementById(
            "activityBadge"
        );


    const events =
        Array.isArray(
            mahpeState.events
        )

            ? mahpeState.events

            : [];


    const unread =
        getUnreadActivityCount();


    if (badge) {

        badge.textContent =
            unread;


        badge.classList.toggle(
            "hidden",
            unread === 0
        );

    }


    if (inbox) {

        inbox.classList.toggle(
            "has-unread",
            unread > 0
        );

    }


    if (!list) {

        return;

    }


    if (!events.length) {

        list.innerHTML = `

            <div
                class="activity-compact-empty"
            >

                <span>
                    Todo al día.
                </span>

                <small>
                    Tus novedades aparecerán aquí.
                </small>

            </div>

        `;

        return;

    }


    const visibleEvents =
        events.slice(
            0,
            2
        );


    list.innerHTML =
        visibleEvents
            .map(
                event => `

                    <article
                        class="activity-item compact ${
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

                                ${formatRelativeDate(
                                    event.createdAt
                                )}

                            </small>

                        </div>

                    </article>

                `
            )
            .join("") +

        (
            events.length > 2

                ? `

                    <button
                        class="activity-more-button"
                        type="button"
                        onclick="openMahpeActivity()"
                    >

                        ${
                            events.length - 2
                        }
                        novedades más →

                    </button>

                `

                : ""
        );

}


/* =========================================================
   33. VER ACTIVIDAD

   Por ahora amplía la propia bandeja.
   En el futuro puede ser una pantalla.
========================================================= */

function openMahpeActivity() {

    const list =
        document.getElementById(
            "activityList"
        );


    if (!list) {

        return;

    }


    const events =
        mahpeState.events;


    if (!events.length) {

        return;

    }


    list.innerHTML =
        events
            .slice(
                0,
                12
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

                                ${formatRelativeDate(
                                    event.createdAt
                                )}

                            </small>

                        </div>

                    </article>

                `
            )
            .join("") +

        `

            <button
                class="activity-more-button"
                type="button"
                onclick="collapseMahpeActivity()"
            >

                Mostrar menos

            </button>

        `;


    markActivityAsRead();

}


/* =========================================================
   34. CONTRAER ACTIVIDAD
========================================================= */

function collapseMahpeActivity() {

    renderActivityInbox();

}


/* =========================================================
   35. TODAS LAS PUBLICACIONES
========================================================= */

function getAllPosts() {

    const realPosts =
        mahpeState.posts
            .slice()
            .sort(
                (
                    a,
                    b
                ) => {

                    const dateA =
                        new Date(
                            a.createdAt ||
                            0
                        ).getTime();


                    const dateB =
                        new Date(
                            b.createdAt ||
                            0
                        ).getTime();


                    return (
                        dateB -
                        dateA
                    );

                }
            );


    return [

        demoPost,

        ...realPosts

    ];

}


/* =========================================================
   36. EMPRESA DE UNA PUBLICACIÓN
========================================================= */

function getPostCompany(
    post
) {

    if (!post) {

        return null;

    }


    if (post.demo) {

        return demoCompany;

    }


    return getCompanyById(
        post.companyId
    );

}


/* =========================================================
   37. SIGUIENDO
========================================================= */

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


/* =========================================================
   38. NÚMERO DE EMPRESAS SEGUIDAS
========================================================= */

function getFollowingCount() {

    return Object.values(

        mahpeState.following ||
        {}

    ).filter(
        Boolean
    ).length;

}


/* =========================================================
   39. MÉTRICA VISIBLE DEL POST
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
       SURANO demo no se modifica directamente.

       Las señales del usuario se añaden
       visualmente sobre la métrica demo.
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
   40. PUNTUACIÓN DE TENDENCIA
========================================================= */

function getPostTrendScore(
    post
) {

    const views =
        getDisplayedPostMetric(
            post,
            "views"
        );


    const interactions =
        getDisplayedPostMetric(
            post,
            "interactions"
        );


    const interested =
        getDisplayedPostMetric(
            post,
            "interested"
        );


    const committed =
        getDisplayedPostMetric(
            post,
            "committed"
        );


    return (

        views *
        0.05 +

        interactions *
        1 +

        interested *
        4 +

        committed *
        10

    );

}


/* =========================================================
   41. PUBLICACIONES VISIBLES
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
   42. FEED SHELL

   MUY IMPORTANTE:
   index.html es dueño de:

   Siguiendo | Descubrir | Tendencias

   JS NO CREA OTRA BARRA.
========================================================= */

function ensureFeedShell() {

    const feedContainer =
        document.getElementById(
            "feedContainer"
        );


    if (!feedContainer) {

        return false;

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
            "MAHPE: faltan controles del feed en index.html."
        );

    }


    return true;

}


/* =========================================================
   43. CAMBIAR FEED
========================================================= */

function setFeedMode(
    mode
) {

    const validModes = [

        "following",

        "explore",

        "trending"

    ];


    currentFeedMode =
        validModes.includes(
            mode
        )

            ? mode

            : "explore";


    updateFeedControls();


    renderFeed();

}


/* =========================================================
   44. INICIALIZAR TABS DEL FEED
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
                    () => {

                        setFeedMode(
                            button.dataset.feedMode
                        );

                    };

            }
        );


    updateFeedControls();

}


/* =========================================================
   45. ACTUALIZAR TABS
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
   46. FEED VACÍO
========================================================= */

function renderEmptyFeed(
    container
) {

    let title =
        "Todavía no hay publicaciones";


    let text =
        "Las nuevas empresas y productos aparecerán aquí.";


    if (
        currentFeedMode ===
        "following"
    ) {

        title =
            "Todavía no sigues publicaciones";


        text =
            "Ve a Descubrir y sigue empresas que te interesen.";

    }


    else if (
        currentFeedMode ===
        "trending"
    ) {

        title =
            "Todavía no hay tendencias";


        text =
            "Las señales de la comunidad decidirán qué productos y empresas suben.";

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


            <p
                class="muted"
            >

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

                            DESCUBRIR

                        </button>

                    `

                    : ""
            }

        </section>

    `;

}


/* =========================================================
   47. VISUAL DE PUBLICACIÓN
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


    if (image) {

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
                    loading="lazy"
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
                                    class="post-product-price"
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
                    post.title ||
                    company.name
                )}

            </strong>


            <p>

                ${escapeHTML(
                    post.text ||
                    ""
                )}

            </p>

        </div>

    `;

}


/* =========================================================
   48. BOTÓN DE SEÑAL
========================================================= */

function renderSignalButton(
    post,
    signal,
    emoji,
    metric,
    label
) {

    const key =
        post.id +
        "-" +
        signal;


    const selected =
        Boolean(
            mahpeState.interactions[
                key
            ]
        );


    return `

        <button
            class="signal-button ${
                selected
                    ? "selected"
                    : ""
            }"
            data-post="${post.id}"
            data-signal="${signal}"
            type="button"
            aria-pressed="${
                selected
                    ? "true"
                    : "false"
            }"
        >

            <span>
                ${emoji}
            </span>


            <strong>

                ${getDisplayedPostMetric(
                    post,
                    metric
                )}

            </strong>


            <small>
                ${label}
            </small>

        </button>

    `;

}


/* =========================================================
   49. RENDER FEED
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


            const following =
                isFollowingCompany(
                    company.id
                );


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "post";


            article.dataset.postId =
                post.id;


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
                                company.category ||
                                "Empresa"
                            )}

                            ·

                            ${escapeHTML(
                                company.stage ||
                                "Idea"
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

                        ${escapeHTML(
                            post.text ||
                            ""
                        )}

                    </p>


                    ${
                        post.createdAt

                            ? `

                                <small
                                    class="post-time"
                                >

                                    ${formatRelativeDate(
                                        post.createdAt
                                    )}

                                </small>

                            `

                            : ""
                    }


                    <div
                        class="signals"
                    >

                        ${renderSignalButton(
                            post,
                            "view",
                            "👁",
                            "views",
                            "Vistas"
                        )}


                        ${renderSignalButton(
                            post,
                            "interaction",
                            "♡",
                            "interactions",
                            "Interacción"
                        )}


                        ${renderSignalButton(
                            post,
                            "interest",
                            "🔥",
                            "interested",
                            "Interesado"
                        )}


                        ${renderSignalButton(
                            post,
                            "commitment",
                            "💰",
                            "committed",
                            "Comprometido"
                        )}

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
   50. SEGUIR / DEJAR DE SEGUIR
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


            /*
               Valor SIMULADO.
               No representa dinero real.
            */

            company.value =
                Number(
                    company.value ||
                    0
                ) +
                4;

        }


        /*
           Recompensa única interna MAHPE.
        */

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


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    if (
        typeof updateProfile ===
        "function"
    ) {

        updateProfile();

    }

}


/* =========================================================
   51. EVENTOS DEL FEED
========================================================= */

function bindFeedEvents() {

    document
        .querySelectorAll(
            ".follow-button"
        )
        .forEach(
            button => {

                button.onclick =
                    () => {

                        toggleCompanyFollow(
                            button.dataset.company
                        );

                    };

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
                           Una misma instalación local
                           solo puede enviar una señal
                           de cada tipo a cada post.
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
   52. APLICAR SEÑAL
========================================================= */

function applySignal(
    postId,
    signal
) {

    const realPost =
        mahpeState.posts.find(

            post =>
                post.id ===
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


    /*
       👁 VISTA
    */

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


    /*
       ♡ INTERACCIÓN
    */

    else if (
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


    /*
       🔥 INTERÉS
    */

    else if (
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


    /*
       💰 COMPROMETIDO

       IMPORTANTE:
       Es una señal de intención de mercado.
       NO es una compra ni inversión.
    */

    else if (
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


            /*
               Capital del simulador.
               NO dinero real.
            */

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


    if (
        realPost &&
        typeof recalculateCompanyStage ===
            "function"
    ) {

        recalculateCompanyStage(
            company
        );

    }


    saveMahpeState();


    renderFeed();


    renderActivityInbox();


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    if (
        typeof updateProfile ===
        "function"
    ) {

        updateProfile();

    }

}


/* =========================================================
   53. ACTUALIZACIÓN GLOBAL

   Se completa visualmente con los bloques
   siguientes, pero ya puede actualizar
   contadores existentes.
========================================================= */

function updateGlobalUI() {

    const mahpesTargets = [

        document.getElementById(
            "mahpesCount"
        ),

        document.getElementById(
            "profileMahpes"
        )

    ];


    mahpesTargets.forEach(
        element => {

            if (element) {

                element.textContent =
                    Number(
                        mahpeState.mahpes ||
                        0
                    ).toLocaleString(
                        "es-PE"
                    );

            }

        }
    );


    const followingCount =
        document.getElementById(
            "followingCount"
        );


    if (followingCount) {

        followingCount.textContent =
            getFollowingCount();

    }

}


/* =========================================================
   54. PREPARAR NAVEGACIÓN

   La inicialización definitiva ocurre
   una sola vez en BLOQUE 4/4.
========================================================= */

function bindMainNavigation() {

    getNavButtons().forEach(
        button => {

            button.onclick =
                function() {

                    const viewId =
                        this.dataset.view;


                    if (!viewId) {

                        return;

                    }


                    openView(
                        viewId
                    );

                };

        }
    );

}


/* =========================================================
   55. EXPONER FUNCIONES NECESARIAS
========================================================= */

window.setFeedMode =
    setFeedMode;


window.toggleCompanyFollow =
    toggleCompanyFollow;


window.openMahpeActivity =
    openMahpeActivity;


window.collapseMahpeActivity =
    collapseMahpeActivity;


/* =========================================================
   FIN BLOQUE 1/4

   NO INICIALIZAR AQUÍ.

   BLOQUE 2/4 CONTINÚA INMEDIATAMENTE CON:

   - Crear empresa
   - Identidad visual
   - "Crea tu logo con IA:"
   - Subir logo
   - Crear productos
   - Hasta 5 imágenes
   - Elegir portada
   - Editar producto
   - Eliminar producto
   - Publicar producto
   - Galería / vitrina empresarial

========================================================= */
/* =========================================================
   MAHPE v2.0
   Crea. Simula. Haz crecer.

   BLOQUE 2/4
   ---------------------------------------------------------
   EMPRESA + IDENTIDAD + PRODUCTOS

   - Crear empresa
   - Identidad visual
   - Logo de empresa
   - Links externos para crear logo con IA
   - Crear producto
   - Hasta 5 imágenes
   - Elegir portada
   - Editar producto
   - Eliminar producto
   - Publicar producto en MAHPE
   - Publicaciones empresariales
   - Métricas por producto
   - Potencial del producto
   ---------------------------------------------------------

   CONTINÚA DIRECTAMENTE DESPUÉS DEL BLOQUE 1/4
========================================================= */


/* =========================================================
   56. ELEMENTOS — CREAR EMPRESA
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
   57. MENSAJE — CREAR EMPRESA
========================================================= */

function setCreateCompanyStatus(
    message,
    type = ""
) {

    if (!createCompanyStatus) {

        return;

    }


    createCompanyStatus.textContent =
        message;


    createCompanyStatus.className =
        "form-message";


    if (type) {

        createCompanyStatus.classList.add(
            type
        );

    }

}


/* =========================================================
   58. LIMPIAR FORMULARIO DE EMPRESA
========================================================= */

function clearCompanyForm() {

    if (companyNameInput) {

        companyNameInput.value = "";

    }


    if (companyCategoryInput) {

        companyCategoryInput.value = "";

    }


    if (companyDescriptionInput) {

        companyDescriptionInput.value = "";

    }


    if (companyProductInput) {

        companyProductInput.value = "";

    }


    if (companyPriceInput) {

        companyPriceInput.value = "";

    }


    if (companyAudienceInput) {

        companyAudienceInput.value = "";

    }

}


/* =========================================================
   59. CREAR EMPRESA
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


    const firstProduct =
        companyProductInput
            ? companyProductInput.value.trim()
            : "";


    const price =
        companyPriceInput
            ? Number(
                companyPriceInput.value
            ) || 0
            : 0;


    const audience =
        companyAudienceInput
            ? companyAudienceInput.value.trim()
            : "";


    if (!name) {

        setCreateCompanyStatus(
            "Escribe el nombre de tu empresa.",
            "error"
        );

        return;

    }


    if (!category) {

        setCreateCompanyStatus(
            "Indica la categoría de tu empresa.",
            "error"
        );

        return;

    }


    const duplicate =
        mahpeState.companies.some(

            company =>
                company.name
                    .trim()
                    .toLowerCase() ===
                name.toLowerCase()

        );


    if (duplicate) {

        setCreateCompanyStatus(
            "Ya tienes una empresa con ese nombre.",
            "error"
        );

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

        product:
            firstProduct,

        price,

        audience,

        stage:
            "Idea",

        followers: 0,

        interactions: 0,

        interested: 0,

        committed: 0,

        /*
           Valor interno del simulador.
           NO representa dinero real.
        */

        value: 500,

        /*
           Capital ficticio del simulador.
           NO es saldo retirable.
        */

        capital: 500,

        activity: 20,

        marketResponse: 10,

        locationStrength: 10,

        risk: 15,

        designLevel: 10,

        productValidation: 5,

        marketKnowledge: 10,

        campaignPower: 0,

        decisions: [],

        brandImage: null,

        brandImageUpdatedAt: null,

        createdAt:
            new Date()
                .toISOString()

    };


    mahpeState.companies.unshift(
        company
    );


    currentCompanyId =
        company.id;


    /*
       Si el usuario escribió un producto
       durante la creación de empresa,
       lo convertimos en producto real
       dentro de la vitrina.
    */

    if (firstProduct) {

        const product = {

            id:
                generateId(
                    "product"
                ),

            companyId:
                company.id,

            name:
                firstProduct,

            category,

            price,

            description:
                "Primer producto de " +
                name +
                ".",

            images: [],

            coverIndex: 0,

            published: false,

            metrics: {

                views: 0,

                interactions: 0,

                interested: 0,

                committed: 0

            },

            createdAt:
                new Date()
                    .toISOString(),

            updatedAt:
                new Date()
                    .toISOString()

        };


        mahpeState.products.unshift(
            product
        );

    }


    addMahpeEvent(

        "company",

        "Creaste " +
        company.name +
        ".",

        company.id

    );


    saveMahpeState();


    clearCompanyForm();


    setCreateCompanyStatus(
        "Empresa creada. Ya puedes desarrollar su identidad y productos.",
        "success"
    );


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    if (
        typeof updateProfile ===
        "function"
    ) {

        updateProfile();

    }


    setTimeout(
        () => {

            openView(
                "companyView"
            );

        },
        250
    );

}


/* =========================================================
   60. IDENTIDAD VISUAL
========================================================= */

function renderBrandIdentity(
    company
) {

    if (!company) {

        return "";

    }


    return `

        <section
            class="brand-identity-card"
        >

            <div
                class="brand-identity-header"
            >

                <div>

                    <span
                        class="eyebrow"
                    >
                        IDENTIDAD
                    </span>


                    <h3>
                        Identidad visual
                    </h3>

                </div>


                ${renderCompanyAvatar(
                    company,
                    "brand-profile-avatar"
                )}

            </div>


            <div
                class="brand-ai-help"
            >

                <strong>
                    Crea tu logo con IA:
                </strong>


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
                        href="https://www.adobe.com/express/create/logo"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Adobe Express
                    </a>


                    <a
                        href="https://looka.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Looka
                    </a>

                </div>

            </div>


            <div
                class="brand-upload-row"
            >

                <input
                    id="companyLogoInput"
                    type="file"
                    accept="image/*"
                    hidden
                >


                <button
                    class="secondary-button"
                    type="button"
                    onclick="openCompanyLogoPicker()"
                >

                    ${
                        company.brandImage
                            ? "CAMBIAR LOGO"
                            : "SUBIR LOGO"
                    }

                </button>


                ${
                    company.brandImage

                        ? `

                            <button
                                class="text-button danger"
                                type="button"
                                onclick="removeCompanyLogo()"
                            >

                                Quitar

                            </button>

                        `

                        : ""
                }

            </div>

        </section>

    `;

}


/* =========================================================
   61. ABRIR SELECTOR DE LOGO
========================================================= */

function openCompanyLogoPicker() {

    const input =
        document.getElementById(
            "companyLogoInput"
        );


    if (input) {

        input.click();

    }

}


/* =========================================================
   62. PROCESAR LOGO
========================================================= */

async function handleCompanyLogoFile(
    file
) {

    const company =
        getCurrentCompany();


    if (
        !company ||
        !file
    ) {

        return;

    }


    try {

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


        company.designLevel =
            clamp(
                Number(
                    company.designLevel ||
                    0
                ) +
                8
            );


        addMahpeEvent(

            "brand",

            "Actualizaste la identidad visual de " +
            company.name +
            ".",

            company.id

        );


        saveMahpeState();


        if (
            typeof renderCompanyDashboard ===
            "function"
        ) {

            renderCompanyDashboard();

        }


        renderFeed();

    }

    catch (error) {

        console.error(
            error
        );


        alert(
            error.message ||
            "No se pudo procesar el logo."
        );

    }

}


/* =========================================================
   63. QUITAR LOGO
========================================================= */

function removeCompanyLogo() {

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


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    renderFeed();

}


/* =========================================================
   64. CONECTAR INPUT DE LOGO DINÁMICO
========================================================= */

function bindCompanyLogoInput() {

    const input =
        document.getElementById(
            "companyLogoInput"
        );


    if (!input) {

        return;

    }


    input.onchange =
        async function() {

            const file =
                this.files &&
                this.files[0];


            if (file) {

                await handleCompanyLogoFile(
                    file
                );

            }


            this.value = "";

        };

}


/* =========================================================
   65. ELEMENTOS — EDITOR DE PRODUCTO
========================================================= */

function getProductEditorElements() {

    return {

        editor:
            document.getElementById(
                "productEditor"
            ),

        title:
            document.getElementById(
                "productEditorTitle"
            ),

        name:
            document.getElementById(
                "productNameInput"
            ),

        category:
            document.getElementById(
                "productCategoryInput"
            ),

        price:
            document.getElementById(
                "productPriceInput"
            ),

        description:
            document.getElementById(
                "productDescriptionInput"
            ),

        images:
            document.getElementById(
                "productImagesInput"
            ),

        preview:
            document.getElementById(
                "productImagePreview"
            ),

        save:
            document.getElementById(
                "saveProductButton"
            ),

        cancel:
            document.getElementById(
                "cancelProductButton"
            ),

        status:
            document.getElementById(
                "productEditorStatus"
            )

    };

}


/* =========================================================
   66. ABRIR EDITOR — NUEVO PRODUCTO
========================================================= */

function openNewProductEditor() {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    editingProductId =
        null;


    productEditorImages =
        [];


    productEditorCoverIndex =
        0;


    const elements =
        getProductEditorElements();


    if (
        !elements.editor
    ) {

        console.warn(
            "MAHPE: #productEditor no existe en index.html."
        );

        return;

    }


    if (elements.title) {

        elements.title.textContent =
            "Agregar producto";

    }


    if (elements.name) {

        elements.name.value = "";

    }


    if (elements.category) {

        elements.category.value =
            company.category ||
            "";

    }


    if (elements.price) {

        elements.price.value = "";

    }


    if (elements.description) {

        elements.description.value = "";

    }


    if (elements.images) {

        elements.images.value = "";

    }


    if (elements.status) {

        elements.status.textContent =
            "";

    }


    renderProductImagePreview();


    elements.editor.classList.remove(
        "hidden"
    );


    elements.editor.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    if (elements.name) {

        setTimeout(
            () => {

                elements.name.focus();

            },
            200
        );

    }

}


/* =========================================================
   67. EDITAR PRODUCTO
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


    const company =
        getCurrentCompany();


    if (
        !company ||
        product.companyId !==
            company.id
    ) {

        return;

    }


    editingProductId =
        product.id;


    productEditorImages =
        Array.isArray(
            product.images
        )

            ? [
                ...product.images
            ]

            : [];


    productEditorCoverIndex =
        Number(
            product.coverIndex ||
            0
        );


    const elements =
        getProductEditorElements();


    if (!elements.editor) {

        return;

    }


    if (elements.title) {

        elements.title.textContent =
            "Editar producto";

    }


    if (elements.name) {

        elements.name.value =
            product.name ||
            "";

    }


    if (elements.category) {

        elements.category.value =
            product.category ||
            "";

    }


    if (elements.price) {

        elements.price.value =
            Number(
                product.price ||
                0
            );

    }


    if (elements.description) {

        elements.description.value =
            product.description ||
            "";

    }


    if (elements.images) {

        elements.images.value =
            "";

    }


    if (elements.status) {

        elements.status.textContent =
            "";

    }


    renderProductImagePreview();


    elements.editor.classList.remove(
        "hidden"
    );


    elements.editor.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =========================================================
   68. CERRAR EDITOR
========================================================= */

function closeProductEditor(
    scrollToCompany = true
) {

    const elements =
        getProductEditorElements();


    if (elements.editor) {

        elements.editor.classList.add(
            "hidden"
        );

    }


    editingProductId =
        null;


    productEditorImages =
        [];


    productEditorCoverIndex =
        0;


    if (
        scrollToCompany &&
        typeof renderCompanyDashboard ===
            "function"
    ) {

        renderCompanyDashboard();

    }

}


/* =========================================================
   69. ESTADO DEL EDITOR
========================================================= */

function setProductEditorStatus(
    message,
    type = ""
) {

    const element =
        document.getElementById(
            "productEditorStatus"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.className =
        "form-message";


    if (type) {

        element.classList.add(
            type
        );

    }

}


/* =========================================================
   70. LEER IMÁGENES DEL PRODUCTO
========================================================= */

async function handleProductImages(
    files
) {

    if (!files) {

        return;

    }


    const available =
        Math.max(

            0,

            5 -
            productEditorImages.length

        );


    if (available <= 0) {

        setProductEditorStatus(
            "Puedes usar hasta 5 imágenes por producto.",
            "error"
        );

        return;

    }


    const selected =
        Array.from(
            files
        ).slice(
            0,
            available
        );


    if (!selected.length) {

        return;

    }


    setProductEditorStatus(
        "Procesando imágenes..."
    );


    for (
        const file
        of selected
    ) {

        try {

            const compressed =
                await compressImageFile(

                    file,

                    {

                        maxDimension: 1200,

                        quality: 0.76

                    }

                );


            productEditorImages.push(
                compressed
            );

        }

        catch (error) {

            console.warn(
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


    renderProductImagePreview();


    setProductEditorStatus(

        productEditorImages.length

            ? productEditorImages.length +
              "/5 imágenes listas."

            : ""

    );

}


/* =========================================================
   71. PREVISUALIZACIÓN DE IMÁGENES
========================================================= */

function renderProductImagePreview() {

    const container =
        document.getElementById(
            "productImagePreview"
        );


    if (!container) {

        return;

    }


    if (
        !productEditorImages.length
    ) {

        container.innerHTML = `

            <div
                class="product-preview-empty"
            >

                <span>
                    ＋
                </span>

                <small>
                    Añade imágenes para construir la vitrina del producto.
                </small>

            </div>

        `;

        return;

    }


    container.innerHTML =
        productEditorImages
            .map(
                (
                    image,
                    index
                ) => `

                    <div
                        class="product-preview-item ${
                            index ===
                            productEditorCoverIndex

                                ? "cover"

                                : ""
                        }"
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
                                        class="product-preview-cover"
                                    >
                                        PORTADA
                                    </span>

                                `

                                : ""
                        }


                        <div
                            class="product-preview-overlay"
                        >

                            <button
                                class="product-preview-button"
                                type="button"
                                onclick="setProductCover(${index})"
                                title="Usar como portada"
                            >

                                ★

                            </button>


                            <button
                                class="product-preview-button"
                                type="button"
                                onclick="removeProductEditorImage(${index})"
                                title="Eliminar imagen"
                            >

                                ×

                            </button>

                        </div>

                    </div>

                `
            )
            .join("") +

        `

            <div
                class="product-image-counter"
            >

                ${productEditorImages.length}/5

            </div>

        `;

}


/* =========================================================
   72. ELEGIR PORTADA
========================================================= */

function setProductCover(
    index
) {

    if (
        index < 0 ||
        index >=
            productEditorImages.length
    ) {

        return;

    }


    productEditorCoverIndex =
        index;


    renderProductImagePreview();

}


/* =========================================================
   73. QUITAR IMAGEN
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
        productEditorCoverIndex ===
        index
    ) {

        productEditorCoverIndex =
            0;

    }


    else if (
        productEditorCoverIndex >
        index
    ) {

        productEditorCoverIndex -=
            1;

    }


    renderProductImagePreview();

}


/* =========================================================
   74. GUARDAR PRODUCTO
========================================================= */

function saveProductFromEditor() {

    const company =
        getCurrentCompany();


    if (!company) {

        setProductEditorStatus(
            "Primero crea una empresa.",
            "error"
        );

        return;

    }


    const elements =
        getProductEditorElements();


    const name =
        elements.name
            ? elements.name.value.trim()
            : "";


    const category =
        elements.category
            ? elements.category.value.trim()
            : "";


    const price =
        elements.price
            ? Number(
                elements.price.value
            ) || 0
            : 0;


    const description =
        elements.description
            ? elements.description.value.trim()
            : "";


    if (!name) {

        setProductEditorStatus(
            "Escribe el nombre del producto.",
            "error"
        );

        return;

    }


    if (price < 0) {

        setProductEditorStatus(
            "El precio no puede ser negativo.",
            "error"
        );

        return;

    }


    /*
       EDITAR PRODUCTO EXISTENTE
    */

    if (editingProductId) {

        const product =
            getProductById(
                editingProductId
            );


        if (!product) {

            setProductEditorStatus(
                "No encontramos el producto.",
                "error"
            );

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
            [
                ...productEditorImages
            ];


        product.coverIndex =
            productEditorCoverIndex;


        product.updatedAt =
            new Date()
                .toISOString();


        addMahpeEvent(

            "product",

            "Actualizaste " +
            product.name +
            ".",

            company.id,

            {

                productId:
                    product.id

            }

        );


        saveMahpeState();


        setProductEditorStatus(
            "Producto actualizado.",
            "success"
        );

    }


    /*
       NUEVO PRODUCTO
    */

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
                [
                    ...productEditorImages
                ],

            coverIndex:
                productEditorCoverIndex,

            published: false,

            metrics: {

                views: 0,

                interactions: 0,

                interested: 0,

                committed: 0

            },

            createdAt:
                new Date()
                    .toISOString(),

            updatedAt:
                new Date()
                    .toISOString()

        };


        mahpeState.products.unshift(
            product
        );


        company.productValidation =
            clamp(
                Number(
                    company.productValidation ||
                    0
                ) +
                3
            );


        company.activity =
            clamp(
                Number(
                    company.activity ||
                    0
                ) +
                2
            );


        addMahpeEvent(

            "product",

            "Añadiste " +
            product.name +
            " a " +
            company.name +
            ".",

            company.id,

            {

                productId:
                    product.id

            }

        );


        saveMahpeState();


        setProductEditorStatus(
            "Producto creado.",
            "success"
        );

    }


    setTimeout(
        () => {

            closeProductEditor(
                true
            );

        },
        300
    );

}


/* =========================================================
   75. ELIMINAR PRODUCTO
========================================================= */

function deleteProduct(
    productId
) {

    const product =
        getProductById(
            productId
        );


    const company =
        getCurrentCompany();


    if (
        !product ||
        !company ||
        product.companyId !==
            company.id
    ) {

        return;

    }


    const accepted =
        window.confirm(

            "¿Eliminar " +
            product.name +
            " de tu empresa?"

        );


    if (!accepted) {

        return;

    }


    mahpeState.products =
        mahpeState.products.filter(

            item =>
                item.id !==
                productId

        );


    /*
       Conservamos publicaciones históricas,
       pero eliminamos la relación directa
       con el producto eliminado.
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


    addMahpeEvent(

        "product",

        "Eliminaste " +
        product.name +
        ".",

        company.id

    );


    saveMahpeState();


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    renderFeed();

}


/* =========================================================
   76. PUBLICAR PRODUCTO EN MAHPE
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

        productId:
            product.id,

        title:
            product.name,

        text:
            product.description ||
            (
                "Conoce " +
                product.name +
                " de " +
                company.name +
                "."
            ),

        price:
            Number(
                product.price ||
                0
            ),

        image:
            cover,

        views: 0,

        interactions: 0,

        interested: 0,

        committed: 0,

        createdAt:
            new Date()
                .toISOString()

    };


    mahpeState.posts.unshift(
        post
    );


    product.published =
        true;


    product.lastPublishedAt =
        post.createdAt;


    product.updatedAt =
        post.createdAt;


    company.activity =
        clamp(
            Number(
                company.activity ||
                0
            ) +
            4
        );


    addMahpeEvent(

        "post",

        "Publicaste " +
        product.name +
        " en MAHPE.",

        company.id,

        {

            productId:
                product.id,

            postId:
                post.id

        }

    );


    saveMahpeState();


    renderFeed();


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    /*
       Después de publicar mostramos
       el producto en Descubrir.
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
   77. PUBLICACIÓN GENERAL DE EMPRESA
========================================================= */

function publishCompanyPost(
    text
) {

    const company =
        getCurrentCompany();


    if (!company) {

        return false;

    }


    const content =
        String(
            text || ""
        ).trim();


    if (!content) {

        return false;

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

        productId:
            null,

        title:
            company.name,

        text:
            content,

        price: 0,

        image: null,

        views: 0,

        interactions: 0,

        interested: 0,

        committed: 0,

        createdAt:
            new Date()
                .toISOString()

    };


    mahpeState.posts.unshift(
        post
    );


    company.activity =
        clamp(
            Number(
                company.activity ||
                0
            ) +
            2
        );


    addMahpeEvent(

        "post",

        company.name +
        " publicó una actualización.",

        company.id,

        {

            postId:
                post.id

        }

    );


    saveMahpeState();


    renderFeed();


    return true;

}


/* =========================================================
   78. MÉTRICAS DEL PRODUCTO
========================================================= */

function getProductMetrics(
    product
) {

    if (!product) {

        return {

            views: 0,

            interactions: 0,

            interested: 0,

            committed: 0

        };

    }


    migrateProductData(
        product
    );


    return {

        views:
            Number(
                product.metrics.views ||
                0
            ),

        interactions:
            Number(
                product.metrics.interactions ||
                0
            ),

        interested:
            Number(
                product.metrics.interested ||
                0
            ),

        committed:
            Number(
                product.metrics.committed ||
                0
            )

    };

}


/* =========================================================
   79. SCORE DE PRODUCTO
========================================================= */

function getProductScore(
    product
) {

    const metrics =
        getProductMetrics(
            product
        );


    return (

        metrics.views *
        0.05 +

        metrics.interactions *
        1 +

        metrics.interested *
        4 +

        metrics.committed *
        10

    );

}


/* =========================================================
   80. POTENCIAL DEL PRODUCTO
========================================================= */

function getProductPotential(
    product
) {

    const score =
        getProductScore(
            product
        );


    if (score >= 60) {

        return {

            label:
                "ALTO",

            className:
                "high"

        };

    }


    if (score >= 20) {

        return {

            label:
                "MEDIO",

            className:
                "medium"

        };

    }


    return {

        label:
            "EN PRUEBA",

        className:
            "testing"

    };

}


/* =========================================================
   81. TARJETA DE PRODUCTO
========================================================= */

function renderProductCard(
    product
) {

    const cover =
        getProductCover(
            product
        );


    const metrics =
        getProductMetrics(
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
                                loading="lazy"
                            >

                        `

                        : `

                            <div
                                class="product-image-placeholder"
                            >

                                <span>
                                    ${escapeHTML(
                                        product.name
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </span>

                                <small>
                                    Sin imagen
                                </small>

                            </div>

                        `
                }


                ${
                    product.published

                        ? `

                            <span
                                class="product-published-badge"
                            >
                                PUBLICADO
                            </span>

                        `

                        : ""
                }


                <span
                    class="product-potential ${potential.className}"
                >

                    ${potential.label}

                </span>

            </div>


            <div
                class="product-card-body"
            >

                <small
                    class="product-category"
                >

                    ${escapeHTML(
                        product.category ||
                        "Producto"
                    )}

                </small>


                <h3>

                    ${escapeHTML(
                        product.name
                    )}

                </h3>


                ${
                    Number(
                        product.price
                    ) > 0

                        ? `

                            <strong
                                class="product-price"
                            >

                                S/ ${formatPrice(
                                    product.price
                                )}

                            </strong>

                        `

                        : ""
                }


                ${
                    product.description

                        ? `

                            <p>

                                ${escapeHTML(
                                    product.description
                                )}

                            </p>

                        `

                        : ""
                }


                <div
                    class="product-signals"
                >

                    <span>
                        👁 ${metrics.views}
                    </span>

                    <span>
                        ♡ ${metrics.interactions}
                    </span>

                    <span>
                        🔥 ${metrics.interested}
                    </span>

                    <span>
                        💰 ${metrics.committed}
                    </span>

                </div>


                <div
                    class="product-card-actions"
                >

                    <button
                        class="secondary-button"
                        type="button"
                        onclick="editProduct('${product.id}')"
                    >

                        EDITAR

                    </button>


                    <button
                        class="primary-button"
                        type="button"
                        onclick="publishProduct('${product.id}')"
                    >

                        ${
                            product.published
                                ? "PUBLICAR DE NUEVO"
                                : "PUBLICAR"
                        }

                    </button>

                </div>


                <button
                    class="delete-product-button"
                    type="button"
                    onclick="deleteProduct('${product.id}')"
                >

                    Eliminar producto

                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   82. GALERÍA DE PRODUCTOS
========================================================= */

function renderCompanyProducts(
    company
) {

    if (!company) {

        return "";

    }


    const products =
        getCompanyProducts(
            company.id
        );


    if (!products.length) {

        return `

            <section
                class="products-empty"
            >

                <div
                    class="products-empty-icon"
                >
                    ＋
                </div>


                <h3>
                    Tu vitrina está vacía
                </h3>


                <p>
                    Añade el primer producto de
                    ${escapeHTML(
                        company.name
                    )}.
                </p>


                <button
                    class="primary-button"
                    type="button"
                    onclick="openNewProductEditor()"
                >

                    AGREGAR PRODUCTO

                </button>

            </section>

        `;

    }


    return `

        <section
            class="company-products-panel"
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


                    <h3>
                        Productos
                    </h3>

                </div>


                <button
                    class="add-product-button"
                    type="button"
                    onclick="openNewProductEditor()"
                >

                    + Producto

                </button>

            </div>


            <div
                class="product-summary"
            >

                <div>
                    <strong>
                        ${products.length}
                    </strong>

                    <span>
                        Productos
                    </span>
                </div>


                <div>
                    <strong>

                        ${
                            products.filter(
                                product =>
                                    product.published
                            ).length
                        }

                    </strong>

                    <span>
                        Publicados
                    </span>
                </div>


                <div>
                    <strong>

                        ${
                            products.reduce(
                                (
                                    total,
                                    product
                                ) =>
                                    total +
                                    getProductMetrics(
                                        product
                                    ).interested,
                                0
                            )
                        }

                    </strong>

                    <span>
                        Interesados
                    </span>
                </div>

            </div>


            <div
                class="products-grid"
            >

                ${
                    products
                        .map(
                            renderProductCard
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   83. MEJOR PRODUCTO
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
   84. ESTADÍSTICAS DE PRODUCTOS
========================================================= */

function renderProductStatistics(
    company
) {

    if (!company) {

        return "";

    }


    const products =
        getCompanyProducts(
            company.id
        );


    if (!products.length) {

        return `

            <section
                class="company-statistics-panel"
            >

                <div
                    class="products-empty"
                >

                    <h3>
                        Todavía no hay datos
                    </h3>


                    <p>
                        Crea y publica productos para comenzar a medir respuesta.
                    </p>

                </div>

            </section>

        `;

    }


    const totals =
        products.reduce(

            (
                result,
                product
            ) => {

                const metrics =
                    getProductMetrics(
                        product
                    );


                result.views +=
                    metrics.views;


                result.interactions +=
                    metrics.interactions;


                result.interested +=
                    metrics.interested;


                result.committed +=
                    metrics.committed;


                return result;

            },

            {

                views: 0,

                interactions: 0,

                interested: 0,

                committed: 0

            }

        );


    const best =
        getBestCompanyProduct(
            company.id
        );


    return `

        <section
            class="company-statistics-panel"
        >

            <div
                class="company-statistics-grid"
            >

                <div
                    class="company-stat-card"
                >

                    <span>
                        👁
                    </span>

                    <strong>
                        ${totals.views}
                    </strong>

                    <small>
                        Vistas
                    </small>

                </div>


                <div
                    class="company-stat-card"
                >

                    <span>
                        ♡
                    </span>

                    <strong>
                        ${totals.interactions}
                    </strong>

                    <small>
                        Interacciones
                    </small>

                </div>


                <div
                    class="company-stat-card"
                >

                    <span>
                        🔥
                    </span>

                    <strong>
                        ${totals.interested}
                    </strong>

                    <small>
                        Interesados
                    </small>

                </div>


                <div
                    class="company-stat-card"
                >

                    <span>
                        💰
                    </span>

                    <strong>
                        ${totals.committed}
                    </strong>

                    <small>
                        Comprometidos
                    </small>

                </div>

            </div>


            ${
                best

                    ? `

                        <article
                            class="best-product-card"
                        >

                            <span
                                class="eyebrow"
                            >
                                PRODUCTO CON MAYOR RESPUESTA
                            </span>


                            <h3>

                                ${escapeHTML(
                                    best.name
                                )}

                            </h3>


                            <p>

                                Potencial:

                                <strong>

                                    ${
                                        getProductPotential(
                                            best
                                        ).label
                                    }

                                </strong>

                            </p>


                            <div
                                class="product-signals"
                            >

                                <span>
                                    👁 ${
                                        getProductMetrics(
                                            best
                                        ).views
                                    }
                                </span>

                                <span>
                                    ♡ ${
                                        getProductMetrics(
                                            best
                                        ).interactions
                                    }
                                </span>

                                <span>
                                    🔥 ${
                                        getProductMetrics(
                                            best
                                        ).interested
                                    }
                                </span>

                                <span>
                                    💰 ${
                                        getProductMetrics(
                                            best
                                        ).committed
                                    }
                                </span>

                            </div>

                        </article>

                    `

                    : ""
            }

        </section>

    `;

}


/* =========================================================
   85. VISTA RESUMIDA DE PRODUCTO

   Se utilizará también desde Perfil.
========================================================= */

function renderCompactProduct(
    product
) {

    const cover =
        getProductCover(
            product
        );


    return `

        <article
            class="compact-product"
        >

            <div
                class="compact-product-image"
            >

                ${
                    cover

                        ? `

                            <img
                                src="${cover}"
                                alt="${escapeHTML(
                                    product.name
                                )}"
                                loading="lazy"
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


            <div>

                <strong>

                    ${escapeHTML(
                        product.name
                    )}

                </strong>


                <small>

                    ${
                        product.published
                            ? "Publicado"
                            : "En desarrollo"
                    }

                </small>

            </div>

        </article>

    `;

}


/* =========================================================
   86. PRODUCTOS PUBLICADOS
========================================================= */

function getPublishedProducts() {

    return mahpeState.products.filter(

        product =>
            product.published

    );

}


/* =========================================================
   87. EMPRESA CON MAYOR RESPUESTA
========================================================= */

function getMostActiveCompany() {

    if (
        !mahpeState.companies.length
    ) {

        return null;

    }


    return mahpeState.companies
        .slice()
        .sort(

            (
                a,
                b
            ) => {

                const scoreA =

                    Number(
                        a.interactions ||
                        0
                    ) +

                    Number(
                        a.interested ||
                        0
                    ) *
                    4 +

                    Number(
                        a.committed ||
                        0
                    ) *
                    10;


                const scoreB =

                    Number(
                        b.interactions ||
                        0
                    ) +

                    Number(
                        b.interested ||
                        0
                    ) *
                    4 +

                    Number(
                        b.committed ||
                        0
                    ) *
                    10;


                return (
                    scoreB -
                    scoreA
                );

            }

        )[0];

}


/* =========================================================
   88. CAMBIAR EMPRESA ACTUAL
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
        "products";


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    openView(
        "companyView"
    );

}


/* =========================================================
   89. ELIMINAR EMPRESA

   Elimina empresa + productos.
   Conserva publicaciones como historial,
   pero rompe las relaciones eliminadas.
========================================================= */

function deleteCompany(
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


    const accepted =
        window.confirm(

            "¿Eliminar " +
            company.name +
            "? Esta acción también eliminará sus productos."

        );


    if (!accepted) {

        return;

    }


    const productIds =
        mahpeState.products

            .filter(
                product =>
                    product.companyId ===
                    companyId
            )

            .map(
                product =>
                    product.id
            );


    mahpeState.products =
        mahpeState.products.filter(

            product =>
                product.companyId !==
                companyId

        );


    mahpeState.posts =
        mahpeState.posts.filter(

            post =>
                post.companyId !==
                companyId

        );


    productIds.forEach(
        productId => {

            Object.keys(
                mahpeState.interactions
            ).forEach(
                key => {

                    /*
                       Las interacciones se limpian
                       cuando pertenecían a posts
                       eliminados posteriormente.
                    */

                    if (
                        key.includes(
                            productId
                        )
                    ) {

                        delete mahpeState.interactions[
                            key
                        ];

                    }

                }
            );

        }
    );


    delete mahpeState.following[
        companyId
    ];


    mahpeState.companies =
        mahpeState.companies.filter(

            item =>
                item.id !==
                companyId

        );


    if (
        currentCompanyId ===
        companyId
    ) {

        currentCompanyId =
            mahpeState.companies.length

                ? mahpeState.companies[0].id

                : null;

    }


    addMahpeEvent(

        "company",

        "Eliminaste " +
        company.name +
        "."

    );


    saveMahpeState();


    renderFeed();


    if (
        typeof renderCompanyDashboard ===
        "function"
    ) {

        renderCompanyDashboard();

    }


    if (
        typeof updateProfile ===
        "function"
    ) {

        updateProfile();

    }

}


/* =========================================================
   90. EVENTOS DEL EDITOR DE PRODUCTOS
========================================================= */

function bindProductEditorEvents() {

    const elements =
        getProductEditorElements();


    if (elements.save) {

        elements.save.onclick =
            saveProductFromEditor;

    }


    if (elements.cancel) {

        elements.cancel.onclick =
            () => {

                closeProductEditor(
                    true
                );

            };

    }


    if (elements.images) {

        elements.images.onchange =
            async function() {

                await handleProductImages(
                    this.files
                );


                this.value = "";

            };

    }

}


/* =========================================================
   91. EVENTO DE CREAR EMPRESA
========================================================= */

function bindCompanyCreation() {

    if (createCompanyButton) {

        createCompanyButton.onclick =
            createCompany;

    }

}


/* =========================================================
   92. EXPONER FUNCIONES DEL BLOQUE 2
========================================================= */

window.createCompany =
    createCompany;


window.openCompanyLogoPicker =
    openCompanyLogoPicker;


window.removeCompanyLogo =
    removeCompanyLogo;


window.openNewProductEditor =
    openNewProductEditor;


window.editProduct =
    editProduct;


window.closeProductEditor =
    closeProductEditor;


window.setProductCover =
    setProductCover;


window.removeProductEditorImage =
    removeProductEditorImage;


window.saveProductFromEditor =
    saveProductFromEditor;


window.deleteProduct =
    deleteProduct;


window.publishProduct =
    publishProduct;


window.publishCompanyPost =
    publishCompanyPost;


window.selectCompany =
    selectCompany;


window.deleteCompany =
    deleteCompany;


/* =========================================================
   FIN BLOQUE 2/4

   NO INICIALIZAR TODAVÍA.

   EL BLOQUE 3/4 CONTINÚA CON:

   ★ NUEVO PANEL "MI EMPRESA"
   ★ Header / portada / logo
   ★ Productos | Estadísticas | Decisiones
   ★ Business Engine
   ★ Etapas de crecimiento
   ★ Decisiones y consecuencias

   Y, SOBRE TODO:

   ★ NUEVO "MI PERFIL"
   ★ Foto editable
   ★ Nombre
   ★ @usuario
   ★ Bio
   ★ Ubicación opcional
   ★ Mahpes
   ★ Empresas
   ★ Productos
   ★ Recomendaciones / referencias
   ★ Actividad
   ★ Configuración
   ★ Ayuda
   ★ Cerrar sesión

   SIN DINERO REAL.
========================================================= */
/* =========================================================
   MAHPE v2.0 — BLOQUE 3/4
   EMPRESA + BUSINESS ENGINE + PERFIL
========================================================= */

/* =========================================================
   93. ELEMENTOS PRINCIPALES
========================================================= */

const companyDashboard =
    document.getElementById("companyDashboard");

const profileView =
    document.getElementById("profileView");


/* =========================================================
   94. ETAPAS EMPRESARIALES
========================================================= */

const COMPANY_STAGES = [
    "Idea",
    "En desarrollo",
    "Lanzada",
    "En crecimiento",
    "Consolidada"
];

function getCompanyGrowthScore(company) {

    if (!company) return 0;

    return clamp(
        Number(company.activity || 0) * 0.20 +
        Number(company.marketResponse || 0) * 0.25 +
        Number(company.productValidation || 0) * 0.25 +
        Number(company.designLevel || 0) * 0.10 +
        Number(company.marketKnowledge || 0) * 0.10 +
        Number(company.locationStrength || 0) * 0.10
    );
}

function recalculateCompanyStage(company) {

    if (!company || company.demo) return;

    const score = getCompanyGrowthScore(company);

    const products = getCompanyProducts(company.id);

    const published = products.some(
        product => product.published
    );

    let nextStage = "Idea";

    if (score >= 25 || products.length > 0) {
        nextStage = "En desarrollo";
    }

    if (published && score >= 35) {
        nextStage = "Lanzada";
    }

    if (
        published &&
        score >= 60 &&
        Number(company.interested || 0) >= 5
    ) {
        nextStage = "En crecimiento";
    }

    if (
        published &&
        score >= 85 &&
        Number(company.committed || 0) >= 20
    ) {
        nextStage = "Consolidada";
    }

    if (company.stage !== nextStage) {

        company.stage = nextStage;

        addMahpeEvent(
            "company",
            `${company.name} alcanzó la etapa ${nextStage}.`,
            company.id
        );
    }
}


/* =========================================================
   95. MOTOR DE DECISIONES
========================================================= */

const BUSINESS_DECISIONS = [
    {
        id: "design",
        icon: "🎨",
        title: "Mejorar identidad",
        description: "Trabaja en la presentación de tu marca.",
        cost: 25,
        effects: {
            designLevel: 10,
            activity: 3
        },
        risk: 0
    },
    {
        id: "research",
        icon: "🔎",
        title: "Investigar mercado",
        description: "Conoce mejor a tus posibles compradores.",
        cost: 35,
        effects: {
            marketKnowledge: 12,
            marketResponse: 5
        },
        risk: 0
    },
    {
        id: "campaign",
        icon: "📣",
        title: "Lanzar campaña",
        description: "Prueba una estrategia de promoción.",
        cost: 45,
        effects: {
            campaignPower: 12,
            activity: 8,
            marketResponse: 4
        },
        risk: 5
    },
    {
        id: "validation",
        icon: "🧪",
        title: "Validar producto",
        description: "Evalúa la respuesta potencial del mercado.",
        cost: 30,
        effects: {
            productValidation: 12,
            marketKnowledge: 4
        },
        risk: 0
    },
    {
        id: "territory",
        icon: "📍",
        title: "Estudiar ubicación",
        description: "Analiza oportunidades territoriales con COYOTE.",
        cost: 40,
        effects: {
            locationStrength: 12,
            marketKnowledge: 5
        },
        risk: -3
    }
];


/* =========================================================
   96. EJECUTAR DECISIÓN
========================================================= */

function executeBusinessDecision(decisionId) {

    const company = getCurrentCompany();

    const decision = BUSINESS_DECISIONS.find(
        item => item.id === decisionId
    );

    if (!company || !decision) return;

    const cost = Number(decision.cost || 0);

    if (mahpeState.mahpes < cost) {

        alert("No tienes suficientes Mahpes para esta decisión.");
        return;
    }

    mahpeState.mahpes -= cost;

    Object.entries(decision.effects).forEach(
        ([metric, change]) => {

            company[metric] = clamp(
                Number(company[metric] || 0) + change
            );
        }
    );

    company.risk = clamp(
        Number(company.risk || 0) +
        Number(decision.risk || 0)
    );

    company.decisions.push({
        id: generateId("decision"),
        decisionId,
        title: decision.title,
        cost,
        effects: { ...decision.effects },
        createdAt: new Date().toISOString()
    });

    mahpeState.decisionHistory.unshift({
        id: generateId("history"),
        companyId: company.id,
        decisionId,
        title: decision.title,
        cost,
        createdAt: new Date().toISOString()
    });

    company.value =
        Number(company.value || 0) +
        cost * 0.5;

    recalculateCompanyStage(company);

    addMahpeEvent(
        "decision",
        `${company.name}: ${decision.title}.`,
        company.id
    );

    saveMahpeState();

    renderCompanyDashboard();
    renderActivityInbox();
    updateProfile();
}


/* =========================================================
   97. MÉTRICAS EMPRESARIALES
========================================================= */

function renderBusinessMetric(label, value, icon = "●") {

    const safeValue = clamp(value);

    return `
        <div class="mahpe-business-metric">
            <div class="mahpe-business-metric-top">
                <span>${icon} ${escapeHTML(label)}</span>
                <strong>${safeValue}%</strong>
            </div>

            <div class="mahpe-business-metric-track">
                <div
                    class="mahpe-business-metric-fill"
                    style="width:${safeValue}%"
                ></div>
            </div>
        </div>
    `;
}

function renderBusinessMetrics(company) {

    return `
        <section class="mahpe-business-metrics">
            <div class="mahpe-section-heading">
                <h3>Estado empresarial</h3>
                <small>Indicadores del simulador</small>
            </div>

            ${renderBusinessMetric(
                "Actividad",
                company.activity,
                "⚡"
            )}

            ${renderBusinessMetric(
                "Respuesta del mercado",
                company.marketResponse,
                "🔥"
            )}

            ${renderBusinessMetric(
                "Validación",
                company.productValidation,
                "🧪"
            )}

            ${renderBusinessMetric(
                "Diseño",
                company.designLevel,
                "🎨"
            )}

            ${renderBusinessMetric(
                "Conocimiento del mercado",
                company.marketKnowledge,
                "🔎"
            )}

            ${renderBusinessMetric(
                "Ubicación",
                company.locationStrength,
                "📍"
            )}

            ${renderBusinessMetric(
                "Riesgo",
                company.risk,
                "⚠️"
            )}
        </section>
    `;
}


/* =========================================================
   98. HISTORIAL DE DECISIONES
========================================================= */

function renderBusinessDecisionHistory(company) {

    const history = Array.isArray(company.decisions)
        ? company.decisions.slice().reverse().slice(0, 8)
        : [];

    if (!history.length) {

        return `
            <div class="mahpe-empty-note">
                Todavía no has tomado decisiones empresariales.
            </div>
        `;
    }

    return `
        <div class="mahpe-decision-history">
            ${history.map(item => `
                <article class="mahpe-history-item">
                    <div>
                        <strong>${escapeHTML(item.title)}</strong>
                        <small>${formatRelativeDate(item.createdAt)}</small>
                    </div>

                    <span>−${Number(item.cost || 0)} Mahpes</span>
                </article>
            `).join("")}
        </div>
    `;
}


/* =========================================================
   99. PANEL DE DECISIONES
========================================================= */

function renderCompanyDecisions(company) {

    return `
        <section class="mahpe-decisions-panel">

            <div class="mahpe-section-heading">
                <div>
                    <span class="eyebrow">SIMULADOR</span>
                    <h3>Decisiones</h3>
                </div>

                <span class="mahpe-small-balance">
                    ◈ ${mahpeState.mahpes.toLocaleString("es-PE")}
                </span>
            </div>

            <p class="muted">
                Cada decisión utiliza Mahpes y modifica
                los indicadores simulados de tu empresa.
            </p>

            <div class="mahpe-decisions-grid">
                ${BUSINESS_DECISIONS.map(decision => `
                    <article class="mahpe-decision-card">

                        <span class="mahpe-decision-icon">
                            ${decision.icon}
                        </span>

                        <h4>${escapeHTML(decision.title)}</h4>

                        <p>${escapeHTML(decision.description)}</p>

                        <div class="mahpe-decision-footer">
                            <span>
                                ◈ ${decision.cost} Mahpes
                            </span>

                            <button
                                type="button"
                                class="secondary-button"
                                data-business-decision="${decision.id}"
                                ${mahpeState.mahpes < decision.cost
                                    ? "disabled"
                                    : ""}
                            >
                                DECIDIR
                            </button>
                        </div>

                    </article>
                `).join("")}
            </div>

            <h3>Historial</h3>

            ${renderBusinessDecisionHistory(company)}

        </section>
    `;
}


/* =========================================================
   100. PORTADA DE EMPRESA
========================================================= */

function renderCompanyHero(company) {

    const products = getCompanyProducts(company.id);

    return `
        <section class="mahpe-company-hero">

            <div class="mahpe-company-cover">
                <span class="mahpe-cover-wordmark">
                    ${escapeHTML(company.name)}
                </span>
            </div>

            <div class="mahpe-company-identity">

                ${renderCompanyAvatar(
                    company,
                    "mahpe-company-logo"
                )}

                <div class="mahpe-company-identity-text">

                    <span class="eyebrow">
                        MI EMPRESA
                    </span>

                    <h2>${escapeHTML(company.name)}</h2>

                    <p>
                        ${escapeHTML(company.category || "Empresa")}
                        ·
                        ${escapeHTML(company.stage || "Idea")}
                    </p>

                </div>

            </div>

            <p class="mahpe-company-description">
                ${escapeHTML(
                    company.description ||
                    "Construye tu empresa dentro de MAHPE."
                )}
            </p>

            <div class="mahpe-company-stats">

                <div>
                    <strong>${products.length}</strong>
                    <span>Productos</span>
                </div>

                <div>
                    <strong>${Number(company.followers || 0)}</strong>
                    <span>Seguidores</span>
                </div>

                <div>
                    <strong>
                        S/ ${formatPrice(company.value)}
                    </strong>
                    <span>Valor simulado</span>
                </div>

            </div>

        </section>
    `;
}


/* =========================================================
   101. PESTAÑAS DE EMPRESA
========================================================= */

function setCompanyTab(tab) {

    const valid = [
        "products",
        "statistics",
        "decisions"
    ];

    if (!valid.includes(tab)) return;

    currentCompanyTab = tab;

    renderCompanyDashboard();
}

function renderCompanyTabs() {

    const tabs = [
        ["products", "Productos"],
        ["statistics", "Estadísticas"],
        ["decisions", "Decisiones"]
    ];

    return `
        <nav
            class="company-tabs"
            aria-label="Secciones de empresa"
        >
            ${tabs.map(([id, label]) => `
                <button
                    type="button"
                    class="company-tab ${
                        currentCompanyTab === id
                            ? "active"
                            : ""
                    }"
                    data-company-tab="${id}"
                >
                    ${label}
                </button>
            `).join("")}
        </nav>
    `;
}


/* =========================================================
   102. PANEL ESTADÍSTICAS
========================================================= */

function renderCompanyStatistics(company) {

    const growth = getCompanyGrowthScore(company);

    return `
        <section class="mahpe-statistics-dashboard">

            <div class="mahpe-growth-card">

                <span class="eyebrow">
                    CRECIMIENTO
                </span>

                <div class="mahpe-growth-value">
                    <strong>${growth}%</strong>
                    <span>${escapeHTML(company.stage)}</span>
                </div>

                <div class="mahpe-business-metric-track">
                    <div
                        class="mahpe-business-metric-fill"
                        style="width:${growth}%"
                    ></div>
                </div>

            </div>

            ${renderProductStatistics(company)}

            ${renderBusinessMetrics(company)}

        </section>
    `;
}


/* =========================================================
   103. CAMBIAR EMPRESA DESDE SELECTOR
========================================================= */

function renderCompanySelector() {

    if (mahpeState.companies.length <= 1) {
        return "";
    }

    return `
        <div class="mahpe-company-switcher">

            <label for="mahpeCompanySelect">
                Empresa activa
            </label>

            <select id="mahpeCompanySelect">
                ${mahpeState.companies.map(company => `
                    <option
                        value="${escapeHTML(company.id)}"
                        ${company.id === currentCompanyId
                            ? "selected"
                            : ""}
                    >
                        ${escapeHTML(company.name)}
                    </option>
                `).join("")}
            </select>

        </div>
    `;
}


/* =========================================================
   104. RENDER PRINCIPAL DE MI EMPRESA
========================================================= */

function renderCompanyDashboard() {

    if (!companyDashboard) return;

    const company = getCurrentCompany();

    if (!company) {

        companyDashboard.innerHTML = `
            <section class="mahpe-company-empty">

                <span class="eyebrow">
                    MI EMPRESA
                </span>

                <h2>Todo empieza con una idea</h2>

                <p>
                    Crea tu primera empresa, diseña sus productos
                    y descubre cómo responde el mercado.
                </p>

                <button
                    type="button"
                    class="primary-button"
                    id="mahpeGoCreateCompany"
                >
                    CREAR MI EMPRESA
                </button>

            </section>
        `;

        const createButton =
            document.getElementById("mahpeGoCreateCompany");

        if (createButton) {
            createButton.onclick = () => openView("createView");
        }

        return;
    }

    let content = "";

    if (currentCompanyTab === "products") {

        content = renderCompanyProducts(company);

    } else if (currentCompanyTab === "statistics") {

        content = renderCompanyStatistics(company);

    } else {

        content = renderCompanyDecisions(company);
    }

    companyDashboard.innerHTML = `
        <div class="mahpe-company-dashboard">

            ${renderCompanySelector()}

            ${renderCompanyHero(company)}

            ${renderCompanyTabs()}

            <div class="mahpe-company-tab-content">
                ${content}
            </div>

            ${renderBrandIdentity(company)}

        </div>
    `;

    bindCompanyDashboardEvents();
}


/* =========================================================
   105. EVENTOS DEL PANEL EMPRESA
========================================================= */

function bindCompanyDashboardEvents() {

    document
        .querySelectorAll("[data-company-tab]")
        .forEach(button => {

            button.onclick = () => {
                setCompanyTab(button.dataset.companyTab);
            };
        });

    document
        .querySelectorAll("[data-business-decision]")
        .forEach(button => {

            button.onclick = () => {
                executeBusinessDecision(
                    button.dataset.businessDecision
                );
            };
        });

    const selector =
        document.getElementById("mahpeCompanySelect");

    if (selector) {

        selector.onchange = () => {
            selectCompany(selector.value);
        };
    }

    bindCompanyLogoInput();
}


/* =========================================================
   106. PERFIL — ESTADO DE EDICIÓN
========================================================= */

let profileEditing = false;

let profileSection = "overview";


/* =========================================================
   107. PERFIL — FOTO
========================================================= */

function renderProfileAvatar() {

    const profile = mahpeState.profile;

    if (profile.photo) {

        return `
            <div class="mahpe-profile-avatar has-photo">

                <img
                    src="${profile.photo}"
                    alt="Foto de perfil"
                >

                <button
                    type="button"
                    class="mahpe-profile-camera"
                    id="mahpeChangePhoto"
                    aria-label="Cambiar foto de perfil"
                >
                    📷
                </button>

            </div>
        `;
    }

    const initial = (
        profile.name || "M"
    ).charAt(0).toUpperCase();

    return `
        <div class="mahpe-profile-avatar">

            <span>${escapeHTML(initial)}</span>

            <button
                type="button"
                class="mahpe-profile-camera"
                id="mahpeChangePhoto"
                aria-label="Agregar foto de perfil"
            >
                📷
            </button>

        </div>
    `;
}


/* =========================================================
   108. PERFIL — MÉTRICAS
========================================================= */

function getProfileStatistics() {

    return {
        mahpes: Number(mahpeState.mahpes || 0),
        companies: mahpeState.companies.length,
        products: mahpeState.products.length,
        recommendations:
            mahpeState.profile.recommendations.length
    };
}


/* =========================================================
   109. PERFIL — MENÚ
========================================================= */

const PROFILE_MENU = [
    {
        id: "companies",
        icon: "🏢",
        label: "Mis empresas"
    },
    {
        id: "products",
        icon: "📦",
        label: "Mis productos"
    },
    {
        id: "recommendations",
        icon: "★",
        label: "Recomendaciones"
    },
    {
        id: "activity",
        icon: "◷",
        label: "Mi actividad"
    },
    {
        id: "mahpes",
        icon: "◈",
        label: "Mis Mahpes"
    },
    {
        id: "settings",
        icon: "⚙",
        label: "Configuración"
    },
    {
        id: "help",
        icon: "?",
        label: "Ayuda"
    }
];


/* =========================================================
   110. PERFIL — RESUMEN
========================================================= */

function renderProfileOverview() {

    const stats = getProfileStatistics();

    return `
        <div class="mahpe-profile-menu">

            ${PROFILE_MENU.map(item => {

                let count = "";

                if (item.id === "companies") {
                    count = stats.companies;
                }

                if (item.id === "products") {
                    count = stats.products;
                }

                if (item.id === "recommendations") {
                    count = stats.recommendations;
                }

                if (item.id === "mahpes") {
                    count = stats.mahpes.toLocaleString("es-PE");
                }

                return `
                    <button
                        type="button"
                        class="mahpe-profile-menu-item"
                        data-profile-section="${item.id}"
                    >
                        <span class="mahpe-profile-menu-icon">
                            ${item.icon}
                        </span>

                        <span class="mahpe-profile-menu-label">
                            ${item.label}
                        </span>

                        <span class="mahpe-profile-menu-value">
                            ${count}
                        </span>

                        <span class="mahpe-profile-menu-arrow">
                            ›
                        </span>
                    </button>
                `;
            }).join("")}

        </div>
    `;
}


/* =========================================================
   111. PERFIL — EMPRESAS
========================================================= */

function renderProfileCompanies() {

    if (!mahpeState.companies.length) {

        return `
            <div class="mahpe-profile-empty">
                Todavía no tienes empresas.
            </div>
        `;
    }

    return `
        <div class="mahpe-profile-company-list">

            ${mahpeState.companies.map(company => `
                <button
                    type="button"
                    class="mahpe-profile-company-item"
                    data-select-company="${escapeHTML(company.id)}"
                >
                    ${renderCompanyAvatar(
                        company,
                        "mahpe-profile-company-logo"
                    )}

                    <div>
                        <strong>${escapeHTML(company.name)}</strong>
                        <small>${escapeHTML(company.stage)}</small>
                    </div>

                    <span>›</span>
                </button>
            `).join("")}

        </div>
    `;
}


/* =========================================================
   112. PERFIL — PRODUCTOS
========================================================= */

function renderProfileProducts() {

    if (!mahpeState.products.length) {

        return `
            <div class="mahpe-profile-empty">
                Todavía no has creado productos.
            </div>
        `;
    }

    return `
        <div class="mahpe-profile-products-list">

            ${mahpeState.products.map(
                renderCompactProduct
            ).join("")}

        </div>
    `;
}


/* =========================================================
   113. PERFIL — REFERENCIAS
========================================================= */

function renderProfileRecommendations() {

    const recommendations =
        mahpeState.profile.recommendations;

    if (!recommendations.length) {

        return `
            <div class="mahpe-profile-empty">

                <h4>Todavía no tienes referencias</h4>

                <p>
                    Cuando otros usuarios puedan recomendar
                    tu trabajo, aparecerán aquí.
                </p>

                <small>
                    Las referencias reales requieren
                    cuentas de usuarios verificables.
                </small>

            </div>
        `;
    }

    return `
        <div class="mahpe-recommendations-list">

            ${recommendations.map(item => `
                <article class="mahpe-recommendation-card">

                    <div>
                        <strong>
                            ${escapeHTML(item.author || "Usuario")}
                        </strong>

                        <span>
                            ${"★".repeat(
                                Math.max(
                                    0,
                                    Math.min(5, Number(item.rating || 0))
                                )
                            )}
                        </span>
                    </div>

                    <p>${escapeHTML(item.text || "")}</p>

                    <small>
                        ${formatRelativeDate(item.createdAt)}
                    </small>

                </article>
            `).join("")}

        </div>
    `;
}


/* =========================================================
   114. PERFIL — ACTIVIDAD
========================================================= */

function renderProfileActivity() {

    const events = mahpeState.events.slice(0, 20);

    if (!events.length) {

        return `
            <div class="mahpe-profile-empty">
                Todavía no tienes actividad.
            </div>
        `;
    }

    return `
        <div class="mahpe-profile-activity-list">

            ${events.map(event => `
                <article class="mahpe-profile-activity-item">

                    <span>
                        ${getActivityIcon(event.type)}
                    </span>

                    <div>
                        <strong>${escapeHTML(event.message)}</strong>

                        <small>
                            ${formatRelativeDate(event.createdAt)}
                        </small>
                    </div>

                </article>
            `).join("")}

        </div>
    `;
}


/* =========================================================
   115. PERFIL — MAHPES
========================================================= */

function renderProfileMahpes() {

    return `
        <section class="mahpe-profile-mahpes">

            <span class="eyebrow">
                MONEDA DEL SIMULADOR
            </span>

            <div class="mahpe-profile-mahpes-value">
                ◈ ${mahpeState.mahpes.toLocaleString("es-PE")}
            </div>

            <p>
                Los Mahpes sirven para tomar decisiones
                y desarrollar empresas dentro del juego.
            </p>

            <small>
                No son dinero real, no se pueden retirar
                y no representan una inversión.
            </small>

        </section>
    `;
}


/* =========================================================
   116. PERFIL — CONFIGURACIÓN
========================================================= */

function renderProfileSettings() {

    return `
        <div class="mahpe-profile-settings">

            <button
                type="button"
                class="mahpe-profile-setting-button"
                id="mahpeEditProfileFromSettings"
            >
                ✎ Editar mi perfil
            </button>

            <div class="mahpe-profile-setting-note">
                Los datos de esta versión se guardan
                localmente en este navegador.
            </div>

        </div>
    `;
}


/* =========================================================
   117. PERFIL — AYUDA
========================================================= */

function renderProfileHelp() {

    return `
        <div class="mahpe-profile-help">

            <h4>¿Qué es MAHPE?</h4>

            <p>
                Es un simulador empresarial donde puedes
                crear marcas, presentar productos, medir
                señales de interés y tomar decisiones.
            </p>

            <h4>¿Qué es COYOTE?</h4>

            <p>
                Es el módulo territorial de MAHPE.
                Permite explorar comercios y activar
                voluntariamente un Punto Verde.
            </p>

            <h4>¿Se utiliza dinero real?</h4>

            <p>
                No. Esta versión funciona con Mahpes
                y valores simulados.
            </p>

        </div>
    `;
}


/* =========================================================
   118. PERFIL — CONTENIDO DE SECCIÓN
========================================================= */

function renderProfileSection() {

    const sections = {
        overview: renderProfileOverview,
        companies: renderProfileCompanies,
        products: renderProfileProducts,
        recommendations: renderProfileRecommendations,
        activity: renderProfileActivity,
        mahpes: renderProfileMahpes,
        settings: renderProfileSettings,
        help: renderProfileHelp
    };

    const renderer =
        sections[profileSection] ||
        renderProfileOverview;

    return renderer();
}


/* =========================================================
   119. PERFIL — EDITOR
========================================================= */

function renderProfileEditor() {

    const profile = mahpeState.profile;

    return `
        <section class="mahpe-profile-editor">

            <h3>Editar perfil</h3>

            <label for="mahpeProfileNameInput">
                Nombre
            </label>

            <input
                id="mahpeProfileNameInput"
                type="text"
                maxlength="60"
                value="${escapeHTML(profile.name)}"
            >

            <label for="mahpeProfileUsernameInput">
                Nombre de usuario
            </label>

            <input
                id="mahpeProfileUsernameInput"
                type="text"
                maxlength="30"
                value="${escapeHTML(profile.username)}"
            >

            <label for="mahpeProfileBioInput">
                Biografía
            </label>

            <textarea
                id="mahpeProfileBioInput"
                maxlength="240"
                rows="3"
            >${escapeHTML(profile.bio)}</textarea>

            <label for="mahpeProfileLocationInput">
                Ubicación (opcional)
            </label>

            <input
                id="mahpeProfileLocationInput"
                type="text"
                maxlength="80"
                value="${escapeHTML(profile.location)}"
                placeholder="Ej. Lima, Perú"
            >

            <div class="mahpe-profile-editor-actions">

                <button
                    type="button"
                    class="secondary-button"
                    id="mahpeCancelProfileEdit"
                >
                    CANCELAR
                </button>

                <button
                    type="button"
                    class="primary-button"
                    id="mahpeSaveProfile"
                >
                    GUARDAR
                </button>

            </div>

        </section>
    `;
}


/* =========================================================
   120. GUARDAR PERFIL
========================================================= */

function saveProfileChanges() {

    const name = document
        .getElementById("mahpeProfileNameInput")
        ?.value.trim();

    const username = document
        .getElementById("mahpeProfileUsernameInput")
        ?.value.trim();

    const bio = document
        .getElementById("mahpeProfileBioInput")
        ?.value.trim();

    const location = document
        .getElementById("mahpeProfileLocationInput")
        ?.value.trim();

    if (!name) {
        alert("Escribe tu nombre.");
        return;
    }

    if (!username) {
        alert("Escribe tu nombre de usuario.");
        return;
    }

    const cleanUsername = username
        .replace(/^@+/, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

    if (!/^[a-z0-9_.]{3,30}$/.test(cleanUsername)) {
        alert(
            "El usuario debe tener entre 3 y 30 caracteres: letras, números, punto o guion bajo."
        );
        return;
    }

    mahpeState.profile.name = name;
    mahpeState.profile.username = cleanUsername;
    mahpeState.profile.bio = bio || "";
    mahpeState.profile.location = location || "";

    addMahpeEvent(
        "profile",
        "Actualizaste tu perfil."
    );

    profileEditing = false;

    saveMahpeState();
    updateProfile();
    renderActivityInbox();
}


/* =========================================================
   121. CAMBIAR FOTO
========================================================= */

async function handleProfilePhoto(file) {

    if (!file) return;

    try {

        const compressed = await compressImageFile(
            file,
            {
                maxDimension: 500,
                quality: 0.78
            }
        );

        mahpeState.profile.photo = compressed;

        addMahpeEvent(
            "profile",
            "Actualizaste tu foto de perfil."
        );

        saveMahpeState();
        updateProfile();
        renderActivityInbox();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "No se pudo procesar la foto."
        );
    }
}


/* =========================================================
   122. PERFIL — RENDER PRINCIPAL
========================================================= */

function updateProfile() {

    if (!profileView) return;

    const profile = mahpeState.profile;

    const stats = getProfileStatistics();

    profileView.innerHTML = `
        <div class="mahpe-profile-page">

            <header class="mahpe-profile-topbar">

                <h2>Mi perfil</h2>

                <button
                    type="button"
                    class="mahpe-profile-gear"
                    id="mahpeProfileSettingsButton"
                    aria-label="Configuración"
                >
                    ⚙
                </button>

            </header>

            <div class="mahpe-profile-identity">

                ${renderProfileAvatar()}

                <h3>${escapeHTML(profile.name)}</h3>

                <span class="mahpe-profile-handle">
                    @${escapeHTML(profile.username)}
                </span>

                ${
                    profile.bio
                        ? `
                            <p class="mahpe-profile-bio">
                                ${escapeHTML(profile.bio)}
                            </p>
                        `
                        : ""
                }

                ${
                    profile.location
                        ? `
                            <span class="mahpe-profile-location">
                                📍 ${escapeHTML(profile.location)}
                            </span>
                        `
                        : ""
                }

                <button
                    type="button"
                    class="mahpe-profile-edit-button"
                    id="mahpeEditProfileButton"
                >
                    Editar perfil
                </button>

            </div>

            <div class="mahpe-profile-stats">

                <div>
                    <strong>
                        ${stats.mahpes.toLocaleString("es-PE")}
                    </strong>
                    <span>Mahpes</span>
                </div>

                <div>
                    <strong>${stats.companies}</strong>
                    <span>Empresas</span>
                </div>

                <div>
                    <strong>${stats.products}</strong>
                    <span>Productos</span>
                </div>

            </div>

            ${
                profileEditing
                    ? renderProfileEditor()
                    : `
                        <section class="mahpe-profile-content">

                            ${
                                profileSection !== "overview"
                                    ? `
                                        <button
                                            type="button"
                                            class="mahpe-profile-back"
                                            id="mahpeProfileBack"
                                        >
                                            ← Mi perfil
                                        </button>

                                        <h3 class="mahpe-profile-section-title">
                                            ${escapeHTML(
                                                PROFILE_MENU.find(
                                                    item =>
                                                        item.id === profileSection
                                                )?.label || ""
                                            )}
                                        </h3>
                                    `
                                    : ""
                            }

                            ${renderProfileSection()}

                        </section>
                    `
            }

            <input
                id="mahpeProfilePhotoInput"
                type="file"
                accept="image/*"
                hidden
            >

        </div>
    `;

    bindProfileEvents();
}


/* =========================================================
   123. PERFIL — NAVEGACIÓN
========================================================= */

function openProfileSection(section) {

    profileEditing = false;

    profileSection = section;

    updateProfile();
}

function openProfileEditor() {

    profileEditing = true;

    updateProfile();
}


/* =========================================================
   124. EVENTOS DEL PERFIL
========================================================= */

function bindProfileEvents() {

    const photoButton =
        document.getElementById("mahpeChangePhoto");

    const photoInput =
        document.getElementById("mahpeProfilePhotoInput");

    if (photoButton && photoInput) {

        photoButton.onclick = () => photoInput.click();

        photoInput.onchange = async () => {

            const file = photoInput.files?.[0];

            if (file) {
                await handleProfilePhoto(file);
            }
        };
    }

    const editButton =
        document.getElementById("mahpeEditProfileButton");

    if (editButton) {
        editButton.onclick = openProfileEditor;
    }

    const settingsButton =
        document.getElementById("mahpeProfileSettingsButton");

    if (settingsButton) {
        settingsButton.onclick = () => {
            openProfileSection("settings");
        };
    }

    document
        .querySelectorAll("[data-profile-section]")
        .forEach(button => {

            button.onclick = () => {
                openProfileSection(
                    button.dataset.profileSection
                );
            };
        });

    document
        .querySelectorAll("[data-select-company]")
        .forEach(button => {

            button.onclick = () => {
                selectCompany(
                    button.dataset.selectCompany
                );
            };
        });

    const backButton =
        document.getElementById("mahpeProfileBack");

    if (backButton) {

        backButton.onclick = () => {
            openProfileSection("overview");
        };
    }

    const saveButton =
        document.getElementById("mahpeSaveProfile");

    if (saveButton) {
        saveButton.onclick = saveProfileChanges;
    }

    const cancelButton =
        document.getElementById("mahpeCancelProfileEdit");

    if (cancelButton) {

        cancelButton.onclick = () => {
            profileEditing = false;
            updateProfile();
        };
    }

    const settingsEdit =
        document.getElementById(
            "mahpeEditProfileFromSettings"
        );

    if (settingsEdit) {
        settingsEdit.onclick = openProfileEditor;
    }
}


/* =========================================================
   125. EXPONER FUNCIONES DEL BLOQUE 3
========================================================= */

window.setCompanyTab =
    setCompanyTab;

window.executeBusinessDecision =
    executeBusinessDecision;

window.renderCompanyDashboard =
    renderCompanyDashboard;

window.updateProfile =
    updateProfile;

window.openProfileSection =
    openProfileSection;

window.openProfileEditor =
    openProfileEditor;


/* =========================================================
   FIN BLOQUE 3/4

   NO INICIALIZAR AQUÍ.

   BLOQUE 4/4:
   - COYOTE
   - Punto Verde ON/OFF
   - Ubicación azul vs comercio verde
   - Búsqueda y radios
   - Seguimiento de puntos
   - Persistencia
   - Inicialización única
========================================================= */
/* =========================================================
   MAHPE v2.0 — BLOQUE 4/4
   COYOTE + PUNTO VERDE + INICIALIZACIÓN
========================================================= */


/* =========================================================
   126. ESTADO COYOTE
========================================================= */

const COYOTE_SELLER_KEY = "coyote_seller_point";

const COYOTE_DEFAULT_CENTER = [
    -12.0464,
    -77.0428
];

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

let coyoteSearchResults = [];

let coyoteMapInitialized = false;


/* =========================================================
   127. ELEMENTOS COYOTE
========================================================= */

const activateButton =
    document.getElementById("activateButton");

const sellerForm =
    document.getElementById("sellerForm");

const productInput =
    document.getElementById("productInput");

const confirmSellerButton =
    document.getElementById("confirmSellerButton");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const referenceText =
    document.getElementById("referenceText");

const offerText =
    document.getElementById("offerText");

const demandBar =
    document.getElementById("demandBar");

const demandText =
    document.getElementById("demandText");

const coyoteStatus =
    document.getElementById("status");


/* =========================================================
   128. UTILIDADES COYOTE
========================================================= */

function updateStatus(message) {

    if (coyoteStatus) {
        coyoteStatus.textContent = message;
    }
}

function isValidCoordinate(value) {

    return Number.isFinite(Number(value));
}

function isValidCoyotePoint(point) {

    return Boolean(
        point &&
        isValidCoordinate(point.lat) &&
        isValidCoordinate(point.lng) &&
        Math.abs(Number(point.lat)) <= 90 &&
        Math.abs(Number(point.lng)) <= 180
    );
}

function escapeCoyoteText(value) {

    return escapeHTML(String(value ?? ""));
}


/* =========================================================
   129. LEER PUNTO GUARDADO
========================================================= */

function getSavedSellerPoint() {

    try {

        const raw = localStorage.getItem(
            COYOTE_SELLER_KEY
        );

        if (!raw) return null;

        const point = JSON.parse(raw);

        if (!isValidCoyotePoint(point)) {
            return null;
        }

        return point;

    } catch (error) {

        console.error(
            "COYOTE: error al leer el Punto Verde.",
            error
        );

        return null;
    }
}


/* =========================================================
   130. GUARDAR PUNTO
========================================================= */

function saveSellerPoint(point) {

    if (!isValidCoyotePoint(point)) {
        return false;
    }

    try {

        localStorage.setItem(
            COYOTE_SELLER_KEY,
            JSON.stringify(point)
        );

        return true;

    } catch (error) {

        console.error(
            "COYOTE: error al guardar el Punto Verde.",
            error
        );

        return false;
    }
}


/* =========================================================
   131. INICIALIZAR MAPA
========================================================= */

function initializeMap() {

    const mapElement =
        document.getElementById("map");

    if (!mapElement) {
        console.warn("COYOTE: falta #map.");
        return;
    }

    if (typeof L === "undefined") {

        console.warn(
            "COYOTE: Leaflet no está disponible."
        );

        updateStatus(
            "No se pudo cargar el mapa."
        );

        return;
    }

    if (map) {

        map.invalidateSize();
        return;
    }

    map = L.map("map", {
        zoomControl: true
    }).setView(
        COYOTE_DEFAULT_CENTER,
        12
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(map);

    coyoteMapInitialized = true;

    loadSavedSeller();

    updateReference();

    /*
       La ubicación se solicita únicamente
       cuando sea necesaria para activar
       o utilizar una función geográfica.
    */

    updateStatus(
        getSavedSellerPoint()?.active
            ? "Tu Punto Verde está activo."
            : "Explora COYOTE o activa tu Punto Verde."
    );
}


/* =========================================================
   132. MARCADOR DE UBICACIÓN PERSONAL

   AZUL: ubicación del usuario.
   VERDE: comercio activo.

   Ya no se confunden.
========================================================= */

function updateUserMarker(lat, lng) {

    if (!map || typeof L === "undefined") {
        return;
    }

    if (
        !isValidCoordinate(lat) ||
        !isValidCoordinate(lng)
    ) {
        return;
    }

    const coordinates = [
        Number(lat),
        Number(lng)
    ];

    if (!userMarker) {

        userMarker = L.circleMarker(
            coordinates,
            {
                radius: 7,
                color: "#ffffff",
                weight: 3,
                fillColor: "#348bff",
                fillOpacity: 1
            }
        ).addTo(map);

        userMarker.bindPopup(
            "📍 Tu ubicación"
        );

    } else {

        userMarker.setLatLng(coordinates);
    }
}


/* =========================================================
   133. SOLICITAR UBICACIÓN
========================================================= */

function requestCoyoteLocation(options = {}) {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            reject(
                new Error(
                    "Este navegador no admite geolocalización."
                )
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {

                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                updateUserMarker(
                    userLocation.lat,
                    userLocation.lng
                );

                updateReference();

                resolve(userLocation);
            },
            error => {

                let message =
                    "No se pudo obtener tu ubicación.";

                if (error.code === 1) {

                    message =
                        "Debes permitir el acceso a la ubicación.";
                }

                reject(new Error(message));
            },
            {
                enableHighAccuracy:
                    options.highAccuracy ?? false,
                timeout: 12000,
                maximumAge: 60000
            }
        );
    });
}


/* =========================================================
   134. RADIO DE BÚSQUEDA
========================================================= */

function drawSearchRadius() {

    if (!map) return;

    if (searchCircle) {

        map.removeLayer(searchCircle);
        searchCircle = null;
    }

    if (!userLocation) return;

    searchCircle = L.circle(
        [
            userLocation.lat,
            userLocation.lng
        ],
        {
            radius: selectedRadius * 1000,
            color: "#348bff",
            weight: 1,
            fillColor: "#348bff",
            fillOpacity: 0.035
        }
    ).addTo(map);
}

function updateReference() {

    if (referenceText) {

        referenceText.textContent =
            `${selectedRadius} km`;
    }

    drawSearchRadius();
}

function initializeRadiusButtons() {

    document
        .querySelectorAll("[data-radius]")
        .forEach(button => {

            const radius =
                Number(button.dataset.radius);

            button.classList.toggle(
                "active",
                radius === selectedRadius
            );

            button.onclick = () => {

                if (
                    !Number.isFinite(radius) ||
                    radius <= 0
                ) {
                    return;
                }

                selectedRadius = radius;

                document
                    .querySelectorAll("[data-radius]")
                    .forEach(item => {

                        item.classList.toggle(
                            "active",
                            item === button
                        );
                    });

                updateReference();
                searchCommercialPoints();
            };
        });
}


/* =========================================================
   135. BOTÓN PUNTO VERDE
========================================================= */

function updateSellerToggleUI(active) {

    if (!activateButton) return;

    activateButton.textContent = active
        ? "DESACTIVAR PUNTO"
        : "ACTIVAR PUNTO";

    activateButton.classList.toggle(
        "is-active",
        Boolean(active)
    );

    activateButton.setAttribute(
        "aria-pressed",
        active ? "true" : "false"
    );
}

function showSellerForm(show) {

    if (!sellerForm) return;

    sellerForm.classList.toggle(
        "hidden",
        !show
    );
}


/* =========================================================
   136. PRODUCTO PREDETERMINADO
========================================================= */

function getDefaultCoyoteProduct() {

    const company = getCurrentCompany();

    if (!company) return "";

    const products = getCompanyProducts(
        company.id
    );

    if (products.length) {
        return products[0].name;
    }

    return company.product || "";
}


/* =========================================================
   137. POPUP DEL PUNTO VERDE
========================================================= */

function buildSellerPopup(point) {

    const companyName = escapeCoyoteText(
        point.companyName || "Comerciante"
    );

    const product = escapeCoyoteText(
        point.product || "Producto"
    );

    return `
        <div class="coyote-seller-popup">

            <strong>🟢 ${companyName}</strong>

            <p>${product}</p>

            <small>
                Punto comercial activo
            </small>

            <button
                type="button"
                onclick="deactivateSeller()"
                style="
                    display:block;
                    margin-top:10px;
                    padding:8px 12px;
                    border:0;
                    border-radius:8px;
                    cursor:pointer;
                "
            >
                Desactivar punto
            </button>

        </div>
    `;
}


/* =========================================================
   138. QUITAR MARCADOR COMERCIAL

   Esta función elimina exclusivamente
   el marcador del vendedor.

   El marcador azul del usuario permanece.
========================================================= */

function removeSellerMarker() {

    if (!map) {

        sellerMarker = null;
        return;
    }

    if (sellerMarker) {

        try {

            map.removeLayer(sellerMarker);

        } catch (error) {

            console.warn(
                "COYOTE: error quitando marcador.",
                error
            );
        }
    }

    /*
       Limpieza defensiva de marcadores
       comerciales anteriores que pudieran
       quedar en el mapa.
    */

    map.eachLayer(layer => {

        if (
            layer &&
            layer.options &&
            layer.options.mahpeSellerMarker === true
        ) {

            map.removeLayer(layer);
        }
    });

    sellerMarker = null;
}


/* =========================================================
   139. CREAR MARCADOR COMERCIAL
========================================================= */

function createSellerPoint(point) {

    if (!map) return;

    removeSellerMarker();

    if (
        !point ||
        !point.active ||
        !isValidCoyotePoint(point)
    ) {

        commercialPoints = [];
        updateOfferMetrics([]);
        return;
    }

    commercialPoints = [point];

    const markerIcon = L.divIcon({
        className: "coyote-green-marker",
        html: `
            <div class="coyote-green-dot"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    sellerMarker = L.marker(
        [
            Number(point.lat),
            Number(point.lng)
        ],
        {
            icon: markerIcon,
            mahpeSellerMarker: true
        }
    ).addTo(map);

    sellerMarker.bindPopup(
        buildSellerPopup(point)
    );

    map.setView(
        [
            Number(point.lat),
            Number(point.lng)
        ],
        Math.max(map.getZoom(), 15)
    );

    updateOfferMetrics(commercialPoints);
}


/* =========================================================
   140. DESACTIVAR PUNTO VERDE
========================================================= */

function deactivateSeller() {

    stopFollowingSeller(false);

    const saved = getSavedSellerPoint();

    if (saved) {

        saved.active = false;

        saved.updatedAt =
            new Date().toISOString();

        saveSellerPoint(saved);
    }

    /*
       Primero eliminamos el marcador.
       Después limpiamos el estado visual.
    */

    removeSellerMarker();

    commercialPoints = [];

    coyoteSearchResults = [];

    showSellerForm(false);

    updateSellerToggleUI(false);

    updateOfferMetrics([]);

    updateStatus(
        "Punto Verde desactivado. Tu comercio sigue guardado."
    );

    /*
       La ubicación personal permanece
       azul si el usuario la compartió.
    */

    if (map) {
        map.closePopup();
    }
}


/* =========================================================
   141. PRIMERA ACTIVACIÓN
========================================================= */

async function requestFirstSellerActivation() {

    updateStatus(
        "📍 Solicitando ubicación para tu Punto Verde..."
    );

    try {

        await requestCoyoteLocation({
            highAccuracy: true
        });

        const defaultProduct =
            getDefaultCoyoteProduct();

        if (
            productInput &&
            !productInput.value.trim()
        ) {

            productInput.value =
                defaultProduct;
        }

        showSellerForm(true);

        updateStatus(
            "Ubicación lista. Indica qué vendes y confirma."
        );

        productInput?.focus();

    } catch (error) {

        updateStatus(
            "⚠️ " + error.message
        );
    }
}


/* =========================================================
   142. CONFIRMAR ACTIVACIÓN
========================================================= */

function confirmSellerPoint() {

    if (!userLocation) {

        updateStatus(
            "Primero debes compartir tu ubicación."
        );

        return;
    }

    const product =
        productInput?.value.trim() ||
        getDefaultCoyoteProduct();

    if (!product) {

        updateStatus(
            "Indica qué producto ofreces."
        );

        return;
    }

    const company = getCurrentCompany();

    const point = {
        id: "local-seller",
        companyId: company?.id || null,
        companyName:
            company?.name || "Comerciante",
        category:
            company?.category || "",
        product,
        lat: userLocation.lat,
        lng: userLocation.lng,
        active: true,
        updatedAt: new Date().toISOString()
    };

    if (!saveSellerPoint(point)) {

        updateStatus(
            "No se pudo guardar el Punto Verde."
        );

        return;
    }

    createSellerPoint(point);

    showSellerForm(false);

    updateSellerToggleUI(true);

    updateStatus(
        "🟢 Punto Verde activado."
    );

    addMahpeEvent(
        "coyote",
        "Activaste tu Punto Verde.",
        company?.id || null
    );

    saveMahpeState();
}


/* =========================================================
   143. REACTIVAR PUNTO GUARDADO
========================================================= */

function reactivateSavedSeller(saved) {

    if (!isValidCoyotePoint(saved)) {

        requestFirstSellerActivation();
        return;
    }

    saved.active = true;

    saved.updatedAt =
        new Date().toISOString();

    if (!saveSellerPoint(saved)) {

        updateStatus(
            "No se pudo reactivar el punto."
        );

        return;
    }

    createSellerPoint(saved);

    showSellerForm(false);

    updateSellerToggleUI(true);

    updateStatus(
        "🟢 Punto Verde reactivado."
    );
}


/* =========================================================
   144. INTERRUPTOR PRINCIPAL
========================================================= */

function handleSellerToggle() {

    const saved = getSavedSellerPoint();

    if (saved?.active) {

        deactivateSeller();
        return;
    }

    if (
        saved &&
        !saved.active &&
        saved.product &&
        isValidCoyotePoint(saved)
    ) {

        reactivateSavedSeller(saved);
        return;
    }

    requestFirstSellerActivation();
}


/* =========================================================
   145. CARGAR PUNTO GUARDADO
========================================================= */

function loadSavedSeller() {

    const point = getSavedSellerPoint();

    if (!point) {

        removeSellerMarker();

        commercialPoints = [];

        updateSellerToggleUI(false);

        updateOfferMetrics([]);

        return;
    }

    if (!point.active) {

        removeSellerMarker();

        commercialPoints = [];

        updateSellerToggleUI(false);

        updateOfferMetrics([]);

        updateStatus(
            "Tu Punto Verde está guardado y desactivado."
        );

        return;
    }

    createSellerPoint(point);

    updateSellerToggleUI(true);
}


/* =========================================================
   146. DISTANCIA HAVERSINE
========================================================= */

function calculateDistanceKm(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const toRad = degrees =>
        degrees * Math.PI / 180;

    const earthRadius = 6371;

    const dLat = toRad(lat2 - lat1);

    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;

    return (
        2 *
        earthRadius *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        )
    );
}


/* =========================================================
   147. MÉTRICAS DE OFERTA

   MVP LOCAL:
   Solo se consulta el punto guardado
   en este navegador.

   Los comercios de otros usuarios
   requerirán una base de datos.
========================================================= */

function updateOfferMetrics(points = []) {

    const activePoints = points.filter(
        point => point && point.active
    );

    if (offerText) {

        offerText.textContent =
            `${activePoints.length} comercio${
                activePoints.length === 1
                    ? ""
                    : "s"
            }`;
    }

    if (demandBar) {

        const intensity = Math.min(
            100,
            activePoints.length * 20
        );

        demandBar.style.width =
            `${intensity}%`;
    }

    if (demandText) {

        demandText.textContent =
            activePoints.length
                ? "Oferta local registrada"
                : "Sin oferta activa registrada";
    }
}


/* =========================================================
   148. BÚSQUEDA DE COMERCIOS
========================================================= */

function searchCommercialPoints() {

    const query = (
        searchInput?.value || ""
    ).trim().toLowerCase();

    const saved = getSavedSellerPoint();

    const available = [];

    if (saved?.active) {

        let insideRadius = true;

        if (userLocation) {

            const distance =
                calculateDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    Number(saved.lat),
                    Number(saved.lng)
                );

            insideRadius =
                distance <= selectedRadius;
        }

        const searchableText = [
            saved.product,
            saved.companyName,
            saved.category
        ].join(" ").toLowerCase();

        const matchesQuery =
            !query ||
            searchableText.includes(query);

        if (insideRadius && matchesQuery) {
            available.push(saved);
        }
    }

    coyoteSearchResults = available;

    commercialPoints = available;

    updateOfferMetrics(available);

    if (!available.length) {

        updateStatus(
            "No se encontraron comercios activos con esos criterios."
        );

        return;
    }

    const point = available[0];

    updateStatus(
        `Encontramos ${available.length} comercio activo.`
    );

    if (map) {

        map.setView(
            [
                Number(point.lat),
                Number(point.lng)
            ],
            15
        );

        if (sellerMarker) {
            sellerMarker.openPopup();
        }
    }
}


/* =========================================================
   149. SEGUIMIENTO DEL PUNTO

   El seguimiento es voluntario.
========================================================= */

function stopFollowingSeller(showMessage = true) {

    if (
        followWatchId !== null &&
        navigator.geolocation
    ) {

        navigator.geolocation.clearWatch(
            followWatchId
        );
    }

    followWatchId = null;

    followedSellerPoint = null;

    if (map) {

        if (followUserMarker) {
            map.removeLayer(followUserMarker);
        }

        if (followLine) {
            map.removeLayer(followLine);
        }
    }

    followUserMarker = null;
    followLine = null;

    if (showMessage) {

        updateStatus(
            "Seguimiento detenido."
        );
    }
}

function updateFollowLine() {

    if (
        !map ||
        !userLocation ||
        !followedSellerPoint
    ) {
        return;
    }

    const coordinates = [
        [
            userLocation.lat,
            userLocation.lng
        ],
        [
            Number(followedSellerPoint.lat),
            Number(followedSellerPoint.lng)
        ]
    ];

    if (!followLine) {

        followLine = L.polyline(
            coordinates,
            {
                color: "#348bff",
                weight: 3,
                dashArray: "7 7"
            }
        ).addTo(map);

    } else {

        followLine.setLatLngs(coordinates);
    }
}

function followSellerPoint() {

    const point = getSavedSellerPoint();

    if (!point?.active) {

        updateStatus(
            "No hay un Punto Verde activo para seguir."
        );

        return;
    }

    if (!navigator.geolocation) {

        updateStatus(
            "Tu navegador no permite seguimiento GPS."
        );

        return;
    }

    stopFollowingSeller(false);

    followedSellerPoint = point;

    followWatchId =
        navigator.geolocation.watchPosition(
            position => {

                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                updateUserMarker(
                    userLocation.lat,
                    userLocation.lng
                );

                updateFollowLine();

                const distance =
                    calculateDistanceKm(
                        userLocation.lat,
                        userLocation.lng,
                        Number(point.lat),
                        Number(point.lng)
                    );

                updateStatus(
                    `Distancia al Punto Verde: ${
                        distance.toFixed(2)
                    } km`
                );

            },
            error => {

                updateStatus(
                    "No se pudo actualizar tu ubicación."
                );

                console.warn(error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 15000
            }
        );
}


/* =========================================================
   150. CONECTAR CONTROLES COYOTE
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

        searchInput.onkeydown = event => {

            if (event.key === "Enter") {

                event.preventDefault();
                searchCommercialPoints();
            }
        };
    }

    initializeRadiusButtons();
}


/* =========================================================
   151. REPARACIÓN DE ACTIVIDAD COMPACTA

   Se conserva la bandeja expandida
   al marcar las notificaciones leídas.
========================================================= */

function markActivityAsRead() {

    mahpeState.events.forEach(event => {
        event.read = true;
    });

    saveMahpeState();

    const badge =
        document.getElementById("activityBadge");

    if (badge) {

        badge.textContent = "0";
        badge.classList.add("hidden");
    }

    const inbox =
        document.getElementById("activityInbox");

    if (inbox) {

        inbox.classList.remove("has-unread");
    }
}


/* =========================================================
   152. REPARACIÓN DE MÉTRICAS DEL PERFIL
========================================================= */

function updateGlobalUI() {

    const mahpes = Number(
        mahpeState.mahpes || 0
    ).toLocaleString("es-PE");

    [
        "mahpesCount",
        "profileMahpes"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = mahpes;
        }
    });

    const companies =
        document.getElementById("profileCompanies");

    if (companies) {

        companies.textContent =
            mahpeState.companies.length;
    }

    const following =
        document.getElementById("followingCount");

    if (following) {

        following.textContent =
            getFollowingCount();
    }
}


/* =========================================================
   153. REPARACIÓN DE NAVEGACIÓN

   Compatible con los botones existentes
   de index.html.
========================================================= */

function bindMainNavigation() {

    document
        .querySelectorAll("[data-view]")
        .forEach(button => {

            if (!button.closest("#mahpeMainNav")) {
                return;
            }

            button.onclick = () => {

                const viewId =
                    button.dataset.view;

                if (!viewId) return;

                openView(viewId);
            };
        });
}


/* =========================================================
   154. INICIALIZAR EMPRESA ACTIVA
========================================================= */

function initializeCurrentCompany() {

    if (!mahpeState.companies.length) {

        currentCompanyId = null;
        return;
    }

    const exists =
        mahpeState.companies.some(
            company =>
                company.id === currentCompanyId
        );

    if (!exists) {

        currentCompanyId =
            mahpeState.companies[0].id;
    }
}


/* =========================================================
   155. CONECTAR PUBLICADOR EXISTENTE
========================================================= */

function bindCompanyPublisher() {

    const publishButton =
        document.getElementById("publishPostButton");

    const postInput =
        document.getElementById("postTextInput");

    if (!publishButton || !postInput) {
        return;
    }

    publishButton.onclick = () => {

        const text = postInput.value.trim();

        if (!text) return;

        const published =
            publishCompanyPost(text);

        if (published) {

            postInput.value = "";

            currentFeedMode = "explore";

            openView("feedView");
            renderFeed();
        }
    };
}


/* =========================================================
   156. SINCRONIZACIÓN BÁSICA DE ETAPAS
========================================================= */

function synchronizeCompanyStages() {

    mahpeState.companies.forEach(company => {

        migrateCompanyBusinessData(company);

        recalculateCompanyStage(company);
    });
}


/* =========================================================
   157. INICIALIZACIÓN GENERAL MAHPE
========================================================= */

let mahpeInitialized = false;

function initializeMahpe() {

    if (mahpeInitialized) {
        return;
    }

    mahpeInitialized = true;

    console.info(
        "MAHPE v2.0 — Inicializando..."
    );

    /*
       1. Estado
    */

    migrateMahpeBusinessState();

    initializeCurrentCompany();

    /*
       2. Navegación
    */

    bindMainNavigation();

    /*
       3. Feed
    */

    initializeFeedTabs();

    renderFeed();

    renderActivityInbox();

    /*
       4. Empresa
    */

    bindCompanyCreation();

    bindProductEditorEvents();

    bindCompanyPublisher();

    renderCompanyDashboard();

    /*
       5. Perfil
    */

    updateProfile();

    /*
       6. COYOTE
    */

    bindCoyoteEvents();

    initializeMap();

    /*
       7. Métricas globales
    */

    updateGlobalUI();

    console.info(
        "MAHPE v2.0 — Inicialización completada."
    );
}


/* =========================================================
   158. ARRANQUE ÚNICO
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMahpe,
        { once: true }
    );

} else {

    initializeMahpe();
}


/* =========================================================
   159. FUNCIONES PÚBLICAS COYOTE
========================================================= */

window.handleSellerToggle =
    handleSellerToggle;

window.deactivateSeller =
    deactivateSeller;

window.confirmSellerPoint =
    confirmSellerPoint;

window.searchCommercialPoints =
    searchCommercialPoints;

window.followSellerPoint =
    followSellerPoint;

window.stopFollowingSeller =
    stopFollowingSeller;

window.initializeMahpe =
    initializeMahpe;


/* =========================================================
   FIN BLOQUE 4/4

   MAHPE v2.0
   Crea. Simula. Haz crecer.

   FUNCIONALIDADES INTEGRADAS:

   - Inicio
   - Feed
   - Siguiendo
   - Descubrir
   - Tendencias
   - Señales
   - Empresas
   - Productos
   - Imágenes
   - Logos
   - Publicaciones
   - Estadísticas
   - Decisiones
   - Perfil
   - Foto editable
   - Recomendaciones
   - Actividad
   - Mahpes
   - COYOTE
   - Punto Verde ON/OFF

   SIN DINERO REAL.
========================================================= */
