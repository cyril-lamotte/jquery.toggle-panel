
![Tag](https://img.shields.io/github/v/tag/cyril-lamotte/jquery.toggle-panel)
![Licence](https://img.shields.io/github/license/cyril-lamotte/jquery.toggle-panel)
![Top language](https://img.shields.io/github/languages/top/cyril-lamotte/jquery.toggle-panel)

# jQuery toggle-panel

Plugin jQuery - Afficher un élément aprés un évènement sur un autre élément
(Ex: Bouton qui affiche un div)

## Features

* IE8+ compliant
* ARIA


## Installation

### 1. Join plugin

```html
<script src="js/jquery.toggle-panel.js"></script>
```

```html
<!--"Next" way-->
<button type="button" id="trigger">Toggle next element</button>
<div class="panel"></div>

<!--"Id" way-->
<button type="button" id="trigger" data-tgp-panel-id="panel-1" data-tgp-opened="true">Toggle id="panel-1"</button>
<div id="panel-1" class="panel"></div>
```


### 2. SCSS

```scss
.panel {
  display: none;

  &.tgp__panel--is-opened {
    display: block;
  }
}
```


### 3. JavaScript

```js
// Toggle panel.
$('#trigger').togglePanel({
  panel: 'id',
  event: 'click',
  autoFocus: false,
  panelLabel: 'Recherche'
});
```


```js
// Absolute positionning.
$('#trigger').togglePanel({
  panel: 'id',
  event: 'click',
  mode: 'custom',
  customShow: function($panel, $trigger) {

    $panel.position({
      of: $trigger,
      my: 'left top',
      at: 'left bottom'
    });

  },
  autoFocus: false,
  panelLabel: 'Recherche'
});
```





### 4. Options

Name                    | Type   | Description                                                 | Default or options
------------------------|--------|-------------------------------------------------------------|-------------------
prefix                  | String | Generated classes prefix                                    | 'tgp-'
panel                   | String | the panel can be the next element or defined by its id      | 'id' (need data-tgp-panel-id attribute) / 'next' / 'function' / selector (default: 'next')
panelLabel              | String | Label for accessibility                                     | 'Panel'
event                   | String | Type of event wich trigger action                           | 'click' / 'mouseover'  (default: 'click')
mode                    | String | Apparition mode                                             | 'slide' / 'toggle' / 'custom' (default: 'slide')
customShow & customHide | Method | If 'mode' setting = 'custom', this functions will be called | function($panel, $trigger) {}
wrapper                 | Object | Wrapper of connected panels                                 | false
connect                 | Bool   | If true, only one panel can be shown (need wrapper setting) | false
selfClose               | Bool   | Allow the trigger to close its panel                        | true
removetitle             | Bool   | Disable titles on triggers                                  | true
disableFirstLevel       | Bool   | Disable clicks on the first levels (don't follow the links) | true
autoFocus               | Bool   | Focus is moved to panel at opening                          | true
returnFocus             | Bool   | Return focus to the trigger after closing                   | true
autoHide                | Bool   | Close panel after mouse leaving with delay                  | false
delay                   | Bool   | Delay for auto-hiding                                       | 300
onShow()                | Method | Do stuff after showing                                      | function($panel, $trigger) {}
onShowEnd() & onHideEnd | Method | Do stuff after sliding FX                                   | function($panel, $trigger) {}
onHide()                | Method | Do stuff after hiding                                       | function($panel, $trigger) {}
findPanel()             | Method | If 'panel' setting = "function", this function will be called, must return a valid element (the content panel) | function() {}


### 5. Events

Name                 | Description
---------------------|----------------------------------------
no-autofocus.tgp     | Remove autofocus after initialisation
show.tgp             | Show panel
hide.tgp             | Hide panel
destroy.tgp          | Remove all events and generated HTML.

