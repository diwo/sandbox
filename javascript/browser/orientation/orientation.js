// orientation.js
//
// First go at orientation and canvas web APIs.

'use strict';

var OrientationDemo = function() {
  this.context = null;
  this.alpha = null;
  this.beta = null;
  this.gamma = null;
};

OrientationDemo.prototype = {
  NEEDLE_SIZE: 100,
  NEEDLE_COLOR: '#FF0000',
  GRID_COLOR: '#8888FF',

  init: function() {
    var demo = this;

    window.addEventListener('resize', function(){ demo.resize(); });

    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
      this.context = canvas.getContext('2d');
    } else {
      document.getElementById('canvas-unsupported').style.display = 'block';
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function(data) {
        demo.updateOrientation(data.alpha, data.beta, data.gamma);
      }, false);
    } else {
      document.getElementById('orientation-unsupported').style.display = 'block';
    }

    this.resize();
    this.render();
  },

  resize: function() {
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
  },

  render: function() {
    var demo = this;
    window.requestAnimationFrame(function(){ demo.render(); });

    document.getElementById('orientation-alpha').innerHTML = Math.round(this.alpha);
    document.getElementById('orientation-beta').innerHTML = Math.round(this.beta);
    document.getElementById('orientation-gamma').innerHTML = Math.round(this.gamma);

    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.drawGrid(Math.max(this.context.canvas.width, this.context.canvas.height)/15);

    var x = this.context.canvas.width/2 - (this.context.canvas.width/2 * this.gamma/90.0);
    var y = this.context.canvas.height/2 - (this.context.canvas.height/2 * this.beta/90.0);
    var rot = this.alpha * Math.PI/180;
    this.drawNeedle(x, y, rot);
  },

  drawGrid: function(gapWidth) {
    var context = this.context;
    var canvasWidth = context.canvas.width;
    var canvasHeight = context.canvas.height;

    var drawLine = function(x1, y1, x2, y2) {
      context.save();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.restore();
    };

    var drawV = function(x) {
      drawLine(x, 0, x, canvasHeight);
    };

    var drawH = function(y) {
      drawLine(0, y, canvasWidth, y);
    };

    context.save();
    context.strokeStyle = this.GRID_COLOR;
    context.setLineDash([5, 15]);

    var centerX = canvasWidth/2;
    for (var centerOffsetX=0; centerOffsetX<canvasWidth-centerX; centerOffsetX+=gapWidth) {
      drawV(centerX+centerOffsetX);
      if (centerOffsetX > 0) {
        drawV(centerX-centerOffsetX);
      }
    }

    var centerY = canvasHeight/2;
    for (var centerOffsetY=0; centerOffsetY<canvasHeight-centerY; centerOffsetY+=gapWidth) {
      drawH(centerY+centerOffsetY);
      if (centerOffsetY > 0) {
        drawH(centerY - centerOffsetY);
      }
    }

    context.restore();
  },

  drawNeedle: function(x, y, rot) {
    this.context.save();

    this.context.fillStyle = this.NEEDLE_COLOR;
    this.context.lineWidth = 5;
    this.context.lineJoin = 'round';

    this.context.translate(x, y);
    this.context.rotate(rot);
    this.context.translate(-x, -y);

    this.context.beginPath();

    this.context.moveTo(x, y-this.NEEDLE_SIZE/2);
    this.context.lineTo(x+this.NEEDLE_SIZE/2, y+this.NEEDLE_SIZE/2);
    this.context.lineTo(x, y+this.NEEDLE_SIZE*2/10);
    this.context.lineTo(x-this.NEEDLE_SIZE/2, y+this.NEEDLE_SIZE/2);
    this.context.closePath();

    this.context.fill();
    this.context.stroke();

    this.context.restore();
  },

  updateOrientation: function(alpha, beta, gamma) {
    this.alpha = alpha;
    this.beta = beta;
    this.gamma = gamma;
  }
};

var demo = new OrientationDemo();
demo.init();
