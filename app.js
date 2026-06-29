// =========================
// TONYBIZNES
// APP.JS CZĘŚĆ 1
// =========================
const SUPABASE_URL =
"https://tonyfalcone.github.io/TonyBiznes/";

const SUPABASE_KEY =
"sb_publishable_Y334pcLp_Jj3pzaeOmO_SA__jWp7RaD";

const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
const COSTS = {

    seed: 2800,
    fertilizer: 4000,
    pot: 28000,
    irrigation: 48000

};

let chartInstance = null;

// =========================
// FORMATOWANIE WALUTY
// =========================

function money(value){

    return "$" +
        Number(value).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 0
            }
        );

}

// =========================
// LOCAL STORAGE
// =========================

function saveForm(){

    const data = {

        topy:
            document.getElementById("topy").value,

        cena:
            document.getElementById("cenaCegly").value,

        nasiona:
            document.getElementById("nasiona").value,

        nawoz:
            document.getElementById("nawoz").value,

        doniczki:
            document.getElementById("doniczki").value,

        nawadnianie:
            document.getElementById("nawadnianie").value

    };

    localStorage.setItem(
        "tonybiznes_form",
        JSON.stringify(data)
    );

}

function loadForm(){

    const data =
        JSON.parse(
            localStorage.getItem(
                "tonybiznes_form"
            )
        );

    if(!data) return;

    document.getElementById("topy").value =
        data.topy || 0;

    document.getElementById("cenaCegly").value =
        data.cena || 40000;

    document.getElementById("nasiona").value =
        data.nasiona || 0;

    document.getElementById("nawoz").value =
        data.nawoz || 0;

    document.getElementById("doniczki").value =
        data.doniczki || 0;

    document.getElementById("nawadnianie").value =
        data.nawadnianie || 0;

}

// =========================
// POBIERANIE WARTOŚCI
// =========================

function getFormData(){

    return {

        topy:
            Number(
                document.getElementById("topy").value
            ) || 0,

        cena:
            Number(
                document.getElementById("cenaCegly").value
            ) || 40000,

        nasiona:
            Number(
                document.getElementById("nasiona").value
            ) || 0,

        nawoz:
            Number(
                document.getElementById("nawoz").value
            ) || 0,

        doniczki:
            Number(
                document.getElementById("doniczki").value
            ) || 0,

        nawadnianie:
            Number(
                document.getElementById("nawadnianie").value
            ) || 0

    };

}

// =========================
// KALKULATOR
// =========================

function calculate(){

    const data =
        getFormData();

    const bricks =
        data.topy / 20;

    const revenue =
        bricks * data.cena;

    const seedCost =
        data.nasiona *
        COSTS.seed;

    const fertilizerCost =
        data.nawoz *
        COSTS.fertilizer;

    const potCost =
        data.doniczki *
        COSTS.pot;

    const irrigationCost =
        data.nawadnianie *
        COSTS.irrigation;

    const totalCosts =
        seedCost +
        fertilizerCost +
        potCost +
        irrigationCost;

    const profit =
        revenue -
        totalCosts;

    document.getElementById(
        "cenaLabel"
    ).textContent =
        money(data.cena);

    document.getElementById(
        "koszty"
    ).textContent =
        money(totalCosts);

    document.getElementById(
        "sumTopy"
    ).textContent =
        data.topy;

    document.getElementById(
        "sumCegly"
    ).textContent =
        bricks.toFixed(2);

    document.getElementById(
        "sumPrzychod"
    ).textContent =
        money(revenue);

    document.getElementById(
        "sumKoszt"
    ).textContent =
        money(totalCosts);

    document.getElementById(
        "sumNetto"
    ).textContent =
        money(profit);

    saveForm();

    return {

        topy:
            data.topy,

        cegly:
            bricks,

        przychod:
            revenue,

        koszty:
            totalCosts,

        zysk:
            profit

    };

}
// =========================
// TONYBIZNES
// APP.JS CZĘŚĆ 2
// HISTORIA + STATYSTYKI
// =========================

