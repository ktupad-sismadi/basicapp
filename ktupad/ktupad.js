isDebug = 1;
if (isDebug) var debug = console.log.bind(window.console)
else var debug = function(){}

var conf={
  isSc:0,
  isDebug:1,
  isLang:0,
  isDb:1,
  lang:'eng',
  token:'fa723e8241927aeedd76960c2234d5f5',
  id:'content',
  data:{},
  mod:'view',
  model:'controller.php',
  host:'http://localhost/data/',
  path:'ktupad/model.php',
  url:{ host:'http://localhost/data/', path:'model.php',},
  profile:{ nama:'ktupad',alamat:'jakarta',telpon:'0812.3123.7896',},
  induk:'1',
  items:'1',
  uid:'1',
  uinduk:'1',
  page:'1',
  rpp:'30',
  scanmode:'mobile',

  lang:{
  id:'eng',
  data:[
    {kode:"email",ina:"Email",eng:"E-mail"},
    {kode:"password",ina:"Sandi",eng:"Password"},

  ],
  view:function (i){ // debug('conf.lang.view: '+i);
  str=i.toLowerCase();

  let country = this.data.find(el => el.kode === str);
  if(country){ return country[this.id] ;}
  else {return i;}
  },
},


  includeHTML:function(){
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("include-html");
      if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("include-html");
            // includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
  },

  tableToExcel :function(table, name, fileName) {
      var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

      if (!table.nodeType) table = document.getElementById(table)
      var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
      var link = document.createElement("A");
      link.href = uri + base64(format(template, ctx));
      link.download = fileName || 'table.xml';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

  scriptLoader:function(scripts, callback) { debug('seting.scriptLoader');
  var count = scripts.length;
  function urlCallback(url) {
  return function () {
  debug(url + ' was loaded (' + --count + ' more scripts remaining).');
  if (count < 1) { callback();  }
  };
  }
  for (var url of scripts) {
  var s = document.createElement('script');
  s.setAttribute('src', url);
  s.onload = urlCallback(url);
  document.head.appendChild(s);
  }
  },
  sc:function(sc){ debug('seting.sc');
  localStorage.setItem("ktupad-sc", sc);
  var p = sc.split('?'),
  p0 = p[0],
  p1 = p[1];
  var m = p1.split('/'),
  m0 = m[0],
  m1 = m[1],
  a='ktupad/controller.js',
  b=p0;
  this.scriptLoader([a,b], function() {
  k[m0].app[m1]();
  });
  this.isSc=1;
  debug(this.isSc)
  },

  pad:function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  },

  sekarang:function(){  debug('seting.sekarang');
  var tgl = new Date();
  var dd = tgl.getDate();
  var mm = tgl.getMonth();
  var yy = tgl.getFullYear();
  sekarang = yy + "-" + this.pad(mm,2) + "-" + this.pad(dd,2) ;
  return sekarang;
  },

  jam:function(){  debug('seting.sekarang');
  var tgl = new Date();
  var hh = tgl.getHours();
  var mm = tgl.getMinutes();
  var ss = tgl.getSeconds();
  sekarang = this.pad(hh,2) + ":" + this.pad(mm,2) + ":" + this.pad(ss,2) ;
  return sekarang;
  },


  formatRupiah:function (angka, prefix){ debug('seting.formatRupiah');
  var number_string = angka.replace(/[^,\d]/g, '').toString(),
  split   		= number_string.split(','),
  sisa     		= split[0].length % 3,
  rupiah     		= split[0].substr(0, sisa),
  ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if(ribuan){
  separator = sisa ? '.' : '';
  rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
  },

  terbilang:function (bilangan){ debug('seting.terbilang');
  var kalimat="";
  var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
  var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
  var tingkat = new Array('','Ribu','Juta','Milyar','Triliun');
  var panjang_bilangan = bilangan.length;

  /* pengujian panjang bilangan */
  if(panjang_bilangan > 15){
  kalimat = "Diluar Batas";
  }else{
  /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
  for(i = 1; i <= panjang_bilangan; i++) {
  angka[i] = bilangan.substr(-(i),1);
  }

  var i = 1;
  var j = 0;

  /* mulai proses iterasi terhadap array angka */
  while(i <= panjang_bilangan){
  subkalimat = "";
  kata1 = "";
  kata2 = "";
  kata3 = "";

  /* untuk Ratusan */
  if(angka[i+2] != "0"){
  if(angka[i+2] == "1"){
  kata1 = "Seratus";
  }else{
  kata1 = kata[angka[i+2]] + " Ratus";
  }
  }

  /* untuk Puluhan atau Belasan */
  if(angka[i+1] != "0"){
  if(angka[i+1] == "1"){
  if(angka[i] == "0"){
  kata2 = "Sepuluh";
  }else if(angka[i] == "1"){
  kata2 = "Sebelas";
  }else{
  kata2 = kata[angka[i]] + " Belas";
  }
  }else{
  kata2 = kata[angka[i+1]] + " Puluh";
  }
  }

  /* untuk Satuan */
  if (angka[i] != "0"){
  if (angka[i+1] != "1"){
  kata3 = kata[angka[i]];
  }
  }

  /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
  if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")){
  subkalimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
  }

  /* gabungkan variabe sub kalimat (untuk Satu blok 3 angka) ke variabel kalimat */
  kalimat = subkalimat + kalimat;
  i = i + 3;
  j = j + 1;
  }

  /* mengganti Satu Ribu jadi Seribu jika diperlukan */
  if ((angka[5] == "0") && (angka[6] == "0")){
  kalimat = kalimat.replace("Satu Ribu","Seribu");
  }
  }
  return kalimat;
  },


  close:function(id){ debug('setting.close: '+id);
  var z=document.getElementById(id);
  z.className = z.className.replace('show', 'hide');
  }, // end close

  open:function(id){ debug('seting.open: '+id);
  var z=document.getElementById(id);
  z.className = z.className.replace('hide', 'show');
  }, // end open

  info:function(msg){ debug('seting.info');
  var z=document.getElementById('bawah');
  z.innerHTML=msg;
  z.className = z.className.replace('hide', 'show');
  setTimeout(function(){ z.className = z.className.replace('show', 'hide'); }, 3000);
  },

  getURL:function(x){ debug('seting.getURL');
  var url = new URL(window.location.href);
  return url.searchParams.get(x);
  },

  setURL:function(x){ debug('seting.setURL');
  window.open('?m='+x,'_self');
  debug(x);
  },

  getSplit:function(m,i){ debug('seting.getsplit');
  var mystr = this.getURL(m);
  var myarr = mystr.split("/");
  var myvar = myarr[i];
  debug(myvar);
  return myvar;
  },

  menu:{
  data:[{ id:'1',induk:'0', nama:'Login',url:'master/login/view'}],
  callback:'',
  view:function(id){ debug('menu.view');
  // menu=JSON.parse(this.data);
  menu=this.data;
  // debug(menu);
  out=recurseMenu(0);
  document.getElementById('kiri').innerHTML=out;
  function recurseMenu(parent) {
  out = '<a onclick="conf.close(\'kiri\')" href="#" class="btn-close ico-close"></a><li class="smli pColor">';
  for (var x in menu) {node=menu[x];
  // conf.sc(node.url);
  if (node.induk == parent) {
  // out += '<input type="checkbox"  id="' + node.nama + '" > <label class="btn-h" for="'+ node.nama + '" onClick="conf.sc(\''+node.url+'\')" >' + conf.lang.view(node.nama) + '</label>';
  // out += '<input class="pColor" type="checkbox"  id="' + node.nama + '" > <label class="btn-h pColor pLightColor" for="'+ node.nama + '" onClick="conf.sc(\''+node.url+'\')" >' + conf.lang.view(node.nama) + '</label>';
  out += '<input class="pColor" type="checkbox"  id="' + node.nama + '" > <label class="btn-h" for="'+ node.nama + '" onClick="conf.sc(\''+node.url+'\')" >' + conf.lang.view(node.nama) + '</label>';
  if (node.id > 0) { out += '<ul class="sm">'+recurseMenu(node.id)+'</ul>';	}
  out += '</li>';
  }
  }
  return out ;
  }
  }, // end view

  },

  // nav end
  nav:{
  id:'content',
  data:[],
  page:1,
  sc:function(arr){ debug('nav.sc');
  this.data.push(arr);
  this.page=this.data.length-1;
  this.view(arr);
  },


  view:function(arr){ debug('nav.view');
  conf.sc(arr);
  datas=this.data;
  datal=datas.length-1;
  pages=this.page;
  debug(datas);
  var b = document.getElementById('back');
  var f = document.getElementById('forward');

  b.onclick = function(){
  conf.page--;
  conf.view(datas[conf.page]);
  }

  f.onclick = function(){
  conf.page++;
  conf.view(datas[conf.page]);
  }
  debug(pages)
  if (pages == 0) { b.style.visibility = "hidden"; } else { b.style.visibility = "visible"; }
  if (pages == datal) { f.style.visibility = "hidden"; } else { f.style.visibility = "visible"; }
  }
  },
  // nav end

  modules:function(){ debug('seting.module');

  return   data=[
      {module:'pesan',model:'modules/master/pesan/model.php'},
      {module:'param',model:'modules/master/param/model.php'}
    ];
  },


  get:function(callback){  debug('conf.get');
    var http = new XMLHttpRequest();
    http.open("POST", this.host+this.model, true);

debug(this.host+this.model);
debug(this.data);

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) { callback(http.responseText);

      debug(http.responseText);

    }}
    http.responseType = "text";
    http.onprogress = function(e) { if (e.lengthComputable) { } };
    http.onloadstart = function(e) {
    // k[x].loader.view();
    };
    http.onloadend = function(e) {
    // k[x].loader.close();
    };
    http.send(JSON.stringify(this.data));

  },




};



