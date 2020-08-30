// Daniel Shiffman
// http://codingtra.in
// https://youtu.be/IKB1hWWedMk
// https://thecodingtrain.com/CodingChallenges/011-perlinnoiseterrain.html

// Edited by SacrificeProductions

// Taken further by 3rdp

var cols, rows;
var scl = 20;
var w = 1400;
var h = 1400;

var flying = 0;

var terrain = [];

// default theme
var STROKE_COLOR = 0
var FILL_COLOR = 255
var BACKGROUND_COLOR = 220

// black theme
//var STROKE_COLOR = 255
//var FILL_COLOR = 0
//var BACKGROUND_COLOR = 0
//
//// vaporwave theme
//var STROKE_COLOR = '255,0,255' // has to be this way for rgba logic to be simple
//var FILL_COLOR = 10
//var BACKGROUND_COLOR = '#2d22e3'
//
//// eighties theme
//var STROKE_COLOR = '7,212,218'
//var FILL_COLOR = 10
//var BACKGROUND_COLOR = 'rgb(255,142,86)'

function getStrokeColor(color, alpha = 1) {
  if (typeof color === 'string') {
    return `rgba(${color},${alpha})`
  }
  return `rgba(${color},${color},${color},${alpha})`
}

function setup() {
  createCanvas(600, 600, WEBGL);
  cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
  frameRate(60)
}

function draw() {

  flying -= 0.4;
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 100);
      xoff += 0.2;
    }
    yoff += 0.2;
  }


  background(BACKGROUND_COLOR);
  rotateX(PI / 3);
  translate(-w / 2, -h / 2);

  //stroke(255, 255, 255);
  //line(-w, 9, w, 9); 

  /*
  line(-w, 1, w, 25); 
  line(-w, 1, w, 50); 
  line(-w, 1, w, 75); 
  line(-w, 1, w, 100); 
  line(-w, 0, w, 150); 
  */
  
  //fill(0);
  //stroke(254, 254, 254);









  /*
   beginShape(TRIANGLE_STRIP);
  vertex(0, 0);
  vertex(50, 50);
  vertex(0, 50);
  endShape();
  beginShape(TRIANGLE_STRIP);
  vertex(-50, -50);
  vertex(0, -50);
  vertex(0, 0);
  vertex(50, -50);
  vertex(50, 0);
  endShape();

  translate(100, 100)
  beginShape(TRIANGLE_FAN);
  vertex(0, 0);
  vertex(50, 50);
  vertex(0, 50);
  endShape();

  beginShape(TRIANGLE_FAN);
  vertex(-50, -50);
  vertex(0, -50);
  vertex(0, 0);
  vertex(50, -50);
  vertex(50, 0);
  endShape();
  */








  //rect(200, 20, 440, 440);







  // see the terrain. spoiler: it looks really bad.
  // actually it looks nicer with antialias: true hardcoded into getContext in p5 file, and on Linux it doesn't work in Chrome, Firefox FTW
  // looks even better on my XPS 15 - equally as good in Edge as in Firefox. didn't try Chrome, haven't installed it yet
  // related Chrome bug, it says it's fixed, I guess not on Linux and/or not on version 80 https://bugs.chromium.org/p/chromium/issues/detail?id=159275
  // ah, now it looks just as good as in Processing (Java). nice. so antialiasing should be enabled from startup, it can't be changed in runtime and somewhy p5 defaults to false, need to patch it to get it to work
  // and actually this sketch works in recent versions of p5, I tried with online editor. but if you use both smooth and noSmooth you'll crash the sketch, and when you call smooth you'll be making everything smoother (as expected). I didn't want to use the latest version at the time because they had smooth in webgl mode break the stroke on TRIANGLE_STRIP, making the terrain invisible. I'm happy that version 1.1.9 worked for me, still I'll include my patched p5.min.js for reference.
  fill(FILL_COLOR)
  for (var y = 0; y < rows - 1; y++) {
    smooth();
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      // z (height and depth of terrain) to be normalized at to the horizon (y == 0)
      const mapZregulators = {
        0: 0.00001,
        1: 0.01,
        2: 0.1, 3: 0.15, 4: 0.2, 5: 0.22, 6: 0.24, 7: 0.26, 8: 0.28, 9: 0.3, 10: 0.32, 11: 0.34, 12: 0.36, 13: 0.38, 14: 0.4, 15: 0.42, 16: 0.44, 17: 0.46, 18: 0.48, 19: 0.5, 20: 0.52, 21: 0.54, 22: 0.56, 23: 0.58, 24: 0.6, 25: 0.62, 26: 0.64, 27: 0.66, 28: 0.68, 29: 0.7, 30: 0.72, 31: 0.74, 32: 0.76, 33: 0.78, 34: 0.8, 35: 0.82, 36: 0.84, 37: 0.86, 38: 0.88, 39: 0.9, 40: 0.92, 41: 0.94, 42: 0.96, 43: 0.98 };
      let zRegulator0 = mapZregulators[y] || 1;
      let zRegulator1 = mapZregulators[y + 1] || 1;
      // make terrain color more transparent at the horizon
      if (zRegulator1 === 1 && zRegulator0 === 1) {
        stroke(getStrokeColor(STROKE_COLOR));
      } else {
        stroke(getStrokeColor(STROKE_COLOR, zRegulator0));
      }
      // bend the plane a little bit down at the horizon, creates the illuson of a round earth
      vertex(
        x * scl, y * scl,
        terrain[x][y] * zRegulator0
        - 100 * (1 - zRegulator0)
      );
      vertex(
        x * scl, (y + 1) * scl,
        terrain[x][y + 1] * zRegulator1
        - 100 * (1 - zRegulator1)
      );
      // TODO: bend the plane under the camera point of view down a little bit, to complete the round earth illusion
    }
    endShape();
  }
}
