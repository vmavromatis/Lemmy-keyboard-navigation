// ==UserScript==
// @name          lemmy-keyboard-navigation
// @match         https://*/*
// @grant         none
// @version       2.2
// @author        vmavromatis
// @author        howdy@thesimplecorner.org
// @author        InfinibyteF4
// @author        aglidden
// @license       GPL3
// @icon          https://raw.githubusercontent.com/vmavromatis/Lemmy-keyboard-navigation/main/icon.png?inline=true
// @homepageURL   https://github.com/vmavromatis/Lemmy-keyboard-navigation
// @namespace     https://github.com/vmavromatis/Lemmy-keyboard-navigation
// @description   Easily navigate Lemmy with your keyboard
// @run-at        document-end
// ==/UserScript==

/*global window,console,localStorage,sessionStorage,document,GM_addStyle,PRO_addStyle,addStyle,MutationObserver,location*/

//isLemmySite
if (document.querySelectorAll('.lemmy-site').length >= 1) {

// DEBUGGING (ignore me!)
//localStorage.clear();
//sessionStorage.clear();

//settings page (this is from lemmyTools)
const optionsKey = "lemmy-keyboard-navigation-Options";

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
  const odiv = document.getElementById("lkOptions");
  let userOptions = {};
  if (open === "open") {
    odiv.style.display = "block";
  } else if (open === "set") {
    //First run set defaults or pull from localstorage.
    userOptions = Object.assign({}, {
        pageOffset: 5,
        vimKeyNavigation: true,
        smoothScroll: false,
        scrollPosition: "middle",
        expandOption: "both",
        backgroundHex: "#373737",
        kb_expand: "KeyX",
        kb_comments: "KeyC",
        kb_openLink: "Enter",
        kb_parent: "KeyP",
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
        m_options: "KeyO"
      },
      getSettingsFromLocalStorage()
    );
    localStorage.setItem(optionsKey, JSON.stringify(userOptions));
  } else if (open === "save") {
    //save button
    odiv.style.display = "none";
    //general
    userOptions.vimKeyNavigation =
      document.getElementById("option_vimKeyNavigation").checked;

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

    userOptions.expandOption =
    document.getElementById("option_expandOption").value;

    userOptions.backgroundHex =
      document.getElementById("option_backgroundHex").value;
    //keybinds
    userOptions.kb_expand =
      document.getElementById("option_kb_expand").value;

    userOptions.kb_comments =
      document.getElementById("option_kb_comments").value;

    userOptions.kb_openLink =
      document.getElementById("option_kb_openLink").value;

    userOptions.kb_parent =
      document.getElementById("option_kb_parent").value;

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

    userOptions.m_options =
      document.getElementById("option_m_options").value;

    localStorage.setItem(optionsKey, JSON.stringify(userOptions));
    window.location.reload();
  }

  userOptions = getSettingsFromLocalStorage();
  return userOptions;
}

let settings = options("set");
let vimKeyNavigation = checkedIfTrue(settings.vimKeyNavigation);
let smoothScroll = checkedIfTrue(settings.smoothScroll);
let pageOffset = window.innerHeight * settings.pageOffset / 100;
let scrollPosition = settings.scrollPosition;
let backgroundHex = settings.backgroundHex;
let expandOption = settings.expandOption;

// Set selected entry colors
const backgroundColor = `${backgroundHex}`;
const textColor = 'white';

// Set navigation keys with keycodes here: https://www.toptal.com/developers/keycode
let nextKey = 'ArrowDown';
let prevKey = 'ArrowUp';
let nextPageKey = 'ArrowRight';
let prevPageKey = 'ArrowLeft';

if (vimKeyNavigation) {
  nextKey = 'KeyJ';
  prevKey = 'KeyK';
  nextPageKey = 'KeyL';
  prevPageKey = 'KeyH';
}

const expandKey = `${settings.kb_expand}`;
const openCommentsKey = `${settings.kb_comments}`;
const openLinkAndCollapseKey = `${settings.kb_openLink}`;
const parentCommentKey = `${settings.kb_parent}`;
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


