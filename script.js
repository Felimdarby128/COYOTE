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

    decisionHistory: []

};


let mahpeState =
    loadMahpeState();


let currentCompanyId =
    mahpeState.companies.length
        ? mahpeState.companies[0].id
        : null;


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

        if (!parsed.interactions) {
            parsed.interactions = {};
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


function getPostCompany(post) {

    if (post.demo) {

        return demoCompany;

    }


    return (
        mahpeState.companies.find(
            company =>
                company.id ===
                post.companyId
        ) || null
    );

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


    getAllPosts()
        .forEach(post => {

            const company =
                getPostCompany(post);


            if (!company) {

                return;

            }


            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "post";


            const interactionKey =
                post.id +
                "-interaction";


            const interestKey =
                post.id +
                "-interest";


            const commitmentKey =
                post.id +
                "-commitment";


            article.innerHTML = `

                <div class="post-header">

                    <div class="company-avatar">

                        ${escapeHTML(
                            company.name
                                .charAt(0)
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

                            <span>
                                👁
                            </span>

                            <strong>
                                ${post.views || 0}
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
                        >

                            <span>
                                ♡
                            </span>

                            <strong>
                                ${post.interactions || 0}
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
                        >

                            <span>
                                🔥
                            </span>

                            <strong>
                                ${post.interested || 0}
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
                        >

                            <span>
                                💰
                            </span>

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
   INTERACCIONES DEL FEED
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

                    const companyId =
                        this.dataset.company;


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

                        const company =
                            mahpeState
                                .companies
                                .find(
                                    item =>
                                        item.id ===
                                        companyId
                                );


                        if (company) {

                            company.followers += 1;

                            company.value += 4;

                        }


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
                item.id ===
                postId
        );


    /*
        Si el post pertenece a SURANO demo,
        la interacción se registra pero no
        altera una empresa real del usuario.
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


    migrateCompanyBusinessData(
        company
    );


    if (
        signal ===
        "interaction"
    ) {

        post.interactions += 1;

        company.interactions += 1;

        company.activity =
            clamp(
                company.activity + 1
            );

        company.value += 5;

    }


    if (
        signal ===
        "interest"
    ) {

        post.interested += 1;

        company.interested += 1;

        company.marketResponse =
            clamp(
                company.marketResponse + 2
            );

        company.productValidation =
            clamp(
                company.productValidation + 1
            );

        company.value += 20;

    }


    if (
        signal ===
        "commitment"
    ) {

        post.committed += 1;

        company.committed += 1;

        company.marketResponse =
            clamp(
                company.marketResponse + 4
            );

        company.productValidation =
            clamp(
                company.productValidation + 3
            );

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
   FIN DE PARTE 1/2
   NO CIERRES EL ARCHIVO.
   LA PARTE 2 EMPIEZA CON LOS ESTILOS DEL BUSINESS ENGINE
   Y CONTINÚA CON TODO EL MAPA COYOTE.
========================================================= */
/* =========================================================
   ESTILOS COYOTE BUSINESS ENGINE
========================================================= */

function injectCoyoteBusinessStyles() {

    if (
        document.getElementById(
            "coyoteBusinessStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "coyoteBusinessStyles";


    style.textContent = `

        .coyote-business-engine {

            margin-top: 18px;

            padding: 22px;

            border:
                1px solid
                rgba(255,255,255,.08);

            border-radius: 22px;

            background:
                #111315;

        }


        .coyote-engine-heading {

            display: flex;

            justify-content:
                space-between;

            gap: 18px;

            align-items:
                flex-start;

        }


        .coyote-engine-heading h2 {

            margin:
                7px 0 5px;

        }


        .coyote-score {

            min-width: 94px;

            padding: 13px;

            text-align:
                center;

            border:
                1px solid
                rgba(0,233,101,.25);

            border-radius:
                16px;

            background:
                rgba(0,233,101,.07);

        }


        .coyote-score strong {

            font-size:
                27px;

            color:
                #00e965;

        }


        .coyote-score small {

            color:
                #6f7772;

        }


        .coyote-score span {

            display:
                block;

            margin-top:
                4px;

            font-size:
                7px;

            font-weight:
                900;

            letter-spacing:
                1px;

            color:
                #00e965;

        }


        .coyote-business-metrics {

            display:
                grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap:
                9px;

            margin-top:
                18px;

        }


        .coyote-business-metric {

            padding:
                11px;

            border:
                1px solid
                rgba(255,255,255,.06);

            border-radius:
                12px;

            background:
                #181a1d;

        }


        .coyote-business-metric
        > div:first-child {

            display:
                flex;

            justify-content:
                space-between;

            gap:
                8px;

            font-size:
                9px;

            color:
                #8a9094;

        }


        .coyote-business-metric strong {

            color:
                white;

        }


        .coyote-business-bar {

            height:
                5px;

            margin-top:
                8px;

            overflow:
                hidden;

            border-radius:
                20px;

            background:
                #292d30;

        }


        .coyote-business-bar div {

            height:
                100%;

            border-radius:
                20px;

            background:
                #00e965;

        }


        .coyote-risk-line {

            display:
                flex;

            justify-content:
                space-between;

            margin:
                11px 0 17px;

            padding:
                10px 12px;

            border-radius:
                11px;

            background:
                rgba(255,255,255,.035);

            color:
                #8b9094;

            font-size:
                10px;

        }


        .coyote-risk-line strong {

            color:
                #f2f2f2;

        }


        .coyote-decision-grid {

            display:
                grid;

            grid-template-columns:
                repeat(2, 1fr);

            gap:
                9px;

        }


        .coyote-decision-button {

            display:
                flex;

            align-items:
                center;

            gap:
                10px;

            min-height:
                76px;

            padding:
                11px;

            border:
                1px solid
                rgba(255,255,255,.07);

            border-radius:
                14px;

            background:
                #181a1d;

            color:
                white;

            text-align:
                left;

            cursor:
                pointer;

            transition:
                .18s ease;

        }


        .coyote-decision-button:hover {

            border-color:
                rgba(0,233,101,.4);

            background:
                rgba(0,233,101,.06);

            transform:
                translateY(-1px);

        }


        .coyote-decision-icon {

            font-size:
                20px;

        }


        .coyote-decision-copy {

            flex:
                1;

        }


        .coyote-decision-copy strong,
        .coyote-decision-copy small {

            display:
                block;

        }


        .coyote-decision-copy strong {

            font-size:
                10px;

        }


        .coyote-decision-copy small {

            margin-top:
                4px;

            color:
                #777d82;

            font-size:
                8px;

            line-height:
                1.35;

        }


        .coyote-decision-cost {

            white-space:
                nowrap;

            color:
                #00e965;

            font-size:
                9px;

            font-weight:
                900;

        }


        .coyote-business-result {

            display:
                none;

            margin-top:
                13px;

            padding:
                12px;

            border-radius:
                12px;

            font-size:
                10px;

            line-height:
                1.5;

        }


        .coyote-business-result.success {

            display:
                block;

            border:
                1px solid
                rgba(0,233,101,.2);

            background:
                rgba(0,233,101,.07);

            color:
                #bdf8d1;

        }


        .coyote-business-result.warning {

            display:
                block;

            border:
                1px solid
                rgba(255,190,60,.25);

            background:
                rgba(255,190,60,.08);

            color:
                #ffd68b;

        }


        .coyote-history {

            margin-top:
                20px;

            padding-top:
                15px;

            border-top:
                1px solid
                rgba(255,255,255,.07);

        }


        .coyote-history h3 {

            margin:
                0 0 10px;

            font-size:
                12px;

        }


        .coyote-history-item {

            display:
                flex;

            justify-content:
                space-between;

            gap:
                10px;

            padding:
                9px 0;

            border-bottom:
                1px solid
                rgba(255,255,255,.05);

        }


        .coyote-history-item strong,
        .coyote-history-item small {

            display:
                block;

        }


        .coyote-history-item strong {

            font-size:
                9px;

        }


        .coyote-history-item small {

            margin-top:
                3px;

            color:
                #6f7478;

            font-size:
                7px;

        }


        .coyote-history-item > span {

            color:
                #00e965;

            font-size:
                10px;

            font-weight:
                900;

        }


        .coyote-history-empty {

            color:
                #686e72;

            font-size:
                9px;

        }


        @media (
            max-width: 600px
        ) {

            .coyote-engine-heading {

                flex-direction:
                    column;

            }


            .coyote-score {

                width:
                    100%;

            }


            .coyote-decision-grid {

                grid-template-columns:
                    1fr;

            }


            .coyote-business-metrics {

                grid-template-columns:
                    1fr;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   COYOTE — MAPA
========================================================= */

let map;

let userLocation =
    null;

let userMarker =
    null;

let selectedRadius =
    10;

let followWatchId =
    null;

let followUserMarker =
    null;

let followLine =
    null;

let followedSellerPoint =
    null;


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

        console.error(
            "No existe #map."
        );

        return;

    }


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

            maxZoom:
                19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }

    )
    .addTo(
        map
    );


    loadSavedSeller();

}


/* =========================================================
   ACTIVAR PUNTO VERDE
========================================================= */

const activateButton =
    document.getElementById(
        "activateButton"
    );


if (activateButton) {

    activateButton
        .addEventListener(
            "click",
            activateSeller
        );

}


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
                    position
                        .coords
                        .latitude;


                const lng =
                    position
                        .coords
                        .longitude;


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


                const sellerForm =
                    document
                        .getElementById(
                            "sellerForm"
                        );


                if (sellerForm) {

                    sellerForm
                        .classList
                        .remove(
                            "hidden"
                        );

                }


                if (activateButton) {

                    activateButton
                        .classList
                        .add(
                            "hidden"
                        );

                }


                updateStatus(

                    "📍 Ubicación encontrada. " +
                    "Ahora indica qué vendes."

                );

            },


            function(error) {

                if (
                    error.code ===
                    1
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

const confirmSellerButton =
    document.getElementById(
        "confirmSellerButton"
    );


if (confirmSellerButton) {

    confirmSellerButton
        .addEventListener(
            "click",
            createSellerPoint
        );

}


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


    if (!input) {

        return;

    }


    const product =
        input
            .value
            .trim();


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


    const sellerForm =
        document.getElementById(
            "sellerForm"
        );


    if (sellerForm) {

        sellerForm
            .classList
            .add(
                "hidden"
            );

    }


    updateStatus(

        "🟢 <strong>Punto activo.</strong><br>" +

        escapeHTML(
            product
        )

    );

}


/* =========================================================
   MOSTRAR PUNTO VERDE
========================================================= */

function showGreenPoint(
    point
) {

    if (!map) {

        return;

    }


    if (userMarker) {

        map.removeLayer(
            userMarker
        );

    }


    const greenIcon =
        L.divIcon({

            className:
                "",

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
        .addTo(
            map
        );


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
            "Error cargando Punto Verde:",
            error
        );

    }

}


/* =========================================================
   DESACTIVAR PUNTO
========================================================= */

function deactivateSeller() {

    stopFollowingSeller(
        false
    );


    localStorage.removeItem(
        "coyote_seller_point"
    );


    if (
        userMarker &&
        map
    ) {

        map.removeLayer(
            userMarker
        );


        userMarker =
            null;

    }


    if (activateButton) {

        activateButton
            .classList
            .remove(
                "hidden"
            );

    }


    updateStatus(
        "⚪ Punto desactivado."
    );

}


/* =========================================================
   RADIO DE BÚSQUEDA
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

                rangeButtons
                    .forEach(
                        item => {

                            item
                                .classList
                                .remove(
                                    "active"
                                );

                        }
                    );


                this
                    .classList
                    .add(
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


function updateReference() {

    let text =
        "Una zona amplia alrededor de ti.";


    if (
        selectedRadius ===
        1
    ) {

        text =
            "Tu zona inmediata.";

    }


    if (
        selectedRadius ===
        3
    ) {

        text =
            "Varios sectores cercanos.";

    }


    if (
        selectedRadius ===
        10
    ) {

        text =
            "Una zona amplia alrededor de ti.";

    }


    if (
        selectedRadius ===
        20
    ) {

        text =
            "Varias zonas de tu entorno.";

    }


    const reference =
        document.getElementById(
            "referenceText"
        );


    if (reference) {

        reference.innerHTML =

            "🔎 " +

            selectedRadius +

            " km<br>" +

            text;

    }

}


/* =========================================================
   BUSCAR PRODUCTOS
========================================================= */

const searchButton =
    document.getElementById(
        "searchButton"
    );


if (searchButton) {

    searchButton
        .addEventListener(
            "click",
            searchProducts
        );

}


function searchProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {

        return;

    }


    const search =
        searchInput
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

                point.product &&

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


    const offerText =
        document.getElementById(
            "offerText"
        );


    if (offerText) {

        offerText.textContent =

            matches.length +

            " punto(s)";

    }


    const intensity =
        Math.min(

            100,

            20 +

            matches.length *
            30

        );


    const demandBar =
        document.getElementById(
            "demandBar"
        );


    if (demandBar) {

        demandBar.style.width =

            intensity +

            "%";

    }


    const demandText =
        document.getElementById(
            "demandText"
        );


    if (demandText) {

        demandText.textContent =

            matches.length

                ? "Actividad detectada"

                : "Actividad inicial";

    }


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

    catch (error) {

        console.error(
            error
        );

        return;

    }


    if (
        !navigator.geolocation
    ) {

        updateStatus(
            "❌ Tu navegador no permite seguimiento."
        );

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

                                    radius:
                                        7,

                                    weight:
                                        3

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


                    if (
                        !followLine
                    ) {

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

                                    weight:
                                        4,

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


                function(error) {

                    console.error(
                        error
                    );


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

        map &&

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

        map &&

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

function updateStatus(
    message
) {

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
   CONECTAR EMPRESA CON COYOTE
========================================================= */

function syncCompanyWithCoyotePoint() {

    const company =
        getCurrentCompany();


    if (!company) {

        return;

    }


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


            saveMahpeState();

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================================
   ACTUALIZAR REFERENCIA INICIAL
========================================================= */

updateReference();


/* =========================================================
   ARRANQUE MAHPE v1.1
========================================================= */

migrateMahpeBusinessState();


injectCoyoteBusinessStyles();


initializeMap();


renderFeed();


renderCompanyDashboard();


updateGlobalUI();


openView(
    "feedView"
);


console.log(
    "MAHPE v1.1 iniciado."
);


console.log(
    "COYOTE activo como motor territorial + empresarial."
);


/* =========================================================
   FIN MAHPE v1.1
========================================================= */
/* ============================================================
   MAHPE
   SCRIPT.JS DEFINITIVO

   PARTE 2 DE 2

   PEGAR INMEDIATAMENTE DEBAJO DE LA PARTE 1

   - Dashboard de empresa
   - Publicador
   - Business Engine
   - COYOTE
   - Leaflet
   - Punto Verde
   - Buscador
   - Distancias
   - Seguimiento
   - Arranque final
============================================================ */


/* ============================================================
   31. DASHBOARD DE EMPRESA
============================================================ */

function renderCompanyDashboard() {

    const container =
        document.getElementById(
            "companyDashboard"
        );

    if (!container) {
        return;
    }


    if (!mahpeState.companies.length) {

        container.innerHTML = `
            <section class="empty-state">

                <strong>
                    Todavía no tienes una empresa
                </strong>

                <p>
                    Crea tu primera empresa para
                    empezar a probar productos,
                    mercado, diseño y ubicación.
                </p>

                <button
                    id="emptyCreateCompanyButton"
                    class="primary-button"
                    type="button"
                    style="
                        margin-top:16px;
                        max-width:260px;
                    "
                >
                    CREAR EMPRESA
                </button>

            </section>
        `;


        const createButton =
            document.getElementById(
                "emptyCreateCompanyButton"
            );


        if (createButton) {

            createButton.addEventListener(
                "click",
                function () {

                    openView(
                        "createView"
                    );

                }
            );

        }


        return;

    }


    let company =
        getCurrentCompany();


    if (!company) {

        currentCompanyId =
            mahpeState
                .companies[0]
                .id;


        company =
            getCurrentCompany();

    }


    if (!company) {
        return;
    }


    migrateCompanyBusinessData(
        company
    );


    recalculateCompanyStage(
        company
    );


    const score =
        calculateBusinessScore(
            company
        );


    const scoreInfo =
        getBusinessScoreLabel(
            score
        );


    const companyOptions =
        mahpeState
            .companies
            .map(
                item => `
                    <option
                        value="${escapeHTML(
                            item.id
                        )}"
                        ${
                            item.id ===
                            company.id
                                ? "selected"
                                : ""
                        }
                    >
                        ${escapeHTML(
                            item.name
                        )}
                    </option>
                `
            )
            .join("");


    container.innerHTML = `

        <section
            style="
                margin-top:18px;
            "
        >

            <label
                for="companySelector"
                style="
                    margin-top:0;
                "
            >
                EMPRESA ACTIVA
            </label>

            <select id="companySelector">
                ${companyOptions}
            </select>

        </section>


        <section class="company-hero">

            <div class="company-hero-top">

                <div class="company-big-avatar">
                    ${escapeHTML(
                        getInitials(
                            company.name
                        )
                    )}
                </div>


                <div
                    style="
                        min-width:0;
                        flex:1;
                    "
                >

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


                    <div
                        style="
                            margin-top:6px;
                            color:#727b76;
                            font-size:8px;
                        "
                    >
                        ${escapeHTML(
                            company.category
                        )}
                    </div>

                </div>


                <div
                    style="
                        flex-shrink:0;
                        text-align:right;
                    "
                >

                    <strong
                        style="
                            display:block;
                            color:#00e86d;
                            font-size:23px;
                        "
                    >
                        ${score}
                    </strong>

                    <small
                        style="
                            color:#727b76;
                            font-size:7px;
                        "
                    >
                        SCORE
                    </small>

                </div>

            </div>


            <p class="company-description">
                ${escapeHTML(
                    company.description
                )}
            </p>


            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:6px;
                    margin-top:12px;
                "
            >

                <span class="badge green">
                    ${escapeHTML(
                        scoreInfo.label
                    )}
                </span>

                <span class="badge">
                    ${escapeHTML(
                        company.product
                    )}
                </span>

                <span class="badge">
                    ${formatMoney(
                        company.price
                    )}
                </span>

            </div>

        </section>


        <section class="stats-grid">

            <div class="stat-card">

                <span>◈</span>

                <strong>
                    ${formatNumber(
                        company.value
                    )}
                </strong>

                <small>
                    Valor virtual
                </small>

            </div>


            <div class="stat-card">

                <span>💼</span>

                <strong>
                    ${formatNumber(
                        company.capital
                    )}
                </strong>

                <small>
                    Capital
                </small>

            </div>


            <div class="stat-card">

                <span>♡</span>

                <strong>
                    ${formatNumber(
                        company.interactions
                    )}
                </strong>

                <small>
                    Interacciones
                </small>

            </div>


            <div class="stat-card">

                <span>🔥</span>

                <strong>
                    ${formatNumber(
                        company.interested
                    )}
                </strong>

                <small>
                    Interesados
                </small>

            </div>


            <div class="stat-card">

                <span>💰</span>

                <strong>
                    ${formatNumber(
                        company.committed
                    )}
                </strong>

                <small>
                    Comprometidos
                </small>

            </div>


            <div class="stat-card">

                <span>👥</span>

                <strong>
                    ${formatNumber(
                        company.followers
                    )}
                </strong>

                <small>
                    Seguidores
                </small>

            </div>

        </section>


        <section class="publisher">

            <span class="eyebrow">
                PUBLICAR
            </span>

            <h3>
                Prueba una idea en el mercado
            </h3>

            <p>
                Publica un producto, concepto o
                propuesta para recibir señales.
            </p>


            <label for="companyPostTitle">
                Título
            </label>

            <input
                id="companyPostTitle"
                type="text"
                autocomplete="off"
                placeholder="Ej. Nueva colección"
            >


            <label for="companyPostText">
                Publicación
            </label>

            <textarea
                id="companyPostText"
                placeholder="Cuenta qué estás probando..."
            ></textarea>


            <button
                id="publishCompanyPostButton"
                class="primary-button"
                type="button"
                style="
                    margin-top:12px;
                "
            >
                PUBLICAR EN MAHPE
            </button>


            <div
                id="publisherStatus"
                class="form-message"
            ></div>

        </section>


        ${renderBusinessEngine(
            company
        )}


        <section
            class="info-card"
            style="
                margin-bottom:25px;
            "
        >

            <span class="eyebrow">
                EMPRESA
            </span>

            <h2>
                ${escapeHTML(
                    company.product
                )}
            </h2>

            <p>
                Público:
                ${escapeHTML(
                    company.audience
                )}
            </p>

            <p>
                Precio estimado:
                ${formatMoney(
                    company.price
                )}
            </p>


            <button
                id="openCompanyMapButton"
                class="secondary-button"
                type="button"
                style="
                    margin-top:8px;
                "
            >
                📍 ABRIR EN COYOTE
            </button>


            <button
                id="deleteCompanyButton"
                class="secondary-button"
                type="button"
                style="
                    margin-top:8px;
                    color:#ff6478;
                "
            >
                ELIMINAR EMPRESA
            </button>

        </section>

    `;


    bindCompanyDashboardEvents();

}


/* ============================================================
   32. EVENTOS DEL DASHBOARD
============================================================ */

function bindCompanyDashboardEvents() {

    const selector =
        document.getElementById(
            "companySelector"
        );


    if (selector) {

        selector.addEventListener(
            "change",
            function () {

                selectCompany(
                    this.value
                );

            }
        );

    }


    const publishButton =
        document.getElementById(
            "publishCompanyPostButton"
        );


    if (publishButton) {

        publishButton.addEventListener(
            "click",
            function () {

                const title =
                    document.getElementById(
                        "companyPostTitle"
                    );


                const text =
                    document.getElementById(
                        "companyPostText"
                    );


                const status =
                    document.getElementById(
                        "publisherStatus"
                    );


                const company =
                    getCurrentCompany();


                if (
                    !company ||
                    !title ||
                    !text
                ) {
                    return;
                }


                if (
                    !title.value.trim() ||
                    !text.value.trim()
                ) {

                    if (status) {

                        status.textContent =
                            "⚠️ Completa el título y la publicación.";

                    }

                    return;

                }


                const success =
                    createCompanyPost(

                        company.id,

                        title.value,

                        text.value

                    );


                if (success) {

                    title.value = "";
                    text.value = "";


                    if (status) {

                        status.textContent =
                            "✓ Publicación enviada al mercado.";

                    }


                    renderCompanyDashboard();

                }

            }
        );

    }


    document
        .querySelectorAll(
            "[data-business-decision]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        executeBusinessDecision(
                            this.dataset
                                .businessDecision
                        );

                    }
                );

            }
        );


    const mapButton =
        document.getElementById(
            "openCompanyMapButton"
        );


    if (mapButton) {

        mapButton.addEventListener(
            "click",
            function () {

                openView(
                    "mapView"
                );


                setTimeout(
                    () => {

                        const company =
                            getCurrentCompany();


                        if (company) {

                            updateStatus(
                                "📍 COYOTE listo para analizar a " +
                                escapeHTML(
                                    company.name
                                ) +
                                "."
                            );

                        }

                    },
                    200
                );

            }
        );

    }


    const deleteButton =
        document.getElementById(
            "deleteCompanyButton"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                const company =
                    getCurrentCompany();


                if (!company) {
                    return;
                }


                const confirmed =
                    window.confirm(
                        "¿Eliminar " +
                        company.name +
                        "? Sus publicaciones también serán eliminadas."
                    );


                if (confirmed) {

                    deleteCompany(
                        company.id
                    );

                }

            }
        );

    }

}


/* ============================================================
   33. VARIABLES COYOTE
============================================================ */

let map = null;

let userLocation = null;

let userMarker = null;

let radiusCircle = null;

let selectedRadius = 10;

let sellerMarker = null;

let searchMarkers = [];

let commercialPoints = [];

let followWatchId = null;

let followUserMarker = null;

let followLine = null;


/* ============================================================
   34. ELEMENTOS COYOTE
============================================================ */

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


/* ============================================================
   35. ICONOS LEAFLET
============================================================ */

function createGreenIcon() {

    if (
        typeof L ===
        "undefined"
    ) {
        return null;
    }


    return L.divIcon({

        className: "",

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


function createCoyoteIcon() {

    if (
        typeof L ===
        "undefined"
    ) {
        return null;
    }


    return L.divIcon({

        className: "",

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


/* ============================================================
   36. INICIALIZAR MAPA
============================================================ */

function initializeMap() {

    if (
        typeof L ===
        "undefined"
    ) {

        console.error(
            "Leaflet no está disponible."
        );

        return;

    }


    const mapElement =
        document.getElementById(
            "map"
        );


    if (!mapElement) {
        return;
    }


    if (map) {

        setTimeout(
            () => {
                map.invalidateSize();
            },
            100
        );

        return;

    }


    /*
       Vista inicial general de Lima.
       No se interpreta como ubicación
       exacta del usuario.
    */

    map =
        L.map(
            "map",
            {
                zoomControl: true
            }
        );


    map.setView(
        [-12.0464, -77.0428],
        11
    );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom:
                19,

            attribution:
                "&copy; OpenStreetMap"

        }
    ).addTo(
        map
    );


    map.on(
        "click",
        function (event) {

            if (
                sellerForm &&
                !sellerForm.classList.contains(
                    "hidden"
                )
            ) {

                userLocation = {
                    lat:
                        event.latlng.lat,

                    lng:
                        event.latlng.lng
                };


                updateStatus(
                    "📍 Punto seleccionado. Escribe qué vendes y confirma."
                );

            }

        }
    );


    restoreSellerPoint();


    setTimeout(
        () => {
            map.invalidateSize();
        },
        250
    );

}


/* ============================================================
   37. OBTENER UBICACIÓN CON CONSENTIMIENTO
============================================================ */

function requestUserLocation(
    callback
) {

    if (
        !navigator.geolocation
    ) {

        updateStatus(
            "⚠️ Tu navegador no permite geolocalización."
        );

        if (callback) {
            callback(null);
        }

        return;

    }


    updateStatus(
        "📡 Solicitando tu ubicación..."
    );


    navigator.geolocation
        .getCurrentPosition(

            function (position) {

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


                if (
                    map &&
                    typeof L !==
                        "undefined"
                ) {

                    if (userMarker) {

                        map.removeLayer(
                            userMarker
                        );

                    }


                    userMarker =
                        L.circleMarker(

                            [
                                userLocation.lat,
                                userLocation.lng
                            ],

                            {

                                radius:
                                    7,

                                weight:
                                    2,

                                color:
                                    "#ffffff",

                                fillColor:
                                    "#00e86d",

                                fillOpacity:
                                    1

                            }

                        ).addTo(
                            map
                        );


                    userMarker
                        .bindPopup(
                            "Tu posición actual"
                        );


                    map.setView(
                        [
                            userLocation.lat,
                            userLocation.lng
                        ],
                        15
                    );


                    drawRadius();

                }


                updateStatus(
                    "✓ Ubicación obtenida."
                );


                if (callback) {

                    callback(
                        userLocation
                    );

                }

            },


            function (error) {

                console.warn(
                    "Geolocalización:",
                    error
                );


                updateStatus(
                    "⚠️ No se pudo obtener tu ubicación. Puedes seleccionar un punto manualmente en el mapa."
                );


                if (callback) {

                    callback(null);

                }

            },


            {

                enableHighAccuracy:
                    true,

                timeout:
                    12000,

                maximumAge:
                    10000

            }

        );

}


/* ============================================================
   38. RADIO DE BÚSQUEDA
============================================================ */

function drawRadius() {

    if (
        !map ||
        !userLocation ||
        typeof L ===
            "undefined"
    ) {
        return;
    }


    if (radiusCircle) {

        map.removeLayer(
            radiusCircle
        );

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

                weight:
                    1,

                opacity:
                    0.35,

                fillColor:
                    "#00e86d",

                fillOpacity:
                    0.04

            }

        ).addTo(
            map
        );

}


/* ============================================================
   39. BOTONES DE RADIO
============================================================ */

document
    .querySelectorAll(
        ".range-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const radius =
                        Number(
                            this.dataset
                                .radius
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
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    this.classList.add(
                        "active"
                    );


                    updateReference();

                    drawRadius();

                }
            );

        }
    );


/* ============================================================
   40. REFERENCIA DEL RADIO
============================================================ */

function updateReference() {

    if (!referenceText) {
        return;
    }


    let message =
        "Una zona amplia alrededor de ti.";


    if (
        selectedRadius <=
        1
    ) {

        message =
            "Búsqueda muy cercana.";

    }

    else if (
        selectedRadius <=
        3
    ) {

        message =
            "Tu zona y alrededores cercanos.";

    }

    else if (
        selectedRadius >=
        20
    ) {

        message =
            "Exploración territorial extensa.";

    }


    referenceText.innerHTML =
        "🔎 " +
        selectedRadius +
        " km<br>" +
        escapeHTML(
            message
        );

}


/* ============================================================
   41. ACTIVAR PUNTO
============================================================ */

if (activateButton) {

    activateButton.addEventListener(
        "click",
        function () {

            if (!sellerForm) {
                return;
            }


            sellerForm.classList.remove(
                "hidden"
            );


            requestUserLocation(
                function (location) {

                    if (!location) {

                        updateStatus(
                            "📍 Haz clic en el mapa para seleccionar manualmente tu punto."
                        );

                    }

                }
            );

        }
    );

}


/* ============================================================
   42. CONFIRMAR PUNTO VERDE
============================================================ */

if (confirmSellerButton) {

    confirmSellerButton
        .addEventListener(
            "click",
            confirmSellerPoint
        );

}


function confirmSellerPoint() {

    if (!sellerProductInput) {
        return;
    }


    const product =
        sellerProductInput
            .value
            .trim();


    if (!product) {

        updateStatus(
            "⚠️ Escribe qué vendes."
        );

        sellerProductInput.focus();

        return;

    }


    if (!userLocation) {

        updateStatus(
            "📍 Necesitamos una posición. Permite la ubicación o haz clic en el mapa."
        );

        return;

    }


    const company =
        getCurrentCompany();


    const point = {

        id:
            generateId(
                "seller"
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

        lat:
            userLocation.lat,

        lng:
            userLocation.lng,

        active:
            true,

        createdAt:
            new Date()
                .toISOString()

    };


    try {

        localStorage.setItem(
            COYOTE_STORAGE_KEY,
            JSON.stringify(
                point
            )
        );

    }

    catch (error) {

        console.error(
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


    renderSellerPoint(
        point
    );


    syncCompanyWithCoyotePoint();


    if (sellerForm) {

        sellerForm.classList.add(
            "hidden"
        );

    }


    sellerProductInput.value =
        "";


    updateStatus(
        "🟢 Punto Verde activo · " +
        escapeHTML(
            product
        )
    );


    updateOfferMetrics(
        commercialPoints.length
    );

}


/* ============================================================
   43. RENDERIZAR PUNTO VERDE
============================================================ */

function renderSellerPoint(
    point
) {

    if (
        !map ||
        !point ||
        typeof L ===
            "undefined"
    ) {
        return;
    }


    if (sellerMarker) {

        map.removeLayer(
            sellerMarker
        );

    }


    const icon =
        createGreenIcon();


    const options =
        icon
            ? {
                icon
            }
            : {};


    sellerMarker =
        L.marker(

            [
                point.lat,
                point.lng
            ],

            options

        ).addTo(
            map
        );


    sellerMarker.bindPopup(
        `
            <strong>
                ${escapeHTML(
                    point.companyName ||
                    "Punto Verde"
                )}
            </strong>

            <br>

            ${escapeHTML(
                point.product
            )}

            <br><br>

            <button
                type="button"
                onclick="startFollowingSeller(
                    ${Number(
                        point.lat
                    )},
                    ${Number(
                        point.lng
                    )}
                )"
                style="
                    border:0;
                    border-radius:8px;
                    padding:8px 10px;
                    background:#00e86d;
                    color:#00210f;
                    font-weight:900;
                    cursor:pointer;
                "
            >
                IR A ESTE PUNTO
            </button>
        `
    );


    map.setView(
        [
            point.lat,
            point.lng
        ],
        16
    );

}


/* ============================================================
   44. RESTAURAR PUNTO
============================================================ */

function restoreSellerPoint() {

    const saved =
        localStorage.getItem(
            COYOTE_STORAGE_KEY
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
            !point ||
            !point.active ||
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
            return;
        }


        point.lat =
            Number(
                point.lat
            );


        point.lng =
            Number(
                point.lng
            );


        commercialPoints.push(
            point
        );


        renderSellerPoint(
            point
        );


        updateOfferMetrics(
            commercialPoints.length
        );

    }

    catch (error) {

        console.error(
            "Punto COYOTE inválido:",
            error
        );

    }

}


/* ============================================================
   45. BUSCADOR COYOTE
============================================================ */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchCommercialPoints
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

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


function searchCommercialPoints() {

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


    if (!userLocation) {

        requestUserLocation(
            function () {

                executeCommercialSearch(
                    query
                );

            }
        );

        return;

    }


    executeCommercialSearch(
        query
    );

}


/* ============================================================
   46. EJECUTAR BÚSQUEDA
============================================================ */

function executeCommercialSearch(
    query
) {

    clearSearchMarkers();


    const matches =
        commercialPoints
            .map(
                point => {

                    const distance =
                        userLocation
                            ? calculateDistanceKm(

                                userLocation.lat,

                                userLocation.lng,

                                point.lat,

                                point.lng

                            )
                            : 0;


                    return {
                        ...point,
                        distance
                    };

                }
            )
            .filter(
                point => {

                    const product =
                        String(
                            point.product ||
                            ""
                        )
                            .toLowerCase();


                    const productMatch =
                        product.includes(
                            query
                        );


                    const radiusMatch =
                        !userLocation ||
                        point.distance <=
                            selectedRadius;


                    return (
                        productMatch &&
                        radiusMatch
                    );

                }
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    a.distance -
                    b.distance
            );


    matches.forEach(
        renderSearchPoint
    );


    updateOfferMetrics(
        matches.length
    );


    if (!matches.length) {

        updateStatus(
            "🔎 No encontramos " +
            escapeHTML(
                query
            ) +
            " dentro de " +
            selectedRadius +
            " km."
        );

        return;

    }


    updateStatus(
        "✓ Encontramos " +
        matches.length +
        (
            matches.length === 1
                ? " punto"
                : " puntos"
        ) +
        " para " +
        escapeHTML(
            query
        ) +
        "."
    );


    fitSearchResults(
        matches
    );

}


/* ============================================================
   47. RENDERIZAR RESULTADO
============================================================ */

function renderSearchPoint(
    point
) {

    if (
        !map ||
        typeof L ===
            "undefined"
    ) {
        return;
    }


    const icon =
        createCoyoteIcon();


    const options =
        icon
            ? {
                icon
            }
            : {};


    const marker =
        L.marker(

            [
                point.lat,
                point.lng
            ],

            options

        ).addTo(
            map
        );


    const distanceText =
        userLocation
            ? point.distance
                .toFixed(2) +
                " km"
            : "Distancia no disponible";


    marker.bindPopup(
        `
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
                    ${Number(
                        point.lat
                    )},
                    ${Number(
                        point.lng
                    )}
                )"
                style="
                    border:0;
                    border-radius:8px;
                    padding:8px 10px;
                    background:#00e86d;
                    color:#00210f;
                    font-weight:900;
                    cursor:pointer;
                "
            >
                IR A ESTE PUNTO
            </button>
        `
    );


    searchMarkers.push(
        marker
    );

}


/* ============================================================
   48. LIMPIAR RESULTADOS
============================================================ */

function clearSearchMarkers() {

    if (!map) {

        searchMarkers = [];

        return;

    }


    searchMarkers.forEach(
        marker => {

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
    );


    searchMarkers = [];

}


/* ============================================================
   49. ENCUADRAR RESULTADOS
============================================================ */

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


    const points =
        matches.map(
            point => [
                point.lat,
                point.lng
            ]
        );


    if (userLocation) {

        points.push(
            [
                userLocation.lat,
                userLocation.lng
            ]
        );

    }


    if (
        points.length ===
        1
    ) {

        map.setView(
            points[0],
            16
        );

        return;

    }


    const bounds =
        L.latLngBounds(
            points
        );


    map.fitBounds(
        bounds,
        {
            padding:
                [70, 70],

            maxZoom:
                16
        }
    );

}


/* ============================================================
   50. MÉTRICAS DE OFERTA
============================================================ */

function updateOfferMetrics(
    count
) {

    const normalizedCount =
        Math.max(
            0,
            safeNumber(
                count
            )
        );


    if (offerText) {

        offerText.textContent =
            normalizedCount +
            (
                normalizedCount === 1
                    ? " punto"
                    : " puntos"
            );

    }


    const demand =
        clamp(
            normalizedCount *
            18
        );


    if (demandBar) {

        demandBar.style.width =
            demand +
            "%";

    }


    if (demandText) {

        if (
            normalizedCount ===
            0
        ) {

            demandText.textContent =
                "Sin datos";

        }

        else if (
            normalizedCount <=
            2
        ) {

            demandText.textContent =
                "Actividad baja";

        }

        else if (
            normalizedCount <=
            5
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


/* ============================================================
   51. SEGUIR VENDEDOR
============================================================ */

function startFollowingSeller(
    sellerLat,
    sellerLng
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
            "❌ Punto comercial inválido."
        );

        return;

    }


    if (
        !navigator.geolocation
    ) {

        updateStatus(
            "⚠️ El navegador no permite seguimiento por ubicación."
        );

        return;

    }


    stopFollowingSeller(
        false
    );


    updateStatus(
        "🧭 Seguimiento iniciado."
    );


    followWatchId =
        navigator
            .geolocation
            .watchPosition(

                function (
                    position
                ) {

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

                                    radius:
                                        7,

                                    color:
                                        "#ffffff",

                                    weight:
                                        2,

                                    fillColor:
                                        "#4d8cff",

                                    fillOpacity:
                                        1

                                }

                            ).addTo(
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


                    if (followLine) {

                        map.removeLayer(
                            followLine
                        );

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

                                weight:
                                    3,

                                opacity:
                                    0.8,

                                dashArray:
                                    "7 8"

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
                        distance <
                        1
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
                                .toFixed(
                                    2
                                ) +
                            " km";

                    }


                    updateStatus(
                        "🧭 Distancia al punto: " +
                        "<strong>" +
                        escapeHTML(
                            distanceText
                        ) +
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


                function (error) {

                    console.error(
                        error
                    );


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


/* ============================================================
   52. DETENER SEGUIMIENTO
============================================================ */

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
        map &&
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
        map &&
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


/* ============================================================
   53. DISTANCIA HAVERSINE
============================================================ */

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


/* ============================================================
   54. ESTADO COYOTE
============================================================ */

function updateStatus(
    message
) {

    const element =
        document.getElementById(
            "status"
        );


    if (element) {

        element.innerHTML =
            message;

    }

}


/* ============================================================
   55. CONECTAR EMPRESA CON PUNTO COYOTE
============================================================ */

function syncCompanyWithCoyotePoint() {

    const company =
        getCurrentCompany();


    if (!company) {
        return;
    }


    const saved =
        localStorage.getItem(
            COYOTE_STORAGE_KEY
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

        }

    }

    catch (error) {

        console.error(
            error
        );

    }

}


/* ============================================================
   56. VISIBILIDAD DEL MAPA
============================================================ */

function refreshMapSize() {

    if (!map) {
        return;
    }


    setTimeout(
        () => {

            map.invalidateSize();

        },
        80
    );


    setTimeout(
        () => {

            map.invalidateSize();

        },
        300
    );

}


/* ============================================================
   57. RESIZE
============================================================ */

window.addEventListener(
    "resize",
    function () {

        if (
            document
                .getElementById(
                    "mapView"
                )
                ?.classList
                .contains(
                    "active"
                )
        ) {

            refreshMapSize();

        }

    }
);


/* ============================================================
   58. LIMPIEZA AL SALIR
============================================================ */

window.addEventListener(
    "beforeunload",
    function () {

        stopFollowingSeller(
            false
        );

    }
);


/* ============================================================
   59. ACTUALIZAR REFERENCIA
============================================================ */

updateReference();


/* ============================================================
   60. ARRANQUE MAHPE
============================================================ */

function startMahpe() {

    migrateMahpeBusinessState();


    /*
       Leaflet puede construirse mientras
       la vista está oculta, pero al entrar
       al mapa openView() ejecutará
       invalidateSize() para corregir
       las dimensiones.
    */

    initializeMap();


    renderFeed();


    renderCompanyDashboard();


    updateGlobalUI();


    openView(
        "feedView"
    );


    console.log(
        "MAHPE iniciado."
    );


    console.log(
        "COYOTE activo como motor territorial y empresarial."
    );

}


/* ============================================================
   61. EJECUTAR
============================================================ */

startMahpe();


/* ============================================================
   FIN SCRIPT.JS
============================================================ */
