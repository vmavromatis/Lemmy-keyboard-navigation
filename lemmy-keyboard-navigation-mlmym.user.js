// ==UserScript==
// @name          mlmym-keyboard-navigation
// @match         https://*/*
// @grant         none
// @version       2.6
// @author        vmavromatis
// @author        howdy@thesimplecorner.org
// @author        InfinibyteF4
// @author        aglidden
// @license       GPL3
// @icon          https://raw.githubusercontent.com/vmavromatis/Lemmy-keyboard-navigation/main/icon.png?inline=true
// @homepageURL   https://github.com/vmavromatis/Lemmy-keyboard-navigation/
// @namespace     https://github.com/vmavromatis/Lemmy-keyboard-navigation/
// @description   Easily navigate Lemmy with your keyboard
// @run-at        document-end
// ==/UserScript==

/*global window,console,localStorage,sessionStorage,document,GM_addStyle,PRO_addStyle,addStyle,MutationObserver,location*/

// display warning if used on non-Mlmym site
if (!document.querySelectorAll('.spacer>a>.icon').length >= 1){
  console.log('This userscript is intended to be used with mlmym.\nhttps://github.com/rystaf/mlmym');
} else {
// this userscript doesn't work with endless scrolling (yet!)
console.log(`This userscript doesn't currently work with endless scrolling/auto load. These settings have been disabled.`);
localStorage.setItem('endlessScrolling', false);
localStorage.setItem('autoLoad', false);

// set background color based on if dark mode is on or not
let background;
if (document.getElementsByClassName("dark").length >= 1) {
  background = '#303030';
} else {
  background = '#f0f3fc';
}
// settings page (this is from lemmyTools)
const optionsKey = "mlmym-keyboard-navigation-Options";

function getSettingsFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(optionsKey) || "{}");
  } catch (_) {
    return {};
  }
}

function checkedIfTrue(val) {
  return val ? "checked" : "";
}

function options(open) {
  const odiv = document.getElementById("lmOptions");
  let userOptions = {};
  if (open === "open") {
    odiv.style.display = "block";
  } else if (open === "set") {
    //First run set defaults or pull from localstorage.
    userOptions = Object.assign({}, {
        mlmymFixButton: true,
        pageOffset: 5,
        optionsLink: true,
        enableArrowKeyScrolling: true,
        autoNext: false,
        expandNext: true,
        openNewTab: false,
        smoothScroll: false,
        scrollPosition: "middle",
        backgroundHex: `${background}`,
        kb_prevPage: "KeyH",
        kb_nextPage: "KeyL",
        kb_prevKey: "KeyK",
        kb_nextKey: "KeyJ",
        kb_expand: "KeyX",
        kb_comments: "KeyC",
        kb_openLink: "Enter",
        // kb_parent: "KeyP",
        kb_upvote: "KeyA",
        kb_downvote: "KeyZ",
        kb_replyComm: "KeyR",
        kb_save: "KeyS",
        kb_context: "KeyQ",
        kb_smallerImg: "Minus",
        kb_largerImg: "Equal",
        kb_user: "KeyU",
        kb_edit: "KeyE",
        kb_top: "KeyT",
        m_dialog: "KeyG",
        m_first: "Digit1",
        m_second: "Digit2",
        m_third: "Digit3",
        m_fourth: "Digit4",
        m_fifth: "Digit5",
        m_frontpage: "KeyF",
        m_saved: "KeyS",
        m_userpage: "KeyU",
        m_inbox: "KeyI",
        m_options: "KeyO",
        s_search: "Period"
      },
      getSettingsFromLocalStorage()
    );
    localStorage.setItem(optionsKey, JSON.stringify(userOptions));
  } else if (open === "save") {
    //save button
    odiv.style.display = "none";
    //general
    userOptions.mlmymFixButton =
    document.getElementById("option_mlmymFixButton").checked;

    userOptions.optionsLink =
      document.getElementById("option_optionsLink").checked;

    userOptions.enableArrowKeyScrolling =
      document.getElementById("option_enableArrowKeyScrolling").checked;

    userOptions.autoNext =
      document.getElementById("option_autoNext").checked;

    userOptions.expandNext =
      document.getElementById("option_expandNext").checked;

    userOptions.openNewTab =
      document.getElementById("option_openNewTab").checked;

    userOptions.smoothScroll =
      document.getElementById("option_smoothScroll").checked;

    let offset = parseFloat(
      document.getElementById("option_pageOffset").value
    );
    if (isNaN(offset) || offset < 0 || offset > 100) {
      userOptions.pageOffset = 0;
    } else {
      userOptions.pageOffset = offset;
    }

    userOptions.scrollPosition =
      document.getElementById("option_scrollPosition").value;

    userOptions.backgroundHex =
      document.getElementById("option_backgroundHex").value;
    //keybinds
    userOptions.kb_prevPage =
      document.getElementById("option_kb_prevPage").value;

    userOptions.kb_nextPage =
      document.getElementById("option_kb_nextPage").value;

    userOptions.kb_prevKey =
      document.getElementById("option_kb_prevKey").value;

    userOptions.kb_nextKey =
      document.getElementById("option_kb_nextKey").value;

    userOptions.kb_expand =
      document.getElementById("option_kb_expand").value;

    userOptions.kb_comments =
      document.getElementById("option_kb_comments").value;

    userOptions.kb_openLink =
      document.getElementById("option_kb_openLink").value;

    /*userOptions.kb_parent =
      document.getElementById("option_kb_parent").value;*/

    userOptions.kb_upvote =
      document.getElementById("option_kb_upvote").value;

    userOptions.kb_downvote =
      document.getElementById("option_kb_downvote").value;

    userOptions.kb_replyComm =
      document.getElementById("option_kb_replyComm").value;

    userOptions.kb_save =
      document.getElementById("option_kb_save").value;

    userOptions.kb_context =
      document.getElementById("option_kb_context").value;

    userOptions.kb_smallerImg =
      document.getElementById("option_kb_smallerImg").value;

    userOptions.kb_largerImg =
      document.getElementById("option_kb_largerImg").value;

    userOptions.kb_user =
      document.getElementById("option_kb_user").value;

    userOptions.kb_edit =
      document.getElementById("option_kb_edit").value;

    userOptions.kb_top =
      document.getElementById("option_kb_top").value;
    //dialog keybinds
    userOptions.m_dialog =
      document.getElementById("option_m_dialog").value;

    userOptions.m_first =
      document.getElementById("option_m_first").value;

    userOptions.m_second =
      document.getElementById("option_m_second").value;

    userOptions.m_third =
      document.getElementById("option_m_third").value;

    userOptions.m_fourth =
      document.getElementById("option_m_fourth").value;

    userOptions.m_fifth =
      document.getElementById("option_m_fifth").value;

    userOptions.m_frontpage =
      document.getElementById("option_m_frontpage").value;

    userOptions.m_saved =
      document.getElementById("option_m_saved").value;

    userOptions.m_userpage =
      document.getElementById("option_m_userpage").value;

    userOptions.m_inbox =
      document.getElementById("option_m_inbox").value;

    if (document.getElementById("option_m_options").value === "") {
      userOptions.m_options = "KeyO"; //if left blank, reset to default
    } else {
      userOptions.m_options = document.getElementById("option_m_options").value;
    }

    userOptions.s_search =
      document.getElementById("option_s_search").value;

    localStorage.setItem(optionsKey, JSON.stringify(userOptions));
    window.location.reload();
  }

  userOptions = getSettingsFromLocalStorage();
  return userOptions;
}

