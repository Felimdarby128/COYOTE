/* =========================================================
   MAHPE v1.1
   JUEGO + SIMULADOR EMPRESARIAL
   COYOTE = MOTOR TERRITORIAL + BUSINESS ENGINE
========================================================= */


/* =========================================================
   ESTADO MAHPE
========================================================= */

const DEFAULT_STATE = {

    mahpes: 1250,

    companies: [],

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


/* =========================================================
   EMPRESA DEMO — SURANO
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

        const parsed =
            JSON.parse(saved);


        if (!Array.isArray(parsed.companies)) {
            parsed.companies = [];
        }


        if (!Array.isArray(parsed.posts)) {
            parsed.posts = [];
        }


        if (!parsed.interactions || typeof parsed.interactions !== "object") {
            parsed.interactions = {};
        }


        if (!parsed.following || typeof parsed.following !== "object") {
            parsed.following = {};
        }


        if (!parsed.followRewards || typeof parsed.followRewards !== "object") {
            parsed.followRewards = {};
        }


        if (!Array.isArray(parsed.events)) {
            parsed.events = [];
        }


        if (!Array.isArray(parsed.decisionHistory)) {
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
            Math.round(value)
        )
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


/* =========================================================
   MIGRACIÓN BUSINESS ENGINE
========================================================= */

function migrateCompanyBusinessData(
    company
) {

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

}


function migrateMahpeBusinessState() {

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


    localStorage.setItem(
        "mahpe_state_v1",
        JSON.stringify(
            mahpeState
        )
    );

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
   FEED — MAHPE INTERACTION LOOP v1
========================================================= */

function getAllPosts() {
    return [demoPost, ...mahpeState.posts.slice().reverse()];
}

function getPostCompany(post) {
    if (post.demo) return demoCompany;
    return mahpeState.companies.find(company => company.id === post.companyId) || null;
}

function isFollowingCompany(companyId) {
    return Boolean(mahpeState.following && mahpeState.following[companyId]);
}

function getFollowingCount() {
    return Object.values(mahpeState.following || {}).filter(Boolean).length;
}

function getDisplayedPostMetric(post, metric) {
    let value = Number(post[metric] || 0);
    if (!post.demo) return value;

    const signalMap = {
        views: "view",
        interactions: "interaction",
        interested: "interest",
        committed: "commitment"
    };

    const signal = signalMap[metric];
    if (signal && mahpeState.interactions[post.id + "-" + signal]) value += 1;
    return value;
}

function getPostTrendScore(post) {
    return (
        getDisplayedPostMetric(post, "views") * 0.05 +
        getDisplayedPostMetric(post, "interactions") +
        getDisplayedPostMetric(post, "interested") * 4 +
        getDisplayedPostMetric(post, "committed") * 10
    );
}

function getVisiblePosts() {
    const posts = getAllPosts();
    if (currentFeedMode === "following") {
        return posts.filter(post => isFollowingCompany(post.companyId));
    }
    if (currentFeedMode === "trending") {
        return posts.slice().sort((a, b) => getPostTrendScore(b) - getPostTrendScore(a));
    }
    return posts;
}

function ensureFeedShell() {
    const feedContainer = document.getElementById("feedContainer");
    if (!feedContainer) return;

    if (!document.getElementById("mahpeFeedTabs")) {
        const tabs = document.createElement("div");
        tabs.id = "mahpeFeedTabs";
        tabs.className = "mahpe-feed-tabs";
        tabs.innerHTML = `
            <button type="button" class="feed-tab active" data-feed-mode="explore" id="exploreFeedButton">Descubrir</button>
            <button type="button" class="feed-tab" data-feed-mode="following" id="followingFeedButton">Siguiendo <span id="followingCount">0</span></button>
            <button type="button" class="feed-tab" data-feed-mode="trending" id="trendingFeedButton">Tendencias</button>
        `;
        feedContainer.parentNode.insertBefore(tabs, feedContainer);
    }

    if (!document.getElementById("mahpeInteractionStyles")) {
        const style = document.createElement("style");
        style.id = "mahpeInteractionStyles";
        style.textContent = `
            .mahpe-feed-tabs{display:flex;gap:8px;max-width:760px;margin:0 auto 16px;padding:4px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow-x:auto}
            .feed-tab{flex:1;min-width:max-content;border:0;background:transparent;color:#8f9892;padding:10px 14px;border-radius:10px;font-weight:800;cursor:pointer}
            .feed-tab.active{background:#00e86d;color:#04150b}
            .feed-tab span{display:inline-flex;min-width:20px;height:20px;align-items:center;justify-content:center;margin-left:4px;border-radius:999px;background:rgba(0,0,0,.18);font-size:11px}
            .feed-empty{max-width:760px;margin:18px auto;padding:28px;text-align:center;border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.025)}
            .feed-empty h2{margin:8px 0}.feed-empty p{margin-bottom:16px}
            .follow-button.following{background:rgba(0,232,109,.13);color:#00e86d;border-color:rgba(0,232,109,.35)}
            .signal-button.selected{border-color:rgba(0,232,109,.5);background:rgba(0,232,109,.09)}
            #activateButton.is-active{background:#161b18;color:#ff7676;border:1px solid rgba(255,118,118,.35)}
        `;
        document.head.appendChild(style);
    }
}

function setFeedMode(mode) {
    if (!["explore", "following", "trending"].includes(mode)) mode = "explore";
    currentFeedMode = mode;
    updateFeedControls();
    renderFeed();
}

function initializeFeedTabs() {
    ensureFeedShell();
    document.querySelectorAll(".feed-tab").forEach(button => {
        button.onclick = () => setFeedMode(button.dataset.feedMode);
    });
    updateFeedControls();
}

function updateFeedControls() {
    const counter = document.getElementById("followingCount");
    if (counter) counter.textContent = getFollowingCount();
    document.querySelectorAll(".feed-tab").forEach(button => {
        button.classList.toggle("active", button.dataset.feedMode === currentFeedMode);
    });
}

function addMahpeEvent(type, message, companyId = null) {
    if (!Array.isArray(mahpeState.events)) mahpeState.events = [];
    mahpeState.events.unshift({
        id: generateId("event"), type, message, companyId, read: false,
        createdAt: new Date().toISOString()
    });
    mahpeState.events = mahpeState.events.slice(0, 30);
}

function renderEmptyFeed(container) {
    let title = "Todavía no hay publicaciones";
    let text = "Las nuevas empresas aparecerán aquí.";
    if (currentFeedMode === "following") {
        title = "Tu bandeja de Siguiendo está vacía";
        text = "Ve a Descubrir y sigue empresas para construir tu propio feed.";
    } else if (currentFeedMode === "trending") {
        title = "Todavía no hay tendencias";
        text = "Las señales de mercado decidirán qué empresas suben aquí.";
    }
    container.innerHTML = `<section class="feed-empty"><span class="eyebrow">MAHPE</span><h2>${escapeHTML(title)}</h2><p class="muted">${escapeHTML(text)}</p>${currentFeedMode === "following" ? '<button class="secondary-button" type="button" onclick="setFeedMode(\'explore\')">DESCUBRIR EMPRESAS</button>' : ''}</section>`;
}

function renderFeed() {
    const container = document.getElementById("feedContainer");
    if (!container) return;
    ensureFeedShell();
    updateFeedControls();
    const posts = getVisiblePosts();
    container.innerHTML = "";
    if (!posts.length) { renderEmptyFeed(container); return; }

    posts.forEach(post => {
        const company = getPostCompany(post);
        if (!company) return;
        const article = document.createElement("article");
        article.className = "post";
        const viewKey = post.id + "-view";
        const interactionKey = post.id + "-interaction";
        const interestKey = post.id + "-interest";
        const commitmentKey = post.id + "-commitment";
        const following = isFollowingCompany(company.id);

        article.innerHTML = `
            <div class="post-header">
                <div class="company-avatar">${escapeHTML(company.name.charAt(0))}</div>
                <div class="post-company"><strong>${escapeHTML(company.name)}</strong><span>${escapeHTML(company.category)} · ${escapeHTML(company.stage)}</span></div>
                <button class="follow-button ${following ? "following" : ""}" data-company="${company.id}" type="button">${following ? "Siguiendo" : "Seguir"}</button>
            </div>
            <div class="post-visual"><div class="visual-brand">${escapeHTML(company.name)}</div><strong>${escapeHTML(post.title)}</strong><p>${escapeHTML(post.text)}</p></div>
            <div class="post-body">
                <p class="post-description"><strong>${escapeHTML(company.name)}</strong> · ${escapeHTML(post.text)}</p>
                <div class="signals">
                    <button class="signal-button ${mahpeState.interactions[viewKey] ? "selected" : ""}" data-post="${post.id}" data-signal="view" type="button"><span>👁</span><strong>${getDisplayedPostMetric(post,"views")}</strong><small>Vistas</small></button>
                    <button class="signal-button ${mahpeState.interactions[interactionKey] ? "selected" : ""}" data-post="${post.id}" data-signal="interaction" type="button"><span>♡</span><strong>${getDisplayedPostMetric(post,"interactions")}</strong><small>Interacción</small></button>
                    <button class="signal-button ${mahpeState.interactions[interestKey] ? "selected" : ""}" data-post="${post.id}" data-signal="interest" type="button"><span>🔥</span><strong>${getDisplayedPostMetric(post,"interested")}</strong><small>Interesado</small></button>
                    <button class="signal-button ${mahpeState.interactions[commitmentKey] ? "selected" : ""}" data-post="${post.id}" data-signal="commitment" type="button"><span>💰</span><strong>${getDisplayedPostMetric(post,"committed")}</strong><small>Comprometido</small></button>
                </div>
            </div>`;
        container.appendChild(article);
    });
    bindFeedEvents();
}

function toggleCompanyFollow(companyId) {
    if (!companyId) return;
    const company = companyId === demoCompany.id ? demoCompany : mahpeState.companies.find(item => item.id === companyId);
    if (!company) return;
    const wasFollowing = isFollowingCompany(companyId);

    if (wasFollowing) {
        delete mahpeState.following[companyId];
        if (!company.demo) company.followers = Math.max(0, Number(company.followers || 0) - 1);
        addMahpeEvent("follow", "Dejaste de seguir a " + company.name + ".", companyId);
    } else {
        mahpeState.following[companyId] = true;
        if (!company.demo) {
            company.followers = Number(company.followers || 0) + 1;
            company.value = Number(company.value || 0) + 4;
        }
        if (!mahpeState.followRewards[companyId]) {
            mahpeState.mahpes += 2;
            mahpeState.followRewards[companyId] = true;
        }
        addMahpeEvent("follow", "Ahora sigues a " + company.name + ".", companyId);
    }
    saveMahpeState();
    renderFeed();
}

function bindFeedEvents() {
    document.querySelectorAll(".follow-button").forEach(button => {
        button.onclick = () => toggleCompanyFollow(button.dataset.company);
    });
    document.querySelectorAll(".signal-button").forEach(button => {
        button.onclick = () => {
            const postId = button.dataset.post;
            const signal = button.dataset.signal;
            const key = postId + "-" + signal;
            if (mahpeState.interactions[key]) return;
            mahpeState.interactions[key] = true;
            applySignal(postId, signal);
        };
    });
}

function applySignal(postId, signal) {
    const realPost = mahpeState.posts.find(item => item.id === postId);
    const post = realPost || (postId === demoPost.id ? demoPost : null);
    if (!post) return;
    const company = getPostCompany(post);
    if (!company) return;

    if (signal === "view") {
        if (realPost) realPost.views = Number(realPost.views || 0) + 1;
    }

    if (signal === "interaction") {
        if (realPost) {
            realPost.interactions = Number(realPost.interactions || 0) + 1;
            migrateCompanyBusinessData(company);
            company.interactions += 1;
            company.activity = clamp(company.activity + 1);
            company.value += 5;
        }
        mahpeState.mahpes += 1;
    }

    if (signal === "interest") {
        if (realPost) {
            realPost.interested = Number(realPost.interested || 0) + 1;
            migrateCompanyBusinessData(company);
            company.interested += 1;
            company.marketResponse = clamp(company.marketResponse + 2);
            company.productValidation = clamp(company.productValidation + 1);
            company.value += 20;
        }
        mahpeState.mahpes += 2;
    }

    if (signal === "commitment") {
        if (realPost) {
            realPost.committed = Number(realPost.committed || 0) + 1;
            migrateCompanyBusinessData(company);
            company.committed += 1;
            company.marketResponse = clamp(company.marketResponse + 4);
            company.productValidation = clamp(company.productValidation + 3);
            company.value += 50;
            company.capital += 10;
        }
        mahpeState.mahpes += 3;
    }

    if (realPost) recalculateCompanyStage(company);
    saveMahpeState();
    renderFeed();
    renderCompanyDashboard();
}

window.setFeedMode = setFeedMode;


/* =========================================================
   CREAR EMPRESA
========================================================= */

const createCompanyButton =
    document.getElementById(
        "createCompanyButton"
    );


if (createCompanyButton) {

    createCompanyButton
        .addEventListener(
            "click",
            createCompany
        );

}


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

        activity: 20,

        marketResponse: 20,

        locationStrength: 20,

        risk: 15,

        designLevel: 20,

        productValidation: 10,

        marketKnowledge: 10,

        campaignPower: 0,

        decisions: [],

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


    mahpeState.mahpes +=
        100;


    addMahpeEvent(
        "company",
        "Creaste " + company.name + ".",
        company.id
    );


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
        350
    );

}


