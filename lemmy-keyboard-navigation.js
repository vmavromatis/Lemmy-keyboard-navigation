// ==UserScript==
// @name        lemmy-keyboard-navigation
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.2
// @author      vmavromatis
// @license     GPL3
// @description 07/07/2023, 00:02:02
// ==/UserScript==

/*
==UserScript==
@name             lemmy-keyboard-navigation
@match            https://lemmy.world/*
@match            https://lemm.ee/*
@match            *:*
@version          1.2
@run-at           document-start
==/UserScript==
*/

// Set selected entry colors
const backgroundColor = '#373737';
const textColor = 'white';

// Set navigation keys with keycodes here: https://www.toptal.com/developers/keycode
const nextKey = 'ArrowDown';
const prevKey = 'ArrowUp';
const expandKey = 'KeyX';
const openCommentsKey = 'KeyC';
const openLinkKey = 'Enter';
const nextPageKey = 'ArrowRight';
const prevPageKey = 'ArrowLeft';
const upvoteKey = 'KeyA';
const downvoteKey = 'KeyZ';


window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

const css = [
".selected {",
"  background-color: " + backgroundColor + " !important;",
"  color: " + textColor + ";",
"}"
].join("\n");

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

let currentEntry;
let entries = [];
let previousUrl = "";
let expand = false;

const targetNode = document.documentElement;
const config = { childList: true, subtree: true };

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
    // If no entries yet selected, default to first
    else if (!currentEntry || Array.from(entries).indexOf(currentEntry) < 0) {
        selectEntry(entries[0]);
    }

    Array.from(entries).forEach(entry => {
        entry.removeEventListener("click", clickEntry, true);
        entry.addEventListener('click', clickEntry, true);
    });

    document.removeEventListener("keydown", handleKeyPress, true);
    document.addEventListener("keydown", handleKeyPress, true);
}

function handleKeyPress(event) {
    if (["TEXTAREA", "INPUT"].indexOf(event.target.tagName) > -1) {
        return;
    }

    switch (event.code) {
        case nextKey:
        case prevKey:
        case nextPageKey:
        case prevPageKey:
            let selectedEntry;

            // Next button
            if (event.code === nextKey) {
                    selectedEntry = getNextEntry(currentEntry)
            } else if (event.code === nextPageKey) {
                    selectedEntry = getNextEntrySameLevel(currentEntry);
            }
            // Previous button
            if (event.code === prevKey) {
                    selectedEntry = getPrevEntry(currentEntry)
            } else if (event.code === prevPageKey) {
                    selectedEntry = getPrevEntrySameLevel(currentEntry);
            }

            if (selectedEntry) {
                if (expand) collapseEntry();
                selectEntry(selectedEntry, true);
                if (expand) expandEntry();
            }
            break;
        case expandKey:
            toggleExpand();
            expand = isExpanded() ? true : false;
            break;
        case upvoteKey:
            upVote();
            break;
        case downvoteKey:
            downVote();
            break;
        case openCommentsKey:
            if (event.shiftKey) {
                window.open(
                    currentEntry.querySelector("a.btn[title$='Comments']").href,
                );
            } else {
                currentEntry.querySelector("a.btn[title$='Comments']").click();
            }
            break;
        case openLinkKey:
            const linkElement = currentEntry.querySelector(".col.flex-grow-0.px-0>div>a")
            if (linkElement) {
                if (event.shiftKey) {
                    window.open(linkElement.href);
                } else {
                    linkElement.click();
                }
            }
            break;
        case nextPageKey:
        case prevPageKey:
            const pageButtons = Array.from(document.querySelectorAll(".paginator>button"));

            if (pageButtons) {
                const buttonText = event.code === nextPageKey ? "Next" : "Prev";
                pageButtons.find(btn => btn.innerHTML === buttonText).click();
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

function selectEntry(e, scrollIntoView=false) {
    if (currentEntry) {
        currentEntry.classList.remove(selectedClass);
    }
    currentEntry = e;
    currentEntry.classList.add(selectedClass);

    if (scrollIntoView) {
        scrollIntoViewWithOffset(e, 15)
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

function toggleExpand() {
    const expandButton = currentEntry.querySelector("button[aria-label='Expand here']");
    const textExpandButton = currentEntry.querySelector(".post-title>button");

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
}

function expandEntry() {
    if (!isExpanded()) toggleExpand();
}

function collapseEntry() {
    if (isExpanded()) toggleExpand();
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
