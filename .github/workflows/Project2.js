$(loadAllCoins());
let countCoinChoose = 0;
let coinChoose = new Array(5);
let moreInfoCoinMap = new Map();
const TWO_MINUTES = 120000;
let numIndexCoinInArray = 0;
let lastChooseCoinCard = null;
let qOnLoad = true;
coinChoose.fill(null);

function loadAllCoins() {
    $.get("https://api.coingecko.com/api/v3/coins").then(
        function (data, status) {
            data.forEach(index => {
                let newCard = creatNewCard(index);
                $(".container").append(newCard);
                if (checkButtonFromStorage(index.symbol)) {
                    let containerCoinCards = document.getElementById("container");
                    containerCoinCards.children[containerCoinCards.children.length - 1].children[1].children[0].children[0].checked = true;
                    if (qOnLoad) {
                        coinChoose[numIndexCoinInArray] = newCard;
                        numIndexCoinInArray++;
                    }
                }
            })
            qOnLoad = false;
        }
    )
}

function checkButtonFromStorage(coinSymbol) {
    let strSymbolCoinChooseStorage = localStorage.getItem("symbolCoinChooseStorage");
    let symbolCoinChooseStorageArr;
    if (strSymbolCoinChooseStorage != null) {
        symbolCoinChooseStorageArr = JSON.parse(strSymbolCoinChooseStorage);
        for (let index = 0; index < symbolCoinChooseStorageArr.length; index++) {
            if (symbolCoinChooseStorageArr[index] == coinSymbol) {
                return true;
            }
        }
    }
    return false;
}

function creatNewCard(index) {
    let coinID = index.id;
    let coinSymbol = index.symbol;
    let coinName = index.name;
    let coinImg = index.image.small;
    let newCard = creatNewDiv(coinID);
    newCard.children[0].innerHTML = coinSymbol;
    newCard.children[3].innerHTML = coinName;
    newCard.children[4].children[0].src = coinImg;
    return newCard;
}

function creatNewDiv(coinId) {
    let newDiv = document.createElement("div");
    newDiv.id = coinId;
    newDiv.className = "coinCard";
    newDiv = fillNewDivWithElement(newDiv, coinId);
    return newDiv;
}

function fillNewDivWithElement(newDiv, coinId) {
    let symbolParagraph = creatNewParagraph();
    let nameParagraph = creatNewParagraph();
    let moreInfoBtn = creatNewButton(coinId);
    let newToggleBtn = creatNewToggleButton();
    let imgDiv = creatImgCoin();
    let newBR = document.createElement("br");
    newDiv.append(symbolParagraph);
    newDiv.append(newToggleBtn);
    newDiv.append(newBR);
    newDiv.append(nameParagraph);
    newDiv.append(imgDiv);
    newDiv.append(moreInfoBtn);
    return newDiv;
}

function creatNewParagraph() {
    let newP = document.createElement("p");
    newP.className = "coinDetiles";
    return newP;
}

function creatNewButton(coinId) {
    let newButton = document.createElement("input");
    newButton.type = "button";
    newButton.id = coinId;
    newButton.addEventListener("click", changeTheInformationDisplayed);
    newButton.value = "More info";
    newButton.className = "moreInfo";
    return newButton;
}

function creatNewToggleButton() {
    let newDivToggle = document.createElement("div");
    newDivToggle.className = "toggleDiv";
    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.addEventListener("click", checkCoin, true);
    let newSpan = document.createElement("span");
    newSpan.className = "slider round";
    let newLabel = document.createElement("label");
    newLabel.className = "switch";
    newLabel.append(newInput);
    newLabel.append(newSpan);
    newDivToggle.append(newLabel);
    return newDivToggle;
}

function checkCoin() {
    let thisDiv = this.parentElement.parentElement.parentElement;
    let findPlace = false;
    
    if (this.checked) {
        for (let index = 0; index < coinChoose.length; index++) {
            if (coinChoose[index] == null) {
                let thisDivToArray = thisDiv.cloneNode(true);
                coinChoose[index] = thisDivToArray;
                innerCoinChooseToStorage(thisDiv.children[0].innerHTML);
                findPlace = true;
                break;
            }
        }
        
        if (findPlace == false) {
            lastChooseCoinCard = thisDiv;
            creatModalOverFiveChoose(thisDiv);
        }
    }
    
    else {
        for (let index = 0; index < coinChoose.length; index++) {
            if (coinChoose[index] != null) {
                if (coinChoose[index].id == thisDiv.id) {
                    coinChoose[index] = null;
                    deleteCoinChooseFromStorage(thisDiv.children[0].innerHTML);
                    break;
                }
            }
        }
    }
}

