var cloudName = document.getElementsByTagName("h1")[0].innerHTML;
	cloudName = cloudName.substring(cloudName.indexOf(' - ') + 3);
	var flagsArray = [];
	var emFlags = document.getElementsByClassName("enum-multi");
	var cookieData = "";
	var cookieArray = [];
	var newDiv = "";

	/* See if any previous saves have been made */
	SavedListString = getCookie("PG-Saved-List");
	SavedListArray = SavedListString.split("|").filter(Boolean);
	console.log(SavedListArray);

	/* Cycle through all the flags on the page and assemble a list of the checked ones. 
	 TODO - maybe a hash to check there have been no significant changes? */

	for (i = 0; i < emFlags.length; i++) {
		var flagName = emFlags[i].getElementsByTagName("label")[0].innerHTML;
		var flagId = emFlags[i].getElementsByTagName("input")[0].id;
		var flagChecked = emFlags[i].getElementsByTagName("input")[0].checked;
		var flagClasses = emFlags[i].classList;
		var flagNotAllowed = String(flagClasses).includes("ui_update_disallowed_flag");

		if (flagId.includes("flags")) {
			flagsArray.push([flagId, flagName, flagChecked, flagNotAllowed]);
		};

		if (flagId.includes("flags") && flagChecked) {
			cookieArray.push(flagId);
		};

	};

	function setCookie(cname, cvalue, exdays) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		let expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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

	function saveFlags() {
		alert("test");
	}

	cookieData = cookieArray.join("|");
	setCookie("PG-" + cloudName, cookieData, 1000);
	/* Add the new one to the list */
	SavedListArray.push(cloudName);
	SavedListString = SavedListArray.join("|");
	setCookie("PG-Saved-List", SavedListString, 1000);

	/*console.log("Cookie Data After");
	console.log(getCookie(cloudName));
	console.log("Saved List String: ");
	console.log(getCookie("PG-Saved-List"));
	*/

	/* Check if it already exists and if not then insert div element over the top */
	var flagDiv = document.getElementById("flagDiv");
	if (flagDiv == null) {
		var div = document.createElement("div");
		div.id = "flagDiv";
		div.style.cssText = 'width:100%; height:100%; background:rgba(0, 0, 0, 0.6); color: white;margin: 0; top: 0; left: 0; z-index: 99999; position: fixed;';

		document.body.appendChild(div);

		newDiv += "<div style='background:white;color:black;width:800px;height:auto;position:relative;margin:0 auto;padding:30px;'>";
		newDiv+= "<h1>Patrick's Flag Manager</h1>";
		newDiv+= "<div id='buttons'><button onClick='saveFlags();' type='button'>Save Current Config</button>";
		newDiv+= "</div>";
		newDiv+= "</div>";
		

		div.innerHTML = newDiv;
	} else {
		if (flagDiv.style.display === "none") {
			flagDiv.style.display = "block";
		} else {
			flagDiv.style.display = "none";
		}
	}