const STORAGE_HISTORY =
    "tonybiznes_history";

// =========================
// POBIERANIE HISTORII
// =========================

function getHistory(){

    try{

        return JSON.parse(
            localStorage.getItem(
                STORAGE_HISTORY
            )
        ) || [];

    }

    catch(error){

        return [];

    }

}

// =========================
// ZAPIS HISTORII
// =========================

function saveHistory(history){

    localStorage.setItem(

        STORAGE_HISTORY,

        JSON.stringify(
            history
        )

    );

}

// =========================
// DODAWANIE ZBIORU
// =========================

function addHarvest(){

    const result =
        calculate();

    const history =
        getHistory();

    history.unshift({

        id:
            Date.now(),

        data:
            new Date()
            .toLocaleString("pl-PL"),

        topy:
            result.topy,

        cegly:
            Number(
                result.cegly
                .toFixed(2)
            ),

        przychod:
            result.przychod,

        koszty:
            result.koszty,

        zysk:
            result.zysk

    });

    saveHistory(
        history
    );

    renderHistory();

    renderRanking();

    updateStats();

    updateChart();

}

// =========================
// USUWANIE ZBIORU
// =========================

function deleteHarvest(id){

    const history =
        getHistory()
        .filter(

            item =>
            item.id !== id

        );

    saveHistory(
        history
    );

    renderHistory();

    renderRanking();

    updateStats();

    updateChart();

}

// =========================
// FILTR HISTORII
// =========================

function getFilteredHistory(){

    const filter =
        document
        .getElementById(
            "historyFilter"
        )
        .value
        .toLowerCase()
        .trim();

    const history =
        getHistory();

    if(!filter){

        return history;

    }

    return history.filter(

        item =>

            item.data
            .toLowerCase()
            .includes(filter)

    );

}

// =========================
// RENDER HISTORII
// =========================

function renderHistory(){

    const container =
        document.getElementById(
            "historyList"
        );

    const history =
        getFilteredHistory();

    container.innerHTML = "";

    if(
        history.length === 0
    ){

        container.innerHTML =

        `
        <div class="historyItem">

            Brak zapisanych zbiorów

        </div>
        `;

        return;

    }

    history.forEach(

        item => {

            const element =
                document
                .createElement(
                    "div"
                );

            element.className =
                "historyItem";

            element.innerHTML =

            `
            <div class="historyTop">

                <strong>
                    ${item.data}
                </strong>

                <span class="historyProfit">

                    ${money(item.zysk)}

                </span>

            </div>

            <div>

                🌿 Topów:
                ${item.topy}

            </div>

            <div>

                📦 Cegieł:
                ${item.cegly}

            </div>

            <div>

                💰 Przychód:
                ${money(
                    item.przychod
                )}

            </div>

            <div>

                💸 Koszty:
                ${money(
                    item.koszty
                )}

            </div>

            <button
                style="margin-top:10px"
                onclick="deleteHarvest(${item.id})"
            >

                Usuń

            </button>
            `;

            container.appendChild(
                element
            );

        }

    );

}

// =========================
// AKTUALIZACJA STATYSTYK
// =========================

function updateStats(){

    const history =
        getHistory();

    const harvests =
        history.length;

    const totalProfit =
        history.reduce(

            (sum,item)=>

                sum +
                item.zysk,

            0

        );

    const averageProfit =

        harvests === 0

        ? 0

        :

        totalProfit /
        harvests;

    const totalTopy =
        history.reduce(

            (sum,item)=>

                sum +
                item.topy,

            0

        );

    const totalCegly =
        history.reduce(

            (sum,item)=>

                sum +
                item.cegly,

            0

        );

    document.getElementById(
        "statHarvests"
    ).textContent =
        harvests;

    document.getElementById(
        "statProfit"
    ).textContent =
        money(
            totalProfit
        );

    document.getElementById(
        "statAverage"
    ).textContent =
        money(
            averageProfit
        );

    document.getElementById(
        "statTopy"
    ).textContent =
        totalTopy;

    document.getElementById(
        "statCegly"
    ).textContent =
        totalCegly
        .toFixed(2);

}

