var myTbody=document.getElementById('myTable');
var row=myTbody.insertRow(myTbody.rows.length);

var myTbody2=document.getElementById('myTable2');
var row2=myTbody2.insertRow(myTbody2.rows.length);

var test2 = {
"url": "http://203.253.128.161:7579/Mobius/alone/mlx/la",
"method": "GET",
"timeout": 0,
"headers": {
    "Accept": "application/json",
    "X-M2M-RI": "12345",
    "X-M2M-Origin": "SOrigin",
    "Content-Type": "application/vnd.onem2m-res+json; ty=4"
},
};
$.ajax(test2)
.done(function (test) {
var tt = test["m2m:cin"];
var tt2 = tt["con"];
console.log(tt2);


if(tt2[7]>=7){
  alert("비정상적인 체온이 감지되었습니다. 대상 : 조하영");
}


var name=row.insertCell(0);
var temp=row.insertCell(1);
var date=row.insertCell(2);
var time=row.insertCell(3);
var checkup=row.insertCell(4);

 name.innerHTML="조하영";
 temp.innerHTML=tt2[6]+tt2[7]+tt2[8]+tt2[9]+tt2[10];
  date.innerHTML=tt2[25]+tt2[26]+tt2[27]+tt2[28]+tt2[21]+tt2[20]+tt2[21]+tt2[22]+tt2[23];
  time.innerHTML=tt2[31]+tt2[32]+tt2[33]+tt2[34]+tt2[35]+tt2[36]+tt2[37]+tt2[38]+
                  tt2[39]+tt2[40]+tt2[41];
  checkup.innerHTML=tt2[50]+tt2[51]+tt2[52];


})

var test3 = {
"url": "http://203.253.128.161:7579/Mobius/alone/presence/la",
"method": "GET",
"timeout": 0,
"headers": {
    "Accept": "application/json",
    "X-M2M-RI": "12345",
    "X-M2M-Origin": "SOrigin",
    "Content-Type": "application/vnd.onem2m-res+json; ty=4"
},
};
$.ajax(test3)
.done(function (test) {
var tt1 = test["m2m:cin"];
var tt3 = tt1["con"];
console.log(tt3);


var house=row2.insertCell(0);
var score=row2.insertCell(1);
var answer=row2.insertCell(2);

if(tt3[0] == 0) {
  house.innerHTML +="재실중";
}
if(tt3[0] == 1) {
  house.innerHTM+="미응답";
}
if(tt3[0] == 2) {
  house.innerHTML+="이탈";
  alert("재실 이탈 : 조하영");
}
score.innerHTML = "현재 점수:" + tt3[24] + tt3[25] + tt3[26];
if(tt3[27] == 0){
  score.innerHTML +="[변동: 증가]";
}
if(tt3[27] == 1){
  score.innerHTML += "[변동: 감소]";
}
if(tt3[27] == 2){
  score.innerHTML += "[변동: 유지]";
}
answer.innerHTML= tt3[7] + tt3[8] + tt3[9]+ tt3[10] + tt3[3] + tt3[2]
+ tt3[3] + tt3[4]+ tt3[5] + "&nbsp;| "+ tt3[13]+ tt3[14] + tt3[15] + tt3[16]+ tt3[17] + tt3[18]+ tt3[19]+ tt3[21] + tt3[22];
})


var test4 = {
"url": "http://203.253.128.161:7579/Mobius/alone/mlx?fu=2&rcn=4",
"method": "GET",
"timeout": 0,
"headers": {
    "Accept": "application/json",
    "X-M2M-RI": "12345",
    "X-M2M-Origin": "SOrigin",
    "Content-Type": "application/vnd.onem2m-res+json; ty=4"
},
};
$.ajax(test4)
.done(function (test) {
var tt34 = test["m2m:rsp"];
var tt4 = tt34["m2m:cin"];
var tt24 = tt4["1"];
var tt5 = tt24["con"];
console.log(tt5);

var row=myTbody.insertRow(myTbody.rows.length);

var name=row.insertCell(0);
var temp=row.insertCell(1);
var date=row.insertCell(2);
var time=row.insertCell(3);
var checkup=row.insertCell(4);

 name.innerHTML="최영은";
 temp.innerHTML=tt5[6]+tt5[7]+tt5[8]+tt5[9]+tt5[10];
  date.innerHTML=tt5[25]+tt5[26]+tt5[27]+tt5[28]  +tt5[21]+tt5[20]+tt5[21]+tt5[22]+tt5[23];
  time.innerHTML=tt5[31]+tt5[32]+tt5[33]+tt5[34]+tt5[35]+tt5[36]+tt5[37]+tt5[38]+
                  tt5[39]+tt5[40]+tt5[41];
  checkup.innerHTML=tt5[50]+tt5[51]+tt5[52];

})