var k={};
var ktupad=function(x){
k[x]={
// ajax
ajax:{
  host:'http://localhost/data/',
  model:'model.php',
  limit:100,
  offset:0,
  id:'table',
  data:{token:'1258',mod:'table',cond:''},
  callback:'',

view:function(){  debug('ajax.view');
  this.table();
},

get:function(callback){  debug('ajax.get');
  var http = new XMLHttpRequest();

  this.model=conf.model;
  this.host=conf.host;

  debug(this.host);
  this.data.token=conf.token;

  this.data.path=this.path;
  this.data.limit=this.limit;
  this.data.offset=this.offset;
  this.data.sortir=k[x].app.sortir;

  debug(this.data.path);

  // http.open("POST", this.url.host+this.url.path, true);
  http.open("POST", this.host+this.model, true);


  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function() {
  if(http.readyState == 4 && http.status == 200) { callback(http.responseText);

    debug(http.responseText);

  }}
  http.responseType = "text";
  http.onprogress = function(e) { if (e.lengthComputable) { } };
  http.onloadstart = function(e) {
  k[x].loader.view();
  };
  http.onloadend = function(e) {
  k[x].loader.close();
  };
  http.send(JSON.stringify(this.data));
},

create:function(data){  debug('ajax.create');
  k[x].ajax.data.mod='create';
  k[x].ajax.data.data=data;
  k[x].ajax.get(callback);
  function callback(json){
    debug(json);

  res=JSON.parse(json);
  conf.info(res.info);
  debug(res);
  }
},

read:function(){  debug('ajax.read');
  k[x].ajax.data.mod='read';
  k[x].ajax.data.id=1;
  k[x].ajax.get(callback);

  function callback(json){
  res=JSON.parse(json);
  conf.info(res.info);
  debug(res);
  k[x].table.read(0);

  }


  // function callback(res){
  // k[x].table.read(0);
  // }
}, // end read

update:function(id,data){  debug('ajax.update');
  k[x].ajax.data.mod='update';
  k[x].ajax.data.id=id;
  // k[x].ajax.data.data=JSON.stringify(data);
  k[x].ajax.data.data=data;

   debug(data);
  // debug(JSON.stringify(data));

  k[x].ajax.get(callback);
  function callback(json){
    debug(json);

  res=JSON.parse(json);
  conf.info(res.info);
  debug(res);
  }
}, // end update

delete:function(id){  debug('ajax.delete');
  k[x].ajax.data.mod='delete';
  k[x].ajax.data.id=id;
  k[x].ajax.get(callback);
  function callback(json){
    debug(json);

  res=JSON.parse(json);
  conf.info(res.info);
  debug(res);
  }
}, // end deletes

table:function(){  debug('ajax.table');
k[x].ajax.data.mod='table';
k[x].ajax.get(callback);
function callback(json){
// try {
debug(json);
res=JSON.parse(json);
conf.info(res.info);
conf.akses=res.akses;
debug(conf.akses);
k[x].form.fld=res.fld;
 k[x].app.fld=res.fld;
 k[x].app.data=res.data;
 k[x].table.fld=res.fld;
 k[x].table.data=res.data;
 k[x].table.view();

// }
// catch(err) {
//   // debug(json);
//   debug(err.message)
//   conf.info(err.message);
//   // conf.sc('master/login/view');
// }

}
},  // end table

more:function(){  debug('ajax.more');
k[x].app.offset=k[x].app.offset+k[x].app.limit;
k[x].ajax.get(callback);
  function callback(json){
try {
// debug(json);
res=JSON.parse(json);

if(res.mod=='notify'){ conf.info(res.data);  }
else {

data=k[x].app.data;
for(var i in res.data) { data.push(res.data[i]); }

 k[x].table.data=data;
 k[x].table.view();

}
}
catch(err) { debug(err.message); conf.info(err.message); }

}
},  // end table



getData:function(id){  debug('ajax.getdata');
debug(x);
k[x].ajax.obj.token=conf.token;
k[x].ajax.obj.mod=this.data.mod;
k[x].ajax.obj.id=1;
k[x].ajax.get(callback);
function callback(json){
res=JSON.parse(json);
k[x].data=res.data;
debug(json);
}
},




},
// ajax end


// crud
crud:{
data:[{id:1,nama:"satu" },{id:2,nama:"dua" },{id:3,nama:"tiga"},{id:4,nama:"empat"}],
callback:'',
create:function(){ debug('crud.create');
data=k[x].table.data;
frm=k[x].form.el('Form');
data.push(frm);
if(conf.isDb==1){ k[x].ajax.create(frm); }
k[x].table.data=data;
k[x].table.view();
conf.close('modal');

},

read:function(i){  debug('crud.read');

out='<div id="form"></div>';
k[x].modal.data=out;
k[x].modal.view();
debug(i);

k[x].button.item=i;

k[x].form.fld=k[x].table.fld;
k[x].form.data=k[x].table.data[i];
k[x].form.view();
// conf.close('modal');

},

update:function(i){ debug('crud.update');
data=k[x].table.data;
frm=k[x].form.el('Form');
id=k[x].table.data[i].id;
debug(id);
debug(frm);
if(conf.isDb==1){ k[x].ajax.update(id,frm); }
data.splice(i, 1, frm);
k[x].table.view();
conf.close('modal');

},

delete:function(i){ debug('crud.delete');
data=k[x].table.data;
var nid=data[i].id;
debug(nid);
if(conf.isDb==1){ k[x].ajax.delete(nid); }
data.splice(i,1);
k[x].table.view();
conf.close('modal');
},

deletes:function(i){ debug('crud.deletes');
data=k[x].table.data;

var c=document.getElementsByName('chk'+x);
var data1=[];
for (var i=0;i<c.length;i++) c[i].checked? data1[data1.length]=c[i].value:null;

var nid=[];
for (var i = data1.length -1; i >= 0; i--) {
nid[i]=data[data1[i]].id;
debug(nid[i]);
debug(i);
data.splice(data1[i],1);
}

ids=nid.join(",");

debug(ids)
if(conf.isDb==1){ k[x].ajax.delete(ids); }

k[x].table.data=data;
k[x].table.view();
},

table:function(){ debug('crud.table');

if(conf.isDb==1){ k[x].ajax.table(); }

else {
k[x].table.fld=k[x].app.fld;
k[x].table.data=k[x].app.data;
k[x].table.view();
}

},

add:function(){ debug('crud.add');

out='<div id="form"></div>';
k[x].modal.data=out;
k[x].modal.view();

k[x].form.fld=k[x].app.fld;
k[x].form.data=[];
k[x].form.view();

k[x].button.mode='add';
k[x].button.view();

},
},
// crud end


// scan
scan:{
  id:'scanform',
  mode:'desktop',
  cam:0,

  view:function(data){
    var mode=conf.scanmode;
    this[mode](data);
  },

  desktop:function(callback){

    out='<div id="form"><input type="text" id="idscan"></div>';
    conf.modal.id=this.id;
    conf.modal.data=out;
    conf.modal.view();

    var input = document.getElementById("idscan");
    input.focus();
    var kode = input.value;

    input.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        // k[x2].app.cart(this.value);
        callback(this.value);
  // debug(this.value);
  this.value='';

      }
    });
  },

  mobile:function(callback){
  out='<div id="form"><canvas id="canvas" hidden style="width: 100%; height: auto;"></canvas></div>';
  // out+='<div id="form"><video id="preview" style="width: 100%; height: auto;"></video></div>';
  // out+='<div id="form"><video id="preview" style="width: 100%; height: auto;"></video></div>';
  k[x].modal.data=out;
  k[x].modal.view();

  var sound = new Audio("addon/qrscan/barcode.wav");

  var video = document.createElement("video");
  // var res = document.getElementById("res");
  var canvasElement = document.getElementById("canvas");
  var canvas = canvasElement.getContext("2d");
  // var loadingMessage = document.getElementById("loadingMessage");
  // var outputContainer = document.getElementById("output");
  // var outputMessage = document.getElementById("outputMessage");
  // var outputData = document.getElementById("outputData");

  function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
  }

  // Use facingMode: environment to attemt to get the front camera on phones
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
  requestAnimationFrame(tick);
  });

  function tick() {
    // loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // loadingMessage.hidden = true;
      canvasElement.hidden = false;
      // outputContainer.hidden = false;

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        callback(code.data);

        drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
        // outputMessage.hidden = true;
        // outputData.parentElement.hidden = false;
        // outputData.innerText = code.data;
        sound.play();
        // res.innerHTML=code.data;
        debug(code.data);
        conf.info(code.data);
        // setTimeout(startMe, 10000);


    vidOff();


      } else {
        // outputMessage.hidden = false;
        // outputData.parentElement.hidden = true;
      }

    }
    requestAnimationFrame(tick);

    function vidOff() {
			    	video.pause();
			    	video.src = "";
			    	video.srcObject.getVideoTracks().forEach(track => track.stop());
			        debug("camera off");
			    }


  }


},