let settings = options("set");
let optionsLink = checkedIfTrue(settings.optionsLink);
let enableArrowKeyScrolling = checkedIfTrue(settings.enableArrowKeyScrolling);
let smoothScroll = checkedIfTrue(settings.smoothScroll);
let autoNext = checkedIfTrue(settings.autoNext);
let expandNext = checkedIfTrue(settings.expandNext);
let openNewTab = checkedIfTrue(settings.openNewTab);
let pageOffset = window.innerHeight * settings.pageOffset / 100;
let scrollPosition = settings.scrollPosition;
let backgroundHex = settings.backgroundHex;
let mlmymFixButton = checkedIfTrue(settings.mlmymFixButton);

// Set selected entry colors
const backgroundColor = `${backgroundHex}`;

const nextPageKey = `${settings.kb_nextPage}`;
const prevPageKey = `${settings.kb_prevPage}`;
const nextKey = `${settings.kb_nextKey}`;
const prevKey = `${settings.kb_prevKey}`;

const expandKey = `${settings.kb_expand}`;
const openCommentsKey = `${settings.kb_comments}`;
const openLinkAndCollapseKey = `${settings.kb_openLink}`;
// const parentCommentKey = ``;
const upvoteKey = `${settings.kb_upvote}`;
const downvoteKey = `${settings.kb_downvote}`;
const replyCommKey = `${settings.kb_replyComm}`;
const saveKey = `${settings.kb_save}`;
const contextKey = `${settings.kb_context}`;
const smallerImgKey = `${settings.kb_smallerImg}`;
const biggerImgKey = `${settings.kb_largerImg}`;
const userKey = `${settings.kb_user}`;
const editKey = `${settings.kb_edit}`;
const topKey = `${settings.kb_top}`;
const linkOneKey = 'Digit1';
const linkTwoKey = 'Digit2';
const linkThreeKey = 'Digit3';
const linkFourKey = 'Digit4';
const linkFiveKey = 'Digit5';
const linkSixKey = 'Digit6';
const linkSevenKey = 'Digit7';
const linkEightKey = 'Digit8';
const linkNineKey = 'Digit9';
const linkZeroKey = 'Digit0';

const modalPopupKey = `${settings.m_dialog}`;
const modalSortOneKey = `${settings.m_first}`;
const modalSortTwoKey = `${settings.m_second}`;
const modalSortThreeKey = `${settings.m_third}`;
const modalSortFourKey = `${settings.m_fourth}`;
const modalSortFiveKey = `${settings.m_fifth}`;
const modalFrontpageKey = `${settings.m_frontpage}`;
const modalSavedKey = `${settings.m_saved}`;
const modalProfileKey = `${settings.m_userpage}`;
const modalInboxKey = `${settings.m_inbox}`;
const modalOptionsKey = `${settings.m_options}`;

const searchKey = `${settings.s_search}`

const escapeKey = 'Escape';
let currentlyExpanded = false;
let modalMode = 0;
console.log(`modalMode: ${modalMode}`);

// Stop arrows from moving the page if arrow key scrolling is disabled
window.addEventListener("keydown", function(e) {
  if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1 && !enableArrowKeyScrolling) {
    e.preventDefault();
  }
}, false);

// Remove scroll animations
document.documentElement.style = "scroll-behavior: auto";

// Set CSS for selected entry
const css = `
  .selected {
    background-color: ${backgroundColor} !important;
    font-weight: normal !important;
    }`;

// add an options button in the nav bar
navbarLinks();

// dialog box
let myDialog = document.createElement("dialog");
document.body.appendChild(myDialog);
let para = document.createElement("p");
para.innerHTML = `
  <h3><b>Sort by</b></h3>
  <p>${modalSortOneKey} = Hot</br>
    ${modalSortTwoKey} = Active</br>
    ${modalSortThreeKey} = Top (day)</br>
    ${modalSortFourKey} = New</br>
    ${modalSortFiveKey} = Old</p>
  <h3><b>Go To Page</b></h3>
  <p>${modalFrontpageKey} = Frontpage</br>
  ${modalSavedKey} = Saved</br>
  ${modalProfileKey} = User Profile Page</br>
  ${modalInboxKey} = Inbox</br></p>
  <h6>${modalOptionsKey} = Options Page</br></br></h6>
  <button class="OPTIONSBUTTON1">Open Options Page</button>
  <br/><br/>
  <button class="CLOSEBUTTON1">Press ESC or ${modalPopupKey} to Close</button>
  `;
myDialog.appendChild(para);