// =========================
// TOP 5 ZBIORÓW
// =========================

function renderRanking(){

    const container =
        document.getElementById(
            "rankingList"
        );

    const history =
        getHistory();

    const ranking =

        [...history]

        .sort(

            (a,b)=>

                b.zysk -
                a.zysk

        )

        .slice(0,5);

    container.innerHTML =
        "";

    if(
        ranking.length === 0
    ){

        container.innerHTML =

        `
        <div class="rankItem">

            Brak danych

        </div>
        `;

        return;

    }

    ranking.forEach(

        (item,index)=>{

            const element =
                document
                .createElement(
                    "div"
                );

            element.className =
                "rankItem";

            element.innerHTML =

            `
            <span class="rankPlace">

                #${index + 1}

            </span>

            <span>

                ${item.data}

            </span>

            <span class="rankValue">

                ${money(
                    item.zysk
                )}

            </span>
            `;

            container.appendChild(
                element
            );

        }

    );

}

// =========================
// EVENTY
// =========================

document
.getElementById(
    "saveHarvest"
)
.addEventListener(

    "click",

    addHarvest

);

document
.getElementById(
    "historyFilter"
)
.addEventListener(

    "input",

    renderHistory

);
// =========================
// TONYBIZNES
// APP.JS CZĘŚĆ 3
// WYKRES + START APLIKACJI + PWA
// =========================

// =========================
// WYKRES ZYSKÓW
// =========================

function updateChart(){

    const history =
        getHistory();

    const canvas =
        document.getElementById(
            "profitChart"
        );

    if(!canvas){
        return;
    }

    const labels =
        history.map(
            (item,index)=>
                "#" + (index + 1)
        );

    const profits =
        history.map(
            item => item.zysk
        );

    if(chartInstance){

        chartInstance.destroy();

    }

    chartInstance =
        new Chart(

            canvas,

            {

                type:"line",

                data:{

                    labels:labels,

                    datasets:[

                        {

                            label:
                                "Zysk",

                            data:
                                profits,

                            borderColor:
                                "#39ff88",

                            backgroundColor:
                                "rgba(57,255,136,.15)",

                            borderWidth:
                                3,

                            fill:true,

                            tension:0.25

                        }

                    ]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            labels:{

                                color:"#ffffff"

                            }

                        }

                    },

                    scales:{

                        x:{

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:
                                "rgba(255,255,255,.08)"

                            }

                        },

                        y:{

                            ticks:{

                                color:"#ffffff"

                            },

                            grid:{

                                color:
                                "rgba(255,255,255,.08)"

                            }

                        }

                    }

                }

            }

        );

}

// =========================
// ODŚWIEŻANIE W CZASIE
// RZECZYWISTYM
// =========================

function bindInputs(){

    const inputs =

        document.querySelectorAll(

            'input[type="number"], input[type="range"]'

        );

    inputs.forEach(

        input => {

            input.addEventListener(

                "input",

                () => {

                    calculate();

                }

            );

        }

    );

}

// =========================
// INICJALIZACJA
// =========================

function initializeApp(){

    loadForm();

    calculate();

    renderHistory();

    renderRanking();

    updateStats();

    updateChart();

    bindInputs();

}

// =========================
// SERVICE WORKER
// =========================

function registerServiceWorker(){

    if(

        "serviceWorker"

        in

        navigator

    ){

        window.addEventListener(

            "load",

            () => {

                navigator
                .serviceWorker
                .register(

                    "./sw.js"

                )
                .then(

                    () => {

                        console.log(
                            "Service Worker OK"
                        );

                    }

                )
                .catch(

                    error => {

                        console.error(
                            error
                        );

                    }

                );

            }

        );

    }

}

// =========================
// START
// =========================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeApp();

        registerServiceWorker();

    }

);