stop:function() {
  //clearInterval(theDrawLoop);
  //ExtensionData.vidStatus = 'off';
  video.pause();
  video.src = "";
  localstream.stop();

  debug("Vid off");
}


},
// scan end

// search
search:{
id:'search',
data:[{id:1,nama:"satu" },{id:2,nama:"dua" },{id:3,nama:"tiga"},{id:4,nama:"empat"}],
callback:function(){},
view:function() { debug('search.view');
id=this.id;
out  = '<div class="search row pColor">';
out += '<ul>';
out += '<li class="pTextColor" style="padding: 14px 16px;">'+ conf.lang.view(x) + '</li>';
out += '<li tabindex="0" class="onclick-menu" style="float:right" >';
out += '<i class="ico-tridot dropbtn"></i>';
out += '<div class="onclick-menu-content" id="'+x+'-tool">';
out += '</div>';
out += '</li>';
out += '<li style="float:right" ><input type="text" placeholder="Search..." id="'+x+'-SearchTxt" /></li>';
out += '</ul>';
out += '</div>';
document.getElementById(id).innerHTML=out;

var z= document.getElementById(x+"-SearchTxt");
z.onkeyup = function() {
var y=z.value;
// a=k[x].table.data;
a=this.data;
k[x].search.dosearch(a, y);
//debug(y);
};
}, // end view

dosearch:function (a, id) { debug('search.dosearch');
a=k[x].search.data;
var data = this.filterValuePart(a, id);
debug(data);
this.callback(data);

},

filterValuePart:function(data, key) { debug('search.filterValuePart');
return data.filter(function (item) {
return Object.values(item).map(function (value) {
return String(value).toLowerCase();
}).find(function (value) { var r=key.toLowerCase();
return value.includes(r);
});
});
},

},
// search end

