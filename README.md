<img width="600" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/77ddd70b-91fa-4cf1-b3c1-2f36e26c854a">

A RES-like userscript to easily navigate Lemmy with your keyboard. 

Works on both lemmy-ui (such as https://lemmy.world/) and mlmym (such as https://old.lemmy.world/)

![gif](https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/ddfcb01c-4fa0-4870-8732-66183bb08502)


## Installation

| Greasy Fork <br /> v2.8                               | Chrome <br /> v2.8                                                                       | Firefox <br /> v2.8                                                                           | Edge <br /> v2.8                                                                           | Opera <br /> v2.8                                                                           | 
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |  --------------------------------------------------------------------------------------- |   --------------------------------------------------------------------------------------- |  
| [<img src="https://github.com/denilsonsa/denilsonsa.github.io/blob/master/icons/GreasyFork.svg" width="100">](https://greasyfork.org/en/scripts/470498-lemmy-keyboard-navigation)| [<img src="https://edent.github.io/SuperTinyIcons/images/svg/chrome.svg" width="100" />](https://chrome.google.com/webstore/detail/lemmy-keyboard-navigator/lamoeoaekeeklbcekclbceaeafjkdhbi) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/firefox.svg" width="100" />](https://addons.mozilla.org/en-US/firefox/addon/lemmy-keyboard-navigation/) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/edge.svg" width="100" />](https://microsoftedge.microsoft.com/addons/detail/lemmy-keyboard-navigation/bjnfcimfnaefjmefhagbfabgclhgmfdo/) | [<img src="https://edent.github.io/SuperTinyIcons/images/svg/opera.svg" width="100" />](https://addons.opera.com/en/extensions/details/lemmy-keyboard-navigation/) |  

## Usage

### Default keybinds:
<table>
<thead>
<tr>
<th>Posts</th>
<th>Comments</th>
</tr>
</thead>
<tbody><tr>
<td>J  = Next Post</td>
<td>J  = Next Comment</td>
</tr>
<tr>
<td>K = Previous Post</td>
<td>K = Previous Comment</td>
</tr>
<tr>
<td>L = Next Page</td>
<td><kbd>⇧ Shift</kbd> + J or L = Next same-level Comment</td>
</tr>
<tr>
<td>H = Previous Page</td>
<td><kbd>⇧ Shift</kbd> + K or H = Previous same-level Comment</td>
</tr>
<tr>
<td colspan="2"><div align="center"><p style="color:#00008B;"><i>Hint 💡 Turn Vim-mode off from Options to use arrow navigation (↓↑→←<) instead!</i></p></div></td>
</tr>
<tr>
<td>T = Go to Top</td>
<td>T = Go to Top</td>
</tr>
<tr>
<td>A = Upvote</td>
<td>A = Upvote</td>
</tr>
<tr>
<td>Z = Downvote</td>
<td>Z = Downvote</td>
</tr>
<tr>
<td>S = Save Post</td>
<td>S = Save comment / Show more options</td>
</tr>
<tr>
<td>E = Edit Post</td>
<td>E = Edit comment / Show more options</td>
</tr>
<tr>
<td>X = Expand/Collapse Post (⇧ Shift + X to expand all posts)</td>
<td>X or <kbd>⏎ Enter</kbd> = Toggle collapse / Show more replies</td>
</tr>
<tr>
<td><kbd>-</kbd> = Shrink Expanded Image</td>
<td><kbd>1</kbd> ... <kbd>0</kbd> = Click links in comment</td>
</tr>
<tr>
<td><kbd>=</kbd> = Grow Expanded Image</td>
<td>Q = Show context</td>
</tr>
<tr>
<td>G = Open Navigation Dialog</td>
<td>G = Open Navigation Dialog</td>
</tr>
<tr>
<td>O = Open Options Page</td>
<td>O = Open Options page</td>
</tr>
<tr>
<td><kbd>.</kbd> = Open Quick Search</td>
<td><kbd>.</kbd> = Open Quick Search</td>
</tr>
<tr>
<td>C = View Comments (<kbd>⇧ Shift</kbd> + C to open in new tab)</td>
<td>P = Parent Comment</td>
</tr>
<tr>
<td>R = Go to community (<kbd>⇧ Shift</kbd>+ R to open in new tab)</td>
<td>R = Reply</td>
</tr>
<tr>
<td>U = Go to poster&#39;s profile (<kbd>⇧ Shift</kbd> + U to open in new tab)</td>
<td>U = Go to commenter&#39;s profile (<kbd>⇧ Shift</kbd> + U to open in new tab)</td>
</tr>
<tr>
<td><kbd>⏎ Enter</kbd> = Visit Link (<kbd>⇧ Shift</kbd> + <kbd>⏎ Enter</kbd> to open in new tab)</td>
<td></td>
</tr>
</tbody></table>


![linkpages](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/1a3bc7d4-564c-4054-9e26-be7edce811c8)
![comments](https://github.com/InfinibyteF4/Lemmy-keyboard-navigation/assets/75824710/b9b529d0-0736-4d91-9f8b-293e319a52c0)

### Options ('Ο'):
<img width="250" alt="image" src="https://github.com/vmavromatis/Lemmy-keyboard-navigation/assets/8668731/5aa941d8-94ca-461f-bb10-7f1a590c1e1b">

### Quicknav ('G'):
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
- Initially based on boobslider100's [script](https://lemmy.world/post/1003536)
- Major contributions and HJKL support by @aglidden
- Rebased entirely from @InfinibyteF4 to support extra features like Save Comment/Post (S) , View Community (R) and bugfixes

## Donate: 
<a href="https://www.buymeacoffee.com/vmavromatis" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
