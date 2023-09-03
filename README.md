<img width="600" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/77ddd70b-91fa-4cf1-b3c1-2f36e26c854a">

A RES-like userscript to easily navigate Lemmy with your keyboard. 

Works on lemmy-ui and mlmym websites.

## Installation

| Userscript* <br /> v2.3                                                                         | Chrome <br /> v2.3                                                                        | Firefox <br /> v2.3                                                                           | 
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | 
| [<img src="https://edent.github.io/SuperTinyIcons/images/svg/javascript.svg" width="100">](https://github.com/vmavromatis/Lemmy-keyboard-navigation/raw/main/main.user.js)| [<img src="https://edent.github.io/SuperTinyIcons/images/svg/chrome.svg" width="100" />](https://chrome.google.com/webstore/detail/lemmy-keyboard-navigator/lamoeoaekeeklbcekclbceaeafjkdhbi) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/firefox.svg" width="100" />](https://addons.mozilla.org/en-US/firefox/addon/lemmy-keyboard-navigation/) | 

<sub><sup>*: Make sure you have one of [Tampermonkey](https://www.tampermonkey.net/) / [Violentmonkey](https://violentmonkey.github.io/) / [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) installed<sup><sub>

## Usage

### Default keys:
| Posts                                                       | Comments                                                       |
|-------------------------------------------------------------|----------------------------------------------------------------|
| J or ↓ = Next Post                                          | J or ↓ = Next Comment                                          |
| K or ↑ = Previous Post                                      | K or ↑ = Previous Comment                                      |
| L or → = Next Page                                          | ⇧ Shift + J or L or → = Next same-level Comment                |
| H or ← = Previous Page                                      | ⇧ Shift + K or H or ← = Previous same-level Comment            |
| T = Go to Top                                               | T = Go to Top                                                  |
| A = Upvote                                                  | P = Parent Comment                                             |
| Z = Downvote                                                | A = Upvote                                                     |
| S = Save Post                                               | Z = Downvote                                                   |
| E = Edit Post                                               | S = Show more options / Save comment                           |
| X = Expand/Collapse Post (⇧ Shift + X to expand all posts)  | E = Show more options / Edit comment                           |
| - = Shrink Expanded Image                                   | R = Reply                                                      |
| = = Grow Expanded Image                                     | Q = Show context                                               |
| G = Open Navigation Dialog                                  | 1 ... 0 = Click links in comment                               |
| C = View Comments (⇧ Shift + C to open in new tab)          | G = Open Navigation Dialog                                     |
| R = Go to community (⇧ Shift + R to open in new tab)        | ⏎ Enter or X = Toggle collapse / Show more replies             |
| U = Go to poster's profile (⇧ Shift + U to open in new tab) | U = Go to commenter's profile (⇧ Shift + U to open in new tab) |
| ⏎ Enter = Visit Link (⇧ Shift + ⏎ Enter to open in new tab) |                                                                |


![posts](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/82cee5f2-3ae6-49e6-a3b3-0f4ce04a1400)
![comments](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/4c448b29-13a2-4c11-b1b0-760f8c397245)

### Options ('Ο'):
<img width="200" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/5aa941d8-94ca-461f-bb10-7f1a590c1e1b">

### Quicknav dialog ('G'):
<img width="75" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/553df9c0-c5dd-423f-bc61-8d94f3465d1c">

## Development: 
#### For Chrome or Firefox extension
Select the following files and compress into a zip:
- manifest.json
- icon16.png
- icon48.png
- icon128.png
- lemmy-keyboard-navigation.user.js
- lemmy-keyboard-navigation-mlmym.user.js
  
Then upload the zipped file to publish new version.

## Licence & Credits: 
- GPL 3.0
- Initially based on boobslider100's [script](https://lemmy.world/post/10035360)
- Major contributions and HJKL support by @aglidden
- Rebased entirely from @InfinibyteF4 to support extra features like Save Comment/Post (S) , View Community (R) and bugfixes

## Donate: 
<a href="https://www.buymeacoffee.com/vmavromatis" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