// loader
loader:{
id:'loader',
callback:'',
open:function(){ debug('loader.open');
this.view();
},
close:function(){ debug('loader.close');
conf.close('depan')
},
view:function(){  debug('loader.view');
out  ='<div id="loader" class="loader">';
out +='<div class="sk-cube-grid">';
out +='<div class="sk-cube sk-cube1"></div>';
out +='<div class="sk-cube sk-cube2"></div>';
out +='<div class="sk-cube sk-cube3"></div>';
out +='<div class="sk-cube sk-cube4"></div>';
out +='<div class="sk-cube sk-cube5"></div>';
out +='<div class="sk-cube sk-cube6"></div>';
out +='<div class="sk-cube sk-cube7"></div>';
out +='<div class="sk-cube sk-cube8"></div>';
out +='</div>';
out +='</div>';
z=document.getElementById('depan');
z.innerHTML=out;
z.className = z.className.replace('hide', 'show');
},
},
// loader end

// notify
notify:{
id:'notify',
data:'Hello',
callback:'',
view:function(){ debug('notify.view');
var z=document.getElementById(this.id);
z.innerHTML=this.data;
z.className = z.className.replace('hide', 'show');
setTimeout(function(){ z.className = z.className.replace('show', 'hide'); }, 3000);
}, // end view
},
// notify end

// tabs
tabs:{
id:'tabs',
data:[{id:1,nama:"satu",isi:"satu" },{id:2,nama:"dua",isi:"dua" }],
callback:'',
view:function(){
data=this.data;
out ='<div class="tabs">';
for (key in data) { col=data[key]; ids=col['id']; nama=col['nama']; isi=col['isi'];
out +='<input type="radio" name="tabs" id="'+ids+'" checked="checked">';
out +='<label for="'+ids+'">'+nama+'</label>';
out +='<div class="tab">'+isi+'</div>';
}
out +='</div>';
document.getElementById(this.id).innerHTML=out;
},
},
// tabs end

// button
button:{
id:'button',
item:1,
mode:'edit',
callback:function(){},

view:function(){  debug('button.view');

btn=[];
akses=conf.akses;
if(akses.includes('t')){ btn.splice(0, 0, {nama:"Insert",url:"tambah()" });}
if (this.mode=='edit'){
if(akses.includes('e')){
  btn.splice(1, 0, {nama:"Update",url:"ubah()" });
  btn.splice(2, 0, {nama:"Delete",url:"hapus()"});
}}

data=this.data;
debug(data);

id=this.id;

i=this.item;
tambah=function(){k[x].crud.create(i)};
ubah=function(){k[x].crud.update(i);};
hapus=function(){k[x].crud.delete(i);};
// lihat=function(){debug(i)};
out ='';
for (key in btn) {node=btn[key];
// out += '<div class="l-3 s-12">';
// out += '<button onclick="'+this.data[key].url+'">'+btn[key].nama+'</button>';
out += '<button id="b-'+x+node.nama+'" class="btn-form" onclick="'+node.url+'">' + conf.lang.view(node.nama) + '</button>';
// out += '</div>';
}
document.getElementById(id).innerHTML=out;
this.callback(i);

}, // end view

form:function(id){ debug('button.form');
  this.view();
},

add:function(id){ debug('button.add');
btn=[];
akses=conf.akses;
if(akses.includes('t')){ btn.splice(0, 0, {nama:"add",url:"add()" });}

out ='';
debug(btn);
for (key in btn) {node=btn[key];
    debug(node);
    out +='<div class="btn-float"><i class="ico-plus" onclick="'+node.url+'" title="'+x+node.url+'"></i></div>';
  }
  document.getElementById(x+'-float').innerHTML=out;

}, // end tools


tool:function(){ debug('button.tool');

btn=[
{nama:"print",url:"print()"},
{nama:"filter",url:"filter()" },
{nama:"ekspor",url:"ekspor()" },
{nama:"impor",url:"impor()"},
];

akses=conf.akses;
res=akses.includes('t');
if(akses.includes('t')){ btn.splice(0, 0, {nama:"add",url:"add()" });}
if(akses.includes('e')){ btn.splice(1, 0, {nama:"hapus",url:"hapus()" });}

   debug(btn);
  add=function(){k[x].crud.add(); debug('bener dah')};
  hapus=function(){k[x].crud.deletes()};
  cetak=function(){k[x].cetak.view()};
  filter=function(){k[x].filter.view()};
  ekspor=function(){k[x].export.view()};
  // impor=function(){k[x].import.view()};
  impor=function(){k[x].upload.import()};
  out='';
  for (key in btn) {node=btn[key];
  out += '<a onclick="'+node.url+'" href="#" >' + conf.lang.view(node.nama) + '</a>';
  }
  document.getElementById(x+'-tool').innerHTML = out;
}, // end tools


},
// button


