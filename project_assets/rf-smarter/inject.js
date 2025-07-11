function createPanelExperience() {
    const panelWrapperSpace = 150;
    // create stylesheet for easy reverting of panel experience
    const mainDocStyles = document.createElement('style');
    mainDocStyles.innerHTML = `
        html {
            background-color: #fcf7e9 !important;
        }
        body {
            width: 80% !important;
            min-width: fit-content !important;
            height: calc(100% - ${panelWrapperSpace}px) !important;
            border: 4px solid #356859 !important;
            border-radius: 10px !important;
            margin: 10px 0 0 50% !important;
            transform: translateX(-50%) !important;
        }
    `;
    document.head.appendChild(mainDocStyles);
    

    // create border around the page
    const borderwrap = document.createElement('borderwrap');
    borderwrap.style.cssText = `
        position: fixed;
        width: calc(100% + 10px);
        height: calc(100% + 10px);
        z-index: 2147483647;
        border-radius: 15px;
        border: 5px solid rgb(53, 104, 89);
        top: -5px;
        left: -5px;
        pointer-events: none;
    `;
    document.body.appendChild(borderwrap);

    
    // create panel below the page
    const panelWrapper = document.createElement('div');
    panelWrapper.style.cssText = `
        position: fixed;
        width: calc(100% + 20px);
        height: ${panelWrapperSpace-20}px;
        z-index: 999999999999;
        bottom: 0;
        left: -10px;
        padding: 10px;
        transform: translateY(calc(100% + 10px));
        background-color: #fcf7e9;
    `;
    panelWrapper.innerHTML = `
        <smarterpanel>
            <div id="BECKER_panel_uploadPage" style="width:100%; height:100%;">
                <p>
                    <button onclick="window.CSVfileInput.click()" style="margin:0 10px">Load CSV file from your computer</button>
                    OR
                    <button onclick="window.BeckerDrivefileInput.click()" style="margin:0 10px">Load CSV file from BeckerDrive</button>

                    <button class="focus" id="startAutomationBtn" style="margin:10px;display:none">Oh no! Something went wrong!</button>
                </p>
            </div>
            <div id="BECKER_panel_ProgressPage" style="width:100%; height:100%; display:none">
                <br>
                <div id="BECKER_ProgressBar">
                    <bar style="width:0%"></bar>
                </div>
                <div style="display: flex; flex-wrap: wrap; align-items: center;">
                    <div id="BECKER_ProgressBarText" style="padding:5px"></div>
                    <button onclick="window.viewFailedItems()" style="margin-left: 25px;">View Failed Item Codes (<span id="BECKER_failedItemCodesCount">0</span>)</button>
                </div>
            </div>
            <button onclick="window.revertFromPanelExperience()" id="closeBtn">Close Panel Layout</button>
        </smarterpanel>
    `;
    document.body.appendChild(panelWrapper);
    
    // add css style
    const panelStyles = document.createElement('style');
    panelStyles.innerHTML = `
        smarterpanel {
            display: block;
            position: relative;
            width: 100%;
            height: 100%;
            padding: 10px;
            border-radius: 10px;
            border: 5px solid #356859;
            background-color: #fcf7e9;
        }
        smarterpanel #closeBtn {
            position:absolute;
            right:-1px;
            bottom:-1px;
            background-color: #356859;
            color: #fcf7e9;
            border-radius: 10px 0 0 0;
            border: none;
        }
        smarterpanel button {
            padding: 5px 10px;
            border: 2px solid #356859;
            background-color: #fcf7e9;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
            cursor: pointer;
        }
        smarterpanel button.focus {
            padding: 5px 10px;
            border: 2px solid #fcf7e9;
            background-color: #356859;
            color: #fcf7e9;
            border-radius: 10px;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
            cursor: pointer;
        }
        smarterpanel a {
            border: none !important;
            background: inherit !important;
            text-decoration: underline !important;
            color: green !important;
        }
        #BECKER_ProgressBar {
            box-sizing: border-box;
            position: relative;
            width: 100%;
            height: 20px;
            border: 2px solid #356859;
        }
        #BECKER_ProgressBar bar {
            box-sizing: border-box;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #356859;
        }
    `;
    document.head.appendChild(panelStyles);

    // create CSV file Upload
    const CSVfileInput = document.createElement('input'); // hidden file input
    CSVfileInput.type = 'file';
    CSVfileInput.accept = '.csv';
    CSVfileInput.style.display = 'none';
    document.body.appendChild(CSVfileInput);
    window.CSVfileInput = CSVfileInput;

    const BeckerDrivefileInput = document.createElement('input'); // hidden file input
    BeckerDrivefileInput.setAttribute('beckerdrive', '');
    BeckerDrivefileInput.type = 'file';
    BeckerDrivefileInput.accept = '.csv';
    BeckerDrivefileInput.style.display = 'none';
    document.body.appendChild(BeckerDrivefileInput);
    window.BeckerDrivefileInput = BeckerDrivefileInput;

    const handleFileSelect = (e) => { // on file select
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            const csvToArray = (csv) => {
                rows = csv.split("\n");
                rows = rows.filter(row => row.trim() !== '');

                return rows.map(function (row) {
                    return row.split(",");
                });
            };
            const countSNs = (Arr2D) => {
                let obj = {};
                Arr2D.forEach(row => {
                    if (obj[row[0]]) {
                        obj[row[0]] += 1;
                    } else {
                        obj[row[0]] = 1;
                    }
                });
                let SNs = [];
                for (let key in obj) {
                    SNs.push([key, obj[key]]);
                }
                return SNs;
            }
            reader.onload = function () {
                const csvData = reader.result;
                let data = csvToArray(csvData);
                // if only 1 column, count occurrences and add it to a second column
                if (data.every(row => row.length === 1)) {
                    data = countSNs(data);
                }
                
                window.BECKER_arrayToBeAutomated = data;
                document.getElementById('startAutomationBtn').onclick = BECKER_startAutomationProcess;
                document.getElementById('startAutomationBtn').innerText = 'Start automated count submission for ' + data.length + ' items';
                document.getElementById('startAutomationBtn').style.display = 'unset';
            };
            reader.readAsText(file);
        }
    };
    CSVfileInput.addEventListener('change', handleFileSelect, false);
    BeckerDrivefileInput.addEventListener('change', handleFileSelect, false);

    const beckerDriveScipt = document.createElement('script');
    beckerDriveScipt.src = 'https://21beckem.github.io/BeckerDrive/beckerdrive.js';
    document.head.appendChild(beckerDriveScipt);


    // prevent refresh/redirect
    window.onbeforeunload = function() {
        return "Dude, are you sure you want to leave? Think of the kittens!";
    }

    // add revert function
    window.revertFromPanelExperience = () => {
        if (confirm("Are you sure you want to close this panel? Doing so will lose your progress! Be sure to save any failed item codes first!")) {
            mainDocStyles.remove();
            panelStyles.remove();
            borderwrap.remove();
            panelWrapper.remove();
            CSVfileInput.remove();
            BeckerDrivefileInput.remove();
            beckerDriveScipt.remove();
            makeBeginButton();
            window.onbeforeunload = null;
        }
    }
}



