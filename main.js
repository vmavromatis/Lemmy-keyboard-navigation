// ==UserScript==
// @name          lemmy-keyboard-navigation-experimental
// @match         https://*/*
// @grant         none
// @version       0.1
// @author        vmavromatis
// @author        howdy@thesimplecorner.org
// @author        InfinibyteF4
// @author        aglidden
// @license       GPL3
// @require       https://github.com/vmavromatis/Lemmy-keyboard-navigation/raw/separate-js-files/oldlemmy.js
// @require       https://github.com/vmavromatis/Lemmy-keyboard-navigation/raw/separate-js-files/newlemmy.js
// @icon          https://raw.githubusercontent.com/vmavromatis/Lemmy-keyboard-navigation/main/icon.png?inline=true
// @homepageURL   https://github.com/vmavromatis/Lemmy-keyboard-navigation/tree/add-mlmym-support
// @namespace     https://github.com/vmavromatis/Lemmy-keyboard-navigation/tree/add-mlmym-support
// @description   Easily navigate Lemmy with your keyboard
// @run-at        document-end
// ==/UserScript==

//if New Lemmy
if (document.querySelectorAll('.lemmy-site').length >= 1) {
        var src = "https://github.com/vmavromatis/Lemmy-keyboard-navigation/raw/separate-js-files/newlemmy.js";
        var newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.setAttribute("async", "true");
        newScript.setAttribute("src", src);
        document.body.appendChild(newScript);
}
//if Old Lemmy (mlmym)
else if (document.querySelectorAll('.spacer>a>.icon').length >= 1){
        src = "https://github.com/vmavromatis/Lemmy-keyboard-navigation/raw/separate-js-files/oldlemmy.js";
        newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.setAttribute("async", "true");
        newScript.setAttribute("src", src);
        document.body.appendChild(newScript);
}