// pagination
pagination:{
id:'content',
data:[{id:1,nama:"a" },{id:2,nama:"b" },{id:3,nama:"c"}],
page:1,
rpp:1,
callback:function(){},
view:function(){ debug('pagination.view');
// rpp=k[x].table.rpp;
// k[x].table.page=page;
// mode2=k[x].table.mode2;
// k[x].table[mode2]();
id=this.id;
data=this.data;
rpp=this.rpp;
page=this.page;

var np= Math.ceil(data.length / rpp);
out  ='<button id="'+x+'-m" class="btn-form hide">More.</button>';
out +='<button id="'+x+'-p" class="btn-form">Prev</button>';
out +='<button id="'+x+'-n" class="btn-form">Next</button>';
out +='Page:<span id="'+x+'-s" ></span>';
document.getElementById(id).innerHTML=out;
// debug(page);
m=document.getElementById(x+'-m');
p=document.getElementById(x+'-p');
n=document.getElementById(x+'-n');
s=document.getElementById(x+'-s');

m.onclick = function(){
debug('more...');
k[x].ajax.more();

}
p.onclick = function(){
page--;
k[x].pagination.page=page;
k[x].pagination.view();
k[x].pagination.callback(page);
}
n.onclick = function(){
page++;
k[x].pagination.page=page;
k[x].pagination.view();
k[x].pagination.callback(page);
}
s.innerHTML = page + "/" + np + " | Record(s):" + data.length;
if (page < 1) page = 1;
if (page > np) page = np;
if (page == 1) { p.style.display = "none"; } else { p.style.display = "inline"; }
if (page == np) { n.style.display = "none"; } else { n.style.display = "inline"; }
if (data.length == 0) { p.style.display = "none"; n.style.display = "none";  }
},// end view
},
// pagination end

// modal
modal:{
id:'modal',
data:'Hi',
callback:'',
view:function () { debug('modal.view');
id=this.id;
data=this.data;
out ='<div class="modal row">';
// out +='<a onclick="k.'+x+'.modal.close()" href="#" class="btn-close ico-close"></a>';
out +='<a onclick="conf.close(\'modal\')" href="#" class="btn-close ico-close"></a>';
out +='<p>';
out +=data;
out +='</p>';
out +='<div id="ext"></div>';
out +='</div>';
//	return out;
debug(id);
var z=document.getElementById(id);
z.className = z.className.replace('hide', 'show');
z.innerHTML=out;
}, // end view

},
// modal end

// form
form:{
targetId:'',
hide:['id','uid'],
id:'form',
data:{id:1,name:'a'},
fld:['id','name'],
callback:function(){},

view:function() { debug('form.view');
id=this.id;
data=this.data;
fld=this.fld;

debug(data);

out  = '<div id="cube"></div>';
out  += '<form id="Form">';
for (i in fld) {key=fld[i]; dan=k[x].table.hidden(key);
out += '<div class="row '+dan+'">';
out += '<div id="f-'+key+'" style="margin:5px">';
out += '<div id="la-'+key+'" class="l-4 s-12">';
out += '<label>'+conf.lang.view(key) + '</label>';
out += '</div>';
out += '<div class="l-8 s-12">';
out += '<div id="el-'+key+'"><input type="text" id="'+key+'" name="'+key+'" value=""></div>';
out += '</div></div>';
out += '</div>';
}
out += '</form>';
out += '<div id="'+x+'-Button" class="row"></div>';
out += '<div id="'+x+'-Btn" class="row"></div>';
document.getElementById(id).innerHTML=out;

if(data!=[]){
for (i in data) {
document.getElementById(i).value=data[i];
debug(data[i]);
debug(i);
}
}


this.callback(data);

k[x].button.id=x+'-Button';
k[x].button.view();

},



datepicker:function(id){ debug('form.datepicker');
el=document.getElementById('el-'+id);
val=document.getElementById(id).value;

out='<div id="tools" class="tool"> ';
out+='<input type=text name="'+id+'" id="'+id+'" value="'+val+'">';

out+='<div id="diva" class="subtool" >';
out+='<input type=text name="d-'+id+'" id="d-'+id+'"  list="ld-'+id+'">';
out+='<datalist id="ld-'+id+'">';
for(i = 01; i < 31; i++){ out+='<option value='+i+' />';}
out+='</datalist>';

out+='<input type=text name="m-'+id+'" id="m-'+id+'"   list="lm-'+id+'">';
out+='<datalist id="lm-'+id+'">';
for(i = 01; i < 12; i++){ out+='<option value='+i+' />';}
out+='</datalist>';

out+='<input type=text name="y-'+id+'" id="y-'+id+'"   list="ly-'+id+'">';
out+='<datalist id="ly-'+id+'">';
for(i = 1945; i < 2019; i++){ out+='<option value='+i+' />';}
out+='</datalist>';
out+='<input type=button name="btn-'+id+'" id="btn-'+id+'" value="Ok">';
out+='</div>';

out+='</div>';
el.innerHTML=out;

document.getElementById('btn-'+id).addEventListener("click", function(){
debug('dddd');
d=document.getElementById('d-'+id).value;
m=document.getElementById('m-'+id).value;
y=document.getElementById('y-'+id).value;
dmy=y+'-'+m+'-'+d;
document.getElementById(id).value=dmy;
debug(dmy);

} );

},

datalist:function(id,data){ debug('form.datalist');
el=document.getElementById('el-'+id);
val=document.getElementById(id).value;
out='<input type="text" name="'+id+'" id="'+id+'" value="'+val+'" list="l-'+id+'">';
out+='<datalist id=l-'+id+'>';
for(i in data){ out+='<option value='+data[i]+' />';}
out+='</datalist>';
el.innerHTML=out;
},


dropdown2:function(id,data){ debug('form.dropdown');
el=document.getElementById('el-'+id);
out = '<select name="ope[]" id='+id+' >';
for(i in data){ out+='<option value='+data[i]+' /> '+data[i]+' </option>';}
out += '</select>';
el.innerHTML=out;

},

dropdown:function(id,data){ debug('form.dropdown');
el=document.getElementById('el-'+id);
val=document.getElementById(id).value;

out = '<select name="'+id+'" >';
for(i in data){ out+='<option value='+data[i]+' /> '+data[i]+' </option>';}
out += '</select>';

// out='<input type="text" name="'+id+'" id="'+id+'" value="'+val+'" list="l-'+id+'">';
// out+='<datalist id=l-'+id+'>';
// for(i in data){ out+='<option value='+data[i]+' />';}
// out+='</datalist>';
el.innerHTML=out;
},

textarea:function(id){ debug('form.textarea');
el=document.getElementById('el-'+id);
val=document.getElementById(id).value;
out='<textarea name='+id+' id='+id+' >'+val+'</textarea>';
el.innerHTML=out;
},

el:function (id) { debug('form.el');
frm = document.getElementById(id);
obj={};

for ( var i = 0; i < frm.elements.length; i++ ) { e = frm.elements[i];
obj[e['name']] = e['value'];
}
debug(obj);
return obj;
}, // end el


},
// form end