function makeBeginButton() {
    // create reload button
    const reloadBtn = document.createElement('button');
    reloadBtn.id = 'custom-reload-btn';
    reloadBtn.innerHTML = `<svg style="width:22px" viewBox="0 0 24 24" id="refresh"><g><path d="M20.3 13.43a1 1 0 0 0-1.25.65A7.14 7.14 0 0 1 12.18 19 7.1 7.1 0 0 1 5 12a7.1 7.1 0 0 1 7.18-7 7.26 7.26 0 0 1 4.65 1.67l-2.17-.36a1 1 0 0 0-1.15.83 1 1 0 0 0 .83 1.15l4.24.7h.17a1 1 0 0 0 .34-.06.33.33 0 0 0 .1-.06.78.78 0 0 0 .2-.11l.09-.11c0-.05.09-.09.13-.15s0-.1.05-.14a1.34 1.34 0 0 0 .07-.18l.75-4a1 1 0 0 0-2-.38l-.27 1.45A9.21 9.21 0 0 0 12.18 3 9.1 9.1 0 0 0 3 12a9.1 9.1 0 0 0 9.18 9A9.12 9.12 0 0 0 21 14.68a1 1 0 0 0-.7-1.25z"></path></g></svg>`;
    reloadBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 7px;
        padding: 10px 10px 5px;
        z-index: 9999;
        border: 2px solid rgb(53, 104, 89);
        background-color: rgb(252, 247, 233);
        border-radius: 50%;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
        cursor: pointer;
    `;
    reloadBtn.onclick = () => {
        location.reload();
    };
    document.body.appendChild(reloadBtn);

    // create begin button
    const btn = document.createElement('button');
    btn.id = 'custom-float-btn';
    btn.textContent = "I'm Ready. Let's Begin!";
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 60px;
        padding: 10px 20px;
        z-index: 9999;
        border: 2px solid #356859;
        background-color: #fcf7e9;
        border-radius: 3px;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 6px;
        cursor: pointer;
    `;
    btn.onclick = () => {
        createPanelExperience();
        btn.remove();
        reloadBtn.remove();
    };
    document.body.appendChild(btn);
}
makeBeginButton();