var test8 = {
"url": "http://203.253.128.161:7579/Mobius/alone/presence?fu=2&rcn=4",
"method": "GET",
"timeout": 0,
"headers": {
    "Accept": "application/json",
    "X-M2M-RI": "12345",
    "X-M2M-Origin": "SOrigin",
    "Content-Type": "application/vnd.onem2m-res+json; ty=4"
},
};
$.ajax(test8)
.done(function (test) {
var tt100 = test["m2m:rsp"];
var tt6 = tt100["m2m:cin"];
var tt110 = tt6["1"];
var tt7 = tt110["con"];
console.log(tt7);

var row2=myTbody2.insertRow(myTbody2.rows.length);
var house=row2.insertCell(0);
var score=row2.insertCell(1);
var answer=row2.insertCell(2);


if(tt7[0] == 0) {
  house.innerHTML +="재실중";
}
if(tt7[0] == 1) {
  house.innerHTML+="미응답";
}
if(tt7[0] == 2) {
  house.innerHTML +="이탈";
  // alert("재실 이탈 : 최영은");
}
score.innerHTML = "현재 점수:"+tt7[24] + tt7[25] + tt7[26];
if(tt7[27] == 0){
  score.innerHTML +="[변동: 증가]";
}
if(tt7[27] == 1){
  score.innerHTML += "[변동: 감소]";
}
if(tt7[27] == 2){
  score.innerHTML += "[변동: 유지]";
}
answer.innerHTML= tt7[7] + tt7[8] + tt7[9]+ tt7[10] + tt7[3] + tt7[2]
+ tt7[3] + tt7[4]+ tt7[5] + "&nbsp;| "+ tt7[13]+ tt7[14] + tt7[15] + tt7[16]+ tt7[17] + tt7[18]+ tt7[19]+ tt7[21] + tt7[22];
})































/*var test10 = {
"url": "http://203.253.128.161:7579/Mobius/alone/mlx/la",
"method": "GET",
"timeout": 0,
"headers": {
    "Accept": "application/json",
    "X-M2M-RI": "12345",
    "X-M2M-Origin": "SOrigin",
    "Content-Type": "application/vnd.onem2m-res+json; ty=4"
},
};
$.ajax(test10)
.done(function (test) {
var tt = test["m2m:cin"];
var tt2 = tt["con"];
console.log(tt2);


if(tt2[7]>5){
  alert("비정상적인 체온이 감지되었습니다. 대상 : 조하영");
}

var row=myTbody.insertRow(myTbody.rows.length);
var name=row.insertCell(0);
var temp=row.insertCell(1);
var date=row.insertCell(2);
var time=row.insertCell(3);
var checkup=row.insertCell(4);

 name.innerHTML="조oo";
 temp.innerHTML=tt2[6]+tt2[7]+tt2[8]+tt2[9]+tt2[10];
  date.innerHTML=tt2[25]+tt2[26]+tt2[27]+tt2[28]  +tt2[19]+tt2[20]+tt2[21]+tt2[22]+tt2[23];
  time.innerHTML=tt2[31]+tt2[32]+tt2[33]+tt2[34]+tt2[35]+tt2[36]+tt2[37]+tt2[38]+
                  tt2[39]+tt2[40]+tt2[41];
  checkup.innerHTML=tt2[51]+tt2[52]+tt2[53];


})

var test11 = {
"url": "http://203.253.128.161:7579/Mobius/alone/alone/la",
"method": "GET",
"timeout": 0,
"headers": {
    "Accept": "application/json",
    "X-M2M-RI": "12345",
    "X-M2M-Origin": "SOrigin",
    "Content-Type": "application/vnd.onem2m-res+json; ty=4"
},
};
$.ajax(test11)
.done(function (test) {
var tt1 = test["m2m:cin"];
var tt3 = tt1["con"];
console.log(tt3);

var row2=myTbody2.insertRow(myTbody2.rows.length);
var house=row2.insertCell(0);
var score=row2.insertCell(1);
var answer=row2.insertCell(2);

if(tt3[0] == 0) {
  house.innerHTML ="재실중";
}
if(tt3[0] == 1) {
  house.innerHTM="미응답";
}
if(tt3[0] == 2) {
  house.innerHTM="이탈";
  alert("재실 이탈 : 조하영");
}
score.innerHTML = "현재 점수:" + tt3[24] + tt3[25];
if(tt3[27] == 0){
  score.innerHTML +="[점수 변동: 증가]";
}
if(tt3[27] == 1){
  score.innerHTML += "[점수 변동: 감소]";
}
if(tt3[27] == 2){
  score.innerHTML += "[점수 변동: 유지]";
}
answer.innerHTML=tt3[7] + tt3[8] + tt3[9]+ tt3[10] + tt3[3] + tt3[2]
+ tt3[3] + tt3[4]+ tt3[5] + "&nbsp;| "+ tt3[13]+ tt3[14] + tt3[15] + tt3[16]+ tt3[17] + tt3[18]+ tt3[19]+ tt3[21] + tt3[22];
})



*/