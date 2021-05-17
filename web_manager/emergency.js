
    /*나중에 이거 가지고 틀만들기=복붙용*/
function check(){
      /*나중에 실시간으로 만들려면 for문name돌려야할듯*/
  var x= document.getElementById("button1");
  x.innerHTML="complete";
  x.style.width="120px";
  x.style.backgroundColor="green";
  x.style.color="white";
  x.style.cursor= "pointer";   
}

    /*나중에 이거 가지고 틀만들기=복붙용*/
    function check2(){
      /*나중에 실시간으로 만들려면 for문name돌려야할듯*/
  var x= document.getElementById("button2");
  x.innerHTML="complete";
  x.style.width="120px";
  x.style.backgroundColor="green";
  x.style.color="white";
  x.style.cursor= "pointer";   
}






var test2 = {
    "url": "http://203.253.128.161:7579/Mobius/alone/emergency/la",
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

    if(tt2 == 1){
      alert("긴급 상황이 발생했습니다. 대상 : 조하영");
      document.location.href="emergencyList.html";
    }
  })