//draw search bar
const searchbar = document.createElement("div");
searchbar.setAttribute("id", "lmSearch");
searchbar.classList.add("lmsearch");
searchbar.innerHTML = `
<div id="searchForm">
  Press Enter to search or ESC to close</br>
  <input id="searchInput" type="text" placeholder="Search Lemmy">
  <button id="searchSubmit">Search</button>
  <button id="searchCancel">Close</button>
<div>
`;

//draw settings page
const odiv = document.createElement("div");
odiv.setAttribute("id", "lmOptions");
odiv.classList.add("lmoptions", "border-secondary", "card");
odiv.innerHTML = `
  <h4>mlmym-keyboard-navigation Options</h4>
</hr>
<div class='table-responsive'>
  <table class='table'>
    <thead class='pointer'>
        <td><b>Save and close settings</b></td>
        <td><button id='LMsaveoptionsTop'>Save and Close</button></td>
        </tr>
      <tr>
        <th><h3><b>General</b></h3></th><td><td/>
    </thead>
    </tr>
    <tbody>
      <tr>
        <td><b>Enable mlmym fix selections button</b><br/>Click this button if you can't select a post or comment.<br/>Uncheck to hide this button.</td>
        <td><input type='checkbox' id='option_mlmymFixButton' ${mlmymFixButton} /></td>
      </tr>
      <tr>
        <td><b>Link to Options in the navbar</b><br/>Show 'keyboard navigation options' in<br/>the navbar near the top of the page.</td>
        <td><input type='checkbox' id='option_optionsLink' ${optionsLink} /></td>
      </tr>
      <tr>
        <td><b>Enable Arrow Key Scrolling</b><br/>Uncheck this option to disable the ability<br/>to use the arrow keys to scroll the page.</td>
        <td><input type='checkbox' id='option_enableArrowKeyScrolling' ${enableArrowKeyScrolling} /></td>
      </tr>
      <tr>
        <td><b>Skip to next selection after voting</b><br/>After upvoting/downvoting a post,</br>select the next one.</td>
        <td><input type='checkbox' id='option_autoNext' ${autoNext} /></td>
      </tr>
      <tr>
        <td><b>Auto expand next post</b><br/>If you navigate away from an expanded</br>post, unexpand it and expand the new post.</td>
        <td><input type='checkbox' id='option_expandNext' ${expandNext} /></td>
      </tr>
      <tr>
        <td><b>Always open comments/links in a new tab</b><br/>Automatically open comments and links</br>in a new tab without having to hold Shift.</td>
        <td><input type='checkbox' id='option_openNewTab' ${openNewTab} /></td>
      </tr>
      <tr>
      <tr>
        <td><b>Smooth scrolling</b><br/>Scroll smoothly to the current selection.</td>
        <td><input type='checkbox' id='option_smoothScroll' ${smoothScroll} /></td>
      </tr>
      <tr>
        <td><b>Page Offset</b><br/>Percent of page to offset selected entry when scrolling.<br/>0-20% recommended<br/>Default: 5</td>
        <td><textarea id='option_pageOffset'>${settings.pageOffset}</textarea>%</td>
      </tr>
      <tr>
        <td><b>Scrolling position</b><br/>middle: only scroll the page if selection is near the bottom.<br/>top: always scroll to keep the selection near the top.</td>
        <td><select id="option_scrollPosition">
            <option value='${settings.scrollPosition}'>${settings.scrollPosition}</option>
            <option value='middle'>middle</option>
            <option value='top'>top</option>
            </select></td>
      </tr>
      <tr>
        <td><b>Selected Hex Code</b><br/>The background color of selected posts/comments.<br/>Dark mode default: #303030<br/>Light mode default: #f0f3fc</td>
        <td><textarea id='option_backgroundHex'>${settings.backgroundHex}</textarea></td>
      </tr>
      <tr>
          <td><h3><b>Rebind Keys</b></h3>Set keybinds with keycodes here:<br/><a href='https://www.toptal.com/developers/keycode'>https://www.toptal.com/developers/keycode</a></td><td><td/>
      </tr>
      <tr>
      <tr>
        <td><b>Next Page Key</b><br/>Go to the next page.<br/>Default: KeyL</td>
        <td><textarea id='option_kb_nextPage'>${settings.kb_nextPage}</textarea></td>
      </tr>
      <tr>
        <td><b>Previous Page Key</b><br/>Go to the previous page.<br/>Default: KeyH</td>
        <td><textarea id='option_kb_prevPage'>${settings.kb_prevPage}</textarea></td>
      </tr>
      <tr>
        <td><b>Next Selection Key</b><br/>Go to the next post/comment.<br/>Default: KeyJ</td>
        <td><textarea id='option_kb_nextKey'>${settings.kb_nextKey}</textarea></td>
      </tr>
      <tr>
        <td><b>Previous Selection Key</b><br/>Go to the previous post/comment.<br/>Default: KeyK</td>
        <td><textarea id='option_kb_prevKey'>${settings.kb_prevKey}</textarea></td>
      </tr>
      <tr>
        <td><b>Expand/Collapse</b><br/>Expand/collapse both post and comment content.<br/>Default: KeyX</td>
        <td><textarea id='option_kb_expand'>${settings.kb_expand}</textarea></td>
      </tr>
      <tr>
        <td><b>Open Comments</b><br/>Go to the comments of a post.<br/>Default: KeyC</td>
        <td><textarea id='option_kb_comments'>${settings.kb_comments}</textarea></td>
      </tr>
      <tr>
        <td><b>Open Links</b><br/>Open Links on a post.<br/>(can also be used to collapse comments!)<br/>Default: Enter</td>
        <td><textarea id='option_kb_openLink'>${settings.kb_openLink}</textarea></td>
      </tr>
      <!--
      <tr>
        <td><b>Go to Parent Comment</b><br/>Goes one level up the comment chain.<br/>Default: KeyP</td>
        <td><textarea id='option_kb_parent'>${settings.kb_parent}</textarea></td>
      </tr>
      -->
      <tr>
        <td><b>Upvote</b><br/>:\)<br/>Default: KeyA</td>
        <td><textarea id='option_kb_upvote'>${settings.kb_upvote}</textarea></td>
      </tr>
      <tr>
        <td><b>Downvote</b><br/>:\(<br/>Default: KeyZ</td>
        <td><textarea id='option_kb_downvote'>${settings.kb_downvote}</textarea></td>
      </tr>
      <tr>
        <td><b>Reply/Go to community</b><br/>Posts: goes to the post's community<br/>Comments: replies to the selected comment<br/>Default: KeyR</td>
        <td><textarea id='option_kb_replyComm'>${settings.kb_replyComm}</textarea></td>
      </tr>
      <tr>
        <td><b>Save post/comment</b><br/>Saves the selected post/comment.<br/>Default: KeyS</td>
        <td><textarea id='option_kb_save'>${settings.kb_save}</textarea></td>
      </tr>
      <tr>
        <td><b>Get context of comment</b><br/>Goes to the context of the selected comment.<br/>Default: KeyQ</td>
        <td><textarea id='option_kb_context'>${settings.kb_context}</textarea></td>
      </tr>
      <tr>
        <td><b>Shrink expanded image</b><br/>Make an expanded image smaller.<br/>Default: Minus</td>
        <td><textarea id='option_kb_smallerImg'>${settings.kb_smallerImg}</textarea></td>
      </tr>
      <tr>
        <td><b>Grow expanded image</b><br/>Make an expanded image larger.<br/>Default: Equal</td>
        <td><textarea id='option_kb_largerImg'>${settings.kb_largerImg}</textarea></td>
      </tr>
      <tr>
        <td><b>Go to poster's profile</b><br/>Go to the profile of whoever posted the selected post/comment.<br/>Default: KeyU</td>
        <td><textarea id='option_kb_user'>${settings.kb_user}</textarea></td>
      </tr>
      <tr>
        <td><b>Edit the selected post/comment</b><br/>It only works on your own posts!<br/>Default: KeyE</td>
        <td><textarea id='option_kb_edit'>${settings.kb_edit}</textarea></td>
      </tr>
      <tr>
        <td><b>Scroll to top</b><br/>Scroll to the top of the page.<br/>Default: KeyT</td>
        <td><textarea id='option_kb_top'>${settings.kb_top}</textarea></td>
      </tr>
      <tr>
          <td><h3><b>Rebind Dialog Keys</b></h3></td><td><td/>
      </tr>
      <tr>
        <td><b>Open/Close Dialog</b><br/>Default: KeyG</td>
        <td><textarea id='option_m_dialog'>${settings.m_dialog}</textarea></td>
      </tr>
      <tr>
      <tr>
      <td><h4><b>Sort buttons</b></h4><td/>
      </tr>
        <td><b>Sort by Hot</b><br/>Default: Digit1</td>
        <td><textarea id='option_m_first'>${settings.m_first}</textarea></td>
      </tr>
      <tr>
        <td><b>Sort by Active</b><br/>Default: Digit2</td>
        <td><textarea id='option_m_second'>${settings.m_second}</textarea></td>
      </tr>
      <tr>
        <td><b>Sort by Top (day)</b><br/>Default: Digit3</td>
        <td><textarea id='option_m_third'>${settings.m_third}</textarea></td>
      </tr>
      <tr>
        <td><b>Sort by New</b><br/>Default: Digit4</td>
        <td><textarea id='option_m_fourth'>${settings.m_fourth}</textarea></td>
      </tr>
      <tr>
        <td><b>Sort by Old</b><br/>Default: Digit5</td>
        <td><textarea id='option_m_fifth'>${settings.m_fifth}</textarea></td>
      </tr>
      <tr>
          <td><h4><b>Go to page</b></h4></td><td><td/>
      </tr>
      <tr>
        <td><b>Go to Frontpage</b><br/>Default: KeyF</td>
        <td><textarea id='option_m_frontpage'>${settings.m_frontpage}</textarea></td>
      </tr>
      <tr>
        <td><b>Go to Saved posts/comments</b><br/>Default: KeyS</td>
        <td><textarea id='option_m_saved'>${settings.m_saved}</textarea></td>
      </tr>
      <tr>
        <td><b>Go to Current User's Profile</b><br/>Default: KeyU</td>
        <td><textarea id='option_m_userpage'>${settings.m_userpage}</textarea></td>
      </tr>
      <tr>
        <td><b>Go to Inbox</b><br/>Default: KeyI</td>
        <td><textarea id='option_m_inbox'>${settings.m_inbox}</textarea></td>
      </tr>
      <tr>
        <td><b>Open options page</b><br/>Default: KeyO</td>
        <td><textarea id='option_m_options'>${settings.m_options}</textarea></td>
      </tr>
      <tr>
          <td><h3><b>Rebind Searchbar Keys</b></h3></td><td><td/>
      </tr>
      <tr>
        <td><b>Open search bar</b><br/>Default: Period</td>
        <td><textarea id='option_s_search'>${settings.s_search}</textarea></td>
      </tr>
      <tr>
        <td><b>Save and close settings</b></td>
        <td><button id='LMsaveoptions'>Save and Close</button></td>
      </tr>
      <tr>
        <td><b style='color:red;'>WARNING:<br/>The button below will reset all your settings to default.<br/>This cannot be undone.</b></td><td></td>
      </tr>
      <tr>
        <td><button id='LMresetoptions'>Reset All Settings</button></td><td></td>
      </tr>
    </tbody>
  </table>
</div>
<hr/>
<p>mlmym-keyboard-navigation links:</p>
  <a href='https://github.com/vmavromatis/Lemmy-keyboard-navigation/'>Github</a><br/>
  <a href='https://greasyfork.org/en/scripts/470498-lemmy-keyboard-navigation'>Greasyfork</a><br/>
  <p>This settings page was taken from the <a href='https://github.com/howdy-tsc/LemmyTools'>LemmyTools</a> Userscript.</p></br></br></br>
`;

