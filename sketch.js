// <!--!
// ———————————————————————Designed and Built———————————————————————
// ———————————————————————Philip Frank Otto————————————————————————
// ———————————————————————Echo Park California—————————————————————
// Into the Drawing Wild | p5JS Hiking Time Travels
// Thanks to Casey Reas and Harvey Moon.
// Desma 171 | Winter 2022 | UCLA Design Media Arts

// Spacebar to shift mode.
// Up and Down Arrow to change route.
// -->

let latRoutes = []; // array of latitude data from GPX files
let lonRoutes = []; // array of longitude data from GPX files
let eleRoutes = []; // array of elevation data from GPX files
let speedRoutes = []; // array of speed data from GPX files

let mode = 0; // drawing modes; singular route or all routes

let bg; // background

let xm = 0; //mapped x location
let ym = 0; //mapped y location
let xm1 = 0; //mapped x location
let ym1 = 0; //mapped y location
let ele = 0; //mapped elevation
let speed = 1; //mapped speed

let j = 0; // variable for number of routes in array
let k = 0; // variable for data points in each route

let l = 0; // variable for number of routes in array
let m = 0; // variable for data points in each route

let files = [
  'data/route_2022-03-05_6.28pm.gpx',
  'data/route_2022-02-26_8.03pm.gpx',
  'data/route_2022-02-21_4.41pm.gpx',
  'data/route_2022-02-19_6.04pm.gpx',
  'data/route_2022-02-16_1.51pm.gpx',
  'data/route_2022-02-12_4.15pm.gpx',
  'data/route_2022-02-04_6.02pm.gpx',
  'data/route_2022-01-31_9.50pm.gpx',
  'data/route_2022-01-29_6.20pm.gpx',
  'data/route_2022-01-28_6.11pm.gpx',
  'data/route_2022-01-23_6.27pm.gpx',
  'data/route_2022-01-21_6.21pm.gpx',
  'data/route_2022-01-19_8.01pm.gpx',
  'data/route_2022-01-17_3.25pm.gpx',
  'data/route_2022-01-17_12.20pm.gpx',
  'data/route_2022-01-10_8.28pm.gpx',
  'data/route_2022-01-08_7.04pm.gpx',
  'data/route_2022-01-03_8.27pm.gpx',
  'data/route_2022-01-01_5.19pm.gpx',
  'data/route_2021-12-31_6.24pm.gpx',
  'data/route_2021-12-30_9.25am.gpx',
  'data/route_2021-12-30_10.31pm.gpx',
  'data/route_2021-12-29_8.52am.gpx',
  'data/route_2021-12-29_12.45pm.gpx',
  'data/route_2021-12-28_9.12pm.gpx',
  'data/route_2021-12-28_3.50pm.gpx',
  'data/route_2021-12-27_9.42pm.gpx',
  'data/route_2021-12-27_8.13am.gpx',
  'data/route_2021-12-27_1.06pm.gpx',
  'data/route_2021-12-26_5.14pm.gpx',
  'data/route_2021-12-26_11.43am.gpx',
  'data/route_2021-12-25_7.11pm.gpx',
  'data/route_2021-12-21_1.10pm.gpx',
  'data/route_2021-12-11_6.27pm.gpx',
  'data/route_2021-12-05_11.29am.gpx',
  'data/route_2021-11-23_12.31pm.gpx',
  'data/route_2021-11-16_12.33pm.gpx',
  'data/route_2021-11-09_12.36pm.gpx',
  'data/route_2021-11-09_1.49pm.gpx',
];

// preload data from gpx files above
function preload() {
  // get the latitude, longitutde, and speed from the .gpx files
  for (let i = 0; i < files.length; i++) {
    [latRoutes[i], lonRoutes[i], eleRoutes[i], speedRoutes[i]] = readGPX(files[i]);
  }
}

// clear background and recalcuate drawing proportions when resizing window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (mode < 1) {
    background(bgDark);
    mode = 0;
  }
  else {
    background(bgLight);
  }
}

//basic support for touch screens
function touchStarted() {
  if (mode < 1) {
    background(bgDark);
    l = l + 1;
    m = 0;
    if (l == lonRoutes.length) {
      l = 0;
    }
  }
}

