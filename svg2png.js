(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.echo = factory(root);
  }
})(this, function (root) {

    'use strict';

    function loadFile(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.querySelector( '#svg-content' ).value = evt.target.result;
        };
        reader.readAsBinaryString(file);
    }

    function drawImage() {
        var svg = document.querySelector('svg');
        var view = svg.viewBox.baseVal;
        var s = new XMLSerializer().serializeToString(svg);
        var data = new Blob([s], {type: "image/svg+xml;charset=utf-8"});

        var img = document.createElement('img');
        img.onload = function () {
            var canvas = document.getElementById('canvas');
            var x = view.x;
            var y = view.y;
            var width = parseInt(view.width);
            var height = parseInt(view.height);;
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, x, y, width, height);

            var svgImages = svg.querySelectorAll('image');
            for (var i = 0; i < svgImages.length; i++) {
                var v = svgImages[i];
                var t = document.createElement('img');
                t.src = v.href.baseVal;
                t.onload = function () {
                    ctx.drawImage(t,
                                  parseInt(v.x.baseVal.value),
                                  parseInt(v.y.baseVal.value),
                                  parseInt(v.width.baseVal.value),
                                  parseInt(v.height.baseVal.value));
                };
            }                
            DOMURL.revokeObjectURL(img.src);
        };

        var DOMURL = self.URL || self.webkitURL || self;
        var url = DOMURL.createObjectURL(data);
        img.src = url;

    }

    document.getElementById( 'ifile' ).addEventListener( 'change', function () {
        if ( this.files.length )
            loadFile( this.files[0] );
    }, false );
    
    document.getElementById( 'load' ).addEventListener( 'click', function () {
        document.getElementById( 'ifile' ).click();
    }, false );

    document.getElementById( 'draw' ).addEventListener( 'click', function () {
        document.getElementById( 'svg-preview' ).innerHTML = document.getElementById( 'svg-content' ).value;
        drawImage();
    }, false );

});