// table
table:{
// hide:['id','uid'],
hide:[],
print:'../view/prints/cetak.html',
target:'txt',
mode:'tabledata',  // gallery,header,table,tabledata
mode2:'table',// table,gallery
id:'content',
fld:['id','name'],
data:[{id:1,name:'a'},{id:2,name:'b'},{id:3,name:'c'}],
page:1,
rpp:30,
callback:function(){},
addClick:function(){},


view:function () { debug('table.view');
// conf.close('kiri');
mode=this.mode;
this[mode]();
},


gallery:function (data,id) { debug('table.gallery');
data=this.data;
id=this.id;
var al=data.length;
var	col=data[0];
out = '';
out +='<div class="galrow">';
for (var i = (this.page-1) * this.rpp; i < (this.page * this.rpp) && i < al; i++) {cols=data[i];
out +='<div class="galcolumn" onClick=k.'+x+'.table.read('+i+'); >';
out +='<img src="images/citra/'+data[i].citra+'" style="width:100%">';
out +='<div class="desc">'+data[i].kode+'</div>';
out +='<div class="desc">'+data[i].harga+'</div>';
out +='<div class="desc">'+data[i].nama+'</div></div>';
}

out +='</div>';

var z=document.getElementById(id)
z.innerHTML=out;
},

sortir:function (arr,id) { debug('table.sortir');
asc=true;
var sortByProperty = function (property) {
return function (x, y) {
if (asc){
return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
}
else{
return ((y[property] === x[property]) ? 0 : ((y[property] > x[property]) ? 1 : -1));
}
};
};
arr.sort(sortByProperty(id));
debug(arr.asc)
this.view()
},

hidden:function(id) { debug('table.hide');
arr=k[x].table.hide;
if(arr.includes(id)) { return 'hide';}
},

header:function() { debug('table.header');
  this.table();
},

read:function(i) { debug('table.read');
  k[x].button.mode='edit';
  k[x].crud.read(i);
},



table:function() { debug('table.table');
id=this.id;
fld=this.fld;
data=this.data;
debug(data);

if(this.mode=='header') { isheader='hide';} else { isheader='';}

var al=data.length;
var	col=fld;
out  = '<div class="table"><table id="table">';
out += '<thead><tr>';
outf  = '<tfoot><tr><td class="'+isheader+'"  ></td>';
out +='<th class="pColor '+isheader+'" ><input type="checkbox" name="chs" onclick=k.'+x+'.table.CheckAll(this,\'chk'+x+'\')></th>';
for (i in col){ key=col[i]; dan=this.hidden(key);
outf += '<td id="f'+ key +'" class="'+dan +'"></td>';
out  += '<th id="fh'+ key +'" class="'+dan+' pColor pTextColor col_'+key+'" onClick=k.'+x+'.table.sortir(data,"'+key+'") > ' + conf.lang.view(key) + '</th>';
}
out += '</tr></thead>';
outf += '</tr></tfoot>';
out += '<tbody>';
for (var i = (this.page-1) * this.rpp; i < (this.page * this.rpp) && i < al; i++) {cols=data[i];
out += '<tr>';
out += '<td class="'+isheader+'"><input type="checkbox" name="chk'+x+'" value="'+i+'" onclick=k.'+x+'.table.getVal(x)>  </td>';
for (key in cols) {  dan=this.hidden(key);
var str=cols[key];
// debug(str);
items=str.id;
if(str.length>12){ str=str.substring(0, 12) + ' ...' }
out += '<td  class="'+dan+' col_'+key+'"  onClick=k.'+x+'.table.read('+i+'); > ' + str +'</td>';
}
out += '</tr>';
}

out += '</tbody>';
out += outf;
out += '</table></div>';
var z=document.getElementById(id)
z.innerHTML=out;
}, // end view

tabledata:function (id) { debug('table.tabledata');
id=this.id;
data=this.data;
out  ='<div id="'+x+'-float">dd</div>';
out +='<div id="'+x+'-search"></div>';
out +='<div id="'+x+'-table"></div>';
out +='<div id="'+x+'-pagination"></div>';
out +='<div id="'+x+'-sum"></div>';
// out +='<div id="'+x+'-modal"></div>';
out +='<div id="modal" class="depan hide"></div>';
// debug(id);
document.getElementById(id).innerHTML=out;
// k[x].button.form();

k[x].search.data=data;
k[x].search.id=x+'-search';
k[x].search.view();
k[x].search.callback=function(data){
k[x].table.page=1;
k[x].table.data=data;
mode2=k[x].table.mode2;
k[x].table[mode2]();

k[x].pagination.data=data;
k[x].pagination.view();
}

k[x].table.data=data;
k[x].table.id=x+'-table';
mode2=k[x].table.mode2;
// k[x].table.table();
k[x].table[mode2]();

k[x].pagination.rpp=k[x].table.rpp;
k[x].pagination.data=data;
k[x].pagination.id=x+'-pagination';
k[x].pagination.view();
k[x].pagination.callback=function(data){
debug(page);
k[x].table.page=page;
mode2=k[x].table.mode2;
k[x].table[mode2]();
}

k[x].button.add();
k[x].button.tool();

this.addClick();

// document.getElementById('fbanyak').innerHTML=this.sum(data,'banyak');
}, // end data

sum:function(data,col){ debug('table.sum');
var total = 0
for ( var i = 0, _len = data.length; i < _len; i++ ) {
total += parseInt(data[i][col])
}
return total
},


CheckAll:function(el,o) { debug('table.Checkall');
var c=document.getElementsByName(o);
for (var i=0;i<c.length;i++) c[i].checked = el.checked? true:false ;
}, // end CheckAll

getVal:function(x){ debug('table.getval');
var c=document.getElementsByName('chk'+x);
debug(x);

var data=[];
for (var i=0;i<c.length;i++) c[i].checked? data[data.length]=c[i].value:null;
data.join(",");
debug(data);
}, //end getval
},
// table end

