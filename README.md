# Summernote Prettyprint Plugin

Plugin that add prettyprinted code into editor

## Installation

```html
<!-- include jquery -->
<script   src="http://code.jquery.com/jquery-2.2.4.min.js"></script>

<!-- include Bootstrap and Prettyprint -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min.css" />
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/prettify/r298/prettify.min.js"></script>

<!-- include summernote css/js -->
<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.1/summernote.css" />
<script src="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.1/summernote.js"></script>

<!-- include summernote plugin -->
<script src="summernote-prettyprint-plugin.js"></script>
```

## Usage

Add `div` into `body`; this targeted element will later be rendered to summernote editing tool.

```html
<div id="summernote"></div>
```
Run the script below when document is ready!

```html
<script>
  $(document).ready(function() {
    $('#summernote').summernote();
  });
</script>
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

[License](LICENSE)
