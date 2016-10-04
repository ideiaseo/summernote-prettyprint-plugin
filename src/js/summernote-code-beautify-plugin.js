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

    var prettyprintOpitions = {};

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


      /*var languages = [
        {
          name: "HTML",
          code: "html"
        }, {
          name: "CSS",
          code: "css"
        }, {
          name: "Javascript",
          code: "javascript"
        }, {
          name: "APACHE CONF",
          code: "apacheconf"
        }, {
          names: "ASP.Net",
          code: "aspnet"
        }, {
          name: "BASH",
          code: "bash"
        }, {
          name: "Basic",
          code: "basic"
        }, {
          name: "BATCH",
          code: "batch"
        }, {
          name: "C",
          code: "c"
        }, {
          name: "C#",
          code: "csharp"
        }, {
          name: "C++",
          code: "cpp"
        }, {
          name: "CoffeeScript",
          code: "coffeescript"
        }, {
          name: "Ruby",
          code: "ruby"
        }, {
          name: "Dart",
          code: "dart"
        }, {
          name: "Docker",
          code: "docker"
        }, {
          name: "Erlang",
          code: "erlang"
        }, {
          name: "Fortran",
          code: "fortran"
        }, {
          name: "Git",
          code: "git"
        }, {
          name: "Go",
          code: "go"
        }, {
          name: "GROOVY",
          code: "groovy"
        }, {
          name: "HASKELL",
          code: "haskell"
        }, {
          name: "HTTP",
          code: "http"
        }, {
          name: "Java",
          code: "java"
        }, {
          name: "JSON",
          code: "json"
        }, {
          name: "LATEX",
          code: "latex"
        }, {
          name: "LESS",
          code: "less"
        }, {
          name: "LUA",
          code: "lua"
        }, {
          name: "MAKEFILE",
          code: "makefile"
        }, {
          name: "Markdown",
          code: "markdown"
        }, {
          name: "MATLAB",
          code: "matlab"
        }, {
          name: "NGINX",
          code: "nginx"
        }, {
          name: "Objective-C",
          code: "objectivec"
        }, {
          name: "Pascal",
          code: "pascal"
        }, {
          name: "PERL",
          code: "perl"
        }, {
          name: "PHP",
          code: "php"
        }, {
          name: "Power Shell",
          code: "powershell"
        }, {
          name: "PROLOG",
          code: "prolog"
        }, {
          name: "Python",
          code: "python"
        }, {
          name: "Q",
          code: "q"
        }, {
          name: "JSX",
          code: "jsx"
        }, {
          name: "REST",
          code: "rest"
        }, {
          name: "SASS",
          code: "sass"
        }, {
          name: "SCSS",
          code: "scss"
        }, {
          name: "SCALA",
          code: "scala"
        }, {
          name: "SMALLTALK",
          code: "smalltalk"
        }, {
          name: "SQL",
          code: "sql"
        }, {
          name: "Stylus",
          code: "stylus"
        }, {
          name: "Swift",
          code: "swift"
        }, {
          name: "TEXTILE",
          code: "textile"
        }, {
          name: "Twig",
          code: "twig"
        }, {
          name: "Typescript",
          code: "typescript"
        }, {
          name: "YAML",
          code: "yaml"
        }
      ];
      */
      var languages = [
        "html", "css", "clike", "javascript", "apacheconf", "aspnet", "bash",
        "basic", "batch", "c", "csharp", "cpp", "coffeescript", "ruby", "dart",
        "docker", "erlang", "fortran", "git", "go", "groovy", "haskell", "http",
        "java", "json", "latex", "less", "lua", "makefile", "markdown", "matlab",
        "nginx", "objectivec", "pascal", "perl", "php", "powershell", "prolog",
        "python", "q", "jsx", "rest", "sass", "scss", "scala", "smalltalk", "sql",
        "stylus", "swift", "textile", "twig", "typescript", "yaml"
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

      var $node = $('<pre class="line-numbers">');
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
        $(self.$code).on('input', function (event) {
          self.enableAddButton();
          self.$code
        });
        $(self.$codeLanguage).on('change', function (event) {
          self.enableAddButton();
        });
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
