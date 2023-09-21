<img width="600" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/77ddd70b-91fa-4cf1-b3c1-2f36e26c854a">

A RES-like userscript to easily navigate Lemmy with your keyboard. 

Works on lemmy-ui and mlmym websites.

## Installation

| Greasy Fork <br /> v2.4                               | Chrome <br /> v2.4                                                                        | Firefox <br /> v2.4                                                                           | Edge <br /> v2.3                                                                           | Opera <br /> v2.3                                                                           | Safari <br /> Coming soon                                                                           |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |  --------------------------------------------------------------------------------------- |   --------------------------------------------------------------------------------------- |  --------------------------------------------------------------------------------------- | 
| [<img src="https://github.com/denilsonsa/denilsonsa.github.io/blob/master/icons/GreasyFork.svg" width="100">](https://greasyfork.org/en/scripts/470498-lemmy-keyboard-navigation)| [<img src="https://edent.github.io/SuperTinyIcons/images/svg/chrome.svg" width="100" />](https://chrome.google.com/webstore/detail/lemmy-keyboard-navigator/lamoeoaekeeklbcekclbceaeafjkdhbi) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/firefox.svg" width="100" />](https://addons.mozilla.org/en-US/firefox/addon/lemmy-keyboard-navigation/) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/edge.svg" width="100" />](https://microsoftedge.microsoft.com/addons/detail/lemmy-keyboard-navigation/bjnfcimfnaefjmefhagbfabgclhgmfdo/) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/opera.svg" width="100" />](https://addons.opera.com/en/extensions/details/lemmy-keyboard-navigation/) |  [<img src="https://edent.github.io/SuperTinyIcons/images/svg/safari.svg" width="100" />]() | 


## Usage

### Default keybinds:
| Posts                                                       | Comments                                                       |
|-------------------------------------------------------------|----------------------------------------------------------------|
| J or <kbd>↓</kbd> = Next Post                               | J or <kbd>↓</kbd> = Next Comment                               |
| K or <kbd>↑</kbd> = Previous Post                           | K or <kbd>↑</kbd> = Previous Comment                           |
| L or <kbd>→</kbd> = Next Page                               | <kbd>⇧ Shift</kbd> + J or L or <kbd>→</kbd> = Next same-level Comment     |
| H or <kbd>←</kbd> = Previous Page                           | <kbd>⇧ Shift</kbd> + K or H or <kbd>←</kbd> = Previous same-level Comment |
| T = Go to Top                                               | T = Go to Top                                                  |
| A = Upvote                                                  | A = Upvote                                                     |
| Z = Downvote                                                | Z = Downvote                                                   |
| S = Save Post                                               | S = Save comment / Show more options                           |
| E = Edit Post                                               | E = Edit comment / Show more options                           |
| X = Expand/Collapse Post (⇧ Shift + X to expand all posts)  | X or <kbd>⏎ Enter</kbd> = Toggle collapse / Show more replies  |
| <kbd>-</kbd> = Shrink Expanded Image                        | <kbd>1</kbd> ... <kbd>0</kbd> = Click links in comment         |
| <kbd>=</kbd> = Grow Expanded Image                          | Q = Show context                                               |
| G = Open Navigation Dialog                                  | G = Open Navigation Dialog                                     |
| O = Open Options Page                                       | O = Open Options page                                          |
| <kbd>.</kbd> = Open Quick Search                            | <kbd>.</kbd> = Open Quick Search                               |
| C = View Comments (<kbd>⇧ Shift</kbd> + C to open in new tab) | P = Parent Comment                                           |
| R = Go to community (<kbd>⇧ Shift</kbd>+ R to open in new tab) | R = Reply                                                   |
| U = Go to poster's profile (<kbd>⇧ Shift</kbd> + U to open in new tab) | U = Go to commenter's profile (<kbd>⇧ Shift</kbd> + U to open in new tab) |
| <kbd>⏎ Enter</kbd> = Visit Link (<kbd>⇧ Shift</kbd> + <kbd>⏎ Enter</kbd> to open in new tab) |                              |

![linkpages](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/1a3bc7d4-564c-4054-9e26-be7edce811c8)
![comments](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/b9b529d0-0736-4d91-9f8b-293e319a52c0)

### Options ('Ο'):
<img width="250" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/5aa941d8-94ca-461f-bb10-7f1a590c1e1b">

### Quicknav dialog ('G'):
<img height="300" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/553df9c0-c5dd-423f-bc61-8d94f3465d1c">

### Quick Search ('.'):
![Flameshot_150](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/5b429d02-540f-4bbb-926b-7d1de299d60c)

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
