var titleH1 = document.getElementsByTagName("h1")[0].innerHTML;
if (titleH1.indexOf('Edit Cloud - ') >= 0) {
    cloudName = document.getElementById("cloud_name").innerHTML;
} else {
    cloudName = "Undefined";
}
var cookieData = "";
var newDiv = "";
var flagDiv;
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =
    '.highlightFlagOff { border: 2px solid red;padding:1px;padding-top:3px;margin-top:2px;margin-bottom:1px;border-radius:5px;display:inline-block } .highlightFlagOn { border: 2px solid green; padding:1px;padding-top:3px;margin-right:2px;border-radius:5px;display:inline-block } .enum-multi { margin:3px 0;} table {border-collapse: collapse;margin: 20px 0} table td { padding: 5px;} table thead th { background-color: #54585d;color: #ffffff;font-weight: bold;font-size: 13px;border: 1px solid #54585d;padding:3px} table tbody td {color: #636363;border: 1px solid #dddfe1;} table tbody tr { background-color: #f9fafb;} table tbody tr:nth-child(odd) {background-color: #ffffff;}';
document.getElementsByTagName('head')[0].appendChild(style);

function buildTable() {
    /* See if any previous saves have been made */
    savedListString = getCookie("PG-Saved-List");
    savedListArray = savedListString.split("|").filter(Boolean);
    var newTable = "<table id='cookieTable'>";
    newTable += "<thead><tr>";
    newTable += "<th>Cloud</th>";
    newTable += "<th>Date Saved</th>";
    newTable += "<th># Flags</th>";
    newTable += "<th>Update</th>";
    newTable += "<th>Remove</th>";
    newTable += "</tr></thead>";
    for (i = 0; i < savedListArray.length; i++) {
        newTable += "<tr>";
        var savedData = savedListArray[i].split("@@");
        newTable += "<td>" + savedData[0] + "</td>";
        var date = new Date(Number(savedData[1]));
        newTable += "<td>" + date.toGMTString() + "</td>";
        newTable += "<td>" + savedData[2] + "</td>";
        newTable +=
            "<td><button class='applyFlagsButton' id='applyFlagsButton" +
            i + "'>Apply Flags</button></td>";
        newTable +=
            "<td><button class='deleteButton' id='deleteButton" +
            i + "' value='" + i + "'>Delete</button></td>";
        newTable += "</tr>";
    }
    newTable += "</table>";
    return newTable;
}

function readCurrentFlags() {
    /* Cycle through all the flags on the page and assemble a list of the checked ones. 
     TODO - maybe a hash to check there have been no significant changes? */
    var cookieArray = [];
    var flagsArray = [];
    var emFlags = document.getElementsByClassName("enum-multi");
    for (i = 0; i < emFlags.length; i++) {
        var flagName = emFlags[i].getElementsByTagName("label")[0]
            .innerHTML;
        var flagId = emFlags[i].getElementsByTagName("input")[0].id;
        var flagChecked = emFlags[i].getElementsByTagName("input")[
            0].checked;
        var flagClasses = emFlags[i].classList;
        var flagNotAllowed = String(flagClasses).includes(
            "ui_update_disallowed_flag");
        if (flagId.includes("flags")) {
            flagsArray.push([flagId, flagName, flagChecked,
                flagNotAllowed
            ]);
        };
        if (flagId.includes("flags") && flagChecked) {
            let result = flagId.match(
                /flags([0-9]?)_list_([0-9]+)/);
            /* To save space you take  flags3_list_8 and convert to 3_8 */
            cookieArray.push(result[1] + "_" + result[2]);
        };
    };
    /* Return flagsArray which is everything and cookieArray which is just the checked flags */
    return [flagsArray, cookieArray];
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires +
        ";path=/";
};

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

function deleteCookie(cname) {
    document.cookie = cname + '=; Max-Age=1; path=/';
}

function saveFlags() {
    /* Saves the current list of flags to a new cookie.*/
    timeNow = Date.now();
    var currentFlags = readCurrentFlags();
    cookieData = currentFlags[1].join("|");
    var numOfFlags = currentFlags[0].length;
    var cookieName = "PG-" + cloudName + "@@" + timeNow + "@@" + numOfFlags;
    setCookie(cookieName, cookieData, 1000);
    /* Add the new one to the list */
    savedListArray.push(cookieName);
    savedListString = savedListArray.join("|");
    setCookie("PG-Saved-List", savedListString, 1000);
    /* rebuild the table */
    var savedTable = document.getElementById("savedTable");
    savedTable.innerHTML = buildTable();
    addTableEventListeners();
}

function deleteFlag(flagNum) {
    savedListString = getCookie("PG-Saved-List");
    savedListArray = savedListString.split("|").filter(Boolean);
    var deletedCookie = savedListArray.splice(flagNum, 1);
    savedListString = savedListArray.join("|");
    setCookie("PG-Saved-List", savedListString, 1000);
    deleteCookie(deletedCookie);
    var savedTable = document.getElementById("savedTable");
    savedTable.innerHTML = buildTable();
    addTableEventListeners();
}

function toggleWindow() {
    if (flagDiv.style.display === "none") {
        flagDiv.style.display = "block";
    } else {
        flagDiv.style.display = "none";
    }
}