function creatModalOverFiveChoose(thisDiv) {
    disableNavBarButtons();
    let modalDiv = document.getElementById("myModal");
    let Xbuttonmodal = document.getElementById("buttonX");
    
    Xbuttonmodal.onclick = function () {
        modalDiv.style.display = "none";
        $("#modalBody").empty();
        lastChooseCoinCard.children[1].children[0].children[0].checked = false;
        enableNavBarButtons();
    }
    
    let modalBodyDiv = document.getElementById("modalBody");
    for (let index = 0; index < coinChoose.length; index++) {
        let coinCardToModal = coinChoose[index].cloneNode(true);
        coinCardToModal.children[5].addEventListener("click", changeTheInformationDisplayed);
        modalBodyDiv.appendChild(coinCardToModal);
    }
    
    let thisCoinCardToAppend = thisDiv.cloneNode(true);
    thisCoinCardToAppend.children[5].addEventListener("click", changeTheInformationDisplayed);
    modalBodyDiv.append(thisCoinCardToAppend);
    modalDiv.style.display = "block";
    
    window.onclick = function (event) {
        if (event.target == modalDiv) {
            modalDiv.style.display = "none";
            $("#modalBody").empty();
            lastChooseCoinCard.children[1].children[0].children[0].checked = false;
            enableNavBarButtons();
        }
    }
}

function cancleChangeModal() {
    let modalDiv = document.getElementById("myModal");
    modalDiv.style.display = "none";
    lastChooseCoinCard.children[1].children[0].children[0].checked = false;
    let titleModal = document.getElementById("secondTitleModal");
    titleModal.style.color = "green";
    $("#modalBody").empty();
    enableNavBarButtons();
}

function confirnChangeModal() {
    let countCoinCardChoose = 0;
    let modalBodyDiv = document.getElementById("modalBody");
    
    for (let index = 0; index <= 5; index++) {
        let thisCoinCardToggleInput = modalBodyDiv.children[index].children[1].children[0].children[0].checked;
        
        if (thisCoinCardToggleInput) {
            countCoinCardChoose++;
        }
        
        else {
            let containerCoinCards = document.getElementById("container");
            
            for (let index2 = 0; index2 < coinChoose.length; index2++) {
                if (coinChoose[index2] != null) {
                    if (modalBodyDiv.children[index].id == coinChoose[index2].id) {
                        coinChoose[index2] = null;
                        break;
                    }
                }
            }
            
            for (let index2 = 0; index2 < containerCoinCards.children.length; index2++) {
                if (modalBodyDiv.children[index].id == containerCoinCards.children[index2].id) {
                    containerCoinCards.children[index2].children[1].children[0].children[0].checked = false;
                    break;
                }
            }
            
            if (lastChooseCoinCard.id != modalBodyDiv.children[index].id) {
                deleteCoinChooseFromStorage(modalBodyDiv.children[index].children[0].innerHTML);
            }
        }
    }
    
    if (countCoinCardChoose < 6) {
        let modalDiv = document.getElementById("myModal");
        modalDiv.style.display = "none";
        $("#modalBody").empty();
        
        if (lastChooseCoinCard.children[1].children[0].children[0].checked) {
            for (let index = 0; index < coinChoose.length; index++) {
                if (coinChoose[index] == null) {
                    let coinCardToArray = lastChooseCoinCard.cloneNode(true);
                    coinChoose[index] = coinCardToArray;
                    let modalBodyTitleDiv = document.getElementById("modalBodyTitle");
                    modalBodyTitleDiv.style.backgroundColor = "transparent";
                    break;
                }
            }
            
            innerCoinChooseToStorage(lastChooseCoinCard.children[0].innerHTML);
            let titleModal = document.getElementById("secondTitleModal");
            titleModal.style.color = "green";

        }
        enableNavBarButtons();
    }
    
    else {
        let titleModal = document.getElementById("secondTitleModal");
        titleModal.style.color = "red";
    }
    // lastChooseCoinCard = null;
}

