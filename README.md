# Lemmy-keyboard-navigation
A RES-like userscript to navigate Lemmy with the keyboard. Supports both HJKL and arrow navigation.

Works on lemmy-ui and mlmym websites.

## Installation & Usage:
### As a Chrome Extension
Get from [here](https://chrome.google.com/webstore/detail/lemmy-keyboard-navigator/lamoeoaekeeklbcekclbceaeafjkdhbi)

### As a Userscript
- Make sure you have [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) installed 
- [Click here](https://greasyfork.org/en/scripts/470498-lemmy-keyboard-navigation) to install script from Greasyfork (there is a webhook that auto-syncs with this repo)
- Press 'G' (dashboard) then 'O' to configure your settings
- Voila! You may now navigate https://lemmy.world/ (or any other lemmy instance of your choice) with your keyboard

## Keybinds

|                         Link Pages                                |
|----------------------------------------------------------------------|
| <kbd>J</kbd> or <kbd>↓</kbd> = Next Post                                |
| <kbd>K</kbd> or <kbd>↑</kbd> = Previous Post                        |
| <kbd>L</kbd> or <kbd>→</kbd> = Next Page                |
| <kbd>H</kbd> or <kbd>←</kbd> = Previous Page                |
| <kbd>T</kbd> = Go to Top                                              |
| <kbd>A</kbd> = Upvote                                                |
| <kbd>Z</kbd> = Downvote   |
| <kbd>S</kbd> = Save Post                                               |
| <kbd>E</kbd> = Edit Post                                               |
| <kbd>X</kbd> = Expand/Collapse Post (<kbd>⇧ Shift</kbd> + <kbd>X</kbd> to expand all posts)                                      |
| <kbd>-</kbd> = Shrink Expanded Image                                       |
| <kbd>=</kbd> = Grow Expanded Image                                       |
| <kbd>G</kbd> = Open Navigation Dialog                                       |
| <kbd>C</kbd> = View Comments (<kbd>⇧ Shift</kbd> + <kbd>C</kbd> to open in new tab)  |
| <kbd>R</kbd> = Go to community (<kbd>⇧ Shift</kbd> + <kbd>R</kbd> to open in new tab)                                                 |
| <kbd>U</kbd> = Go to poster's profile (<kbd>⇧ Shift</kbd> + <kbd>U</kbd> to open in new tab)                                                 |
| <kbd>⏎ Enter</kbd> = Visit Link (<kbd>⇧ Shift</kbd> + <kbd>⏎ Enter</kbd> to open in new tab)                                     |

![linkpages](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/82cee5f2-3ae6-49e6-a3b3-0f4ce04a1400)



|                         Comments                                 |
|----------------------------------------------------------------------|
| <kbd>J</kbd> or <kbd>↓</kbd> = Next Comment                               |
| <kbd>K</kbd> or <kbd>↑</kbd> = Previous Comment                       |
| <kbd>⇧ Shift</kbd> + <kbd>J</kbd> or <kbd>L</kbd> or <kbd>→</kbd> = Next same-level Comment                |
| <kbd>⇧ Shift</kbd> + <kbd>K</kbd> or <kbd>H</kbd> or <kbd>←</kbd> = Previous same-level Comment                |
| <kbd>T</kbd> = Go to Top                                              |
| <kbd>P</kbd> = Parent Comment                                               |
| <kbd>A</kbd> = Upvote                                                |
| <kbd>Z</kbd> = Downvote                                              |
| <kbd>S</kbd> = Show more options / Save comment                                                |
| <kbd>E</kbd> = Show more options / Edit comment                                                |
| <kbd>R</kbd> = Reply                                                 |
| <kbd>Q</kbd> = Show context                                                |
| <kbd>1</kbd> ... <kbd>0</kbd> = Click links in comment                                                |
| <kbd>G</kbd> = Open Navigation Dialog                                       |
| <kbd>⏎ Enter</kbd> or <kbd>X</kbd> = Toggle collapse / Show more replies                                    |
| <kbd>U</kbd> = Go to commenter's profile (<kbd>⇧ Shift</kbd> + <kbd>U</kbd> to open in new tab)                                                 |

![comments](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/4c448b29-13a2-4c11-b1b0-760f8c397245)



## Licence & Credits: 
- GPL 3.0
- Initially based on boobslider100's [script](https://lemmy.world/post/10035360)
- Major contributions and HJKL support by @aglidden
- Rebased entirely from @InfinibyteF4 to support extra features like Save Comment/Post (S) , View Community (R) and bugfixes

## Donate: 
Coffee link ☕

[![Paypal](https://www.paypalobjects.com/en_GB/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=bill%2emavromatis%40gmail%2ecom&lc=GB&currency_code=GBP&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted)
