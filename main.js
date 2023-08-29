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
// @require       file:////Users/mazinga/Projects/newlemmy.js
// @require       file:////Users/mazinga/Projects/oldlemmy.js
// @icon          https://raw.githubusercontent.com/vmavromatis/Lemmy-keyboard-navigation/main/icon.png?inline=true
// @homepageURL   https://github.com/vmavromatis/Lemmy-keyboard-navigation/tree/add-mlmym-support
// @namespace     https://github.com/vmavromatis/Lemmy-keyboard-navigation/tree/add-mlmym-support
// @description   Easily navigate Lemmy with your keyboard
// @run-at        document-end
// ==/UserScript==

//if New Lemmy
if (document.querySelectorAll('.lemmy-site').length >= 1) {
        var src = "file:////Users/mazinga/Projects/newlemmy.js";
        var newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.setAttribute("async", "true");
        newScript.setAttribute("src", src);
        document.body.appendChild(newScript);
}
//if Old Lemmy (mlmym)
else if (document.querySelectorAll('.spacer>a>.icon').length >= 1){
        src = "file:////Users/mazinga/Projects/oldlemmy.js";
        newScript = document.createElement("script");
        newScript.type = "text/javascript";
        newScript.setAttribute("async", "true");
        newScript.setAttribute("src", src);
        document.body.appendChild(newScript);
}