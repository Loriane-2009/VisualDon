import jsdom from "jsdom";
import fetch from "isomorphic-fetch"
import puppeteer from "puppeteer"


const wikipedia_url = "https://fr.wikipedia.org/wiki/Liste_des_cours_d%27eau_de_la_Suisse";


/*
========================================================================================================================
1. Capture d’écran
========================================================================================================================
*/
const screenshot = async () => {
const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(wikipedia_url, { waitUntil: "networkidle2" });
    await page.screenshot({ path: "screenshot.png", fullPage: true });
    await browser.close();
    console.log("✅ Capture d’écran enregistrée sous screenshot.png");
};

/*
========================================================================================================================
2. Noms des cours d'eau Suisses
========================================================================================================================
*/
const fetchData = async () => {
    const res = await fetch(wikipedia_url);
    const text = await res.text();
    const dom = new jsdom.JSDOM(text);
    const document = dom.window.document;

    const coursEau = [];

    document.querySelectorAll("table.wikitable").forEach(table => {
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 3) {
                const nom = cells[0].textContent.trim();
                const longueur = parseFloat(cells[1].textContent.trim().replace(",", "."));
                const debit = parseFloat(cells[2].textContent.trim().replace(",", "."));
                if (!isNaN(longueur)) {
                    coursEau.push({ nom, longueur, debit });
                }
            }
        });
    });

    console.log("\n🌊 Cours d'eau de plus de 30 km :");
    coursEau.filter(r => r.longueur > 30).forEach(r =>
        console.log(`- ${r.nom} (${r.longueur} km)`)
    );
    /*
    ========================================================================================================================
    3. Nom du cours d'eau le plus long
    ========================================================================================================================
    */
    const plusLong = coursEau.reduce((max, r) => r.longueur > max.longueur ? r : max, coursEau[0]);
    console.log(`\n📏 Le plus long : ${plusLong.nom} (${plusLong.longueur} km)`);

    /*
    ========================================================================================================================
    4. Nom du cours d'eau avec le débit le plus élevé
    ========================================================================================================================
    */
    const plusDebit = coursEau.reduce((max, r) => r.debit > max.debit ? r : max, coursEau[0]);
    console.log(`\n💧 Le débit le plus élevé : ${plusDebit.nom} (${plusDebit.debit} m³/s)`);
};

(async () => {
    await screenshot();
    await fetchData();
})();