let LMbutton;
if (mlmymFixButton) {
LMbutton = document.createElement("div");
LMbutton.setAttribute("id", "lmFix");
LMbutton.classList.add("lmfix", "border-secondary", "card");
LMbutton.innerHTML = `
  <p><button id='LMbuttonfix'>mlmym fix</br>selections</button></p>
`;
}

let styleString = `
.lmoptions {
  position: fixed;
  min-width: auto;
  min-height: auto;
  width: auto;
  height: 100%;
  top: 0;
  display: none;
  left: 0;
  overflow: scroll;
  z-index: 1000;
  padding: 0.5%;
  margin-top:35px;
  background-color: ${background};
}

.lmfix {
  position: fixed;
  min-width: auto;
  min-height: auto;
  width: auto;
  height: 8%;
  top: 0;
  right: 0;
  overflow: scroll;
  z-index: 1000;
  padding: 0.5%;
  margin-top:65px;
}

.lmsearch { /* from RES */
  position: fixed;
  top: 30px;
  left: 50%;
  margin-left: -275px;
  z-index: 10800000;
  width: 550px;
  border: 3px solid ${backgroundColor};
  border-radius: 10px;
  padding: 10px;
  background-color: #333;
  color: #ccc;
}
`;
document.head.appendChild(document.createElement("style")).innerHTML = styleString;
document.body.appendChild(odiv); //options
try { document.body.appendChild(LMbutton); } catch {};
document.body.appendChild(searchbar); //cmdline
document.getElementById('lmSearch').style.display = 'none';