function innerCoinChooseToStorage(coinSymbol) {
    let strSymbolCoinChooseStorage = localStorage.getItem("symbolCoinChooseStorage");
    let symbolCoinChooseStorageArr;
    
    if (strSymbolCoinChooseStorage == null) {
        symbolCoinChooseStorageArr = new Array();
    }
    else {
        symbolCoinChooseStorageArr = JSON.parse(strSymbolCoinChooseStorage);
    }
    
    symbolCoinChooseStorageArr.push(coinSymbol);
    localStorage.setItem("symbolCoinChooseStorage", JSON.stringify(symbolCoinChooseStorageArr));
}

function deleteCoinChooseFromStorage(coinSymbol) {
    let strSymbolCoinChooseStorage = localStorage.getItem("symbolCoinChooseStorage");
    let symbolCoinChooseStorageArr = JSON.parse(strSymbolCoinChooseStorage);
    let indexOfCoinToDelete = symbolCoinChooseStorageArr.indexOf(coinSymbol);
    symbolCoinChooseStorageArr.splice(indexOfCoinToDelete, 1);
    localStorage.setItem("symbolCoinChooseStorage", JSON.stringify(symbolCoinChooseStorageArr));
}

function disableNavBarButtons() {
    document.getElementById("home").disabled = true;
    document.getElementById("liveReprts").disabled = true;
    document.getElementById("about").disabled = true;
    document.getElementById("searchButton").disabled = true;
    document.getElementById("symbolSearch").disabled = true;
}

function enableNavBarButtons() {
    document.getElementById("home").disabled = false;
    document.getElementById("liveReprts").disabled = false;
    document.getElementById("about").disabled = false;
    document.getElementById("searchButton").disabled = false;
    document.getElementById("symbolSearch").disabled = false;
}

function creatImgCoin() {
    let divCoinImg = document.createElement("div");
    divCoinImg.className = "imgCoinDiv";
    let imgTag = document.createElement("img");
    imgTag.id = "imgCoin";
    divCoinImg.append(imgTag);
    return divCoinImg;
}

function changeTheInformationDisplayed() {
    let thisDiv = this.parentElement;
    let button = this;
    
    if (button.value == "More info") {
        let loadindGIFDiv = document.createElement("div");
        loadindGIFDiv.className = "loadindGIFDiv";
        let loadindGIF = document.createElement("img");
        loadindGIF.src = "1_e_Loq49BI4WmN7o9ItTADg.gif";
        loadindGIF.style.width = "60px";
        loadindGIF.style.height = "40px";
        loadindGIFDiv.append(loadindGIF);
        thisDiv.append(loadindGIFDiv);
        thisDiv.style = "animation: fadeIn 2s forwards";
        button.value = "Less info";
        button.style = "animation: fadeInButton 2s forwards";
        if (moreInfoCoinMap.has(thisDiv.id)){
            let allPrice = moreInfoCoinMap.get(thisDiv.id);
            newDivCoin = getDetilesToMoreInfo(allPrice);
            thisDiv.children[6].remove();
            thisDiv.append(newDivCoin);
            moreInfoCoinMap.set(thisDiv.id, allPrice);
        }
        else{
        $.get("https://api.coingecko.com/api/v3/coins/" + thisDiv.id).then(
            function (data, status) {
                let allPrice = data.market_data.current_price;
                newDivCoin = getDetilesToMoreInfo(allPrice);
                thisDiv.children[6].remove();
                thisDiv.append(newDivCoin);
                moreInfoCoinMap.set(thisDiv.id, allPrice);
                setTimeout(function() {
                    moreInfoCoinMap.delete(thisDiv.id);
                }, TWO_MINUTES);
            }
        )}
    }
    
    else {
        thisDiv.style = "animation: fadeOut 2s forwards";
        button.value = "More info";
        button.style = "animation: fadeOutButton 2s forwards";
        thisDiv.children[6].remove();
    }
}

function getDetilesToMoreInfo(allPrice){
    let usdP = creatNewParagraph();
    let eurP = creatNewParagraph();
    let ilsP = creatNewParagraph();
    let newDivCoin = document.createElement("div");
    newDivCoin.className = "divCoinValue";
    let usdValue = allPrice.usd;
    usdP.innerHTML = "<br>USD: " + usdValue + " $";
    let eurValue = allPrice.eur;
    eurP.innerHTML = "EUR: " + eurValue + " €";
    let ilsValue = allPrice.ils;
    ilsP.innerHTML = "ILS: " + ilsValue + " ₪";
    newDivCoin.append(usdP, eurP, ilsP);
    return newDivCoin;
}
function showHomePage() {
    $(".container").empty();
    document.getElementById("aboutMe").style.display = "none";
    document.getElementById("faildSearch").style.display = "none";
    document.getElementById("liveReports").style.display = "none";
    document.getElementById("faildLiveReports").style.display = "none";
    loadAllCoins();
}

