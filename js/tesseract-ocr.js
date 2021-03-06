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
            //progressUpdate(packet); // daca voi decomenta aceast?? linie, va aparea din nou cum are loc procedura..
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
        "Zah??r",
        "Zaharuri",
        "nectar de agave",
	    "conservant",
		//"antioxidan??i",
		"dextroz??",
		"Gum?? de guar",
		"gum?? konjak",
		"caragenan",
		"gum?? de xantan",
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
         "difosfa??i",
         "sorbic acid",
         "artificial flavors",
         "metabisulfit de sodiu",
         "sirop de zah??r",
         "trifosfa??i",
         "erisorbat de sodiu",
         "extract de drojdie",
         "glutamat de sodium",
         "carmin",
         "fosfat de sodiu",
         "sl??nin??",
          "slanina",
          "sorici",
         "gum?? de ester",
         "gum?? de carruba",
         "arome",
         "chinin??",
         "zahar",
         //"octenil succinat de amidon sodic",
         "sirop de zah??r caramelizat",
         "zah??r invertit",
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
        "fain?? de gr??u",
        "condimente",
        "cultura starter",
        "pulp?? porc",
        "pui",
        "ra????",
        
        "sare",
        "ap??",
        "miere",
        "legume deshidratate",
        "fructoz??",
        "honey",
		"carne de porc",
		"ardei",
		//"porc",
		"vit??",
         "usturoi",
         "br??nz??",
         "zer praf",
         "acid citric",
        "l??m??ie",
        "pe??te", 
        "colagen",
         //"unt ",
         "pe??te afumat",
         "morcov",
         "cartofi dulci",
         "cartofi",
         "iaurt",
         //"cacao",
         "verde??uri",
          "boia",
          "piper",
          "zah??r din trestie",
          "zah??r brun",
          "rodii",
          "miere",
          "c??p??uni",
          "corn flakes",
          "ceap??",
          "lapte praf",
          "culturi vii",
          "maz??re",
          "fasole",
          "lecitin??",
          "gr??simi vegetale",
          "vanilie",
    "p??trunjel",
    "beta caroten",
    "unt de cacao",
    "mas?? de cacao",
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
    "ro??u sfecl??",
    "usturoi pudr??",
    "vitamina c",
    "protein?? vegetal?? din soia",
    "amidon din cartofi",
    "fum",
    "rozmarin",
    "glucoz??",
    "glucose",
    "cafea",
    "extract din mal?? din orz",
    "monogliceride",
    "digliceride",
    "ulei de palmier",
    "cacao degresat?? pudr??",
    "lapte praf degresat",
    "arome naturale din fructe",
    "arom?? natural?? de vanilie",
    "afine",
    "orz",
     "gr??sime vegetal??",
     "vanilin??",
     "hri??c??",
     "GOSSYPIUM HERBACEUM (COTTON) EXTRACT",
     "zaharin??",
     "zaharin?? sodic??",
     "pectin",
     "cellulose ",
     "sorbitol",
     "proteine din lapte",
     "ulei de floarea soarelui",
     "??elin??",
     "amidon din gr??u",
     "ciuperci",
     "maltodextrin",
     "legume deshidratate",
     "extract de boia de ardei",
     "vitamina B2",
     "mal?? din orz",
     "bicarbonat de sodiu",
     "t??r????e de gr??u",
     "suc de mere",
     "mal?? din porumb",
     "tartrat de potasiu",
     "bicarbonat de amoniu",
     "glicerol",
     "porumb",
     "alfa-tocoferol",
     "lapte integral pasteurizat",
     "carbonat de amoniu",
     "gr??simi vegetale nehidrogenate",
     "o??et",
     "edta",
     "edetic acid",
    "pudr?? de ro??ii",
    "vitamina b3",
    "acid pantotenic",
    "acid folic",
    "vitamina b6",
    "ardei iute",
    "suc de fructe",
    "dioxid de carbon",
    "suc de l??m??ie",
    "suc de portocale",
    "gum?? arabica",
    "gum?? de acacia",
    "praz",
    "extract de pui",
    "piper",
    "gri?? din gr??u",
    "unt de arahide",
    "past?? de arahide",
    "m??lai",
    "pudr??  de br??nz??",
    "praf de g??lbenu?? de ou",
    "praf de albu?? de ou",
    "plante aromatice",
    "ulei de m??sline",
    "drojdie",
    "maia",
    "f??in?? de soia",
    "fulgi de cocos",
    "cocos",
    "gr??simi din unt",
    "stafide",
    "caju",
    "extract de vanilie",
    "past?? de migdale",
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

    document.getElementById("BadIngred").innerHTML = `Produsul con??ine ingred. periculoase:${badding}(${Math.round((badding * 100) / indices.length)}%)`;

    if (badding == 0) {
        let BadIngre = document.createElement("li");
        let text = document.createTextNode("Produsul nu con??ine ingred. periculoase");
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

    document.getElementById("GoodPer").innerHTML = `Produsul con??ine ingred. bune:${gooding}(${Math.round((gooding * 100) / indices.length)}%)`;
    if (gooding == 0) {
        let goodIngre = document.createElement("li");
        let text = document.createTextNode("Produsul nu con??ine ingred. bune");
        goodIngre.appendChild(text);//appendChild adauga un element html

        good.appendChild(goodIngre);
    }
    document.getElementById("log").style.visibility = "visible";
    document.getElementById("mainLists").style.visibility = "visible"; //cauta un element dup?? id-ul elementului
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
			//document.getElementById("GoodPer").innerHTML = `Produsul con??ine ingred. bune:${gooding}(${Math.round((gooding * 100) / indices.length)}%)`;

            if (allgiensNo == 0) {
                let allgIngre = document.createElement("li");
                let text = document.createTextNode("Produsul nu con??ine alergeni");
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