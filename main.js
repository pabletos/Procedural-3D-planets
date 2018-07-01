var scene, camera, renderer, cube, sphere, ring, rough, metal, ringh, cont;
var ratio = ratio = window.innerWidth/window.innerHeight;
var radius = 1;

//Procedural params
var hasRing, zoom, h, h0, h1, h2, h3, h4, maxBumpHeight, minBumpHeight, biomeZoom, sat, type;

function initRenderer(){
    renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
  
function initCamera(){     
    camera = new THREE.PerspectiveCamera(45, ratio, 1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    //controls = new THREE.OrbitControls( camera );
}

function initScene(){
    scene = new THREE.Scene();
    var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(0, 1, 0.5);
    scene.add(directionalLight);
}
  
function initSphere(){
    var options, disp, texture;
    var maxA = renderer.capabilities.getMaxAnisotropy();
    //var geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
    var geometry = new THREE.SphereGeometry( radius, 32, 32 );
    if(type != 4 ){//Not gas
      var canvases = createTexture();
      texture = new THREE.CanvasTexture(canvases[0]);
      disp = new THREE.CanvasTexture(canvases[1]);
      options = {
        map: texture, 
        bumpMap: disp,
        refractionRatio: 0.01,
        metalness: metal,
        roughness: rough //quita los brillitos
      }
      disp.anisotropy = maxA;
    }else{
      texture = new THREE.CanvasTexture(createGasTexture(2048,2048));
      options = {
        map: texture, 
        refractionRatio: 0.01,
        roughness: 1 //quita los brillitos
      }
    }
    texture.anisotropy = maxA;
    var background = new THREE.CanvasTexture(createStarMap(window.innerWidth, window.innerHeight, 40));
    var material = new THREE.MeshStandardMaterial(options);
    
    for (var i in geometry.vertices) {
      var vertex = geometry.vertices[i];
      vertex.normalize().multiplyScalar(radius);
    }

    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    scene.background = background;
}

function initRing(){
    var innerRadius = radius + 0.5;
    var outerRadius = innerRadius + 1;
    var texture = new THREE.CanvasTexture(createRingTexture(2048,2048));
    var geometry = new THREE.RingGeometry( innerRadius, outerRadius, 32 );
    var material = new THREE.MeshStandardMaterial( {
      map: texture,
      side: THREE.DoubleSide
      } );
    ring = new THREE.Mesh( geometry, material );
    
    scene.add( ring );
    ring.rotation.x = 11;
    ring.rotation.y = 20 - (40 * Math.random());
    
}

function initParams(){
    type = 0;
    cont = true;
    hasRing = Math.random() >= 0.5; // True or false
    zoom = Math.random() * 900 + 100; // Between 100 and 1000
    biomeZoom = 100; // Between 100 and 1000
    rough = 1;
    metal = 0.5;
    
    maxBumpHeight = Math.random() * 240 + 16; // Between 55 and 255
    minBumpHeight = 0;

    chooseType();
}

function chooseType(){
    rough = 1;
    metal = 0.5;
    ringh = Math.random() * 255;
    if(type == 0){ //Metallic
      radius = Math.random() * 0.3 + 0.2;
      hasRing = false; 
      zoom = Math.random() * 900 + 100; // Between 100 and 1000
      biomeZoom = Math.random() * 90 + 10; // Between 100 and 1000
      sat = (Math.random() * 4 + 1)/10;
      h = Math.random() * 255;
      h0 = Math.random() * 255;
      h1 = Math.random() * 255;
      h2 = Math.random() * 255;
      h3 = Math.random() * 255;
      h4 = Math.random() * 255;
      rough = 0.7;
      metal = 0.8;
    }else if(type == 1){ //Rocky
      radius = Math.random() * 0.3 + 0.5;
      hasRing = Math.random() >= 0.5; 
      zoom = Math.random() * 900 + 100;
      biomeZoom = Math.random() * 200 + 100;
      sat = (Math.random() * 4 + 1)/10;
      h = Math.random() * 255;
      h0 = h1 = h;
      h2 = Math.random() * 255;
      h3 = h4 = h2;
    }else if(type == 2){ //Atmosphere
      radius = Math.random() * 0.3 + 0.9;
      hasRing = Math.random() >= 0.5; 
      zoom = Math.random() * 900 + 100;
      biomeZoom = Math.random() * 200 + 200;
      sat = (Math.random() * 4 + 2)/10;
      h = Math.random() * 255;
      h0 = Math.random() * 255;
      h1 = Math.random() * 255;
      h2 = Math.random() * 255;
      h3 = Math.random() * 255;
      h4 = Math.random() * 255;
      hasRing = Math.random() >= 0.5; 
      zoom = Math.random() * 900 + 100;
      biomeZoom = Math.random() * 500 + 500; 
    }else if(type == 3){//Ice
      radius = Math.random() * 0.3 + 0.9;
      hasRing = false;
      zoom = Math.random() * 300 + 200;
      biomeZoom = Math.random() * 1000 + 2000;
      h = h0 = h1 = Math.random() * 60 + 180;
      h2 = h3 = h4 = Math.random() * 60 + 180;
      sat = (Math.random() * 2 + 4)/10;
    }else if(type == 4){//Gas
      radius = Math.random() * 0.3 + 0.9;
      hasRing = Math.random() >= 0.7;
      zoom = 1;
      biomeZoom = 5000;
      h = h0 = h1 = h2 = h3 = h4= Math.random() * 255;
      sat = (Math.random() * 2 + 4)/10;
    }
}

function customChooseType(r, rh, ph1, ph2, s, ring){
    rough = 1;
    metal = 0.5;
    ringh = rh;
    if(type == 0){ //Metallic
      radius = r;
      hasRing = ring; 
      zoom = Math.random() * 900 + 100; // Between 100 and 1000
      biomeZoom = Math.random() * 90 + 10; // Between 100 and 1000
      sat = s;
      h = ph1;
      h0 = ph2;
      h1 = Math.random() * 255;
      h2 = Math.random() * 255;
      h3 = Math.random() * 255;
      h4 = Math.random() * 255;
      rough = 0.7;
      metal = 0.8;
    }else if(type == 1){ //Rocky
      radius = r;
      hasRing = ring; 
      zoom = Math.random() * 900 + 100;
      biomeZoom = Math.random() * 200 + 100;
      sat = s;
      h = ph1;
      h0 = h1 = h;
      h2 = ph2;
      h3 = h4 = h2;      
    }else if(type == 2){ //Atmosphere
      radius = r;
      hasRing = ring; 
      zoom = Math.random() * 900 + 100;
      biomeZoom = Math.random() * 200 + 200;
      sat = s;
      h = ph1;
      h0 = ph2;
      h1 = Math.random() * 255;
      h2 = Math.random() * 255;
      h3 = Math.random() * 255;
      h4 = Math.random() * 255;
      zoom = Math.random() * 900 + 100;
      biomeZoom = Math.random() * 500 + 500; 
    }else if(type == 3){//Ice
      rough = 0.6;
      metal = 0.1;
      radius = r;
      hasRing = ring;
      zoom = Math.random() * 300 + 200;
      biomeZoom = Math.random() * 1000 + 2000;
      h = h0 = h1 = Math.random() * 60 + 180;
      h2 = h3 = h4 = Math.random() * 60 + 180;
      sat = s;
    }else if(type == 4){//Gas
      radius = r;
      hasRing = ring;
      zoom = 1;
      biomeZoom = 5000;
      h = h0 = h1 = h2 = h3 = h4= ph1;
      sat = s;
    }
}

function clearScene(){
    scene.remove(sphere);
    scene.remove(ring);
}
  
function init(){
    initParams();
    initRenderer();
    initCamera();
    initScene();
    initSphere();
    if(hasRing){
      initRing();
    }
}

function reset(){
    clearScene();
    initSphere();
    if(hasRing){
      initRing();
    }
}
  
function animate() {
    if(cont){
      sphere.rotation.y += 0.01;
    }     
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function createRingTexture(width, height){
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height =  height;
    var ctx = canvas.getContext('2d');
    var center = [width/2, height/2];

    for (var r = 1; r < width/2; r += 10) {
      ctx.beginPath();
      ctx.arc(center[0], center[1], r, 0, 2*Math.PI);
      ctx.lineWidth = 10;
      ctx.strokeStyle="hsl("+ringh+','+ 50 + '%,' + (Math.random()*50 + 25) + '%)';
      ctx.stroke();
    }

    return canvas;
}

function createGasTexture(width, height){
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height =  height;
    var ctx = canvas.getContext('2d');
    var center = [width/2, height/2];
    var rndVar = Math.ceil(Math.random() * height);

    for (var ht = 0; ht < height; ht += rndVar) {
      ctx.beginPath();
      ctx.fillStyle="hsl("+h+','+ 50 + '%,' + (Math.random()*50 + 25) + '%)';
      ctx.fillRect(0, ht, width, height);
      rndVar = Math.ceil(Math.random() * 100);
    }

    return canvas;
}

function createStarMap(width, height, R){
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height =  height;
    var ctx = canvas.getContext('2d');
    var image = ctx.createImageData(canvas.width, canvas.height);
    var data = image.data;
    var sample = poissonDiscSampler(width, height, R);

    var s = sample();
    while(s){
      var comp = Math.random() * 180 + 20;
      var visibility = Math.random();
      var cell = (Math.floor(s[0]) + Math.floor(s[1]) * canvas.width) * 4;
      data[cell] = comp; //red
      data[cell + 1] = comp; //blue
      data[cell + 2] = comp; //green
      if(visibility < 0.4){
        data[cell + 3] = 0; // alpha.
      }else{
        data[cell + 3] = 255; // alpha.
      }
      var s = sample();
    }

    ctx.putImageData(image, 0, 0);
    
    return canvas;
}

function makeArray(d1, d2) {
    var arr = [];
    for(i = 0; i < d2; i++) {
        arr.push(new Array(d1));
    }
      return arr;
}

function createBiome(width, height, zoom){
    var biome = makeArray(width, height);
    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var value = Math.abs(noise.bcPerlin2(4*x / zoom, 3*y / zoom)
          + 0.8 * noise.bcPerlin2((2*x) / zoom, (y) / zoom)  
          + 0.5 * noise.bcPerlin2((x) / zoom, (y) / zoom) 
          + 0.35 * noise.bcPerlin2((9*x) / zoom, (5*y) / zoom)
          + 0.15 * noise.bcPerlin2((2*x) / zoom, (3*y) / zoom));
        biome[x][y] = value;
      }
    }
    return biome;
}

function createTexture(){
    var canvas = document.createElement('canvas');
    var dispCanvas = document.createElement('canvas');
    canvas.width = dispCanvas.width = 2048;
    canvas.height = dispCanvas.height = 2048;
    var ctx = canvas.getContext('2d');
    var image = ctx.createImageData(canvas.width, canvas.height);
    var data = image.data;
    var ctx2 = dispCanvas.getContext('2d');
    var dispImg = ctx2.createImageData(dispCanvas.width, dispCanvas.height);
    var dispData = dispImg.data;
    noise.seed(Math.random());
    
    
    var biome = createBiome(canvas.width, canvas.height, biomeZoom);

    for (var x = 0; x < canvas.width; x++) {
      for (var y = 0; y < canvas.height; y++) {
        var value = Math.abs(noise.bcPerlin2(x / zoom, y / zoom)
          + 0.8 * noise.bcPerlin2((5*x) / zoom, (3*y) / zoom)  
          + 0.5 * noise.bcPerlin2((2*x) / zoom, (2*y) / zoom) 
          + 0.35 * noise.bcPerlin2((4*x) / zoom, (2*y) / zoom)
          + 0.15 * noise.bcPerlin2((3*x) / zoom, (1*y) / zoom));
        //value *= 256;
        value *= 1;
        var variation = value *0.5;
        var l = value * ((0.3 - 0.1) + 0);
        var cell = (x + y * canvas.width) * 4;

        if(biome[x][y] < 0.1 && type != 3){ //deep water
          if(type == 2){var dispValue = minBumpHeight;}
          else{var dispValue = (variation) * (maxBumpHeight - minBumpHeight) + minBumpHeight;}            
          var color = hslToRgb(h0, sat, value * (0.3 - 0.1));
        }else if(biome[x][y] < 0.3){
          var dispValue = (0.1 + variation) * (maxBumpHeight - minBumpHeight) + minBumpHeight;
          var color = hslToRgb(h, sat, value * (0.5 - 0.3)  + 0.3);
        }else if(biome[x][y] < 0.5){
          var dispValue = (0.3 + variation) * (maxBumpHeight - minBumpHeight) + minBumpHeight;
          var color = hslToRgb(h1, sat, value * (0.7 - 0.5)  + 0.5);
        }
        else if(biome[x][y] < 0.7){
          var dispValue = (0.5 + variation) * (maxBumpHeight - minBumpHeight) + minBumpHeight;           
          var color = hslToRgb(h2, sat, value * (0.9 - 0.7)  + 0.7);
        }else if(biome[x][y] < 0.9){
          var dispValue = (0.7 + variation) * (maxBumpHeight - minBumpHeight) + minBumpHeight;;           
          var color = hslToRgb(h3, sat, value * (1 - 0.9)  + 0.9);
        }else{
          var dispValue = (0.9 + (variation/2)) * (maxBumpHeight - minBumpHeight) + minBumpHeight;;           
          var color = hslToRgb(h4, sat, 1);
        }

        data[cell] = color[0]; //red
        data[cell + 1] = color[1]; //blue
        data[cell + 2] = color[2]; //green
        data[cell + 3] = 255; // alpha.
        
        dispData[cell] = dispData[cell + 1] = dispData[cell + 2] = dispValue;
        dispData[cell + 3] = 255;
        
      }
    }
    
    ctx.putImageData(image, 0, 0);
    ctx2.putImageData(dispImg, 0, 0);

    return [canvas, dispCanvas];
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
  
var parameters = function() {
    this.type = 0;
    this.color1 = [ 0, 128, 255 ];
    this.color2 = [ 46, 128, 60 ];
    this.color3 = [ 46, 128, 60 ];
    this.ring = false;
    this.rotation = 0;
    this.radius = 0.5;
    this.cont = true;
    this.imageBtn = function(){
        saveImage(renderer);
    };
    this.random = function(){
        chooseType();
        reset();
    }
    this.play = function(){
        type = this.type;
        var cr = rgbToHsl(this.color3[0],this.color3[1],this.color3[2]);
        var c1 = rgbToHsl(this.color1[0],this.color1[1],this.color1[2]);
        var c2 = rgbToHsl(this.color2[0],this.color2[1],this.color2[2]);
        customChooseType(this.radius, Math.ceil(cr[0] * 360), Math.ceil(c1[0] * 360), Math.ceil(c2[0] * 360), (c1[1]+c2[1])/2, this.ring);
        reset();
        this.rotation = 0;
        this.radius = radius;
    }
};

function makeGui(){
    var gui = new dat.GUI({name: "Control Panel"});
    var params = new parameters();
    var f1 = gui.addFolder("General");
    var f2 = gui.addFolder("Procedural params");
    var f3 = gui.addFolder("Camera");
    var tp = f1.add(params, 'type', { Metalic: 0, Rocky: 1, Atmospheric: 2, Frozen: 3, Gas: 4}).name("Planet Type");
    f2.addColor(params, "color1").name("Color 1");
    f2.addColor(params, "color2").name("Color 2");
    f2.addColor(params, "color3").name("Ring Color");
    f2.add(params, "radius", 0.1, 1.5).step(0.1);
    f2.add(params, "ring").name("Has ring");
    f2.add(params, "play").name("Apply changes");
    var contRot = f3.add(params, "cont").name("Auto-rotate");
    var rot = f3.add(params, "rotation", -Math.PI, Math.PI).step(0.01).name("Rotation");
    
    gui.closed = false;
    f1.closed = false;
    gui.add(params, "imageBtn").name("Save image");
    gui.add(params, 'random').name("Randomize");
    
    tp.onChange(function(value){
        params.play();
    });
    contRot.onChange(function(value){
        cont = value;
    });    
    rot.onChange(function(value){
        sphere.rotation.y = params.rotation;
    });
}
  
window.onload = function() {        
    makeGui();
    init();
    animate();
    window.addEventListener('resize', onWindowResize, false);
}