function checkIfChooseCoinToLiveReports(){
    let strCoinChooseToLiveReports = localStorage.getItem("symbolCoinChooseStorage");
    let coinChooseToLiveReports = JSON.parse(strCoinChooseToLiveReports);
    
    if (coinChooseToLiveReports == null || coinChooseToLiveReports.length == 0){
        $(".container").empty();
        document.getElementById("aboutMe").style.display = "none";
        document.getElementById("faildSearch").style.display = "none";
        document.getElementById("liveReports").style.display = "none";
        document.getElementById("faildLiveReports").style.display = "block";

    }
    
    else {
        $(".container").empty();
        document.getElementById("aboutMe").style.display = "none";
        document.getElementById("faildSearch").style.display = "none";
        document.getElementById("liveReports").style.display = "block";
        document.getElementById("faildLiveReports").style.display = "none";
        showLiveReports(coinChooseToLiveReports);
    }
}

function showLiveReports(coinChoose){
    let date = new Date();

    var option = {
        title: {
            text: "Live Reports"
        },
        data: [],
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats:{
                            second: 'hh:mm:ss'
                        } 
                    }
                }]
            }
        }
    };
    $("#liveReports").CanvasJSChart(option);
    let newStrCoinChoos = creatStringToSearchAtAPI(coinChoose);
    for (let index = 0; index < coinChoose.length; index++){
        option.data.push(creatNewData(coinChoose[index]));
    }
    updateData();
    var xValue = date;

    function addData(data) {
        // console.log(data);
        for (let index = 0; index < coinChoose.length; index++){
            option.data[index].dataPoints.push({x: xValue, y: data[coinChoose[index].toUpperCase()].USD});
            if (option.data[index].dataPoints.length > 10){
                option.data[index].dataPoints.splice(0,1);
            }
        }
        date = new Date();
        xValue = date;
        $("#liveReports").CanvasJSChart().render();
        setTimeout(updateData, 2000);
    }

    function updateData() {
        $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + newStrCoinChoos + "&tsyms=USD", addData);
    }
    
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}

function creatStringToSearchAtAPI(coinChoose){
    let strCoinChoos;
    for (let index = 0; index < coinChoose.length; index++){
        if (index == 0){
            strCoinChoos = coinChoose[index];
        }
        else {
            strCoinChoos = strCoinChoos + "," + coinChoose[index];
        }
    }
    return strCoinChoos;
}

function creatNewData(coinSymbol){
    let dataPoints = [];
    let newData = {
        type: "spline",
        name: coinSymbol,
        showInLegend: true,
        xValueFormatString: 'hh:mm:ss',
        yValueFormatString: "#,##0.## $",
        dataPoints: dataPoints
    }
    return newData;
}

function showAbout() {
    $(".container").empty();
    document.getElementById("faildSearch").style.display = "none";
    document.getElementById("aboutMe").style.display = "block";
    document.getElementById("liveReports").style.display = "none";
    document.getElementById("faildLiveReports").style.display = "none";
}

function showSearchResults() {
    document.getElementById("faildSearch").style.display = "none";
    document.getElementById("aboutMe").style.display = "none";
    document.getElementById("liveReports").style.display = "none";
    document.getElementById("faildLiveReports").style.display = "none";
    let find = false;
    let symbolToSearch = document.getElementById("symbolSearch").value.toLowerCase().trim();
    $(".container").empty();
    
    $.get("https://api.coingecko.com/api/v3/coins").then(
        function (data, status) {
            data.forEach(index => {
                let thisSymbol = index.symbol;
                if (thisSymbol == symbolToSearch) {
                    find = true;
                    let newCard = creatNewCard(index);
                    $(".container").append(newCard);
                    if (checkButtonFromStorage(index.symbol)) {
                        let containerCoinCards = document.getElementById("container");
                        containerCoinCards.children[containerCoinCards.children.length - 1].children[1].children[0].children[0].checked = true;
                    }
                    
                }
            })
            if (!find) {
                document.getElementById("faildSearch").style.display = "block";
            }
        }
    )
}
// function showSearchResultsAfterConfirn(){

// }