// filter
filter:{
id:'filter',
data:'d',
callback:'',
view:function() { debug('filter.view');
data=k[x].table.data[0];
data1 = 'LIKE,NOT LIKE,=,!=,>=,<=,IN,NOT IN'.split(',');
out  = '<button class="btn-form" id="getAdd"/>+</button>';
out += '<form id="filterForm" method="post">';
out += '<div id="newlinktpl">';

out += '<div class="clear row">';
out += '<div class="l-2">';
out += '<select name="ope[]" >';
out += '<option value=" AND " >AND</option>';
out += '<option value=" OR " >OR</option>';
out += '</select>';
out += '</div>';
out += '<div class="l-3"><select  name="fld[]" id="fld">';
for ( i in data) { out+='<option value="'+i+' " >'+i+'</option>'; }
out += '</select></div>';
out += '<div class="l-2">';
out += '<select name="ope1[]" >';
for ( i in data1) { out+='<option value=" '+data1[i]+' " >'+data1[i]+'</option>'; }
out += '</select>';
out += '</div>';
out += '<div class="l-5"><input type="text" name="key[]" ></div>';
out += '</div>';
out += '</div>';
out += '<div id="newlink"></div>';
out += '<div class="clear">';
out += '<input type="hidden" name="order1" id="order1" value="ORDER BY">';
out += ' ORDER BY:<select  name="sortir" id="fld1">';
for ( i in data) { out+='<option value=" '+i+' " >'+i+'</option>'; }
out += '</select>';
out += '</div>';
out += '</form>';
out += '<button class="btn-form" id="getFilter">Filter</button>';
k[x].modal.data=out;
k[x].modal.view();

document.getElementById('getAdd').addEventListener("click", function(){
var div1 = document.createElement('div');
div1.innerHTML = document.getElementById('newlinktpl').innerHTML;
document.getElementById('newlink').appendChild(div1);
} );

document.getElementById('getFilter').addEventListener("click", function(){
// obj  = 'WHERE id !=0' ;
obj  = '' ;
var ope1= document.getElementsByName('ope1[]');
var ope = document.getElementsByName('ope[]');
var fld = document.getElementsByName('fld[]');
var key = document.getElementsByName('key[]');

for ( var i = 0; i < ope1.length; i++ ) {
if(ope1[i].value ==' LIKE '){
obj + '%'+key[i]+'%';}
obj += ope[i].value + fld[i].value + ope1[i].value;

if(ope1[i].value ==' LIKE '||ope1[i].value ==' NOT LIKE '){
obj += '"%'+key[i].value+'%"';}
else if(ope1[i].value ==' IN '||ope1[i].value ==' NOT IN '){
obj += '('+key[i].value+')';}
else {
obj += key[i].value;}
}

debug(obj);
// k[x].table.view();

k[x].ajax.data={mod:'table',cond:obj};
k[x].crud.table();


} );
}
},
// filter end


// export
export:{
id:'export',
callback:'',
view:function () { debug('export.view');
data=k[x].table.data;
var data, filename, link;
var csv = conv(data);
if (csv == null) return;
filename = x+'.csv';
if (!csv.match(/^data:text\/csv/i)) {
csv = 'data:text/csv;charset=utf-8,' + csv;
}
data = encodeURI(csv);
link = document.createElement('a');
link.setAttribute('href', data);
link.setAttribute('download', filename);
link.click();

function conv(objArray){
var array = typeof objArray != 'object' ? JSON.parse(objArray):objArray;
var str = '';
var line = '';
for (var index in array[0]) {
if (line != '') line += ';'
line += index;
}
str += line + '\r\n';
for (var i = 0; i < array.length; i++) {
var line = '';
for (var index in array[i]) {
if (line != '') line += ';'
line += array[i][index];
}
str += line + '\r\n';
}
return str;
}}
},
// export end

// upload
upload:{
  id:'import',
  mod:'upload',
dir:'files/',
path:'data.php',
callback:'',
data:{token:'1258',mod:'table',cond:''},

view:function(callback) { debug('form.upload');

path=k[x].ajax.path;
mod=this.mod;
dir=this.dir;
out  = '<input type="file" name="afile" id="afile" accept="image/*">';
out += '<button id="upload" class="btn-form" name=upload >Uploads</button>';
document.getElementById(this.id).innerHTML=out;
document.querySelector('#upload').addEventListener('click', function(e) {
var file = document.getElementById('afile').files[0];
var fd = new FormData();
fd.append("afile", file);
// These extra params aren't necessary but show that you can include other data.
// fd.append("tb", x );
fd.append("isImport", 1);
fd.append("dir", dir);
fd.append("path", path);
fd.append("nama", "sismadi");
fd.append("akses", 1);
fd.append("mod", mod);
var xhr = new XMLHttpRequest();
// conf.model='app2.php';
xhr.open("POST", conf.url.host+conf.model, true);
debug(conf.path);
debug(conf.model);
debug(conf.url.host);

xhr.upload.onprogress = function(e) {
if (e.lengthComputable) {
var percentComplete = (e.loaded / e.total) * 100;
debug(percentComplete + '% uploaded');
}
};
xhr.onload = function() {
if (this.status == 200) {
callback(xhr.response);
debug(xhr.response);
debug('selesai 100');
};

};

xhr.send(fd);
}, false);


},
import:function(callback) { debug('form.import');
out  = '<div id="uploadForm">Updload</div>';
k[x].modal.data=out;
k[x].modal.view();
this.mod='import';
this.id='uploadForm';
this.view(callback);
function callback(json){
debug(json);
k[x].crud.table();
}
},
},
// upload end

