// ==UserScript==
// @name          lemmy-keyboard-navigation
// @match         https://*/*
// @grant         none
// @version       2.0
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

//isLemmySite
if (document.querySelectorAll('.lemmy-site').length >= 1){

//set vimKeyNavigation based on localStorage
var vimKeyNavigation = '';

if (localStorage.getItem('vimKeyNavigation') === null) {
  localStorage.setItem('vimKeyNavigation', true);
}

if (localStorage.getItem('vimKeyNavigation') === 'false') {
  vimKeyNavigation = false;
} else if (localStorage.getItem('vimKeyNavigation') === 'true') {
  vimKeyNavigation = true;
}
console.log(`vimKeyNavigation: ${vimKeyNavigation}`);

// Set selected entry colors
const backgroundColor = '#373737';
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

const expandKey = 'KeyX';
const openCommentsKey = 'KeyC';
const openLinkandcollapseKey = 'Enter';
const parentComment = 'KeyP';
const upvoteKey = 'KeyA';
const downvoteKey = 'KeyZ';
const replycommKey = 'KeyR';
const saveKey = 'KeyS';
const popupKey = 'KeyG';
const contextKey = 'KeyQ';
const smallerimgKey = 'Minus';
const biggerimgKey = 'Equal';
const userKey = 'KeyU';
const editKey = 'KeyE';
const linkoneKey = 'Digit1';
const linktwoKey = 'Digit2';
const linkthreeKey = 'Digit3';
const linkfourKey = 'Digit4';
const linkfiveKey = 'Digit5';

const modalCommentsKey = 'KeyC';
const modalPostsKey = 'KeyP';
const modalSubscribedKey = 'Digit1';
const modalLocalKey = 'Digit2';
const modalAllKey = 'Digit3';
const modalSavedKey = 'KeyS';
const modalFrontpageKey = 'KeyF';
const modalProfileKey = 'KeyU';
const modalInboxKey = 'KeyI';
const modalToggleNavigation = 'KeyV'

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
const css = [
  ".selected {",
  "  background-color: " + backgroundColor + " !important;",
  "  color: " + textColor + ";",
  "}"
].join("\n");

// dialog box
let myDialog = document.createElement("dialog");
document.body.appendChild(myDialog);
let para = document.createElement("p");
para.innerText = `--- Frontpage Sort ---\nP = posts\nC = comments\n1 = subscribed\n2 = local\n3 = all\n\n--- Everywhere Else ---\nS = saved\nF = frontpage\nU = profile\nI = inbox\nV = toggle HJKL (currently ${vimKeyNavigation})`;
myDialog.appendChild(para);
let button = document.createElement("button");
button.classList.add('CLOSEBUTTON1');
button.innerHTML = 'Press ESC or G to Close';
myDialog.appendChild(button);

// Global variables
let currentEntry;
let commentBlock;
let addStyle;
let PRO_addStyle;
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
      sessioncurrentEntry(3);
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
          toggleExpand();
          expand = isExpanded() ? true : false;
          break;
        case smallerimgKey:
          imgresize(0);
          break;
        case biggerimgKey:
          imgresize(1);
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
        case popupKey:
          gotodialog(1);
          instanceanduser();
          break;
        case contextKey:
          getcontext(event);
          break;
        case replycommKey:
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
          visituser(event);
          break;
        case openLinkandcollapseKey:
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
        case parentComment: {
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
        case linkoneKey:
          clickLink(1);
        break;
        case linktwoKey:
          clickLink(2);
        break;
        case linkthreeKey:
          clickLink(3);
        break;
        case linkfourKey:
          clickLink(4);
        break;
        case linkfiveKey:
          clickLink(5);
        break;
        case nextPageKey:
        case prevPageKey: {
          const pageButtons = Array.from(document.querySelectorAll(".paginator>button"));

          if (pageButtons && (document.getElementsByClassName('paginator').length > 0)) {
            const buttonText = event.code === nextPageKey ? "Next" : "Prev";
            pageButtons.find(btn => btn.innerHTML === buttonText).click();
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
        sessioncurrentEntry(4);
      }
      break;
    case modalMode = 1:
      switch (event.code) {
        case escapeKey:
          modalMode = 0;
          console.log(`modalMode: ${modalMode}`);
          break;
        case popupKey:
          gotodialog(0);
          break;
        case modalSubscribedKey:
          let subelement = document.querySelectorAll('[title="Shows the communities you\'ve subscribed to"]')[0];
          sessioncurrentEntry(4);
          subelement.click();
          gotodialog(0);
          break;
        case modalLocalKey:
          let localelement = document.querySelectorAll('[title="Shows only local communities"]')[0];
          sessioncurrentEntry(4);
          localelement.click();
          gotodialog(0);
          break;
        case modalAllKey:
          let allelement = document.querySelectorAll('[title="Shows all communities, including federated ones"]')[0];
          sessioncurrentEntry(4);
          allelement.click();
          gotodialog(0);
          break;
        case modalSavedKey:
          if (window.location.pathname.includes("/u/")) {
            let savedelement = document.getElementsByClassName("btn btn-outline-secondary pointer")[3];
            if (savedelement) {
              savedelement.click();
              gotodialog(0);
            }
          } else {
            instanceanduser(2);
          }
          break;
        case modalFrontpageKey:
          frontpage();
          break;
        case modalProfileKey:
          let profileelement = document.querySelectorAll('[title="Profile"]')[0];
          if (profileelement) {
            profileelement.click();
            gotodialog(0);
          } else {
            instanceanduser(1);
          }
          break;
        case modalInboxKey:
          let notifelement = document.getElementsByClassName("nav-link d-inline-flex align-items-center d-md-inline-block")[2];
          if (notifelement) {
            notifelement.click();
            gotodialog(0);
          } else {
            console.log('Not logged in!');
          }
          break;
        case modalCommentsKey:
          let commentsbutton = document.getElementsByClassName("pointer btn btn-outline-secondary")[1];
          sessioncurrentEntry(4);
          commentsbutton.click();
          gotodialog(0);
          break;
        case modalPostsKey:
          let postsbutton = document.getElementsByClassName("pointer btn btn-outline-secondary")[0];
          sessioncurrentEntry(4);
          postsbutton.click();
          gotodialog(0);
          break;
        case modalToggleNavigation:
          if (vimKeyNavigation === true) {
            localStorage.setItem('vimKeyNavigation', 'false')
            window.location.reload();
          } else {
            localStorage.setItem('vimKeyNavigation', 'true')
            window.location.reload();
          }
          break;
      }
  }
}

function getNextEntry(e) {
  const currentEntryIndex = Array.from(entries).indexOf(e);

  if (currentEntryIndex + 1 >= entries.length) {
    return e;
  }

  sessioncurrentEntry(1);
  return entries[currentEntryIndex + 1];
}

function getPrevEntry(e) {
  const currentEntryIndex = Array.from(entries).indexOf(e);

  if (currentEntryIndex - 1 < 0) {
    return e;
  }

  sessioncurrentEntry(2);
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
  }
  currentEntry = e;
  currentEntry.classList.add(selectedClass);

  if (scrollIntoView) {
    scrollIntoViewWithOffset(e, 15);
  }
}

