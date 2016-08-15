(function(factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function($) {
  'use strict';

  var summernotePrettyprint = function (context) {
    var self = this;
    var options = context.options;
    var inToolbar = false;

    for (var idx in options.toolbar) {
      var buttons = options.toolbar[idx][1];
      if ($.inArray('prettyprint', buttons) > -1) {
        inToolbar = true;
        break;
      }
    }

    if (!inToolbar) { return; }

    var ui = $.summernote.ui;
    var $editor = context.layoutInfo.editor;
    var lang = options.langInfo;

    var prettyprintOpitions = {

    };

    options.prettyprint = $.extend(prettyprintOpitions, options.prettyprint);

    context.memo('button.prettyprint', function () {
      var button = ui.button({
        contents: '{}',
        tooltip: lang.button.tooltip,
        click: function (event) {
          self.show();
        }
      });

      return button.render();
    });

    this.show = function () {
      context.invoke('editor.saveRange');

      self.showDialog()
        .then(function showDialogCb (data) {
          context.invoke('editor.restoreRange');
          // Insert code prettyprinted into editor
          // [function here]
          self.insertToEditor(data);
          ui.hideDialog(self.$dialog);
        }).fail(function () {
          context.invoke('editor.restoreRange');
        });
    };

    this.showDialog = function () {
      self.disableAddButton();
      self.$code.value = '';

      return $.Deferred(function (deferred) {
        ui.onDialogShown(self.$dialog, function dialogShownCb () {
          context.triggerEvent('dialog.shown');
          self.$codeLanguage.focus();

          self.$addBtn.on('click', function addEmbedCb (event) {
            event.preventDefault();
            deferred.resolve({
              language: self.$codeLanguage.value,
              code: self.$code.value
            });
          });
        });

        ui.onDialogHidden(self.$dialog, function dialogHiddenCb () {
          self.$addBtn.off('click');
          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        ui.showDialog(self.$dialog);
      });
    };

    this.createDialog = function ($container) {

      var languages = [
          'bsh', 'c', 'cc', 'cpp', 'cs', 'csh', 'cyc', 'cv', 'htm', 'html',
          'java', 'js', 'm', 'mxml', 'perl', 'pl', 'pm', 'py', 'php', 'rb',
          'sh', 'xhtml', 'xml', 'xsl'
      ];

      var select = '<select class="form-control" id="code-language"><option>' + languages.join('</option><option>') + '</option></select>';

      var dialogOption = {
        title: lang.dialogPrettyfi.title,
        body: '<div class="form-group">' +
        '<label>' + lang.dialogPrettyfi.selectLabel + '</label>' +
        select +
        '</div>' +
        '<div class="form-group">' +
        '<label>' + lang.dialogPrettyfi.codeLabel + '</label>' +
        '<textarea class="form-control" id="code" rows="7"></textarea>' +
        '</div>',
        footer: '<button href="#" id="btn-add" class="btn btn-primary">' + lang.dialogPrettyfi.button + '</button>',
        closeOnEscape: true
      };

      self.$dialog = ui.dialog(dialogOption).render().appendTo($container);
      self.$addBtn = self.$dialog.find('#btn-add');
      self.$codeLanguage = self.$dialog.find('#code-language')[0];
      self.$code = self.$dialog.find('#code')[0];
    };

    this.insertToEditor = function (options) {
      var innerOptions = {
        code: '',
        language: ''
      };

      var _options = $.extend(innerOptions, options);

      var $node = $('<pre>', {
        class: 'prettyprint linenums'
      });
      var $code = $('<code>');
      $code.html(_options.code.replace(/</g,"&lt;").replace(/>/g,"&gt;"));
      $code.addClass('language-' + _options.language);

      $node.html($code)

      context.invoke('editor.insertNode', $node[0]);
      self.$code.innerHTML = '';
    };

    this.enableAddButton = function() {
      if (!!self.$codeLanguage.value && self.$code.value.length > 0) {
        self.$addBtn.attr("disabled", false);
      }
    };

    this.disableAddButton = function() {
      self.$addBtn.attr("disabled", true);
    };

    this.init = function () {
        self.$code.addEventListener('input', function (event) {
          self.enableAddButton();
        }, false);
        self.$codeLanguage.addEventListener('change', function (event) {
          self.enableAddButton();
        }, false);
    };

    this.initialize = function() {
      var $container = options.dialogsInBody ? $(document.body) : $editor;
      self.createDialog($container);
    };

    this.destroy = function() {
      ui.hideDialog(self.$dialog);
      self.$dialog.remove();
    };

    this.events = {
      'summernote.init': function(we, e) {
        self.init();
      },
      'summernote.change': function (we, contents) {
        prettyPrint(contents);
      }
    };
  };

  $.extend(true, $.summernote, {
    lang: {
      'en-US': {
        dialogPrettyfi: {
          title: 'Insert fragment code into editor',
          selectLabel: 'Choose your language',
          codeLabel: 'Type your code',
          button: 'Insert code'
        },
        button: {
          tooltip: 'Insert code'
        }
      },
      'pt-BR': {
        dialogPrettyfi: {
          title: 'Adicionar fragmento de código ao editor',
          selectLabel: 'Escolha a linguagem',
          codeLabel: 'Digite o seu código aqui',
          button: 'Inserir código'
        },
        button: {
          tooltip: 'Adicionar código'
        }
      }
    },
    plugins: {
      'prettyprint': summernotePrettyprint
    }
  });
}));