// editor
editor:{
id:'editor',
data:[{id:1,url:"i",name:"i"},
{id:2,url:"b",name:"b"},
{id:3,url:"p",name:"p"},
{id:4,url:"div",name:"div"},
{id:5,url:"input",name:"input"},
{id:5,url:"img",name:"Image"},
{id:5,url:"a",name:"link"},],
callback:'',
view:function() { debug('editor.view');
arr=this.data;
id=this.id;

out = '<div class="bar"><ul>';
for (key in arr) { out+='<li><a href="#" onclick=k.'+x+'.editor.setel("'+arr[key].url+'"); >'+arr[key].name+'</a></li>';
// out += '<button onclick=k.'+x+'.editor.setel("'+arr[key].url+'"); >'+arr[key].name+'</button>';  }
}
out += '</ul></div><br>';
out += '<textarea id="dev"> </textarea>';
document.getElementById(id).innerHTML=out;
},

setel:function(opt) { debug('editor.setel');
debug(opt);
debug(opt);
var a=['a']
var s=['input']
var img=['img']
var c=['app']
var txtarea = document.getElementById("dev");
var start = txtarea.selectionStart;
var finish = txtarea.selectionEnd;
var allText = txtarea.value;

var sel = allText.substring(start, finish);

var newText=allText.substring(0, start);
nah ="<"+opt+">"+sel+"</"+opt+">";
if(s.includes(opt)){ nah ="<"+opt+" src="+ser+" >"+sel;}


if(img.includes(opt)){
out = '<input type="text" id="txt" value="">';
out += '<div class="row" id="gall"></div>';
k[x].modal.data=out;
k[x].modal.view();

k[x].gallery.id='gall';
k[x].gallery.view();
nah ="<"+opt+" src="+ser+" >"+sel;
}

if(a.includes(opt)){
out = '<input type="text" id="txt" value="">';
k[x].modal.data=out;
k[x].modal.view();
var ser = document.getElementById("txt").value;
nah ="<"+opt+" href="+ser+" >"+sel+"</"+opt+">";
}

if(c.includes(opt)){ nah =apps+sel;}

newText +=nah;
newText +=allText.substring(finish, allText.length);
txtarea.value=newText;

},
},
// editor end

// chart
chart:{
id:'content',
data:[{id:1,nama:'a',isi:'100'},{id:2,nama:'b',isi:'20'},{id:3,nama:'c',isi:'30'},],
colors:['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen'],
mode:'horizontal',
view:function(){ debug('chart.view');
this[this.mode]();
},

vertical:function(){ debug('chart.vertical');
data=this.data;
id=this.id;
colors=this.colors;

out  = '<div class="chart vertical"><table>';
out += '<tr>';
for (key in data) { col=data[key];
out += '<td><div class='+colors[key]+' style="height:'+col.isi+'%"> '+col.isi+'% </div></td>';
}
out += '</tr>';
out += '</table></div>';
document.getElementById(id).innerHTML=out;

},

horizontal:function(){ debug('chart.horizontal');
data=this.data;
id=this.id;
colors=this.colors;
out  = '<div class="chart"><table>';
for (key in data) { col=data[key];
out += '<tr>';
out += '<td><div class='+colors[key]+' style="width:'+col.isi+'%"> '+col.isi+'% : '+col.nama+'</div></td>';
out += '</tr>';
}
out += '</table></div>';
document.getElementById(id).innerHTML=out;

},
},
//chart end

// cetak
cetak:{
id:'content',
mode:'struk',
data:[{id:1,nama:"a" },{id:2,nama:"b" },{id:3,nama:"c"}],
view:function () { debug('cetak.view');
this[this.mode]();
},
table:function () { debug('cetak.table');
debug(this.data);
window.localStorage.setItem('data', JSON.stringify(this.data));
window.open(this.print);
},

struk:function () { debug('cetak.struk');
data=this.data;
a=data.a;
b=data.b;
debug(a);
debug(b);
id=this.id;
profile=conf.profile;
out  = '<div class="cetak"><table>';
out += '<tr><td class="tac">'+profile.logo+'</td><td class="tal" colspan="2">';
out += profile.nama+'<br>';
out += profile.alamat+'<br>';
out += profile.telpon+'<br>';
out +='</td></tr>';

for (key in b) { col=b[key];
out += '<tr>';
// out += '<td><div>'+col.id+'</div></td>';
out += '<td><div>'+col.banyak+'</div></td>';
out += '<td><div>'+col.nama+'</div></td>';
out += '<td class="tar"><div>'+col.harga+'</div></td>';
out += '<td class="tar"><div>'+col.jumlah+'</div></td>';
out += '</tr>';
}

a=a[0];
c=conf.data;
debug(c);
out += '<tr><td class="tar" colspan="2">Subtotal</td><td class="tar">'+a.total+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Tax 10%</td><td class="tar">'+a.total*0.1+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Total</td><td class="tar">'+a.total*1.1+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Cash</td><td class="tar">'+a.nama+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Change</td><td class="tar">'+a.nama+'</td></tr>';
out += '<tr><td class="tac" colspan="3">'+a.kode+', '+a.tanggal+' '+a.jam+'</br>'+c.uName+'</td></tr>';

out += '<a href="#" class="float" onclick="window.print(); return true;">';
out += '<div class="my-float">Print</div>';
out += '</a>';


out += '</table></div>';
// document.getElementById(id).innerHTML=out;
document.getElementById('printarea').innerHTML=out;


// window.print(); return true;

k[x].modal.data=out;
k[x].modal.view();





},

invoice:function () { debug('cetak.invoice');
data=this.data;
id=this.id;
profile=conf.profile;
out  = '<div class="cetak"><table>';
out += '<tr><td class="tac">'+profile.logo+'</td><td class="tal" colspan="2">';
out += profile.nama+'<br>';
out += profile.alamat+'<br>';
out += profile.telpon+'<br>';
out +='</td></tr>';

for (key in data) { col=data[key];
out += '<tr>';
out += '<td><div>'+col.id+'</div></td>';
out += '<td><div>'+col.id+'</div></td>';
out += '<td class="tar"><div>'+col.nama+'</div></td>';
out += '</tr>';
}

out += '<tr><td class="tar" colspan="2">Subtotal</td><td class="tar">'+col.nama+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Tax 10%</td><td class="tar">'+col.nama+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Total</td><td class="tar">'+col.nama+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Cash</td><td class="tar">'+col.nama+'</td></tr>';
out += '<tr><td class="tar" colspan="2">Change</td><td class="tar">'+col.nama+'</td></tr>';
out += '<tr><td class="tac" colspan="3">POS 0001190408, 2019-04-08 12:03 <br> Admin</td></tr>';

out += '</table></div>';
document.getElementById(id).innerHTML=out;
document.getElementById('printarea').innerHTML=out;
},

},
// cetak end




};
// end k[x]
};
// end ktupad
