(function ($) {

  $.togglePanel = function (element, options) {

    // Default options
    var defaults = {
      prefix : 'tgp',
      wrapper: false,
      connect: false,
      panel: 'next',
      event: 'click',
      findPanel: function() {},
      panelLabel: '',
      mode: 'slide',
      customShow: function() {},
      customHide: function() {},
      autoFocus: true,
      selfClose: true,
      returnFocus: true,
      autoHide: false,
      delay: 300,
      modal: false,
      disableFirstLevel: false,
      removeTitle: false,
      smallScreenBreakpoint: 767,
      closeLabel: 'Replier',
      openLabel: 'Déplier',
      onShow: function () {},
      onShowEnd: function () {},
      onHide: function () {},
      onHideEnd: function () {}
    };

    var plugin = this,
        $trigger = $(element);

    plugin.settings = {};


    /** plugins initialisation */
    plugin.init = function () {

      // Merge user's options.
      plugin.settings = $.extend({}, defaults, options);

      // Get associated panel.
      getPanel();

      // Small screen (mobile).
      plugin.settings.isSmallScreen = false;
      if (window.innerWidth <= plugin.settings.smallScreenBreakpoint) {
        plugin.settings.isSmallScreen = true;
      }

      // Modal : Save focusable Elements.
      plugin.settings.focusableElements = plugin.settings.$panel.find('a, :input');
      plugin.settings.focusableElementsFirst = plugin.settings.focusableElements.first();
      plugin.settings.focusableElementsLast = plugin.settings.focusableElements.last();

      initAttributes();
      attachEvents();

      // Open panels (stay closed on small screens).
      if ($trigger.data('tgp-opened') && plugin.settings.isSmallScreen === false) {
        plugin.settings.$panel.trigger('show.tgp');
      }

    };


    /**
     * Get panel from panel setting.
     */
    var getPanel = function() {

      switch (plugin.settings.panel) {

        case 'next':

          // The panel is the next element or the parent's next element.
          if ($trigger.next().length)
            plugin.settings.$panel = $trigger.next();
          else {
            plugin.settings.$panel = $trigger.parent().next();
          }

          // Add id attribute if not exist.
          if (!plugin.settings.$panel.attr('id')) {
            // Generate unique id.
            var uniqueId = generateId();
            plugin.settings.$panel.attr('id', 'tgp-'+ uniqueId);
          }

          break;

        case 'id':

          // Trigger has 'tgp-panel-id' attributes with panel id.
          if (!$trigger.data('tgp-panel-id')) {
            throw new Error('Missing attribute "data-tgp-panel-id".');
          }

          plugin.settings.$panel = $('#'+ $trigger.data('tgp-panel-id'));

          break;

        case 'function':

          // If panel equals to function, it needs findPanel setting which must
          // returns the content panel.
          plugin.settings.$panel = plugin.settings.findPanel($trigger);

          if (!plugin.settings.$panel.length) {
            throw new Error('findPanel method does not returns valid element.');
          }

          break;

        default:

          // Use selector.
          plugin.settings.$panel = $(plugin.settings.panel);

          if (!plugin.settings.$panel.length || plugin.settings.$panel.length > 1) {
            throw new Error('panel selector does not returns a unique element.');
          }

      }

    };

    /** Generate unique HTML id */
    var generateId = function() {

      var id = Math.random() + '';
      id = id.substr(2, 9);

      if ($('#'+ id).length)
        id = generateId();

      return id;
    };


    /** Insert ARIA & classes attributes */
    var initAttributes = function() {

      // Add classes.
      $trigger.addClass(plugin.settings.prefix + '__trigger');
      plugin.settings.$panel.addClass(plugin.settings.prefix + '__panel');

      if (plugin.settings.wrapper.length)
        plugin.settings.wrapper.addClass(plugin.settings.prefix + '__wrapper');

      // Add attributes.
      $trigger.attr({
        'aria-expanded' : false,
        'aria-controls' : plugin.settings.$panel.attr('id')
      });


      if (!plugin.settings.panelLabel) {
        plugin.settings.panelLabel = $trigger.text().trim();
      }

      plugin.settings.$panel.attr({
        'aria-hidden' : true,
        'role' : 'region',
        'aria-label' : plugin.settings.panelLabel
      });

      // Update label.
      updateARIAandTitle(plugin.settings.openLabel + " '" + $trigger.text().trim() + "'");

    };

    /** Shows the panel */
    var showPanel = function() {

      // Active trigger.
      $trigger.addClass(plugin.settings.prefix + '__trigger--is-active')
        .attr('aria-expanded', true);

      // Show panel.
      plugin.settings.$panel
        .attr('aria-hidden', 'false');

      switch(plugin.settings.mode) {

        case 'slide' :

        // Slide FX.
        plugin.settings.$panel.slideDown('fast', function() {
          $(this).addClass(plugin.settings.prefix + '__panel--is-opened');
          plugin.settings.onShowEnd();
        });

        break;

        case 'toggle' :
          plugin.settings.$panel.addClass(plugin.settings.prefix + '__panel--is-opened');
        break;

        case 'custom' :

          // If "mode" setting equals to "custom", it needs customShow setting.
          plugin.settings.$panel.addClass(plugin.settings.prefix + '__panel--is-opened');
          plugin.settings.customShow(plugin.settings.$panel, $trigger);

          break;

        default:
          console.log('Unknown mode.');
      }

      // Move focus to panel.
      if (plugin.settings.autoFocus) {
        plugin.settings.focusableElementsFirst.focus();
      }

      // Update label.
      updateARIAandTitle(plugin.settings.closeLabel + " '" + $trigger.text().trim() + "'");

      // Callback function.
      plugin.settings.onShow(plugin.settings.$panel, $trigger);

    };



    /** Hides the panel */
    var hidePanel = function() {

      if (!$trigger.hasClass(plugin.settings.prefix + '__trigger--is-active'))
        return;

      // Move focus to trigger.
      $trigger
        .removeClass(plugin.settings.prefix + '__trigger--is-active')
        .attr('aria-expanded', false);

      // Return focus.
      if (plugin.settings.returnFocus === true)
        $trigger.focus();


      plugin.settings.$panel
        .attr('aria-hidden', 'true');


      switch(plugin.settings.mode) {

        case 'slide' :

          // Slide FX.
        plugin.settings.$panel.slideUp('fast', function() {
          $(this).removeClass(plugin.settings.prefix + '__panel--is-opened');
            plugin.settings.onShowEnd();
        });

        break;

        case 'toggle' :
        plugin.settings.$panel.removeClass(plugin.settings.prefix + '__panel--is-opened');
        break;

        case 'custom' :

          // If "mode" setting equals to "custom", it needs customShow setting.
          plugin.settings.$panel.removeClass(plugin.settings.prefix + '__panel--is-opened');
          plugin.settings.customHide(plugin.settings.$panel, $trigger);

          break;

        default:
          console.log('Unknow mode.');
      }

      // Update label.
      updateARIAandTitle(plugin.settings.openLabel + " '" + $trigger.text() + "'");

      // Callback function.
      plugin.settings.onHide(plugin.settings.$panel, $trigger);

    };


    var hidePanelWithTimeout = function() {

      if (!plugin.settings.autoHide) {
        return false;
      }

      plugin.timeoutID = window.setTimeout(function() {

        if (!plugin.settings.$panel.data('flag-hover')) {
          plugin.settings.$panel.trigger('hide.tgp');
        }

      }, plugin.settings.delay);

    };


    /**
     * Update aria-label & title attributes.
     *
     * @param {String} label - Label
     */
    var updateARIAandTitle = function(label) {

      // Add aria-label.
      $trigger.attr({
        'aria-label' : label
      });

      if (!plugin.settings.removeTitle) {

        // Add title.
        $trigger.attr({
          'title': label
        });

      }

    };


    /** Attach trigger events */
    var attachTriggerEvents = function() {

      switch(plugin.settings.event) {

        case 'click' :

          $trigger.on(plugin.settings.event + '.tgp', function (event) {

            // Avoid link's default behavior.
            if (event.currentTarget.nodeName === 'A') {
              event.preventDefault();
            }

            event.stopPropagation();

            // Close panel on click on active trigger.
            if ($(this).hasClass(plugin.settings.prefix + '__trigger--is-active' ) && plugin.settings.selfClose === true) {
              plugin.settings.$panel.trigger('hide.tgp');
            }
            else {

              // If panels are connected, close all.
              if (plugin.settings.connect) {
                plugin.settings.wrapper.find('.'+ plugin.settings.prefix + '__panel')
                .trigger('hide.tgp');
              }

              plugin.settings.$panel.trigger('show.tgp');

            }

          });

          break;

        case 'mouseover' :

          $trigger.on('mouseenter.tgp', function (event) {

            clearTimeout(plugin.timeoutID);

            // If panels are connected, close all.
            if (plugin.settings.connect) {
              plugin.settings.wrapper.find('.'+ plugin.settings.prefix + '__panel')
              .trigger('hide.tgp');
            }

            plugin.settings.$panel.trigger('show.tgp');

          });

          break;
      }


      // Hide with escape key.
      $trigger.on('keydown.tgp', function(event) {

        event.stopPropagation();

        // Hide panel with ESC key.
        if (event.keyCode === 27) {
          plugin.settings.$panel.trigger('hide.tgp');
        }

      })

      // Stop propagation on click.
      .on('click', function(event) {
        event.stopPropagation();

        // First level is disable.
        if (plugin.settings.disableFirstLevel) {
          event.preventDefault();
        }

      });


      // Destroy all events & remove added classes and attributes.
      $trigger.on('destroy.tgp', function() {

        $trigger.off('.tgp');
        plugin.settings.$panel.off('.tgp');

        $trigger.add(plugin.settings.$panel)
          .removeData('togglePanel')
          .removeClass('tgp__trigger tgp__trigger--is-active tgp__panel tgp__panel--is-opened')
          .removeAttr('title role aria-hidden aria-expanded aria-label aria-controls');

      });

    };



    /** Attach events */
    var attachEvents = function () {

      // Listen custom events & stop propagation (avoid <body>'s behavior).
      plugin.settings.$panel
        .on('click', function(event) { event.stopPropagation(); })
        .on('no-autofocus.tgp', function(event) { plugin.settings.autoFocus = false; event.stopPropagation(); })
        .on('show.tgp', function(event) { showPanel(); event.stopPropagation(); })
        .on('hide.tgp', function(event) { hidePanel();  event.stopPropagation();})
        .on('mouseenter.tgp', function(event) {
          plugin.settings.$panel.data('flag-hover', true);
          clearTimeout(plugin.timeoutID);
          event.stopPropagation();
        })
        .on('mouseleave.tgp', function(event) { hidePanelWithTimeout(); plugin.settings.$panel.data('flag-hover', false);  event.stopPropagation();})
        .on('hideWithTimeout.tgp', function(event) { hidePanelWithTimeout();  event.stopPropagation();})
        .on('keydown.tgp', function(event) {

          event.stopPropagation();

          // Hide panel with ESC key.
          if (event.keyCode === 27) {
            $(this).trigger('hide.tgp');
          }

        });

      // Hide panels on body click.
      $('body').on('click', function() {
        plugin.settings.$panel.trigger('hide.tgp');
      });

      // Hide panels when wrapper is left.
      if (plugin.settings.wrapper) {
        plugin.settings.wrapper.on('mouseleave.tgp', function() {
          plugin.settings.$panel.trigger('hideWithTimeout.tgp');
        });
      }

      attachTriggerEvents();

    };

    plugin.init();

  };


  $.fn.togglePanel = function (options) {

    return this.each(function () {

      if (undefined === $(this).data('togglePanel')) {
        var plugin = new $.togglePanel(this, options);
        $(this).data('togglePanel', plugin);
      }

    });

  };

})(jQuery);