const escapeKey = 'Escape';
let modalMode = 0;
console.log(`modalMode: ${modalMode}`);

// Stop arrows from moving the page if not using Vim navigation
window.addEventListener("keydown", function(e) {
  if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1 && !vimKeyNavigation) {
    e.preventDefault();
  }
}, false);

// Remove scroll animations
document.documentElement.style = "scroll-behavior: auto";

// Set CSS for selected entry
const css = `
  .selected {
    background-color: ${backgroundColor} !important;
    color: ${textColor};
    }`;

// dialog box
let myDialog = document.createElement("dialog");
document.body.appendChild(myDialog);
let para = document.createElement("p");
para.innerHTML = `
  <h3><b>Sort by</b></h3>
  <p>${modalSortOneKey} = N/A</br>
    ${modalSortTwoKey} = N/A</br>
    ${modalSortThreeKey} = N/A</br>
    ${modalSortFourKey} = N/A</br>
    ${modalSortFiveKey} = N/A</p>
  <h3><b>Go To Page</b></h3>
  <p>${modalFrontpageKey} = Frontpage</br>
  ${modalSavedKey} = Saved</br>
  ${modalProfileKey} = User Profile Page</br>
  ${modalInboxKey} = Inbox</br></p>
  <h6>${modalOptionsKey} = Options Page</br></br></h6>
  `;
myDialog.appendChild(para);
let button = document.createElement("button");
button.classList.add('CLOSEBUTTON1');
button.innerHTML = `Press ESC or ${modalPopupKey} to Close`;
myDialog.appendChild(button);

//draw settings page
const odiv = document.createElement("div");
odiv.setAttribute("id", "lkOptions");
odiv.classList.add("lkoptions", "border-secondary", "card");
odiv.innerHTML = `
  <h4>Lemmy-keyboard-navigation Options</h4>
</hr>
<div class='table-responsive'>
  <table class='table'>
    <thead class='pointer'>
        <td><b>Save and close settings</b></td>
        <td><button id='LKsaveoptionsTop'>Save and Close</button></td>
        </tr>
      <tr>
        <th><h3><b>General</b></h3></th><td><td/>
    </thead>
    </tr>
    <tbody>
      <tr>
        <td><b>Use Vim key navigation</b><br/>Also known as HJKL navigation.<br/>Uncheck to use arrow keys instead.</td>
        <td><input type='checkbox' id='option_vimKeyNavigation' ${vimKeyNavigation} /></td>
      </tr>
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
        <td><b>Expand All Posts</b><br/>Pressing Shift + X will expand all posts.<br/>both: expand both text boxes and images.<br/>images: only expand images.<br/>text: only expand text boxes</td>
        <td><select id="option_expandOption">
            <option value='${settings.expandOption}'>${settings.expandOption}</option>
            <option value='both'>both</option>
            <option value='text'>text</option>
            <option value='images'>images</option>
            </select></td>
      </tr>
      <tr>
        <td><b>Selected Hex Code</b><br/>The background color of selected posts/comments.<br/>Default: #373737</td>
        <td><textarea id='option_backgroundHex'>${settings.backgroundHex}</textarea></td>
      </tr>
      <tr>
          <td><h3><b>Rebind Keys</b></h3>Set keybinds with keycodes here:<br/><a href='https://www.toptal.com/developers/keycode'>https://www.toptal.com/developers/keycode</a></td><td><td/>
      </tr>
      <tr>
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
      <tr>
        <td><b>Go to Parent Comment</b><br/>Goes one level up the comment chain.<br/>Default: KeyP</td>
        <td><textarea id='option_kb_parent'>${settings.kb_parent}</textarea></td>
      </tr>
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
          <td><h4><b>Sort buttons</b></h4>For example: If you were to press G then 3 on the front page,<br/>it would sort by subscribed, but doing the same in a<br/>comment section would sort by new. The dialog<br/>text will change with what sort buttons are avaliable!</td><td><td/>
      </tr>
        <td><b>First Sort Button</b><br/>Default: Digit1</td>
        <td><textarea id='option_m_first'>${settings.m_first}</textarea></td>
      </tr>
      <tr>
        <td><b>Second Sort Button</b><br/>Default: Digit2</td>
        <td><textarea id='option_m_second'>${settings.m_second}</textarea></td>
      </tr>
      <tr>
        <td><b>Third Sort Button</b><br/>Default: Digit3</td>
        <td><textarea id='option_m_third'>${settings.m_third}</textarea></td>
      </tr>
      <tr>
        <td><b>Fourth Sort Button</b><br/>Default: Digit4</td>
        <td><textarea id='option_m_fourth'>${settings.m_fourth}</textarea></td>
      </tr>
      <tr>
        <td><b>Fifth Sort Button</b><br/>Default: Digit5</td>
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
        <td><b>Save and close settings</b></td>
        <td><button id='LKsaveoptions'>Save and Close</button></td>
      </tr>
      <tr>
        <td><b style='color:red;'>WARNING:<br/>The button below will reset all your settings to default.<br/>This cannot be undone.</b></td><td></td>
      </tr>
      <tr>
        <td><button id='LKresetoptions'>Reset All Settings</button></td><td></td>
      </tr>
    </tbody>
  </table>
</div>
<hr />
<p>lemmy-keyboard-navigation links:</p>
<a
  href='https://github.com/vmavromatis/Lemmy-keyboard-navigation'>Github</a><br/><a
  href='https://greasyfork.org/en/scripts/470498-lemmy-keyboard-navigation'>GreasyFork</a><br/><a
  href='https://chrome.google.com/webstore/detail/lemmy-keyboard-navigator/lamoeoaekeeklbcekclbceaeafjkdhbi'>Chrome Extension</a><br/></p>
  <p>This settings page was taken from the <a href='https://github.com/howdy-tsc/LemmyTools'>LemmyTools</a> Userscript.</p>
`;