window.BECKER_consoleSaidThatItemDoesntExist = false;
window.BECKER_listOfItemsThatDontExist = [];
window.myDataWindow = null;
window.viewFailedItems = () => {
    if (window.myDataWindow) {
        window.myDataWindow.close();
    }
    let URL = 'https://21beckem.github.io/becker-suite-public-assets/display2DarrayAsTable.html?data=';
    let failedItems = [...window.BECKER_listOfItemsThatDontExist];
    failedItems.unshift(['Item Code', 'Quantity']);
    if (window.BECKER_listOfItemsThatDontExist.length === 0) {
        failedItems = [['No Failed Items Found']];
    }
    URL += encodeURIComponent(JSON.stringify(failedItems));
    window.myDataWindow = window.open(URL, '_blank', 'width=200,height=600');
    window.myDataWindow.resizeTo(400,800);
    window.myDataWindow.moveTo(300, 100);
    window.myDataWindow.focus();
}

// function to start the automation
async function BECKER_startAutomationProcess() {
    // check to see if the array exists
    if (!window.BECKER_arrayToBeAutomated) {
        alert("Please select a file first.");
        return;
    }
    // check to see if the item input field exists
    if (!document.getElementById("input_viewItem_Item")) {
        alert("Oh No! Looks like we can't find where to type in the item numbers!");
        return;
    }
    // show the progress page
    document.getElementById('BECKER_panel_uploadPage').style.display = 'none';
    document.getElementById('BECKER_panel_ProgressPage').style.display = 'unset';


    // define how to update the progress bar
    function BECKER_updateProgress(complete, total) {
        document.querySelector('#BECKER_ProgressBar bar').style.width = `${(complete / total) * 100}%`;
        document.getElementById('BECKER_ProgressBarText').innerHTML = `Complete: ${complete}<br>Total: ${total}`;
    }


    // define how to handle the case when the code says no matches
    window.BECKER_consoleSaidThatItemDoesntExist = false;
    window.BECKER_listOfItemsThatDontExist = [];
    function BECKER_didThisItemCodeSayNoMatches(item) {
        if (window.BECKER_consoleSaidThatItemDoesntExist) {
            window.BECKER_consoleSaidThatItemDoesntExist = false;
            window.BECKER_listOfItemsThatDontExist.push(item);
            document.getElementById('BECKER_failedItemCodesCount').innerText = window.BECKER_listOfItemsThatDontExist.length;
            return true;
        }
        return false;
    }

    // define how to automate each item
    async function BECKER_automateItem(item) {
        await new Promise(r => setTimeout(r, 500));
        // input item number
        document.getElementById('input_viewItem_Item').value = item[0];
        // simulate 2 enter-keys
        setTimeout(() => {window.sendEnterToPython();},  10);
        setTimeout(() => {window.sendEnterToPython();}, 200);
        console.log('waiting for count input');
        
        // wait until count input exists
        await new Promise(r => setTimeout(r, 1500));
        while (!document.getElementById("input_viewItem_Count")) {
            await new Promise(r => setTimeout(r, 250));
            if (BECKER_didThisItemCodeSayNoMatches(item)) return;


            await new Promise(r => setTimeout(r, 3000));                                   //  REMOVE THESE TWO
            document.getElementById('input_viewItem_Item').id = 'input_viewItem_Count';    //  LINES LATER!!!!
        }
        await new Promise(r => setTimeout(r, 500));

        document.getElementById('input_viewItem_Count').id = 'input_viewItem_Item';        // REMOVE THESE TWO
        return;                                                                            // LINES LATER!!!!


        // input count
        document.getElementById('input_viewItem_Count').value = item[1];
        // simulate 2 enter-keys
        setTimeout(() => {window.sendEnterToPython();},  10);
        setTimeout(() => {window.sendEnterToPython();}, 200);
        
        // wait until item number input exists
        await new Promise(r => setTimeout(r, 1500));
        while (!document.getElementById('input_viewItem_Item')) {
            await new Promise(r => setTimeout(r, 250));
        }
    }
    
    // automate each item
    BECKER_updateProgress(0, window.BECKER_arrayToBeAutomated.length);
    for (let i = 0; i < window.BECKER_arrayToBeAutomated.length; i++) {
        await BECKER_automateItem(window.BECKER_arrayToBeAutomated[i]);
        BECKER_updateProgress(i + 1, window.BECKER_arrayToBeAutomated.length);
    }
}

// set favicon to BeckerSuite
function setFavicon(href) {
    if (document.querySelector("link[rel*='icon']")) {
        document.querySelector("link[rel*='icon']").href = href;
    } else {
        const fav = document.createElement("link");
        fav.rel = "icon";
        fav.href = href;
        document.head.appendChild(fav);
    }
}
setFavicon("https://raw.githubusercontent.com/21beckem/becker-suite-public-assets/refs/heads/main/logo.png");