function sessioncurrentEntry(n) {
  const sessionEntry = sessionStorage.getItem('currentselection');
  const currentEntryIndex = Array.from(entries).indexOf(currentEntry);


  if (n === 1) {
    if (document.getElementsByClassName("home")[0]) {
    sessionStorage.setItem('currentselection', currentEntryIndex+1);
    }
  } else if (n === 2) {
    if (document.getElementsByClassName("home")[0]) {
      sessionStorage.setItem('currentselection', currentEntryIndex-1);
    }
  } else if (n === 3) {
    selectEntry(entries[sessionEntry]);
    console.log(`Set to entry ${sessionEntry}`)
  } else if (n === 4) {
    sessionStorage.setItem('currentselection', 0);
  }
}

function clickLink(n) {
  var links = currentEntry.getElementsByClassName("md-div")[0];
  var alink = links.querySelectorAll('a');

  if (n === 1) {
    window.open(
      alink[0].href,
    );
  } else if (n === 2) {
    window.open(
      alink[1].href,
    );
  } else if (n === 3) {
    window.open(
      alink[2].href,
    );
  } else if (n === 4) {
    window.open(
      alink[3].href,
    );
  } else if (n === 5) {
    window.open(
      alink[4].href,
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
  const upvoteButton = currentEntry.querySelector("button[aria-label='Upvote']");

  if (upvoteButton) {
    upvoteButton.click();
  }
}

function downVote() {
  const downvoteButton = currentEntry.querySelector("button[aria-label='Downvote']");

  if (downvoteButton) {
    downvoteButton.click();
  }
}

function gotodialog(n) {

  const closeButton = document.getElementsByClassName("CLOSEBUTTON1")[0];
  closeButton.addEventListener("click", () => {
    myDialog.close();
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
  });
  if (n === 1) {
    myDialog.showModal();
    modalMode = 1;
    console.log(`modalMode: ${modalMode}`);
  }

  if (n === 0) {
    myDialog.close();
    modalMode = 0;
    console.log(`modalMode: ${modalMode}`);
  }
}

function instanceanduser(n) {
  let currentinstance = window.location.origin;
  let dropdownuser = document.getElementsByClassName("btn dropdown-toggle")[0];
  let username = dropdownuser.textContent;

  if (n === 0) {
    window.location.replace(currentinstance);
  }
  if (n === 1) {
    if (username) {
      let userlink = currentinstance + "/u/" + username;
      window.location.replace(userlink);
    } else {
      console.log('Not logged in!');
      frontpage();
    }
  }
  if (n === 2) {
    if (username) {
      let savedlink = currentinstance + "/u/" + username + "?page=1&sort=New&view=Saved";
      window.location.replace(savedlink);
    } else {
      console.log('Not logged in!');
      frontpage();
    }
  }
}

function frontpage() {
  let homeelement = document.getElementsByClassName("d-flex align-items-center navbar-brand me-md-3 active")[0];
  if (homeelement) {
    homeelement.click();
    gotodialog(0);
  } else {
    instanceanduser(0);
  }
}

function reply(event) {
  const replyButton = currentEntry.querySelector("button[data-tippy-content='reply']");

  if (replyButton) {
    event.preventDefault();
    replyButton.click();
  }
}

function community(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.querySelector("a.community-link").href,
    );
  } else {
    currentEntry.querySelector("a.community-link").click();
  }
}