//Spacebar to change drawing modes
function keyPressed() {
  if (keyCode == 32) {
    if (mode < 1) {
      background(bgLight);
      mode++;
    }
    else if (mode === 1) {
      background(bgDark); m
      mode = 0;
    }
  }
  //Arrow keys to cycle through routes
  if (keyCode == UP_ARROW && l <= lonRoutes.length - 1 && mode == 0) {
    console.log(l);
    background(bgDark);
    l = l + 1;
    m = 0;
    if (l == lonRoutes.length) {
      l = 0;
    }
  }
  if (keyCode == DOWN_ARROW && l > 0 && mode == 0) {
    console.log(l);
    background(bgDark);
    l = l - 1;
    m = 0;
    if (l == 0) {
      l = lonRoutes.length - 1;
    }
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  // rectMode(CENTER);
  // ellipseMode(CENTER);
  strokeCap(SQUARE);
  colorMode(HSB, 360, 100, 100, 100);
  bgLight = color(0, 0, 97.5, 100);
  bgDark = color(0, 0, 2.5, 100);
  background(bgDark); // start with dark background
}

//javascript function to parse and load data from GPX files loaded above
function readGPX(file) {
  let latp = []; // array for latitude data
  let lonp = []; // array for longitude data
  let elep = []; // array for elevation data
  let speedp = []; // array for speed data
  fetch(file)
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(doc => {
      const nodes = [...doc.getElementsByTagName('trkpt')];
      nodes.forEach(node => {
        latp.push(node.getAttribute("lat"));
        lonp.push(node.getAttribute("lon"));
      })
      const ele = doc.getElementsByTagName('ele');
      for (let i = 0; i < ele.length; i++) {
        elep.push(ele[i].innerHTML);
      }
      const speeds = doc.getElementsByTagName('speed');
      for (let i = 0; i < speeds.length; i++) {
        speedp.push(speeds[i].innerHTML);
      }
    })
  return [latp, lonp, elep, speedp]
}


function draw() {
  if (mode == 0) {
    drawRoute(); //default drawing mode; singular route
  }
  if (mode == 1) {
    drawRoutes(); //secondary drawing mode; all routes, geospatially located
  }
}

//secondary drawing mode; all routes, geospatially located
function drawRoutes() {
  console.log(frameRate());
  for (let jump = 0; jump <= 128; jump++) { //for loop to accelerate drawing speed;
    xm = map(lonRoutes[j][k], -117.4, -119, 0, width, true); // mapped x location
    ym = map(latRoutes[j][k], 34.5, 33.5, 0, height, true); // mapped y location
    ele = map(eleRoutes[j][k], 0, 1000, 0, height); // mapped elevation
    speed = map(speedRoutes[j][k], 0, 4, 0, .1); // mapped speed
    strokeWeight(speed); // map stroke weight to speed
    let hue = map(ele, 0, 1000, 0, 330, true); // map hue to elevation
    stroke(hue, 64, 100, 50); // set color to HSB; hue = elevation; 64% saturation; 100% brightness; 50% alpha
    line(xm, ym, xm, ym - ele * .05); // draw line at mapped location
    line(xm, ym, xm, ym + ele * .05);
    if (j <= lonRoutes.length - 1) {
      k++;
      if (k == lonRoutes[j].length) {
        if (j < lonRoutes.length) {
          j++;
          k = 0;
        }
      }
    }
    if (j == lonRoutes.length) {
      j = 0;
      background(bgLight)
    }
  }
}

//primary drawing mode; singular route
function drawRoute() {
  for (let jump = 0; jump <= speed * 32; jump++) { //for loop to accelerate drawing speed;
    let xm1 = map(lonRoutes[l][m], max(lonRoutes[l]), min(lonRoutes[l]), 0, width, true); // mapped x location
    let ym1 = map(latRoutes[l][m], max(latRoutes[l]), min(latRoutes[l]), 0, height, true); // mapped y location
    ele = map(eleRoutes[l][m], 0, 1000, 0, height); // mapped elevation
    speed = map(speedRoutes[l][m], 0, 4, 0, .1); // mapped speed
    strokeWeight(speed * 16); // map stroke weight to speed
    hue = map(ele, 0, 1000, 0, 330, true); // map hue to elevation
    stroke(hue, 64, 100, 100); // set color to HSB; hue = elevation; 64% saturation; 100% brightness; 50% alpha
    line(xm1, ym1, xm1, ym1 - ele * .2);
    if (l <= lonRoutes.length - 1) { //-1 to account for array starting at 0; so the index of array-length dosn't exist
      m++;
      if (m == lonRoutes[l].length) {
        if (l < lonRoutes.length - 1) {
          l++;
          m = 0;
          background(bgDark);
        }
      }
    }
    if (l == lonRoutes.length) {
      l = 0;
    }
  }
}