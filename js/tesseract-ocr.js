$(document).ready(function () {
    var inputs = document.querySelectorAll(".inputfile");
    Array.prototype.forEach.call(inputs, function (input) {
        var label = input.nextElementSibling,
            labelVal = label.innerHTML;

        input.addEventListener("change", function (e) {
            var fileName = "";
            if (this.files && this.files.length > 1) fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
            else fileName = e.target.value.split("\\").pop();

            if (fileName) {
                label.querySelector("span").innerHTML = fileName;

                let reader = new FileReader();
                reader.onload = function () {
                    let dataURL = reader.result;
                    $("#selected-image").attr("src", dataURL);
                    $("#selected-image").addClass("col-12");
                };
                let file = this.files[0];
                reader.readAsDataURL(file);
                startRecognize(file);
            } else {
                label.innerHTML = labelVal;
                $("#selected-image").attr("src", "");
                $("#selected-image").removeClass("col-12");
                $("#arrow-right").addClass("fa-arrow-right");
                $("#arrow-right").removeClass("fa-check");
                $("#arrow-right").removeClass("fa-spinner fa-spin");
                $("#arrow-down").addClass("fa-arrow-down");
                $("#arrow-down").removeClass("fa-check");
                $("#arrow-down").removeClass("fa-spinner fa-spin");
                $("#log").empty();
            }
            
        });

        // Firefox bug fix
        input.addEventListener("focus", function () {
            input.classList.add("has-focus");
        });
        input.addEventListener("blur", function () {
            input.classList.remove("has-focus");     
        });
        // input.addEventListener("crop",function(){
        //  input.classList.add("has-crop");
        // });
    });
});

$("#startLink").click(function () {
    var img = document.getElementById("selected-image");
    startRecognize(img);
});

function startRecognize(img) {
    $("#arrow-right").removeClass("fa-arrow-right");
    $("#arrow-right").addClass("fa-spinner fa-spin");
    $("#arrow-down").removeClass("fa-arrow-down");
    $("#arrow-down").addClass("fa-spinner fa-spin");
    recognizeFile(img);
}


function progressUpdate(packet) {
    var log = document.getElementById("log");

    if (log.firstChild && log.firstChild.status === packet.status) {
        if ("progress" in packet) {
        var progress = log.firstChild.querySelector("progress");
            progress.value = packet.progress;
        }
    } else {
        var line = document.createElement("div");
        line.status = packet.status;
        var status = document.createElement("div");
        status.className = "status";
        status.appendChild(document.createTextNode(packet.status));
        line.appendChild(status);

        if ("progress" in packet) {
            var progress = document.createElement("progress");
            progress.value = packet.progress;
            progress.max = 1;
            line.appendChild(progress);
        }

        if (packet.status == "done") {
            log.innerHTML = "";
            var pre = document.createElement("pre");
            pre.appendChild(document.createTextNode(packet.data.text.replace(/\n\s*\n/g, "\n")));
            line.innerHTML = "";
            line.appendChild(pre);
            $(".fas").removeClass("fa-spinner fa-spin");
            $(".fas").addClass("fa-check");
        }

        log.insertBefore(line, log.firstChild);
    }
}

function recognizeFile(file) {
    $("#log").empty();
    const corePath = window.navigator.userAgent.indexOf("Edge") > -1 ? "js/tesseract-core.asm.js" : "js/tesseract-core.wasm.js";

    const worker = new Tesseract.TesseractWorker({
        corePath,
    });

    worker
        .recognize(file, $("#langsel").val())
        .progress(function (packet) {
            console.info(packet);
            //progressUpdate(packet); // daca voi decomenta această linie, va aparea din nou cum are loc procedura..
        })
        .then(function (data) {
            // console.log(data.text)

            dataCompare(data.text); 

         progressUpdate({ status: "done", data: data });
        });
}

