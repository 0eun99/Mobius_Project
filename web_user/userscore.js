{ 
  var myTest = new Array(
          '조금만 힘내세요.</br>따듯한 봄은</br>반드시 찾아올 거랍니다', 
          '함께 이겨낸 역사, 함께 이겨낼 오늘</br>모두를 응원합니다.', 
          '어려울 때일수록 하나되는 마음.</br>또 한 번</br> 보여줄 때가 된 것 같습니다.', 
          '모두의 노력으로</br> 반드시 극복할 수 있습니다', 
          '모두의 노력으로 반드시</br>극복할 수 있습니다.', 
          '답답하고 우울한 시기지만</br> 조금만 더 힘 내 봅시다');


document.getElementById("p2").innerHTML=randomItem(myTest);

/*document.write(randomItem(myTest), '<br />');*/


function randomItem(a) {

return a[Math.floor(Math.random() * a.length)];
}
}


var gette3 = {
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
  $.ajax(gette3)
  .done(function (get1) {
    var ruru = get1["m2m:cin"];
    var lala = ruru["con"];
    console.log(get1);
  
    document.getElementById('result').innerHTML += lala[25] + lala[26];
    })


var test8 = {
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
  $.ajax(test8)
  .done(function (test1) {
    var tt6 = test1["m2m:cin"];
    var tt7 = tt6["con"];
    console.log(tt7);
  
    document.getElementById("checkcheck").innerHTML += tt7[50]+ tt7[51] + tt7[52];
  })




  var test3 = {
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
  $.ajax(test3)
  .done(function (test) {
    console.log(test);
    var tt1 = test["m2m:rsp"];
    var tt2 = tt1["m2m:cin"];
    var tt3 = tt2["0"];
    var tt4 = tt3["con"];

    // 
    var tt5 = tt2["1"];
    var tt6 = tt5["con"];

    var tt7 = tt2["2"];
    var tt8 = tt7["con"];
  
    var tt9 = tt2["3"];
    var tt10 = tt9["con"];

    console.log(tt4);
    console.log(tt6);
    console.log(tt8);
    console.log(tt10);

    document.getElementById('re3_2').innerHTML += tt4[5]+ tt4[6] + tt4[7]+ tt4[8] + tt4[9];
    document.getElementById('re3_1').innerHTML += tt6[5]+ tt6[6] + tt6[7]+ tt6[8] + tt6[9];
    document.getElementById('re4_2').innerHTML += tt8[5]+ tt8[6] + tt8[7]+ tt8[8] + tt8[9];
    document.getElementById('re4_1').innerHTML += tt10[5]+ tt10[6] + tt10[7]+ tt10[8] + tt10[9];
    })