let styleString = `
.lkoptions {
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
}
`;
document.head.appendChild(document.createElement("style")).innerHTML = styleString;
document.body.appendChild(odiv); //options

document.getElementById("LKsaveoptions").addEventListener("click", (e) => {
  e.preventDefault();
  options("save");
});
document.getElementById("LKsaveoptionsTop").addEventListener("click", (e) => {
  e.preventDefault();
  options("save");
});
document.getElementById("LKresetoptions").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.reload();
});
document.getElementById("navTitle").addEventListener("click", () => {
  sessionStorage.setItem('currentselection', 0);
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

const targetNode = document.documentElement;
const config = {
  childList: true,
  subtree: true
};

const observer = new MutationObserver(() => {
  entries = document.querySelectorAll(".post-listing, .comment-node");

  if (entries.length > 0) {
    if (location.href !== previousUrl) {
      previousUrl = location.href;
      currentEntry = null;
    }
    init();
  }
});

observer.observe(targetNode, config);

function init() {
  // If jumping to comments
  if (window.location.search.includes("scrollToComments=true") &&
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
          break;
        case downvoteKey:
          downVote();
          break;
        case expandKey:
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
        case modalPopupKey:
          dialogUpdate();
          goToDialog("open");
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
            const linkElement = currentEntry.querySelector(".col.flex-grow-1>p>a");
            if (linkElement) {
              if (event.shiftKey) {
                window.open(linkElement.href);
              } else {
                linkElement.click();
              }
            } else {
              comments(event);
            }
          }
          break;
        case parentCommentKey: {
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
        break;
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

          if (pageButtons && (document.getElementsByClassName('paginator').length > 0)) {
            if (event.code === nextPageKey) {
              document.querySelectorAll(".paginator>.btn.btn-secondary")[1].click(); //next
            } else {
              document.querySelectorAll(".paginator>.btn.btn-secondary")[0].click(); //prev
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
        sessionStorage.setItem('currentselection', 0); //reset the selection back to the first post when switching pages
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
          if (window.location.pathname.includes("/u/")) {
            let savedelement = document.getElementsByClassName("btn btn-outline-secondary pointer")[3];
            if (savedelement) {
              savedelement.click();
              goToDialog("close");
            }
          } else {
            instanceAndUser("saved");
          }
          break;
        case modalFrontpageKey:
          frontpage();
          break;
        case modalProfileKey:
          let profileelement = document.getElementsByClassName("dropdown-item px-2")[0];
          if (profileelement) {
            profileelement.click();
            goToDialog("close");
          } else {
            instanceAndUser("profile");
          }
          break;
        case modalInboxKey:
          let notifelement = document.getElementsByClassName("nav-link d-inline-flex align-items-center d-md-inline-block")[2];
          if (notifelement) {
            notifelement.click();
            goToDialog("close");
          } else {
            window.location.replace(window.location.origin + "/login");
          }
          break;
        case modalSortOneKey:
          let firstbutton = document.getElementsByClassName("btn btn-outline-secondary")[0];
          sessionStorage.setItem('currentselection', 0); //reset the selection to the first post when switching filters
          firstbutton.click();
          goToDialog("close");
          break;
        case modalSortTwoKey:
          let secondbutton = document.getElementsByClassName("btn btn-outline-secondary")[1];
          sessionStorage.setItem('currentselection', 0);
          secondbutton.click();
          goToDialog("close");
          break;
        case modalSortThreeKey:
          let thirdbutton = document.getElementsByClassName("btn btn-outline-secondary")[2];
          sessionStorage.setItem('currentselection', 0);
          thirdbutton.click();
          goToDialog("close");
          break;
        case modalSortFourKey:
          let fourthbutton = document.getElementsByClassName("btn btn-outline-secondary")[3];
          sessionStorage.setItem('currentselection', 0);
          fourthbutton.click();
          goToDialog("close");
          break;
        case modalSortFiveKey:
          let fifthbutton = document.getElementsByClassName("btn btn-outline-secondary")[4];
          sessionStorage.setItem('currentselection', 0);
          fifthbutton.click();
          goToDialog("close");
          break;
        case modalOptionsKey:
          options("open");
          goToDialog("close");
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

function dialogUpdate() {
  para.remove();
  para = document.createElement("p");
  para.innerHTML = `
    <h3><b>Sort by</b></h3>
    <p>${modalSortOneKey} = ${dialogLocation(1)}</br>
    ${modalSortTwoKey} = ${dialogLocation(2)}</br>
    ${modalSortThreeKey} = ${dialogLocation(3)}</br>
    ${modalSortFourKey} = ${dialogLocation(4)}</br>
    ${modalSortFiveKey} = ${dialogLocation(5)}</p>
    <h3><b>Go To Page</b></h3>
    <p>${modalFrontpageKey} = Frontpage</br>
    ${modalSavedKey} = Saved</br>
    ${modalProfileKey} = User Profile Page</br>
    ${modalInboxKey} = Inbox</br></p>
    <h6>${modalOptionsKey} = Options Page</br></br></h6>
    `;
  myDialog.appendChild(para);
  myDialog.appendChild(button);
}

function dialogLocation(n) {
  var sort = document.getElementsByClassName("btn btn-outline-secondary");

  if (n === 1 && 1 <= sort.length) {
    return sort[0].innerText;
  }
  if (n === 2 && 2 <= sort.length) {
    return sort[1].innerText;
  }
  if (n === 3 && 3 <= sort.length) {
    return sort[2].innerText;
  }
  if (n === 4 && 4 <= sort.length) {
    return sort[3].innerText;
  }
  if (n === 5 && 5 <= sort.length) {
    return sort[4].innerText;
  }
  return "N/A";
}

function clickEntry(event) {
  const e = event.currentTarget;
  const target = event.target;

  // Deselect if already selected, also ignore if clicking on any link/button
  if (e === currentEntry && e.classList.contains(selectedClass) &&
    !(
      target.tagName.toLowerCase() === "button" || target.tagName.toLowerCase() === "a" ||
      target.parentElement.tagName.toLowerCase() === "button" ||
      target.parentElement.tagName.toLowerCase() === "a" ||
      target.parentElement.parentElement.tagName.toLowerCase() === "button" ||
      target.parentElement.parentElement.tagName.toLowerCase() === "a"
    )
  ) {
    e.classList.remove(selectedClass);
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
    currentEntry = document.querySelectorAll(".post-listing, .comment-node")[0];
    currentEntry.classList.add(selectedClass);
  }
  sessionCurrentEntry("save");
  let links = currentEntry.getElementsByClassName("md-div")[0];
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
    if (document.querySelector(".home")) {
      sessionStorage.setItem('currentselection', currentEntryIndex);
    }
  } else if (n === "restore") {
    selectEntry(entries[sessionEntry]);
    console.log(`Set to entry ${sessionEntry}`);
  }
}

function clickLink(n) {
  let links = currentEntry.getElementsByClassName("md-div")[0];
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
  // Next button
  if (event.code === nextKey) {
    if (event.shiftKey && vimKeyNavigation) {
      selectedEntry = getNextEntrySameLevel(currentEntry);

    } else {
      selectedEntry = getNextEntry(currentEntry);
    }
  }
  // Previous button
  if (event.code === prevKey) {
    if (event.shiftKey && vimKeyNavigation) {
      selectedEntry = getPrevEntrySameLevel(currentEntry);

    } else {
      selectedEntry = getPrevEntry(currentEntry);
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
}

function upVote() {
  identifyButtons();

  if (upvoteButton) {
    upvoteButton.click();
  }
}

function downVote() {
  identifyButtons();

  if (downvoteButton) {
    downvoteButton.click();
  }
}

function goToDialog(n) {

  const closeButton = document.getElementsByClassName("CLOSEBUTTON1")[0];
  closeButton.addEventListener("click", () => {
    myDialog.close();
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
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

function instanceAndUser(n) {
  let currentInstance = window.location.origin;
  let username = document.getElementsByClassName("btn dropdown-toggle")[0].textContent;

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
      let savedlink = currentInstance + "/u/" + username + "?page=1&sort=New&view=Saved";
      window.location.replace(savedlink);
    } else {
      window.location.replace(currentInstance + "/login");
    }
  }
}

var selectionType;
function checkSelection() {
  let postSelection = document.getElementsByClassName("post-listing mt-2 selected")[0];
  let username;
  try {
    username = '@' + document.getElementsByClassName("btn dropdown-toggle")[0].textContent;
  } catch {
    username = ''; // logged out
  }
  let posterusername = currentEntry.getElementsByClassName("person-listing d-inline-flex align-items-baseline text-info")[0].innerText;
  let contextCheck;

  if (postSelection) {
    selectionType = "post";
    contextCheck = currentEntry.getElementsByClassName("btn btn-link btn-animate")[11]; // check for direct link button (rainbow star)
    if (contextCheck) {
      selectionType = `${selectionType}-fedi`;
    }

    if (window.location.pathname.includes("/post/")) {
      contextCheck = currentEntry.getElementsByClassName("btn btn-link btn-animate")[8].href; // check for direct link button
      if (contextCheck === `${window.location.origin}/create_post`) {
        selectionType = "post-page"
      } else {
        selectionType = "post-page-fedi"
      }
    }
  } else {
    selectionType = "comment";
    let contextButton = currentEntry.getElementsByClassName("btn btn-link btn-animate text-muted btn-sm")[0].href;
    let contextButton2 = currentEntry.getElementsByClassName("btn btn-link btn-animate")[2].href;

    if (contextButton === contextButton2) {
      selectionType = `${selectionType}-context`;
    }

    if (window.location.pathname.includes("/inbox")) {
      selectionType = "comment-inbox";
    }
  }
  if (username === posterusername) {
    selectionType = `my-${selectionType}`;
  }
  console.log(`current selection: ${selectionType}`);
}

var upvoteButton;
var downvoteButton;
var replyButton;
var moreButton;
var saveButton;
var editButton;
var commentButton;
function identifyButtons() {
  checkSelection();
  let getButton = currentEntry.getElementsByClassName("btn btn-link btn-animate");
  if (selectionType === "post") { // posts on link pages
    upvoteButton = getButton[0];
    downvoteButton = getButton[1];
    saveButton = getButton[2];
    commentButton = currentEntry.getElementsByClassName("btn btn-link btn-sm text-muted ps-0")[1];
    if (selectionType === "my-post") { // add edit button if the post is yours
      editButton = currentEntry.getElementsByClassName("btn btn-link btn-sm d-flex align-items-center rounded-0 dropdown-item")[2];
    }
  } else if (selectionType === "post-fedi" || selectionType === "post-page-fedi") { // federated posts on link pages and on the page
    upvoteButton = getButton[1];
    downvoteButton = getButton[2];
    saveButton = getButton[3];
    commentButton = currentEntry.getElementsByClassName("btn btn-link btn-sm text-muted ps-0")[1];
  } else if (selectionType === "post-page" || selectionType === "my-post-page") { // on the page of the post
    upvoteButton = getButton[0];
    downvoteButton = getButton[1];
    saveButton = getButton[2];
    commentButton = currentEntry.getElementsByClassName("btn btn-link btn-sm text-muted ps-0")[1];
    if (selectionType === "my-post-page") { // add edit button if the post is yours
      editButton = currentEntry.getElementsByClassName("btn btn-link btn-sm d-flex align-items-center rounded-0 dropdown-item")[2];
    }
  // X - X numbers is the getButton array size depending on if moreButton was clicked or not
  } else if (selectionType === "comment" || selectionType === "my-comment") { // 6 - 10 comments
    upvoteButton = getButton[2];
    downvoteButton = getButton[3];
    replyButton = getButton[4];
    moreButton = getButton[5];
    if (selectionType === "my-comment") { // 6 - 9 add edit button if the comment is yours
      saveButton = getButton[5];
      editButton = getButton[7];
    } else {
      saveButton = getButton[8];
    }
  } else if (selectionType === "comment-context" || selectionType === "my-comment-context") { // 8 - 12 comments with context buttons
    upvoteButton = getButton[4];
    downvoteButton = getButton[5];
    replyButton = getButton[6];
    moreButton = getButton[7];
    if (selectionType === "my-comment-context") { // 8 - 11 add edit button if the comment is yours
      saveButton = getButton[7];
      editButton = getButton[9];
    } else {
      saveButton = getButton[10];
    }
  } else if (selectionType === "comment-inbox") { // 9 - 13 comments in your inbox
    upvoteButton = getButton[5];
    downvoteButton = getButton[6];
    replyButton = getButton[7];
    moreButton = getButton[8];
    saveButton = getButton[11];
  }
}

function frontpage() {
  let homeElement = document.getElementsByClassName("d-flex align-items-center navbar-brand me-md-3 active")[0];
  if (homeElement) {
    homeElement.click();
    goToDialog("close");
  } else {
    window.location.replace(window.location.origin);
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
      currentEntry.querySelector("a.community-link").href
    );
  } else {
    currentEntry.querySelector("a.community-link").click();
  }
}

function visitUser(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.getElementsByClassName("person-listing d-inline-flex align-items-baseline text-info")[0].href
    );
  } else {
    currentEntry.getElementsByClassName("person-listing d-inline-flex align-items-baseline text-info")[0].click();
  }
}

function comments(event) {
  identifyButtons();

  if (event.shiftKey) {
    window.open(
      commentButton.href
    );
  } else {
    commentButton.click();
  }
}

function getContext(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.getElementsByClassName("btn btn-link btn-animate text-muted btn-sm")[0].href
    );
  } else {
    currentEntry.getElementsByClassName("btn btn-link btn-animate text-muted btn-sm")[0].click();
  }
}

let maxSize = 0;

function imgResize(n) {
  let expandedImg = currentEntry.getElementsByClassName("overflow-hidden pictrs-image img-fluid img-expanded slight-radius")[0];
  let expandedHeight = expandedImg.height;
  let expandedWidth = expandedImg.width;
  let expandedHeightbefore = expandedHeight;
  let expandedWidthbefore = expandedWidth;

  if (n === "smaller") {
    expandedHeight = expandedHeight / 1.15;
    expandedWidth = expandedWidth / 1.15;
    expandedImg.style.height = expandedHeight + 'px';
    expandedImg.style.width = expandedWidth + 'px';
    maxSize = 0;
    console.log(`maxSize: ${maxSize}`);
  }

  if (n === "larger") {
    expandedHeight = expandedHeight * 1.15;
    expandedWidth = expandedWidth * 1.15;
    expandedImg.style.width = expandedWidth + 'px';
    expandedImg.style.height = expandedHeight + 'px';

    if (maxSize === 1) {
      expandedImg.style.width = expandedWidthbefore + 'px';
      expandedImg.style.height = expandedHeightbefore + 'px';
    }
    if (expandedImg.width !== Math.round(expandedWidth) || expandedImg.height !== Math.round(expandedHeight)) {
      maxSize = 1;
      console.log(`maxSize: ${maxSize}`);
    }
  }
}

function save() {
  identifyButtons();

  if (saveButton) {
    saveButton.click();
  } else {
    moreButton.click();
  }
}

function edit() {
  identifyButtons();

  if (editButton) {
    editButton.click();
  } else {
    moreButton.click();
  }
}

function toggleExpand() {
  const expandButton = currentEntry.getElementsByClassName("thumbnail rounded overflow-hidden d-inline-block bg-transparent")[0];
  const textExpandButton = currentEntry.querySelector(".post-title>button");
  const videoexpandButton = currentEntry.getElementsByClassName("thumbnail rounded bg-light d-flex justify-content-center")[0];
  const commentExpandButton = currentEntry.querySelector(".ms-2>div>button");
  const moreExpandButton = currentEntry.querySelector(".ms-1>button");

  if (expandButton) {
    expandButton.click();

    // Scroll into view if picture/text preview cut off
    const imgContainer = currentEntry.querySelector("a.d-inline-block");

    if (imgContainer) {
      // Check container positions once image is loaded
      imgContainer.querySelector("img").addEventListener("load", function() {
        scrollIntoViewWithOffset(imgContainer, pageOffset);
      }, true);
      currentEntry.getElementsByClassName("offset-sm-3 my-2 d-none d-sm-block")[0].className = "my-2 d-none d-sm-block";
    }
  }

  if (textExpandButton) {
    textExpandButton.click();

    const textContainers = [currentEntry.querySelector("#postContent"), currentEntry.querySelector(".card-body")];
    textContainers.forEach(container => {
      if (container) {
        scrollIntoViewWithOffset(container, pageOffset);
      }
    });
  }

  if (videoexpandButton) {
    if (videoexpandButton.textContent === "play") { // check if it's a video and not a link or something // this works between languages :>
      videoexpandButton.click();

      // Scroll into view if video/text preview cut off
      const vidContainer = currentEntry.querySelector("div.embed-responsive");

      if (vidContainer) {
          scrollIntoViewWithOffset(vidContainer, pageOffset);
      }
    }
  }

  if (commentExpandButton) {
    commentExpandButton.click();
  }

  if (moreExpandButton) {
    moreExpandButton.click();
    selectEntry(getPrevEntry(currentEntry), true);
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
  let imageExpand = document.getElementsByClassName("thumbnail rounded overflow-hidden d-inline-block bg-transparent");
  let textExpand = document.getElementsByClassName("btn btn-sm btn-link link-dark link-opacity-75 link-opacity-100-hover align-baseline");

  goToTop();
  console.log(`Expanding`);
  if (expandOption === "text" || expandOption === "both") {
    for (let i = 1; i < textExpand.length; i += 2) {
      try {
        textExpand[i].click();
      } catch {}
    }
  }
  if (expandOption === "images" || expandOption === "both") {
    for (let i = 0; i < imageExpand.length; i++) {
      try {
        imageExpand[i].click();
      } catch {}
    }
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