function visituser(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.getElementsByClassName("person-listing d-inline-flex align-items-baseline text-info")[0].href,
    );
  } else {
    currentEntry.getElementsByClassName("person-listing d-inline-flex align-items-baseline text-info")[0].click();
  }
}

function comments(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.querySelector("a.btn[title*='Comment']").href,
    );
  } else {
    currentEntry.querySelector("a.btn[title*='Comment']").click();
  }
}

function getcontext(event) {
  if (event.shiftKey) {
    window.open(
      currentEntry.getElementsByClassName("btn btn-link btn-animate text-muted btn-sm")[0].href,
    );
  } else {
    currentEntry.getElementsByClassName("btn btn-link btn-animate text-muted btn-sm")[0].click();
  }
}

let maxsize = 0;

function imgresize(n) {
  let expandedimg = currentEntry.getElementsByClassName("overflow-hidden pictrs-image img-fluid img-expanded slight-radius")[0];
  let expandedheight = expandedimg.height;
  let expandedwidth = expandedimg.width;
  let expandedheightbefore = expandedheight;
  let expandedwidthbefore = expandedwidth;

  if (n === 0) {
    expandedheight = expandedheight / 1.15;
    expandedwidth = expandedwidth / 1.15;
    expandedimg.style.height = expandedheight + 'px';
    expandedimg.style.width = expandedwidth + 'px';
    maxsize = 0;
    console.log(`maxsize: ${maxsize}`);
  }

  if (n === 1) {
    expandedheight = expandedheight * 1.15;
    expandedwidth = expandedwidth * 1.15;
    expandedimg.style.width = expandedwidth + 'px';
    expandedimg.style.height = expandedheight + 'px';

    if (maxsize === 1) {
      expandedimg.style.width = expandedwidthbefore + 'px';
      expandedimg.style.height = expandedheightbefore + 'px';
    }
    if (expandedimg.width !== Math.round(expandedwidth) || expandedimg.height !== Math.round(expandedheight)) {
      maxsize = 1;
      console.log(`maxsize: ${maxsize}`);
    }
  }
}

function save() {
  const saveButton = currentEntry.querySelector("button[aria-label='save']");
  const unsaveButton = currentEntry.querySelector("button[aria-label='unsave']");
  const moreButton = currentEntry.querySelector("button[aria-label='more']");
  if (saveButton) {
    saveButton.click();
  } else if (unsaveButton) {
    unsaveButton.click();
  } else {
    moreButton.click();
    if (saveButton) {
      saveButton.click();
    } else if (unsaveButton) {
      unsaveButton.click();
    }
  }
}

function edit() {
  let editButton = currentEntry.querySelector("button[aria-label='Edit']");
  let moreButton = currentEntry.querySelector("button[aria-label='more']");

  if (editButton) {
    editButton.click();
  } else {
    moreButton.click();
  }
}

function toggleExpand() {
  const expandButton = currentEntry.querySelector("button[aria-label='Expand here']");
  const textExpandButton = currentEntry.querySelector(".post-title>button");
  const commentExpandButton = currentEntry.querySelector(".ms-2>div>button");
  const moreExpandButton = currentEntry.querySelector(".ms-1>button");

  if (expandButton) {
    expandButton.click();

    // Scroll into view if picture/text preview cut off
    const imgContainer = currentEntry.querySelector("a.d-inline-block");

    if (imgContainer) {
      // Check container positions once image is loaded
      imgContainer.querySelector("img").addEventListener("load", function() {
        scrollIntoViewWithOffset(
          imgContainer,
          currentEntry.offsetHeight - imgContainer.offsetHeight + 10
        );
      }, true);
      currentEntry.getElementsByClassName("offset-sm-3 my-2 d-none d-sm-block")[0].className = "my-2 d-none d-sm-block";
    }
  }

  if (textExpandButton) {
    textExpandButton.click();

    const textContainers = [currentEntry.querySelector("#postContent"), currentEntry.querySelector(".card-body")];
    textContainers.forEach(container => {
      if (container) {
        scrollIntoViewWithOffset(
          container,
          currentEntry.offsetHeight - container.offsetHeight + 10
        );
      }
    });
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

function scrollIntoViewWithOffset(e, offset) {
  if (e.getBoundingClientRect().top < 0 ||
    e.getBoundingClientRect().bottom > window.innerHeight
  ) {
    const y = e.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top: y
    });
  }

}

}