document.getElementById("LMsaveoptions").addEventListener("click", (e) => {
  e.preventDefault();
  options("save");
});
document.getElementById("LMsaveoptionsTop").addEventListener("click", (e) => {
  e.preventDefault();
  options("save");
});
document.getElementById("LMresetoptions").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});
try {
  document.getElementById("LMbuttonfix").addEventListener("click", (e) => {
    call();
  });
} catch {}
document.getElementById("searchSubmit").addEventListener("click", (e) => {
  goToSearch("search");
});
document.getElementById("searchCancel").addEventListener("click", (e) => {
  goToSearch("close");
});
document.getElementById("searchInput").addEventListener('keydown', function onEvent(event) {
    if (event.key === "Enter") {
        goToSearch("search");
    }
    if (event.key === "Escape") {
        goToSearch("close");
    }
});

// Global variables
let currentEntry;
let commentBlock;
let entries = [];
let previousUrl = "";
let expand = false;

if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else if (typeof PRO_addStyle !== "undefined") {
  PRO_addStyle(css);
} else if (typeof addStyle !== "undefined") {
  addStyle(css);
} else {
  let node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  let heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    heads[0].appendChild(node);
  } else {
    // no head yet, stick it whereever
    document.documentElement.appendChild(node);
  }
}

const selectedClass = "selected";

function call() {
  entries = document.querySelectorAll(".post, .comment");
  if (entries.length > 0) {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      currentEntry = null;
    }
    init();
  }
}
call();

function init() {
  sessionStorage.setItem('currentselection', 0); //make sure selection is reset to first
  // If jumping to comments
  if (window.location.pathname.includes("/post/") &&
    entries.length > 1 &&
    (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0)
  ) {
    selectEntry(entries[1], true);
  }
  // If jumping to comment from anchor link
  else if (window.location.pathname.includes("/comment/") &&
    (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0)
  ) {
    const commentId = window.location.pathname.replace("/comment/", "");
    const anchoredEntry = document.getElementById("comment-" + commentId);

    if (anchoredEntry) {
      selectEntry(anchoredEntry, true);
    }
  }
  // If no entries yet selected, default to last selected
  else if (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0) {
    if (sessionStorage.getItem('currentselection') === null) {
      selectEntry(entries[0]);
    } else {
      sessionCurrentEntry("restore");
    }
  }

  Array.from(entries).forEach(entry => {
    entry.removeEventListener("click", clickEntry, true);
    entry.addEventListener('click', clickEntry, true);
  });

  let expandoButtons = document.getElementsByClassName("expando-button");
  Array.from(expandoButtons).forEach(entry => {
    entry.addEventListener('mousedown', (e) => {currentlyExpanded = !currentlyExpanded})
  });

  document.removeEventListener("keydown", handleKeyPress, true);
  document.addEventListener("keydown", handleKeyPress, true);
}