function clearCompanyForm() {

    const fields = [

        "companyNameInput",

        "companyDescriptionInput",

        "companyProductInput",

        "companyPriceInput",

        "companyAudienceInput"

    ];


    fields.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });

}


/* =========================================================
   COYOTE BUSINESS ENGINE
========================================================= */

const COYOTE_DECISIONS = {

    product: {

        icon:
            "🧪",

        name:
            "Probar producto",

        cost:
            40,

        description:
            "Valida el producto frente al mercado virtual."

    },


    design: {

        icon:
            "🎨",

        name:
            "Mejorar diseño",

        cost:
            60,

        description:
            "Refuerza presentación, identidad y percepción."

    },


    campaign: {

        icon:
            "📣",

        name:
            "Hacer campaña",

        cost:
            100,

        description:
            "Aumenta exposición, pero no garantiza interés."

    },


    research: {

        icon:
            "🔎",

        name:
            "Investigar mercado",

        cost:
            70,

        description:
            "Reduce incertidumbre y mejora conocimiento."

    },


    location: {

        icon:
            "📍",

        name:
            "Probar ubicación",

        cost:
            50,

        description:
            "Conecta la empresa con el mapa territorial COYOTE."

    }

};


/* =========================================================
   SEÑALES EMPRESARIALES
========================================================= */