function buildContents() {
    newDiv +=
        "<div style='background:white;color:black;width:800px;height:auto;position:relative;margin:0 auto;padding:30px;'>";
    newDiv +=
        "<img src='https://res.cloudinary.com/patrickg/image/upload/f_auto/q_auto/w_200/cloudinary_logo.png'>"
    newDiv +=
        "<h1 style='margin-bottom:40px'>Admin Flags Manager</h1>";
    if (cloudName != "Undefined") {
        newDiv +=
            "<div id='saveButton'><button type='button'>Save Current Flags</button></div>";
        newDiv += "<div id='savedTable'>";
        newDiv += buildTable();
        newDiv += "</div>";
    } else {
        newDiv +=
            "<h2>This is not an Edit Cloud Page - please close and try again on another page.</h2><br/><br/>";
    }
    newDiv +=
        "<div id='closeButton'><button type='button'>Close</button></div>";
    newDiv +=
        "<p><br/>Use at your own risk!<br/>Created by <a href='mailto:patrick.glithro@cloudinary.com'> Patrick Glithro</a>, please send me any bugs/suggestions/etc.</p>"
    newDiv += "</div>";
    return newDiv;
}

function addTableEventListeners() {
    var deleteButtonElements = document.getElementsByClassName(
        "deleteButton");
    for (let i = 0; i < deleteButtonElements.length; i++) {
        deleteButtonElements[i].addEventListener("click",
            function() {
                deleteFlag(i);
            }, false);
    }
    var applyFlagsButtonElements = document.getElementsByClassName(
        "applyFlagsButton");
    for (let i = 0; i < applyFlagsButtonElements.length; i++) {
        applyFlagsButtonElements[i].addEventListener("click",
            function() {
                compareClouds(i);
            }, false);
    }
}
/* Returns elements in A that are NOT in B  */
function removeElementsNotIn(a, b) {
    return a.filter(function(item) {
        return b.indexOf(item) < 0;
    });
}

function compareClouds(comparedCloud) {
    var changesPending = document.querySelectorAll(
        '.highlightFlagOff,.highlightFlagOn');
    if (changesPending.length > 0) {
        alert(
            "IMPORTANT - You have already made a comparison. Please refresh the page NOW to avoid unexpected results!"
        );
    }
    savedListString = getCookie("PG-Saved-List");
    savedListArray = savedListString.split("|").filter(Boolean);
    comparisonCheckedFlags = getCookie(savedListArray[
        comparedCloud]);
    comparisonCheckedFlagsArray = comparisonCheckedFlags.split("|");
    var changeText = "";
    var readFlags = readCurrentFlags();
    var savedNumOfFlags = savedListArray[comparedCloud].split("@@")[2];
    if (savedNumOfFlags != readFlags[0].length) {
        alert(
            "The number of saved flags does not equal the current number of flags. It is recommended that you make a new copy from the cloud in question to prevent unexpected results!"
        )
    }
    var currentCheckedFlagsArray = readFlags[1];
    var toBeChecked = removeElementsNotIn(
        comparisonCheckedFlagsArray, currentCheckedFlagsArray);
    var toBeUnchecked = removeElementsNotIn(
        currentCheckedFlagsArray, comparisonCheckedFlagsArray);
    /* Highlight changing elements to be checked  */
    changeText += "Enabled:\n";
    for (let i = 0; i < toBeChecked.length; i++) {
        var flagShort = toBeChecked[i].split("_");
        var flagId = "flags" + flagShort[0] + "_list_" + flagShort[
            1];
        var checkbox = document.getElementById(flagId);
        var flagHolder = checkbox.parentElement;
        changeText += flagHolder.getElementsByTagName("label")[0]
            .innerHTML + "\n";
        checkbox.checked = true;
        flagHolder.className = "enum-multi highlightFlagOn";
    }
    /* Highlight changing elements  */
    changeText += "\nDisabled:\n";
    for (let i = 0; i < toBeUnchecked.length; i++) {
        var flagShort = toBeUnchecked[i].split("_");
        var flagId = "flags" + flagShort[0] + "_list_" + flagShort[
            1];
        var checkbox = document.getElementById(flagId);
        var flagHolder = checkbox.parentElement;
        changeText += flagHolder.getElementsByTagName("label")[0]
            .innerHTML + "\n";
        checkbox.checked = false;
        flagHolder.className = "enum-multi highlightFlagOff";
    }
    document.getElementById("customer_admin_log").value =
        changeText;
    document.getElementsByName("commit")[0].value =
        "Save with copied flags!";
    toggleWindow();
    alert(changeText);
}
/* Main code loop */
/* Check if it already exists and if not then insert div element over the top */
flagDiv = document.getElementById("flagDiv");
if (flagDiv == null) {
    var div = document.createElement("div");
    div.id = "flagDiv";
    div.style.cssText =
        'width:100%; height:100%; background:rgba(0, 0, 0, 0.6); color: white;margin: 0; top: 0; left: 0; z-index: 99999; position: fixed;';
    document.body.appendChild(div);
    flagDiv = document.getElementById("flagDiv");
    flagDiv.innerHTML = buildContents();
    addTableEventListeners();
    const saveButton = document.getElementById("saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", saveFlags, false);
    }
    document.getElementById("closeButton").addEventListener("click",
        toggleWindow, false);
} else {
    toggleWindow();
}
