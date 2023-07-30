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
let vimKeyNavigation = '';

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
const openLinkAndCollapseKey = 'Enter';
const parentCommentKey = 'KeyP';
const upvoteKey = 'KeyA';
const downvoteKey = 'KeyZ';
const replyCommKey = 'KeyR';
const saveKey = 'KeyS';
const popupKey = 'KeyG';
const contextKey = 'KeyQ';
const smallerImgKey = 'Minus';
const biggerImgKey = 'Equal';
const userKey = 'KeyU';
const editKey = 'KeyE';
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

const modalCommentsKey = 'KeyC';
const modalPostsKey = 'KeyP';
const modalSubscribedKey = 'Digit1';
const modalLocalKey = 'Digit2';
const modalAllKey = 'Digit3';
const modalSavedKey = 'KeyS';
const modalFrontpageKey = 'KeyF';
const modalProfileKey = 'KeyU';
const modalInboxKey = 'KeyI';
const modalToggleNavigationKey = 'KeyV';

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
  <h3><b>Frontpage Sort</b></h3>
  <p>P = Posts</br>
  C = Comments</br>
  1 = Subscribed</br>
  2 = Local</br>
  3 = all</p>
  <h3><b>Go To Page</b></h3>
  <p>F = Frontpage</br>
  S = Saved</br>
  U = User Profile Page</br>
  I = Inbox</br></p>
  <h6>V = Toggle HJKL (currently ${vimKeyNavigation})</br></br></h6>
  `;
myDialog.appendChild(para);
let button = document.createElement("button");
button.classList.add('CLOSEBUTTON1');
button.innerHTML = 'Press ESC or G to Close';
myDialog.appendChild(button);

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
          toggleExpand();
          expand = isExpanded() ? true : false;
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
        case popupKey:
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
        sessionCurrentEntry("save");
      }
      break;
    case modalMode = 1:
      switch (event.code) {
        case escapeKey:
          modalMode = 0;
          console.log(`modalMode: ${modalMode}`);
          break;
        case popupKey:
          goToDialog("close");
          break;
        case modalSubscribedKey:
          let subelement = document.querySelectorAll('[title="Shows the communities you\'ve subscribed to"]')[0];
          sessionCurrentEntry("save");
          subelement.click();
          goToDialog("close");
          break;
        case modalLocalKey:
          let localelement = document.querySelectorAll('[title="Shows only local communities"]')[0];
          sessionCurrentEntry("save");
          localelement.click();
          goToDialog("close");
          break;
        case modalAllKey:
          let allelement = document.querySelectorAll('[title="Shows all communities, including federated ones"]')[0];
          sessionCurrentEntry("save");
          allelement.click();
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
          let profileelement = document.querySelectorAll('[title="Profile"]')[0];
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
        case modalCommentsKey:
          let commentsbutton = document.getElementsByClassName("pointer btn btn-outline-secondary")[1];
          sessionCurrentEntry("save");
          commentsbutton.click();
          goToDialog("close");
          break;
        case modalPostsKey:
          let postsbutton = document.getElementsByClassName("pointer btn btn-outline-secondary")[0];
          sessionCurrentEntry("save");
          postsbutton.click();
          goToDialog("close");
          break;
        case modalToggleNavigationKey:
          if (vimKeyNavigation === true) {
            localStorage.setItem('vimKeyNavigation', 'false');
            window.location.reload();
          } else {
            localStorage.setItem('vimKeyNavigation', 'true');
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

  sessionCurrentEntry("next");
  return entries[currentEntryIndex + 1];
}

function getPrevEntry(e) {
  const currentEntryIndex = Array.from(entries).indexOf(e);

  if (currentEntryIndex - 1 < 0) {
    return e;
  }

  sessionCurrentEntry("previous");
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
    let linkNumber = currentEntry.querySelectorAll(".linkNumber");
    for (const link of linkNumber) {
      link.remove();
    }
  }
  currentEntry = e;
  currentEntry.classList.add(selectedClass);

  let links = currentEntry.getElementsByClassName("md-div")[0];
  let alink = links.querySelectorAll('a');
  if (alink.length > 0) {
    alink.forEach(function (value, i) {
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

  if (scrollIntoView) {
    scrollIntoViewWithOffset(e, 15);
  }
}

function sessionCurrentEntry(n) {
  const sessionEntry = sessionStorage.getItem('currentselection');
  const currentEntryIndex = Array.from(entries).indexOf(currentEntry);

  if (n === "next") {
    if (document.getElementsByClassName("home")[0]) {
      sessionStorage.setItem('currentselection', currentEntryIndex + 1);
    }
  } else if (n === "previous") {
    if (document.getElementsByClassName("home")[0]) {
      sessionStorage.setItem('currentselection', currentEntryIndex - 1);
    }
  } else if (n === "restore") {
    selectEntry(entries[sessionEntry]);
    console.log(`Set to entry ${sessionEntry}`);
  } else if (n === "save") {
    sessionStorage.setItem('currentselection', 0);
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
  let dropdownUser = document.getElementsByClassName("btn dropdown-toggle")[0];
  let username;
  if (dropdownUser) {
    username = dropdownUser.textContent;
  }
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
  const replyButton = currentEntry.querySelector("button[data-tippy-content='reply']");

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
  if (event.shiftKey) {
    window.open(
      currentEntry.querySelector("a.btn[title*='Comment']").href
    );
  } else {
    currentEntry.querySelector("a.btn[title*='Comment']").click();
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
      top: y,
      behavior: "smooth"
    });
  }

}

}