function handleKeyPress(event) {
  if (["TEXTAREA", "INPUT"].indexOf(event.target.tagName) > -1 || event.metaKey) {
    return;
  }

  switch (modalMode) {
    case modalMode = 0:
      switch (event.code) {
        case nextKey:
        case prevKey:
          previousKey(event);
          break;
        case upvoteKey:
          upVote();
          previousKey(event);
          break;
        case downvoteKey:
          downVote();
          previousKey(event);
          break;
        case expandKey:
          currentlyExpanded = !currentlyExpanded;
          if (event.shiftKey) {
            expandAll();
          } else {
            toggleExpand();
            expand = isExpanded() ? true : false;
          }
          break;
        case smallerImgKey:
          imgResize("smaller");
          break;
        case biggerImgKey:
          imgResize("larger");
          break;
        case saveKey:
          save();
          break;
        case editKey:
          edit();
          break;
        case openCommentsKey:
          comments(event);
          break;
        case searchKey:
          goToSearch("open");
        break;
        case modalPopupKey:
          goToDialog("open");
          break;
        case modalOptionsKey:
          options("open");
          break;
        case contextKey:
          getContext(event);
          break;
        case replyCommKey:
          // allow refresh with Ctrl + R
          if (!event.ctrlKey) {
            if (window.location.pathname.includes("/post/")) {
              reply(event);
            } else {
              community(event);
            }
          }
          break;
        case userKey:
          visitUser(event);
          break;
        case openLinkAndCollapseKey:
          if (window.location.pathname.includes("/post/")) {
            toggleExpand();
          } else {
            const linkElement = document.getElementsByClassName("post")[9].querySelector(".title>.url")
            if (linkElement) {
              if (openNewTab || event.shiftKey) {
                window.open(linkElement.href);
              } else {
                linkElement.click();
              }
            } else {
              comments(event);
            }
          }
          break;
        /*case parentCommentKey: {
          let targetBlock;
          if (currentEntry.classList.contains("ms-1")) {
            targetBlock = getPrevEntry(currentEntry);
          } else if (currentEntry.parentElement.parentElement.parentElement.nodeName === "LI") {
            targetBlock = currentEntry.parentElement.parentElement.parentElement.getElementsByTagName("article")[0];
          }
          if (targetBlock) {
            if (expand) {
              collapseEntry();
            }
            selectEntry(targetBlock, true);
            if (expand) {
              expandEntry();
            }
          }
        }
        break;*/
        case topKey:
          goToTop();
          break;
        case linkOneKey:
          clickLink(1);
          break;
        case linkTwoKey:
          clickLink(2);
          break;
        case linkThreeKey:
          clickLink(3);
          break;
        case linkFourKey:
          clickLink(4);
          break;
        case linkFiveKey:
          clickLink(5);
          break;
        case linkSixKey:
          clickLink(6);
          break;
        case linkSevenKey:
          clickLink(7);
          break;
        case linkEightKey:
          clickLink(8);
          break;
        case linkNineKey:
          clickLink(9);
          break;
        case linkZeroKey:
          clickLink(0);
          break;
        case nextPageKey:
        case prevPageKey: {
          const pageButtons = Array.from(document.querySelectorAll(".paginator>button"));

          if (pageButtons && (document.getElementsByClassName('pager').length > 0)) {
            sessionStorage.setItem('currentselection', 0);
            if (document.querySelectorAll(".pager")[0].children.length === 1) {
              document.querySelectorAll(".pager")[0].children[0].click();
            }
            if (event.code === nextPageKey) {
              document.querySelectorAll(".pager")[0].children[1].click(); //next
            } else {
              document.querySelectorAll(".pager")[0].children[0].click(); //prev
            }
          }
          // Jump next block of comments
          if (event.code === nextPageKey) {
            commentBlock = getNextEntrySameLevel(currentEntry);
          }
          // Jump previous block of comments
          if (event.code === prevPageKey) {
            commentBlock = getPrevEntrySameLevel(currentEntry);
          }
          if (commentBlock) {
            if (expand) {
              collapseEntry();
            }
            selectEntry(commentBlock, true);
            if (expand) {
              expandEntry();
            }
          }
        }
      }
      break;
    case modalMode = 1:
      switch (event.code) {
        case escapeKey:
          modalMode = 0;
          console.log(`modalMode: ${modalMode}`);
          break;
        case modalPopupKey:
          goToDialog("close");
          break;
        case modalSavedKey:
          instanceAndUser("saved");
          break;
        case modalFrontpageKey:
          window.location.replace(window.location.origin);
          break;
        case modalProfileKey:
          instanceAndUser("profile");
          break;
        case modalInboxKey:
          window.location.replace(window.location.origin + "/inbox");
          break;
        case modalSortOneKey:
          modalSort("Hot");
          break;
        case modalSortTwoKey:
          modalSort("Active");
          break;
        case modalSortThreeKey:
          modalSort("Top");
          break;
        case modalSortFourKey:
          modalSort("New");
          break;
        case modalSortFiveKey:
          modalSort("Old");
          break;
          case modalOptionsKey:
          options("open");
          goToDialog("close");
          break;
      }
      break;
    case modalMode = 2:
      switch (event.code) {
        case escapeKey:
          goToSearch("close");
          break;
      }
  }
}

function getNextEntry(e) {
  const currentEntryIndex = Array.from(entries).indexOf(e);

  if (currentEntryIndex + 1 >= entries.length) {
    return e;
  }
  return entries[currentEntryIndex + 1];
}

function getPrevEntry(e) {
  const currentEntryIndex = Array.from(entries).indexOf(e);

  if (currentEntryIndex - 1 < 0) {
    return e;
  }
  return entries[currentEntryIndex - 1];
}

function getNextEntrySameLevel(e) {
  const nextSibling = e.parentElement.nextElementSibling;

  if (!nextSibling || nextSibling.getElementsByTagName("article").length < 1) {
    return getNextEntry(e);
  }

  return nextSibling.getElementsByTagName("article")[0];
}

function getPrevEntrySameLevel(e) {
  const prevSibling = e.parentElement.previousElementSibling;

  if (!prevSibling || prevSibling.getElementsByTagName("article").length < 1) {
    return getPrevEntry(e);
  }

  return prevSibling.getElementsByTagName("article")[0];
}

function navbarLinks() {
  if (optionsLink) {
    let navbarlinks = document.getElementsByTagName("ul")[0];
    let optionpagelink = document.createElement("li");
    optionpagelink.innerHTML = `<a id="LKoptionpagelink" href="#">keyboard navigation options</a>`;
    navbarlinks.appendChild(optionpagelink);
    document.getElementById("LKoptionpagelink").addEventListener("click", (e) => {
      e.preventDefault();
      options("open");
    });
  }  
}

function clickEntry(event) {
  const e = event.currentTarget;
  const target = event.target;

  if (e === currentEntry && e.classList.contains(selectedClass)){
    // e.classList.remove(selectedClass); ASDHFKJLGSDA IT WAS YOU !!!!!!
  } else {
    selectEntry(e);
  }
}

function selectEntry(e, scrollIntoView = false) {
  if (currentEntry) {
    currentEntry.classList.remove(selectedClass);
    let linkNumber = currentEntry.querySelectorAll(".linkNumber");
    if (linkNumber) {
      for (const link of linkNumber) {
        link.remove();
      }
    }
  }
  currentEntry = e;
  try {
    currentEntry.classList.add(selectedClass);
  } catch { // if currentEntry is undefined
    currentEntry = document.querySelectorAll(".post, .comment")[0];
    currentEntry.classList.add(selectedClass);
  }
  sessionCurrentEntry("save");
  let links = currentEntry.querySelector(".content>div>p");
  if (links) {
    let alink = links.querySelectorAll('a');
    if (alink.length > 0) {
      alink.forEach(function(value, i) {
        let linkNumber = document.createElement("span");
        linkNumber.classList.add("linkNumber");
        linkNumber.style.fontSize = "9px";
        linkNumber.style.lineHeight = 0;
        linkNumber.style.verticalAlign = "super";
        linkNumber.setAttribute("data-text", `[${i+1}]`);
        linkNumber.innerText = `[${i+1}]`;
        linkNumber.title = `Press ${i+1} to open link`;
        if (i <= 9) {
          value.appendChild(linkNumber);
        }
      });
    }
  }

  if (scrollIntoView) {
    scrollIntoViewWithOffset(e, pageOffset);
  }
}