let dataCompare = (text) => {
    let allText = text.toLowerCase();

    var indices = [];
    var str = allText.slice(allText.search("ingredie"), allText.length);
    if (str.length > 1) {
        for (var i = 0; i < str.length; i++) {
            if (str[i] === ",") {
                indices.push(i);
            }
        }

        document.getElementById("Total").innerHTML = `	Total ingrediente:${indices.length}`;
    }
    let BadIngredients = [
        "Bisphenol-A (BPA)",
        "Polycyclic aromatic hydrocarbons(PAHs)",
        "Cinnamon",
        "Mercur",
        "Sodium Nitrite",
        "Guar Gum",
        "Carrageenan",
        "Sodium Benzoate",
        "High-Fructose Corn Syrup",
        "Monosodium Glutamate",
        "Sodium Nitrite",
        "Artificial Sweeteners",
        "Xanthan Gum",
        "Artificial Flavoring",
        "Yeast Extract",
        "Sulfites",
        "Aluminium",
        "Magnesium sulphate",
        "Brominated vegetable oil",
        "Refined vegetable oil",
        "Disodium guanylate",
        "Camauba wax",
        "Saccharin",
        "Aspartame",
        "Agave nectar",
        "Sucralose",
        "Caramel coloring",
        "Palm oil",
        "White flour",
        "MSG",
        "Butylated hydroxyanisole (bha)",
        "Talc",
        "Parabens",
        "Fluoride",
        "Mineral oil",
        "Preservatives",
        "Propylene glycol",
        "Sodium selenite",
        "Blue 2",
        "Green 3",
        "Orange B",
        "Cyclamate",
        "Synthetic vitamins",
        "Dextrose",
        "Agave nectar",
        "Sugar",
        "flavours",
        "Zahăr",
        "Zaharuri",
        "nectar de agave",
	    "conservant",
		//"antioxidanți",
		"dextroză",
		"Gumă de guar",
		"gumă konjak",
		"caragenan",
		"gumă de xantan",
        "acid sorbic",
        "sucraloza",
        "aspartam",
        "diacetil",
        "glutamatul monosodic",
        "Red#40",
        "Albastru#2",
        "Galben5",
        "Butilat Hidroxianisol",
        "benzonat de sodiu",
        "azotitul de sodiu",
        "glutamatul de sodiu",
         "azorubina",
         "indigotina",
         "acid sorbic",
         "caramel",
         "diglutamat de calciu",
         "acid benzoic",
         "sorbat de potasiu",
         "nitrit de sodiu",
         "nitrat de sodiu",
         "diacetil",
         "glutamat monosodic",
         "ciclamat de sodiu",
         "inozinat disodic",
         "pirofosfat",
         "difosfați",
         "sorbic acid",
         "artificial flavors",
         "metabisulfit de sodiu",
         "sirop de zahăr",
         "trifosfați",
         "erisorbat de sodiu",
         "extract de drojdie",
         "glutamat de sodium",
         "carmin",
         "fosfat de sodiu",
         "slănină",
          "slanina",
          "sorici",
         "gumă de ester",
         "gumă de carruba",
         "arome",
         "chinină",
         "zahar",
         //"octenil succinat de amidon sodic",
         "sirop de zahăr caramelizat",
         "zahăr invertit",
         "sirop de maltitol",
         

    ].map((v) => v.toLowerCase());
   
  
    let GoodIngredients = [
        "Fructose",
        "Olive oil",
        "Omega-3",
        "Glucosamine",
        "Oats",
        "Fish",
        "Duck",
        "Liver",
        "Peas",
        "Vitamin C",
        "Vitamin E",
        "Sweet potatoes",
        "Carrots",
        "Curry",
        "Orange",
        "Yougurt",
        "Limes",
        "Almonds",
        "Berries",
        "Rice",
        "Lactic acid",
        "Collagen",
        "Peptide",
        "Salmon",
        "Buttermilk",
        "Fish",
        "Onion",
        "Black pepper",
        "Turmeric",
        "Curcuma",
        "Water",
        "Salt",
        "Skim milk powder",
        "Spices",
        "enzyme",
        "live cultures",
        "faină de grâu",
        "condimente",
        "cultura starter",
        "pulpă porc",
        "pui",
        "rață",
        
        "sare",
        "apă",
        "miere",
        "legume deshidratate",
        "fructoză",
        "honey",
		"carne de porc",
		"ardei",
		//"porc",
		"vită",
         "usturoi",
         "brânză",
         "zer praf",
         "acid citric",
        "lămâie",
        "pește", 
        "colagen",
         //"unt ",
         "pește afumat",
         "morcov",
         "cartofi dulci",
         "cartofi",
         "iaurt",
         //"cacao",
         "verdețuri",
          "boia",
          "piper",
          "zahăr din trestie",
          "zahăr brun",
          "rodii",
          "miere",
          "căpșuni",
          "corn flakes",
          "ceapă",
          "lapte praf",
          "culturi vii",
          "mazăre",
          "fasole",
          "lecitină",
          "grăsimi vegetale",
          "vanilie",
    "pătrunjel",
    "beta caroten",
    "unt de cacao",
    "masă de cacao",
    "soy lecithin",
    "fibre",
    "carne de pui",
    "acetati de sodiu",
    "acid ascorbic",
    "carne de curcan",
    "piept de pui",
    "piept de curcan",
    "ascorbat de sodiu",
    "malatodextrin",
    "culturi starter",
    "roșu sfeclă",
    "usturoi pudră",
    "vitamina c",
    "proteină vegetală din soia",
    "amidon din cartofi",
    "fum",
    "rozmarin",
    "glucoză",
    "glucose",
    "cafea",
    "extract din malț din orz",
    "monogliceride",
    "digliceride",
    "ulei de palmier",
    "cacao degresată pudră",
    "lapte praf degresat",
    "arome naturale din fructe",
    "aromă naturală de vanilie",
    "afine",
    "orz",
     "grăsime vegetală",
     "vanilină",
     "hrișcă",
     "GOSSYPIUM HERBACEUM (COTTON) EXTRACT",
     "zaharină",
     "zaharină sodică",
     "pectin",
     "cellulose ",
     "sorbitol",
     "proteine din lapte",
     "ulei de floarea soarelui",
     "țelină",
     "amidon din grâu",
     "ciuperci",
     "maltodextrin",
     "legume deshidratate",
     "extract de boia de ardei",
     "vitamina B2",
     "malț din orz",
     "bicarbonat de sodiu",
     "tărâțe de grâu",
     "suc de mere",
     "malț din porumb",
     "tartrat de potasiu",
     "bicarbonat de amoniu",
     "glicerol",
     "porumb",
     "alfa-tocoferol",
     "lapte integral pasteurizat",
     "carbonat de amoniu",
     "grăsimi vegetale nehidrogenate",
     "oțet",
     "edta",
     "edetic acid",
    "pudră de roșii",
    "vitamina b3",
    "acid pantotenic",
    "acid folic",
    "vitamina b6",
    "ardei iute",
    "suc de fructe",
    "dioxid de carbon",
    "suc de lămâie",
    "suc de portocale",
    "gumă arabica",
    "gumă de acacia",
    "praz",
    "extract de pui",
    "piper",
    "griș din grâu",
    "unt de arahide",
    "pastă de arahide",
    "mălai",
    "pudră  de brânză",
    "praf de gălbenuș de ou",
    "praf de albuș de ou",
    "plante aromatice",
    "ulei de măsline",
    "drojdie",
    "maia",
    "făină de soia",
    "fulgi de cocos",
    "cocos",
    "grăsimi din unt",
    "stafide",
    "caju",
    "extract de vanilie",
    "pastă de migdale",
    "praf de ou",
    




    

         
    ].map((v) => v.toLowerCase());

    let good = document.getElementById("goodONe");
    let Bad = document.getElementById("BadONe");
    

    good.innerHTML = "Ingrediente bune";

    Bad.innerHTML = "Ingrediente periculoase";
    

    let badding = 0;
    for (let i = 0; i < BadIngredients.length; i++) {
        // Bad ingredients
        // console.log(allText.search(BadIngredients[i]));

        if (allText.search(BadIngredients[i]) >= 0) {
            // console.log('Bad Ingredients',BadIngredients[i]);

            badding++;

            let badIngre = document.createElement("li");
            let text = document.createTextNode(BadIngredients[i]);
            badIngre.appendChild(text);

            Bad.appendChild(badIngre);
        }
    }

    document.getElementById("BadIngred").innerHTML = `Produsul conține ingred. periculoase:${badding}(${Math.round((badding * 100) / indices.length)}%)`;

    if (badding == 0) {
        let BadIngre = document.createElement("li");
        let text = document.createTextNode("Produsul nu conține ingred. periculoase");
        BadIngre.appendChild(text);

        Bad.appendChild(BadIngre);
    }

    let gooding = 0;

    for (let i = 0; i < GoodIngredients.length; i++) {
        // Good ingredients
        // console.log(allText.search(BadIngredients[i]));

        if (allText.search(GoodIngredients[i]) >= 0) {
            gooding++;
            // console.log('Good Ingredients',GoodIngredients[i]);
            let goodIngre = document.createElement("li");
            let text = document.createTextNode(GoodIngredients[i]);
            goodIngre.appendChild(text);

            good.appendChild(goodIngre);
        }
    }

    document.getElementById("GoodPer").innerHTML = `Produsul conține ingred. bune:${gooding}(${Math.round((gooding * 100) / indices.length)}%)`;
    if (gooding == 0) {
        let goodIngre = document.createElement("li");
        let text = document.createTextNode("Produsul nu conține ingred. bune");
        goodIngre.appendChild(text);//appendChild adauga un element html

        good.appendChild(goodIngre);
    }
    document.getElementById("log").style.visibility = "visible";
    document.getElementById("mainLists").style.visibility = "visible"; //cauta un element după id-ul elementului
    document.getElementById("mainLists1").style.display = "flex";

    // this is only for sending data to firebasae database for saving
    // 	let allgienss=['Egg','egg','Milk','milk','milk products','eggs','egg products','fish','fish products','Seafood','peanuts','peanut products','nuts', 'hazelnuts','almonds', 'cashews', 'pecans', 'Brazil nuts', 'macadamia nuts', 'Queensland nuts',
    // 	'cereals','gluten','wheat', 'rye', 'barley', 'oats','soy','soy products','lapte']
    // 	firebase.database().ref('/').remove();
    // for (let i = 0; i < allgienss.length; i++) {

    // 	firebase.database().ref('/Allgirens').push(allgienss[i])

    // }
    // and after we will not acess from there and we acess from api of firebase database


    let allg = document.getElementById("Allgiens");
    

    firebase
        .database()
        .ref("/Allgirens")
        .on("value", function (v) {
            let allgiens = [];

            v.forEach((v) => {
                allgiens.push(v.val());
            });

            let allgiensNo = 0;
            allg.innerHTML = "";
            allg.innerHTML = "Alergeni";

            for (let i = 0; i < allgiens.length; i++) {
                // console.log("running>>>>",allgiens[i]);
                if (allText.search(allgiens[i]) >= 0) {
                    console.log(allgiens[i], allgiensNo);
                    allgiensNo++;
                    let goodIngre = document.createElement("li");
                    let text = document.createTextNode(allgiens[i]);
                    goodIngre.appendChild(text);

                    allg.appendChild(goodIngre);
                }
                //de aici am inceput sa fac lista

            }

           // document.getElementById("Allegi").innerHTML = `Alergeni:${allgiensNo}(${Math.round((gooding * 100) / allgiens.length)}%)`;
			document.getElementById("Allegi").innerHTML = `Alergeni:${allgiensNo}(${Math.round((allgiensNo * 100) / allgiens.length)}%)`;
			//document.getElementById("GoodPer").innerHTML = `Produsul conține ingred. bune:${gooding}(${Math.round((gooding * 100) / indices.length)}%)`;

            if (allgiensNo == 0) {
                let allgIngre = document.createElement("li");
                let text = document.createTextNode("Produsul nu conține alergeni");
                allgIngre.appendChild(text);

                allg.appendChild(allgIngre);
            }
        });
};


// let Allerg=["ou",
// "lapte"
// ].map((v) => v.toLowerCase());

// let allgiensNo = 0;

// for (let i = 0; i < Allerg.length; i++) {
//    // Good ingredients
//    // console.log(allText.search(BadIngredients[i]));

//    if (allText.search(Allerg[i]) >= 0) {
//        allgiensNo++;
//        // console.log('Good Ingredients',GoodIngredients[i]);
//        let goodIngre = document.createElement("li");
//        let text = document.createTextNode(Allerg[i]);
//        goodIngre.appendChild(text);

//        allg.appendChild(goodIngre);
//    }
// }