function getCompanySignalScore(
    company
) {

    const interactions =
        Number(
            company.interactions || 0
        );


    const interested =
        Number(
            company.interested || 0
        );


    const committed =
        Number(
            company.committed || 0
        );


    return Math.min(

        100,

        interactions * 0.4 +

        interested * 2 +

        committed * 5

    );

}


/* =========================================================
   ÍNDICE COYOTE
========================================================= */

function calculateCoyoteBusinessScore(
    company
) {

    migrateCompanyBusinessData(
        company
    );


    const signalScore =
        getCompanySignalScore(
            company
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
            0.15 +

        company.marketKnowledge *
            0.10 +

        signalScore *
            0.20 -

        company.risk *
            0.10;


    return clamp(score);

}


function getCoyoteBusinessLabel(
    score
) {

    if (
        score >= 80
    ) {

        return "IMPULSO FUERTE";

    }


    if (
        score >= 60
    ) {

        return "CRECIMIENTO";

    }


    if (
        score >= 40
    ) {

        return "VALIDACIÓN";

    }


    if (
        score >= 20
    ) {

        return "EXPLORACIÓN";

    }


    return "RIESGO ALTO";

}


/* =========================================================
   RESULTADO DE DECISIONES
========================================================= */

function getDecisionRoll(
    company,
    decisionKey
) {

    const source =
        company.id +
        "-" +
        decisionKey +
        "-" +
        Date.now();


    let seed = 0;


    for (
        let i = 0;
        i < source.length;
        i++
    ) {

        seed =
            (
                seed * 31 +
                source.charCodeAt(i)
            ) %
            100000;

    }


    return seed % 100;

}


/* =========================================================
   EJECUTAR DECISIÓN
========================================================= */

function executeBusinessDecision(
    decisionKey
) {

    const company =
        getCurrentCompany();


    const decision =
        COYOTE_DECISIONS[
            decisionKey
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

        showBusinessResult(

            "⚠️ No tienes suficientes Mahpes para esta decisión.",

            "warning"

        );


        return;

    }


    mahpeState.mahpes -=
        decision.cost;


    const roll =
        getDecisionRoll(
            company,
            decisionKey
        );


    const signalScore =
        getCompanySignalScore(
            company
        );


    let valueDelta = 0;

    let resultText = "";


/* =========================================================
   DECISIÓN: PROBAR PRODUCTO
========================================================= */

    if (
        decisionKey ===
        "product"
    ) {

        company.activity =
            clamp(
                company.activity + 6
            );


        company.productValidation =
            clamp(

                company.productValidation +

                (
                    roll >= 35
                        ? 12
                        : 5
                )

            );


        company.marketResponse =
            clamp(

                company.marketResponse +

                (
                    signalScore >= 20
                        ? 8
                        : 3
                )

            );


        if (
            roll >= 35
        ) {

            valueDelta = 90;


            resultText =
                "El producto respondió bien a la prueba. Aumentó su validación.";

        }

        else {

            valueDelta = 30;


            company.risk =
                clamp(
                    company.risk + 2
                );


            resultText =
                "La respuesta fue débil. No fue un fracaso total: COYOTE obtuvo información del mercado.";

        }

    }


/* =========================================================
   DECISIÓN: MEJORAR DISEÑO
========================================================= */

    if (
        decisionKey ===
        "design"
    ) {

        company.designLevel =
            clamp(
                company.designLevel + 14
            );


        company.marketResponse =
            clamp(

                company.marketResponse +

                (
                    roll >= 30
                        ? 6
                        : 2
                )

            );


        company.risk =
            clamp(
                company.risk - 2
            );


        valueDelta =
            roll >= 30
                ? 75
                : 35;


        resultText =
            "La identidad del producto mejoró. COYOTE actualizó su percepción de mercado.";

    }


/* =========================================================
   DECISIÓN: CAMPAÑA
========================================================= */

    if (
        decisionKey ===
        "campaign"
    ) {

        company.activity =
            clamp(
                company.activity + 15
            );


        company.campaignPower =
            clamp(
                company.campaignPower + 15
            );


        if (
            signalScore >= 25 ||
            roll >= 55
        ) {

            company.marketResponse =
                clamp(
                    company.marketResponse + 10
                );


            company.interested +=
                2;


            company.followers +=
                5;


            valueDelta =
                130;


            resultText =
                "La campaña encontró tracción. Aumentó la exposición y aparecieron nuevos interesados.";

        }

        else {

            company.risk =
                clamp(
                    company.risk + 7
                );


            company.followers +=
                2;


            valueDelta =
                25;


            resultText =
                "La campaña consiguió exposición, pero poca intención real. COYOTE detecta riesgo de gastar sin validar.";

        }

    }


/* =========================================================
   DECISIÓN: INVESTIGAR MERCADO
========================================================= */

    if (
        decisionKey ===
        "research"
    ) {

        company.marketKnowledge =
            clamp(
                company.marketKnowledge + 18
            );


        company.risk =
            clamp(
                company.risk - 10
            );


        company.marketResponse =
            clamp(
                company.marketResponse + 4
            );


        valueDelta =
            60;


        resultText =
            "La investigación redujo incertidumbre y mejoró el conocimiento del mercado.";

    }


/* =========================================================
   DECISIÓN: PROBAR UBICACIÓN
========================================================= */

    if (
        decisionKey ===
        "location"
    ) {

        company.locationStrength =
            clamp(
                company.locationStrength + 8
            );


        company.marketKnowledge =
            clamp(
                company.marketKnowledge + 5
            );


        valueDelta =
            45;


        resultText =
            "COYOTE preparó una prueba territorial. El siguiente paso es contrastar la empresa sobre el mapa.";

    }


/* =========================================================
   ACTUALIZAR EMPRESA
========================================================= */

    company.value =
        Math.max(

            0,

            Number(
                company.value || 0
            ) +

            valueDelta

        );


    recalculateCompanyStage(
        company
    );


    const businessScore =
        calculateCoyoteBusinessScore(
            company
        );


    const historyItem = {

        id:
            generateId(
                "decision"
            ),

        companyId:
            company.id,

        decision:
            decision.name,

        decisionKey,

        cost:
            decision.cost,

        valueDelta,

        score:
            businessScore,

        result:
            resultText,

        createdAt:
            new Date()
                .toISOString()

    };


    company.decisions.unshift(
        historyItem
    );


    company.decisions =
        company.decisions.slice(
            0,
            12
        );


    mahpeState
        .decisionHistory
        .unshift(
            historyItem
        );


    mahpeState.decisionHistory =
        mahpeState
            .decisionHistory
            .slice(
                0,
                50
            );


    saveMahpeState();


    renderCompanyDashboard();


    setTimeout(
        function() {

            showBusinessResult(

                resultText +

                " Valor empresarial: +" +

                valueDelta +

                ". Índice COYOTE: " +

                businessScore +

                "/100.",

                "success"

            );

        },
        30
    );


    if (
        decisionKey ===
        "location"
    ) {

        setTimeout(
            function() {

                openView(
                    "mapView"
                );


                updateStatus(

                    "📍 <strong>Prueba empresarial activa.</strong><br>" +

                    "Usa Punto Verde y la búsqueda para observar el territorio de " +

                    escapeHTML(
                        company.name
                    ) +

                    "."

                );

            },
            1100
        );

    }

}


/* =========================================================
   MENSAJE BUSINESS ENGINE
========================================================= */

function showBusinessResult(
    message,
    type = "success"
) {

    const box =
        document.getElementById(
            "coyoteBusinessResult"
        );


    if (!box) {

        return;

    }


    box.className =
        "coyote-business-result " +
        type;


    box.textContent =
        message;

}


/* =========================================================
   MÉTRICA BUSINESS ENGINE
========================================================= */

function renderBusinessMetric(
    label,
    value
) {

    return `

        <div class="coyote-business-metric">

            <div>

                <span>
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${clamp(value)}
                </strong>

            </div>


            <div class="coyote-business-bar">

                <div
                    style="width:${clamp(value)}%"
                ></div>

            </div>

        </div>

    `;

}


/* =========================================================
   RENDER COYOTE BUSINESS ENGINE
========================================================= */

function renderBusinessEngine(
    company
) {

    migrateCompanyBusinessData(
        company
    );


    const score =
        calculateCoyoteBusinessScore(
            company
        );


    const label =
        getCoyoteBusinessLabel(
            score
        );


    const decisionsHTML =
        Object.entries(
   COYOTE_DECISIONS
        )
        .map(
            ([key, decision]) => `

                <button
                    class="coyote-decision-button"
                    onclick="executeBusinessDecision('${key}')"
                >

                    <span
                        class="coyote-decision-icon"
                    >

                        ${decision.icon}

                    </span>


                    <span
                        class="coyote-decision-copy"
                    >

                        <strong>

                            ${escapeHTML(
                                decision.name
                            )}

                        </strong>


                        <small>

                            ${escapeHTML(
                                decision.description
                            )}

                        </small>

                    </span>


                    <span
                        class="coyote-decision-cost"
                    >

                        ◈ ${decision.cost}

                    </span>

                </button>

            `
        )
        .join("");


    const historyHTML =
        company.decisions.length

            ? company.decisions
                .slice(
                    0,
                    5
                )
                .map(
                    item => `

                        <div
                            class="coyote-history-item"
                        >

                            <div>

                                <strong>

                                    ${escapeHTML(
                                        item.decision
                                    )}

                                </strong>


                                <small>

                                    ${new Date(
                                        item.createdAt
                                    ).toLocaleString(
                                        "es-PE"
                                    )}

                                </small>

                            </div>


                            <span>

                                +${item.valueDelta}

                            </span>

                        </div>

                    `
                )
                .join("")

            : `

                <div
                    class="coyote-history-empty"
                >

                    Todavía no has tomado
                    decisiones empresariales.

                </div>

            `;


    return `

        <section
            class="coyote-business-engine"
        >

            <div
                class="coyote-engine-heading"
            >

                <div>

                    <span class="eyebrow">

                        COYOTE BUSINESS ENGINE

                    </span>


                    <h2>

                        Decide. Prueba. Aprende.

                    </h2>


                    <p class="muted">

                        Tus decisiones consumen Mahpes
                        y modifican la evolución simulada
                        de la empresa.

                    </p>

                </div>


                <div class="coyote-score">

                    <strong>

                        ${score}

                    </strong>


                    <small>

                        /100

                    </small>


                    <span>

                        ${label}

                    </span>

                </div>

            </div>


            <div
                class="coyote-business-metrics"
            >

                ${renderBusinessMetric(
                    "Actividad",
                    company.activity
                )}


                ${renderBusinessMetric(
                    "Mercado",
                    company.marketResponse
                )}


                ${renderBusinessMetric(
                    "Producto",
                    company.productValidation
                )}


                ${renderBusinessMetric(
                    "Diseño",
                    company.designLevel
                )}


                ${renderBusinessMetric(
                    "Ubicación",
                    company.locationStrength
                )}


                ${renderBusinessMetric(
                    "Conocimiento",
                    company.marketKnowledge
                )}

            </div>


            <div
                class="coyote-risk-line"
            >

                <span>

                    Riesgo empresarial

                </span>


                <strong>

                    ${company.risk}/100

                </strong>

            </div>


            <div
                class="coyote-decision-grid"
            >

                ${decisionsHTML}

            </div>


            <div
                id="coyoteBusinessResult"
                class="coyote-business-result"
            ></div>


            <div
                class="coyote-history"
            >

                <h3>

                    Últimas decisiones

                </h3>


                ${historyHTML}

            </div>

        </section>

    `;

}


/* =========================================================
   DASHBOARD DE EMPRESA
========================================================= */

function renderCompanyDashboard() {

    const container =
        document.getElementById(
            "companyDashboard"
        );


    if (!container) {

        return;

    }


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

                    Ve a Crear y construye
                    tu primera empresa
                    dentro de MAHPE.

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


    migrateCompanyBusinessData(
        company
    );


    container.innerHTML = `

        <section class="company-hero">

            <div class="company-hero-top">

                <div
                    class="company-big-avatar"
                >

                    ${escapeHTML(
                        company.name
                            .charAt(0)
                    )}

                </div>


                <div>

                    <h1>

                        ${escapeHTML(
                            company.name
                        )}

                    </h1>


                    <div
                        class="company-stage"
                    >

                        ${escapeHTML(
                            company.stage
                        )}

                    </div>

                </div>

            </div>


            <p
                class="company-description"
            >

                ${escapeHTML(
                    company.description
                )}

            </p>

        </section>


        <section class="stats-grid">

            <div class="stat-card">

                <span>
                    📈
                </span>

                <strong>
                    ${company.value}
                </strong>

                <small>
                    Valor MAHPE
                </small>

            </div>


            <div class="stat-card">

                <span>
                    ◈
                </span>

                <strong>
                    ${company.capital}
                </strong>

                <small>
                    Capital virtual
                </small>

            </div>


            <div class="stat-card">

                <span>
                    🔥
                </span>

                <strong>
                    ${company.interested}
                </strong>

                <small>
                    Interesados
                </small>

            </div>


            <div class="stat-card">

                <span>
                    💰
                </span>

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
                S/ ${company.price}

                <br><br>

                Público:
                ${escapeHTML(
                    company.audience
                )}

            </p>

        </section>


        ${renderBusinessEngine(
            company
        )}


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


    if (
        !titleInput ||
        !textInput
    ) {

        return;

    }


    const title =
        titleInput
            .value
            .trim();


    const text =
        textInput
            .value
            .trim();


    if (
        !title ||
        !text
    ) {

        return;

    }


    migrateCompanyBusinessData(
        company
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

        title,

        text,

        views:
            Math.floor(
                10 +
                Math.random() *
                35
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


    company.value +=
        25;


    company.activity =
        clamp(
            company.activity + 3
        );


    mahpeState.mahpes +=
        10;


    recalculateCompanyStage(
        company
    );


    addMahpeEvent(
        "post",
        company.name + " publicó: " + title + ".",
        company.id
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

    const profileMahpes =
        document.getElementById(
            "profileMahpes"
        );


    const profileCompanies =
        document.getElementById(
            "profileCompanies"
        );


    const profileInterest =
        document.getElementById(
            "profileInterest"
        );


    const profileCommitment =
        document.getElementById(
            "profileCommitment"
        );


    if (profileMahpes) {

        profileMahpes.textContent =
            mahpeState.mahpes;

    }


    if (profileCompanies) {

        profileCompanies.textContent =
            mahpeState
                .companies
                .length;

    }


    const totalInterest =
        mahpeState
            .companies
            .reduce(

                (
                    total,
                    company
                ) =>

                    total +
                    Number(
                        company.interested || 0
                    ),

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
                    Number(
                        company.committed || 0
                    ),

                0

            );


    if (profileInterest) {

        profileInterest.textContent =
            totalInterest;

    }


    if (profileCommitment) {

        profileCommitment.textContent =
            totalCommitment;

    }

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
   FIN PARTE 1/2

   NO DECLARES "map" NI NINGUNA VARIABLE COYOTE AQUÍ.

   LA PARTE 2/2 SE PEGA DIRECTAMENTE DEBAJO.
========================================================= */
/* =========================================================
   MAHPE v1.1
   SCRIPT.JS — PARTE 2/2

   COYOTE
   - Mapa Leaflet
   - Punto Verde
   - Ubicación
   - Radios de búsqueda
   - Buscador
   - Seguimiento
   - Distancias
   - Sincronización con empresa
   - Arranque final
========================================================= */


/* =========================================================
   VARIABLES COYOTE
   IMPORTANTE:
   ESTA ES LA ÚNICA DECLARACIÓN DE ESTAS VARIABLES
========================================================= */

let map = null;

let userLocation = null;

let userMarker = null;

let selectedRadius = 10;

let radiusCircle = null;

let sellerMarker = null;

let commercialPoints = [];

let searchMarkers = [];

let followWatchId = null;

let followUserMarker = null;

let followLine = null;

let followedSellerPoint = null;


/* =========================================================
   ELEMENTOS DEL PANEL COYOTE
========================================================= */

const activateButton =
    document.getElementById(
        "activateButton"
    );


const sellerForm =
    document.getElementById(
        "sellerForm"
    );


const sellerProductInput =
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
   INICIALIZAR MAPA
========================================================= */

function initializeMap() {

    if (map) {

        return;

    }


    const mapElement =
        document.getElementById(
            "map"
        );


    if (!mapElement) {

        console.warn(
            "MAHPE: no se encontró #map."
        );

        return;

    }


    if (
        typeof L ===
        "undefined"
    ) {

        console.error(
            "MAHPE: Leaflet no está cargado."
        );


        updateStatus(
            "⚠️ No se pudo cargar el motor del mapa."
        );


        return;

    }


    map =
        L.map(
            "map",
            {

                zoomControl: true,

                attributionControl: true

            }
        );


    /*
       Vista inicial general.
       La ubicación real solamente se solicita
       cuando el usuario activa su punto.
    */

    map.setView(
        [
            -12.0464,
            -77.0428
        ],
        11
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


    /*
       Permite elegir manualmente una ubicación
       cuando el formulario de vendedor está abierto.
    */

    map.on(
        "click",

        function(event) {

            if (!sellerForm) {

                return;

            }


            if (
                sellerForm.classList.contains(
                    "hidden"
                )
            ) {

                return;

            }


            userLocation = {

                lat:
                    event.latlng.lat,

                lng:
                    event.latlng.lng

            };


            showTemporaryUserMarker(
                userLocation.lat,
                userLocation.lng
            );


            drawSearchRadius();


            updateStatus(

                "📍 Punto seleccionado en el mapa.<br>" +

                "Ahora escribe qué vendes y pulsa <strong>Confirmar punto</strong>."

            );

        }

    );


    loadSavedSeller();


    setTimeout(
        function() {

            if (map) {

                map.invalidateSize();

            }

        },
        250
    );

}


/* =========================================================
   ICONO PUNTO VERDE
========================================================= */

function createGreenSellerIcon() {

    if (
        typeof L ===
        "undefined"
    ) {

        return null;

    }


    return L.divIcon({

        className:
            "coyote-div-icon",

        html:
            '<div class="green-marker"></div>',

        iconSize:
            [24, 24],

        iconAnchor:
            [12, 12],

        popupAnchor:
            [0, -14]

    });

}


/* =========================================================
   ICONO RESULTADO COYOTE
========================================================= */

function createSearchResultIcon() {

    if (
        typeof L ===
        "undefined"
    ) {

        return null;

    }


    return L.divIcon({

        className:
            "coyote-div-icon",

        html:
            '<div class="coyote-marker">●</div>',

        iconSize:
            [28, 28],

        iconAnchor:
            [14, 14],

        popupAnchor:
            [0, -16]

    });

}


/* =========================================================
   MOSTRAR POSICIÓN TEMPORAL
========================================================= */

function showTemporaryUserMarker(
    lat,
    lng
) {

    if (
        !map ||
        typeof L ===
        "undefined"
    ) {

        return;

    }


    if (userMarker) {

        try {

            map.removeLayer(
                userMarker
            );

        }

        catch (error) {

            console.warn(error);

        }

    }


    userMarker =
        L.circleMarker(

            [lat, lng],

            {

                radius: 7,

                weight: 2,

                color:
                    "#ffffff",

                fillColor:
                    "#00e86d",

                fillOpacity: 1

            }

        ).addTo(
            map
        );


    userMarker.bindPopup(
        "Ubicación seleccionada"
    );

}


/* =========================================================
   ESTADO DEL PUNTO VERDE
========================================================= */

function getSavedSellerPoint() {
    try {
        const raw = localStorage.getItem("coyote_seller_point");
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function saveSellerPoint(point) {
    try {
        localStorage.setItem("coyote_seller_point", JSON.stringify(point));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function updateSellerToggleUI(active) {
    if (!activateButton) return;
    activateButton.style.display = "";
    activateButton.disabled = false;
    activateButton.classList.toggle("is-active", Boolean(active));
    activateButton.textContent = active ? "DESACTIVAR PUNTO VERDE" : "ACTIVAR PUNTO VERDE";
}

function reactivateSavedSeller(point) {
    if (!point) return false;
    const lat = Number(point.lat);
    const lng = Number(point.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

    point.lat = lat;
    point.lng = lng;
    point.active = true;
    point.updatedAt = new Date().toISOString();
    saveSellerPoint(point);

    userLocation = { lat, lng };
    commercialPoints = commercialPoints.filter(item => item.id !== point.id);
    commercialPoints.push(point);
    showGreenPoint(point);
    drawSearchRadius();
    updateOfferMetrics(commercialPoints.length);
    if (sellerForm) sellerForm.classList.add("hidden");
    updateSellerToggleUI(true);
    updateStatus("🟢 Punto Verde activo: <strong>" + escapeHTML(point.product || "Producto") + "</strong>.");
    return true;
}

function toggleSellerPresence() {
    const saved = getSavedSellerPoint();
    if (saved && saved.active) {
        deactivateSeller();
        return;
    }
    if (saved && reactivateSavedSeller(saved)) {
        return;
    }
    activateSeller();
}


/* =========================================================
   ACTIVAR PUNTO VERDE
========================================================= */

function activateSeller() {

    if (!sellerForm) {

        return;

    }


    sellerForm.classList.remove(
        "hidden"
    );


    if (activateButton) {

        activateButton.disabled =
            true;

    }


    if (
        !navigator.geolocation
    ) {

        updateStatus(

            "⚠️ Tu navegador no permite geolocalización.<br>" +

            "Puedes hacer clic directamente sobre el mapa para seleccionar tu punto."

        );


        if (activateButton) {

            activateButton.disabled =
                false;

        }


        return;

    }


    updateStatus(
        "📍 Buscando tu ubicación..."
    );


    navigator.geolocation
        .getCurrentPosition(

            function(position) {

                userLocation = {

                    lat:
                        position
                            .coords
                            .latitude,

                    lng:
                        position
                            .coords
                            .longitude

                };


                showTemporaryUserMarker(

                    userLocation.lat,

                    userLocation.lng

                );


                drawSearchRadius();


                if (map) {

                    map.setView(

                        [
                            userLocation.lat,
                            userLocation.lng
                        ],

                        17

                    );

                }


                updateStatus(

                    "✓ Ubicación encontrada.<br>" +

                    "Escribe qué vendes y confirma tu Punto Verde."

                );


                if (activateButton) {

                    activateButton.disabled =
                        false;

                }

            },


            function(error) {

                console.warn(
                    "COYOTE geolocation:",
                    error
                );


                if (
                    error &&
                    error.code === 1
                ) {

                    updateStatus(

                        "⚠️ No se concedió acceso a tu ubicación.<br>" +

                        "Puedes seleccionar el punto manualmente tocando el mapa."

                    );

                }

                else {

                    updateStatus(

                        "⚠️ No pudimos obtener tu ubicación.<br>" +

                        "Selecciona manualmente un punto sobre el mapa."

                    );

                }


                if (activateButton) {

                    activateButton.disabled =
                        false;

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
   EVENTO ACTIVAR
========================================================= */

if (activateButton) {

    activateButton.addEventListener(

        "click",

        toggleSellerPresence

    );

}


/* =========================================================
   CONFIRMAR PUNTO VERDE
========================================================= */

function createSellerPoint() {

    if (!userLocation) {

        updateStatus(

            "⚠️ Primero permite tu ubicación o selecciona un punto en el mapa."

        );


        return;

    }


    if (!sellerProductInput) {

        return;

    }


    const product =
        sellerProductInput
            .value
            .trim();


    if (!product) {

        updateStatus(
            "⚠️ Escribe qué producto vendes."
        );


        sellerProductInput.focus();


        return;

    }


    const company =
        getCurrentCompany();


    const point = {

        id:
            generateId(
                "coyote-point"
            ),

        lat:
            Number(
                userLocation.lat
            ),

        lng:
            Number(
                userLocation.lng
            ),

        product,

        companyId:
            company
                ? company.id
                : null,

        companyName:
            company
                ? company.name
                : "Comerciante MAHPE",

        active: true,

        createdAt:
            new Date()
                .toISOString()

    };


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
            "No se pudo guardar Punto Verde:",
            error
        );

    }


    commercialPoints =
        commercialPoints.filter(

            item =>
                item.id !==
                point.id

        );


    commercialPoints.push(
        point
    );


    showGreenPoint(
        point
    );


    if (sellerForm) {

        sellerForm.classList.add(
            "hidden"
        );

    }


    updateSellerToggleUI(true);


    sellerProductInput.value =
        "";


    syncCompanyWithCoyotePoint();


    updateOfferMetrics(
        commercialPoints.length
    );


    updateStatus(

        "🟢 <strong>Punto Verde activo.</strong><br>" +

        escapeHTML(
            product
        ) +

        " ya está visible dentro de COYOTE."

    );

}


/* =========================================================
   EVENTO CONFIRMAR
========================================================= */

if (confirmSellerButton) {

    confirmSellerButton.addEventListener(

        "click",

        createSellerPoint

    );

}


/* =========================================================
   MOSTRAR PUNTO VERDE
========================================================= */

function showGreenPoint(point) {

    if (
        !map ||
        !point ||
        typeof L ===
        "undefined"
    ) {

        return;

    }


    if (sellerMarker) {

        try {

            map.removeLayer(
                sellerMarker
            );

        }

        catch (error) {

            console.warn(error);

        }

    }


    const icon =
        createGreenSellerIcon();


    const markerOptions =
        icon
            ? { icon }
            : {};


    sellerMarker =
        L.marker(

            [
                Number(point.lat),
                Number(point.lng)
            ],

            markerOptions

        ).addTo(
            map
        );


    const companyName =
        point.companyName ||
        "Comerciante MAHPE";


    sellerMarker.bindPopup(`

        <div
            style="
                min-width:170px;
                line-height:1.45;
            "
        >

            <strong>

                ${escapeHTML(
                    companyName
                )}

            </strong>

            <br>

            <span>

                ${escapeHTML(
                    point.product
                )}

            </span>

            <br><br>


            <button

                type="button"

                onclick="followSellerPoint()"

                style="
                    width:100%;
                    border:0;
                    border-radius:8px;
                    padding:9px 10px;
                    background:#00e86d;
                    color:#001b0c;
                    font-weight:900;
                    cursor:pointer;
                "

            >

                IR A ESTE PUNTO

            </button>


            <button

                type="button"

                onclick="deactivateSeller()"

                style="
                    width:100%;
                    margin-top:6px;
                    border:1px solid rgba(0,0,0,.15);
                    border-radius:8px;
                    padding:8px 10px;
                    background:white;
                    color:#333;
                    font-weight:700;
                    cursor:pointer;
                "

            >

                Desactivar

            </button>

        </div>

    `);


    map.setView(

        [
            Number(point.lat),
            Number(point.lng)
        ],

        Math.max(
            map.getZoom(),
            15
        )

    );

}


/* =========================================================
   CARGAR PUNTO GUARDADO
========================================================= */

function loadSavedSeller() {
    const point = getSavedSellerPoint();

    if (!point) {
        updateSellerToggleUI(false);
        return;
    }

    const lat = Number(point.lat);
    const lng = Number(point.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        updateSellerToggleUI(false);
        return;
    }
  point.lat = lat;
    point.lng = lng;
    userLocation = { lat, lng };

    if (!point.active) {
        commercialPoints = commercialPoints.filter(item => item.id !== point.id);
        updateOfferMetrics(commercialPoints.length);
        updateSellerToggleUI(false);
        if (sellerForm) sellerForm.classList.add("hidden");
        updateStatus("⚪ Tu Punto Verde está desactivado. Tus datos siguen guardados y puedes reactivarlo cuando quieras.");
        return;
    }

    commercialPoints = commercialPoints.filter(item => item.id !== point.id);
    commercialPoints.push(point);
    showGreenPoint(point);
    updateOfferMetrics(commercialPoints.length);
    updateSellerToggleUI(true);
    if (sellerForm) sellerForm.classList.add("hidden");
    updateStatus("🟢 Tienes un Punto Verde activo: <strong>" + escapeHTML(point.product) + "</strong>.");
}


/* =========================================================
   DESACTIVAR PUNTO VERDE
========================================================= */

function deactivateSeller() {
    stopFollowingSeller(false);

    const point = getSavedSellerPoint();

    if (point) {
        point.active = false;
        point.updatedAt = new Date().toISOString();
        saveSellerPoint(point);
    }

    if (sellerMarker && map) {
        try { map.removeLayer(sellerMarker); } catch (error) { console.warn(error); }
    }

    sellerMarker = null;

    if (point && point.id) {
        commercialPoints = commercialPoints.filter(item => item.id !== point.id);
    } else {
        commercialPoints = [];
    }

    if (sellerForm) sellerForm.classList.add("hidden");
    updateSellerToggleUI(false);
    updateOfferMetrics(commercialPoints.length);
    updateStatus("⚪ Punto Verde desactivado. Tu comercio quedó guardado y puedes reactivarlo con un clic.");
}


/* =========================================================
   RADIO DE BÚSQUEDA
========================================================= */

function drawSearchRadius() {

    if (
        !map ||
        !userLocation ||
        typeof L ===
        "undefined"
    ) {

        return;

    }


    if (radiusCircle) {

        try {

            map.removeLayer(
                radiusCircle
            );

        }

        catch (error) {

            console.warn(error);

        }

    }


    radiusCircle =
        L.circle(

            [
                userLocation.lat,
                userLocation.lng
            ],

            {

                radius:
                    selectedRadius *
                    1000,

                color:
                    "#00e86d",

                weight: 1,

                opacity: 0.32,

                fillColor:
                    "#00e86d",

                fillOpacity:
                    0.035

            }

        ).addTo(
            map
        );

}


/* =========================================================
   BOTONES DE RANGO
========================================================= */

document
    .querySelectorAll(
        ".range-button"
    )
    .forEach(button => {

        button.addEventListener(

            "click",

            function() {

                const radius =
                    Number(
                        this.dataset.radius
                    );


                if (
                    !Number.isFinite(
                        radius
                    )
                ) {

                    return;

                }


                selectedRadius =
                    radius;


                document
                    .querySelectorAll(
                        ".range-button"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                this.classList.add(
                    "active"
                );


                updateReference();


                drawSearchRadius();

            }

        );

    });


/* =========================================================
   TEXTO DE REFERENCIA
========================================================= */

function updateReference() {

    if (!referenceText) {

        return;

    }


    let description =
        "Una zona amplia alrededor de ti.";


    if (
        selectedRadius === 1
    ) {

        description =
            "Tu zona inmediata.";

    }


    else if (
        selectedRadius === 3
    ) {

        description =
            "Varios sectores cercanos.";

    }


    else if (
        selectedRadius === 10
    ) {

        description =
            "Una zona amplia alrededor de ti.";

    }


    else if (
        selectedRadius >= 20
    ) {

        description =
            "Varias zonas de tu entorno.";

    }


    referenceText.innerHTML =

        "🔎 " +

        selectedRadius +

        " km<br>" +

        escapeHTML(
            description
        );

}


/* =========================================================
   BUSCADOR DE PRODUCTOS
========================================================= */

function searchCoyoteProducts() {

    if (!searchInput) {

        return;

    }


    const query =
        searchInput
            .value
            .trim()
            .toLowerCase();


    if (!query) {

        updateStatus(

            "🔎 Escribe el producto que buscas."

        );


        return;

    }


    /*
       En esta versión local, COYOTE consulta
       los puntos almacenados en el navegador.

       Cuando conectemos Supabase, esta misma
       función podrá consultar puntos reales
       de múltiples usuarios.
    */


    const matches =
        commercialPoints
            .map(point => {

                let distance = null;


                if (userLocation) {

                    distance =
                        calculateDistanceKm(

                            userLocation.lat,

                            userLocation.lng,

                            Number(point.lat),

                            Number(point.lng)

                        );

                }


                return {

                    ...point,

                    distance

                };

            })
            .filter(point => {

                const product =
                    String(
                        point.product || ""
                    )
                    .toLowerCase();


                const productMatches =
                    product.includes(
                        query
                    );


                const radiusMatches =
                    point.distance === null ||
                    point.distance <=
                        selectedRadius;


                return (
                    productMatches &&
                    radiusMatches
                );

            });


    clearSearchMarkers();


    updateOfferMetrics(
        matches.length
    );


    if (
        matches.length === 0
    ) {

        updateStatus(

            "🔎 No encontramos <strong>" +

            escapeHTML(
                query
            ) +

            "</strong> dentro del radio seleccionado."

        );


        return;

    }


    matches.forEach(
        renderSearchResult
    );


    fitSearchResults(
        matches
    );


    updateStatus(

        "✓ COYOTE encontró <strong>" +

        matches.length +

        "</strong> " +

        (
            matches.length === 1
                ? "resultado"
                : "resultados"
        ) +

        " para <strong>" +

        escapeHTML(
            query
        ) +

        "</strong>."

    );

}


/* =========================================================
   EVENTO BUSCAR
========================================================= */

if (searchButton) {

    searchButton.addEventListener(

        "click",

        searchCoyoteProducts

    );

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


                searchCoyoteProducts();

            }

        }

    );

}


/* =========================================================
   RENDER RESULTADO DE BÚSQUEDA
========================================================= */

function renderSearchResult(point) {

    if (
        !map ||
        typeof L ===
        "undefined"
    ) {

        return;

    }


    const icon =
        createSearchResultIcon();


    const options =
        icon
            ? { icon }
            : {};


    const marker =
        L.marker(

            [
                Number(point.lat),
                Number(point.lng)
            ],

            options

        ).addTo(
            map
        );


    let distanceText =
        "Distancia no disponible";


    if (
        point.distance !== null &&
        Number.isFinite(
            point.distance
        )
    ) {

        if (
            point.distance < 1
        ) {

            distanceText =
                Math.round(
                    point.distance *
                    1000
                ) +
                " m";

        }

        else {

            distanceText =
                point.distance
                    .toFixed(2) +
                " km";

        }

    }


    marker.bindPopup(`

        <strong>

            ${escapeHTML(
                point.companyName ||
                "Comerciante"
            )}

        </strong>

        <br>

        ${escapeHTML(
            point.product
        )}

        <br>

        <small>

            ${escapeHTML(
                distanceText
            )}

        </small>

        <br><br>


        <button

            type="button"

            onclick="startFollowingSeller(
                ${Number(point.lat)},
                ${Number(point.lng)}
            )"

            style="
                border:0;
                border-radius:8px;
                padding:8px 10px;
                background:#00e86d;
                color:#001b0c;
                font-weight:900;
                cursor:pointer;
            "

        >

            IR A ESTE PUNTO

        </button>

    `);


    searchMarkers.push(
        marker
    );

}


/* =========================================================
   LIMPIAR RESULTADOS
========================================================= */

function clearSearchMarkers() {

    if (!map) {

        searchMarkers = [];

        return;

    }


    searchMarkers.forEach(marker => {

        try {

            if (
                map.hasLayer(
                    marker
                )
            ) {

                map.removeLayer(
                    marker
                );

            }

        }

        catch (error) {

            console.warn(error);

        }

    });


    searchMarkers = [];

}


/* =========================================================
   ENCUADRAR RESULTADOS
========================================================= */

function fitSearchResults(
    matches
) {

    if (
        !map ||
        !matches.length ||
        typeof L ===
        "undefined"
    ) {

        return;

    }


    const positions =
        matches.map(point => [

            Number(point.lat),

            Number(point.lng)

        ]);


    if (userLocation) {

        positions.push([

            Number(
                userLocation.lat
            ),

            Number(
                userLocation.lng
            )

        ]);

    }


    if (
        positions.length === 1
    ) {

        map.setView(
            positions[0],
            16
        );


        return;

    }


    const bounds =
        L.latLngBounds(
            positions
        );


    map.fitBounds(

        bounds,

        {

            padding:
                [60, 60],

            maxZoom: 16

        }

    );

}


/* =========================================================
   MÉTRICAS DEL PANEL
========================================================= */

function updateOfferMetrics(
    matches
) {

    const count =
        Math.max(
            0,
            Number(matches) || 0
        );


    if (offerText) {

        offerText.textContent =
            count === 1

                ? "1 punto"

                : count +
                  " puntos";

    }


    /*
       Por ahora representa intensidad
       de actividad dentro del prototipo.
    */

    const intensity =
        count === 0

            ? 0

            : Math.min(
                100,
                20 +
                count * 30
            );


    if (demandBar) {

        demandBar.style.width =
            intensity +
            "%";

    }


    if (demandText) {

        if (
            count === 0
        ) {

            demandText.textContent =
                "Sin actividad detectada";

        }


        else if (
            intensity < 50
        ) {

            demandText.textContent =
                "Actividad inicial";

        }


        else if (
            intensity < 80
        ) {

            demandText.textContent =
                "Actividad media";

        }


        else {

            demandText.textContent =
                "Actividad alta";

        }

    }

}


/* =========================================================
   SEGUIR EL PUNTO VERDE GUARDADO
========================================================= */

function followSellerPoint() {

    let saved = null;


    try {

        saved =
            localStorage.getItem(
                "coyote_seller_point"
            );

    }

    catch (error) {

        console.error(error);

    }


    if (!saved) {

        updateStatus(

            "⚠️ No existe un Punto Verde activo."

        );


        return;

    }


    try {

        const point =
            JSON.parse(saved);


        if (
            !point ||
            !point.active
        ) {

            updateStatus(

                "⚠️ El Punto Verde ya no está activo."

            );


            return;

        }


        startFollowingSeller(

            Number(point.lat),

            Number(point.lng),

            point

        );

    }

    catch (error) {

        console.error(error);


        updateStatus(

            "⚠️ No se pudo abrir el punto."

        );

    }

}


/* =========================================================
   INICIAR SEGUIMIENTO
========================================================= */

function startFollowingSeller(
    sellerLat,
    sellerLng,
    sellerPoint = null
) {

    sellerLat =
        Number(
            sellerLat
        );


    sellerLng =
        Number(
            sellerLng
        );


    if (
        !Number.isFinite(
            sellerLat
        ) ||
        !Number.isFinite(
            sellerLng
        )
    ) {

        updateStatus(

            "⚠️ La ubicación comercial no es válida."

        );


        return;

    }


    if (
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
        sellerPoint || {

            lat:
                sellerLat,

            lng:
                sellerLng

        };


    updateStatus(

        "🧭 Iniciando seguimiento hacia el punto..."

    );


    followWatchId =
        navigator.geolocation
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


                    userLocation = {

                        lat:
                            buyerLat,

                        lng:
                            buyerLng

                    };


                    updateFollowMap(

                        buyerLat,

                        buyerLng,

                        sellerLat,

                        sellerLng

                    );

                },


                function(error) {

                    console.error(
                        "Seguimiento COYOTE:",
                        error
                    );


                    stopFollowingSeller(
                        false
                    );


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
   ACTUALIZAR MAPA DE SEGUIMIENTO
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

            console.warn(error);

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
   DETENER SEGUIMIENTO
========================================================= */

function stopFollowingSeller(
    showMessage = true
) {

    if (
        followWatchId !== null &&
        navigator.geolocation
    ) {

        navigator
            .geolocation
            .clearWatch(
                followWatchId
            );


        followWatchId = null;

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

            console.warn(error);

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

            console.warn(error);

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
   DISTANCIA HAVERSINE
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
   SINCRONIZAR COYOTE CON EMPRESA
========================================================= */

function syncCompanyWithCoyotePoint() {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


    let saved = null;


    try {

        saved =
            localStorage.getItem(
                "coyote_seller_point"
            );

    }

    catch (error) {

        console.error(error);

    }


    if (!saved) {

        return;

    }


    try {

        const point =
            JSON.parse(saved);


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


        saveMahpeState();


        renderCompanyDashboard();

    }

    catch (error) {

        console.error(
            "No se pudo sincronizar COYOTE:",
            error
        );

    }

}


/* =========================================================
   STATUS COYOTE
========================================================= */

function updateStatus(message) {

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
   REFRESCAR MAPA
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
   RESIZE
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
   LIMPIEZA AL CERRAR
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
   COMPATIBILIDAD DE FUNCIONES DE POPUP
========================================================= */

/*
   Las exponemos explícitamente porque los botones
   dentro de los popups Leaflet usan onclick.
*/

window.followSellerPoint =
    followSellerPoint;


window.startFollowingSeller =
    startFollowingSeller;


window.deactivateSeller =
    deactivateSeller;

window.toggleSellerPresence =
    toggleSellerPresence;


window.executeBusinessDecision =
    executeBusinessDecision;


window.openView =
    openView;


window.publishCompanyPost =
    publishCompanyPost;


/* =========================================================
   COMPROBACIÓN BÁSICA
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
   ARRANQUE
========================================================= */

function initializeMahpe() {

    console.log(
        "MAHPE: iniciando..."
    );


    validateMahpeDOM();


    /*
       Actualiza empresas antiguas almacenadas
       antes de la incorporación del Business Engine.
    */

    migrateMahpeBusinessState();


    /*
       Prepara el texto inicial del radio.
    */

    updateReference();


    /*
       Inicializa Leaflet una sola vez.
    */

    initializeMap();


    /*
       Render principal.
    */

    initializeFeedTabs();

    renderFeed();


    renderCompanyDashboard();


    updateGlobalUI();


    /*
       MAHPE siempre abre inicialmente
       en el Feed.
    */

    openView(
        "feedView"
    );


    console.log(
        "MAHPE: listo."
    );

}


/* =========================================================
   EJECUCIÓN SEGURA
========================================================= */

/*
   El script está colocado al final del BODY en nuestro
   index.html, por lo que normalmente el DOM ya existe.

   Aun así dejamos esta comprobación para evitar problemas
   si después movemos script.js al HEAD.
*/

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
   FIN MAHPE v1.1
   FIN SCRIPT.JS
========================================================= */        