function sessionCurrentEntry(n) {
  const sessionEntry = sessionStorage.getItem('currentselection');
  const currentEntryIndex = Array.from(entries).indexOf(currentEntry);

  if (n === "save") {
    if (document.getElementsByClassName("post").length > 1) {
      sessionStorage.setItem('currentselection', currentEntryIndex);
    }
  } else if (n === "restore") {
    selectEntry(entries[sessionEntry]);
    console.log(`Set to entry ${sessionEntry}`);
  }
}

function clickLink(n) {
  let links = currentEntry.querySelector(".content>div>p");
  let alink = links.querySelectorAll('a');
  if (n === 1) {
    window.open(
      alink[0].href
    );
  } else if (n === 2) {
    window.open(
      alink[1].href
    );
  } else if (n === 3) {
    window.open(
      alink[2].href
    );
  } else if (n === 4) {
    window.open(
      alink[3].href
    );
  } else if (n === 5) {
    window.open(
      alink[4].href
    );
  } else if (n === 6) {
    window.open(
      alink[5].href
    );
  } else if (n === 7) {
    window.open(
      alink[6].href
    );
  } else if (n === 8) {
    window.open(
      alink[7].href
    );
  } else if (n === 9) {
    window.open(
      alink[8].href
    );
  } else if (n === 0) {
    window.open(
      alink[9].href
    );
  }
}

function isExpanded() {
  if (
    currentEntry.querySelector("a.d-inline-block:not(.thumbnail)") ||
    currentEntry.querySelector("#postContent") ||
    currentEntry.querySelector(".card-body")
  ) {
    return true;
  }

  return false;
}

function previousKey(event) {
  let selectedEntry;
  if (expandNext && currentlyExpanded) {
    toggleExpand();
  }
  // Next button
  if (event.code === nextKey) {
    if (event.shiftKey && enableArrowKeyScrolling) {
      selectedEntry = getNextEntrySameLevel(currentEntry);

    } else {
      selectedEntry = getNextEntry(currentEntry);
    }
  }
  // Previous button
  if (event.code === prevKey) {
    if (event.shiftKey && enableArrowKeyScrolling) {
      selectedEntry = getPrevEntrySameLevel(currentEntry);

    } else {
      selectedEntry = getPrevEntry(currentEntry);
    }
  }
  if (event.code === upvoteKey || event.code === downvoteKey) {
    if (autoNext) {
      selectedEntry = getNextEntry(currentEntry);
    }
  }
  if (selectedEntry) {
    if (expand) {
      collapseEntry();
    }
    selectEntry(selectedEntry, true);
    if (expand) {
      expandEntry();
    }
  }
  if (expandNext && currentlyExpanded) {
    toggleExpand();
  }
}
function upVote() {
  identifyButtons();

  if (upvoteButton) {
    upvoteButton.click();
  }
  call();
}

function downVote() {
  identifyButtons();

  if (downvoteButton) {
    downvoteButton.click();
  }
  call();
}

function goToDialog(n) {

  const closeButton = document.getElementsByClassName("CLOSEBUTTON1")[0];
  const optionsButton = document.getElementsByClassName("OPTIONSBUTTON1")[0];
  closeButton.addEventListener("click", () => {
    myDialog.close();
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
  });
  optionsButton.addEventListener("click", () => {
    myDialog.close();
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
    options("open");
  });
  if (n === "open") {
    myDialog.showModal();
    modalMode = 1;
    console.log(`modalMode: ${modalMode}`);
  }

  if (n === "close") {
    myDialog.close();
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
  }
}

let searchQuery;
function goToSearch(n) {
  if (n === "open") {
    document.getElementById('lmSearch').style.display = 'block';
    document.getElementById('searchInput').focus();
    setTimeout(function() {
      document.getElementById('searchInput').value = ''; // this is to get rid of the '.' in the search box
    }, 1);
    modalMode = 2;
    console.log(`modalMode: ${modalMode}`);
  }
  if (n === "close") {
    document.getElementById('lmSearch').style.display = 'none';
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
  }
  if (n === "search") {
    searchQuery = document.getElementById("searchInput").value;
    window.location = `${window.location.origin}/search?q=${searchQuery}&searchtype=Posts&sort=TopAll&listingType=All`;
  }
}

function instanceAndUser(n) {
  let currentInstance = window.location.origin;
  let username = document.querySelectorAll('body>nav>.right>a')[0].textContent;

  if (n === "profile") {
    if (username) {
      let userlink = currentInstance + "/u/" + username;
      window.location.replace(userlink);
    } else {
      window.location.replace(currentInstance + "/login");
    }
  }
  if (n === "saved") {
    if (username) {
      let savedlink = currentInstance + "/u/" + username + "?view=Saved";
      window.location.replace(savedlink);
    } else {
      window.location.replace(currentInstance + "/login");
    }
  }
}

var selectionType;
function checkSelection() {
  let postSelection = document.getElementsByClassName("post selected")[0];
  let username;
  let posterusername;

  try {
    username = document.querySelectorAll('body>nav>.right>a')[0].textContent;
  } catch {
    username = ''; // logged out
  }

  if (postSelection) {
    selectionType = "post";
    posterusername = currentEntry.querySelectorAll(".meta>a")[0].innerText;
  } else {
    selectionType = "comment";
    posterusername = currentEntry.querySelectorAll(".meta>a")[1].innerText;
  }
  if (username === posterusername) {
    selectionType = `my-${selectionType}`;
  }
  console.log(`current selection: ${selectionType}`);
}

var upvoteButton;
var downvoteButton;
var replyButton;
var saveButton;
var editButton;
var contextButton;
var commentButton;
function identifyButtons() {
  checkSelection();
  let getButton = currentEntry.getElementsByClassName("buttons")[0].children;
  let voteButton = currentEntry.querySelector('.score>.link-btn');
  upvoteButton = voteButton[0];
  downvoteButton = voteButton[3];
  // posts
  if (selectionType === "post" || selectionType === "my-post") { // posts on link pages
    commentButton = getButton[0];
    if (selectionType === "my-post") { // add edit button if the post is yours
      editButton = getButton[2];
      saveButton = getButton[4].children[2];
    } else {
      saveButton = getButton[2].children[2];
    }
  } else if (selectionType === "comment" || selectionType === "my-comment") {
    contextButton = getButton[0].children[0];
    if (selectionType === "my-comment") {
      saveButton = getButton[5].children[0].children[2];
      editButton = getButton[3].children[0];
      replyButton = getButton[6].children[0];
    } else {
      saveButton = getButton[3].children[0].children[2];
      replyButton = getButton[4].children[0];
    }
  }
}

function modalSort(sort) {
  if (sort === "Hot") {
    if (window.location.search.includes("?sort=")) {
      window.location = window.location.toString().replace(/(?<=\?)(.*?)(?=\&|$)/g, 'sort=Hot');
    } else {
      window.location.replace(window.location + '?sort=Hot');
    }
  }
  if (sort === "Active") {
    if (window.location.search.includes("?sort=")) {
      window.location = window.location.toString().replace(/(?<=\?)(.*?)(?=\&|$)/g, 'sort=Active');
    } else {
      window.location.replace(window.location + '?sort=Active');
    }
  }
  if (sort === "Top") {
    if (window.location.search.includes("?sort=")) {
      window.location = window.location.toString().replace(/(?<=\?)(.*?)(?=\&|$)/g, 'sort=TopDay');
    } else {
      window.location.replace(window.location + '?sort=TopDay');
    }
  }
  if (sort === "New") {
    if (window.location.search.includes("?sort=")) {
      window.location = window.location.toString().replace(/(?<=\?)(.*?)(?=\&|$)/g, 'sort=New');
    } else {
      window.location.replace(window.location + '?sort=New');
    }
  }
  if (sort === "Old") {
    if (window.location.search.includes("?sort=")) {
      window.location = window.location.toString().replace(/(?<=\?)(.*?)(?=\&|$)/g, 'sort=New');
    } else {
      window.location.replace(window.location + '?sort=New');
    }
  }
}

function reply(event) {
  identifyButtons();

  if (replyButton) {
    event.preventDefault();
    replyButton.click();
  }
}

function community(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.querySelectorAll(".meta>a")[1].href
    );
  } else {
    currentEntry.querySelectorAll(".meta>a")[1].click();
  }
}

function visitUser(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.querySelectorAll(".meta>a")[0].href
    );
  } else {
    currentEntry.querySelectorAll(".meta>a")[0].click();
  }
}

function comments(event) {
  identifyButtons();

  if (openNewTab || event.shiftKey) {
    window.open(
      commentButton.href
    );
  } else {
    commentButton.click();
  }
}

function getContext(event) {
  identifyButtons();

  if (event.shiftKey) {
    window.open(
      contextButton.href
    );
  } else {
    contextButton.click();
  }
}

function imgResize(n) {
  let expandedImg = currentEntry.getElementsByClassName("image")[0];
  let expandedHeight = expandedImg.height;
  let expandedWidth = expandedImg.width;

  if (n === "smaller") {
    expandedHeight = expandedHeight / 1.15;
    expandedWidth = expandedWidth / 1.15;
    expandedImg.style.height = expandedHeight + 'px';
    expandedImg.style.width = expandedWidth + 'px';
  }

  if (n === "larger") {
    expandedHeight = expandedHeight * 1.15;
    expandedWidth = expandedWidth * 1.15;
    expandedImg.style.width = expandedWidth + 'px';
    expandedImg.style.height = expandedHeight + 'px';
  }
}

function save() {
  identifyButtons();

  if (saveButton) {
    saveButton.click();
  }
  call();
}

function edit() {
  identifyButtons();

  if (editButton) {
    editButton.click();
  }
}

function toggleExpand() {
  const expandButton = currentEntry.getElementsByClassName("expando-button")[0];

  if (expandButton) {
    expandButton.click();

    // Scroll into view if picture/text preview cut off
    const imgContainer = currentEntry.querySelector(".expando>.image");

    if (imgContainer) {
      // Check container positions once image is loaded
      imgContainer.addEventListener("load", function() {
        scrollIntoViewWithOffset(imgContainer, pageOffset);
      }, true);
    }
  }
}

function expandEntry() {
  if (!isExpanded()) {
    toggleExpand();
  }
}

function collapseEntry() {
  if (isExpanded()) {
    toggleExpand();
  }
}

function expandAll() {
  let expandButtons = document.getElementsByClassName("expando-button");

  goToTop();
  console.log(`Expanding`);
  for (let i = 0; i < expandButtons.length; i++) {
    try {
      expandButtons[i].click();
    } catch {}
  }
  goToTop();
}

function goToTop () {
  window.scrollTo(0, 0);
  sessionStorage.setItem('currentselection', 0);
  sessionCurrentEntry("restore");
}

function scrollIntoViewWithOffset(e, offset) {
  const y = e.getBoundingClientRect().top + window.scrollY - offset;
  if (scrollPosition === "middle") {
    if (e.getBoundingClientRect().top < 0 ||
      e.getBoundingClientRect().bottom > window.innerHeight
    ) {
      scrollPage(y);
    }
  } else if (scrollPosition === "top") {
    scrollPage(y);
  }
}

function scrollPage(y) {
  if (smoothScroll) {
    window.scrollTo({
      top: y,
      behavior: "smooth"
    });
  } else {
    window.scrollTo({
      top: y
    });
  }
}

}
