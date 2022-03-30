const userIdCar = localStorage.getItem("userId");
const carArray = localStorage.getItem("carArray");
const selectedCar = document.getElementById("selectedCar");
let selectedCarId=0;
let start=0;
let end=0;

showCarElements();
function showCarElements() {
    console.log("id : "+userIdCar);
    console.log(" dizi  : " +carArray);
    for(let i=0;i<carArray.length;i++){
        if(carArray[i]!=','){
            var option = document.createElement("option");
            option.value = carArray[i];
            option.text = carArray[i];
            selectedCar.appendChild(option);
        }
    }
}

const myInterval = setInterval(()=>{
    initMap();
},20000)




function selectCar(e) {
    e.preventDefault()
    clearInterval(myInterval);
    //const deneme = parseInt(selectedCar.value);
    //localStorage.setItem("deneme",deneme);
    selectedCarId = parseInt(selectedCar.value);
    initMap([]);
    //console.log(deneme.split(",")[0]);
    //console.log(deneme.split(",")[1]);
}


function initMap() {
    var options = {
        zoom: 5,
        center: { lat: 59.371848333533954, lng: 17.934110566442758 }
    };
    
    var map = new google.maps.Map(document.getElementById('map'), options);

    /*fetch('http://localhost:8080/api/searchCar/1')
        .then(response => response.json())
        .then(data => convertDataDetails(data))
        .then(data => addToMap(data));*/

        if(selectedCarId==0){
            
            for(let i=0;i<carArray.length;i++){
                if(carArray[i]==1){
                    fetch('http://localhost:8080/api/searchCarForId/1')
                    .then(response => response.json())
                    .then(data => convertDataDetails(data))
                    .then(data => addToMap(data,1));
                }
                if(carArray[i]==2){
                    fetch('http://localhost:8080/api/searchCarForId/2')
                    .then(response => response.json())
                    .then(data => convertDataDetails(data))
                    .then(data => addToMap(data,2));
                }
                if(carArray[i]==3){
                    fetch('http://localhost:8080/api/searchCarForId/3')
                    .then(response => response.json())
                    .then(data => convertDataDetails(data))
                    .then(data => addToMap(data,3));
                }
                if(carArray[i]==5){
                    fetch('http://localhost:8080/api/searchCarForId/5')
                    .then(response => response.json())
                    .then(data => convertDataDetails(data))
                    .then(data => addToMap(data,5));
                }
            }

        }

        else if(selectedCarId>0){
            console.log("start:"+start+" end:"+end);
            fetch('http://localhost:8080/api/searchCarForTimeRange', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id : selectedCarId, start: start, end: end })
            })
                .then(res => res.json())
                .then(data => convertDataDetails(data))
                .then(data => addToMap(data,selectedCarId));

        }
        




    function convertDataDetails(cikti) { // cekilen veriyi uygun formata donusturur.
        let dizi = [];
        for (let i = 0; i < cikti.length; i++) {
            let dizi2 = [];
            dizi2.push(cikti[i].Latitude, cikti[i].Longitude, cikti[i].Date);
            dizi.push(dizi2);
        }
        return dizi;
    }

    function addMarker(lat, lng, minute, hour, day, mounth, year, carIds) {
        var marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
        });
        //console.log("date:"+date);
        if(carIds==1){
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        }
        if(carIds==2){
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        }
        if(carIds==3){
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
        }
        if(carIds==5){
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        }

        var infowindow =  new google.maps.InfoWindow({
            content: `carId:${carIds} , lat:${lat} , lng:${lng}  ,  ${hour}:${minute}  ,  ${day}/${mounth}/${year}`,
            map: map
        });
        marker.addListener('mouseover', function() {
            infowindow.open(map, this);
        });
        marker.addListener('mouseout', function() {
            infowindow.close();
        });


    }

    function addToMap(carArray,carId) {
        for (let i = 0; i < carArray.length; i++) {
            addMarker(parseFloat(carArray[i][0]), parseFloat(carArray[i][1]), parseInt(carArray[i][2].minute), parseInt(carArray[i][2].hour), parseInt(carArray[i][2].day), parseInt(carArray[i][2].mounth), parseInt(carArray[i][2].year), carId); // 0. indis latitude , 1. indis longitude
            //console.log(carArray[i][0] + "," + carArray[i][1]);
        }
    }

}



(function () {
    'use strict';
    var init = function () {
        var slider2 = new rSlider({
            target: '#time_range',
            values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            step: 1,
            range: true,
            set: [0, 24],
            tooltip: true,
            scale: true,
            labels: true,
            width: null,
            onChange: function (vals) {
                //let deneme = localStorage.getItem("deneme");
                //deneme = toString(deneme);
                
                if(selectedCarId>0){ 
                    //initMap([]);
                    console.log("selectedCarId:"+selectedCarId);
                    start = vals.split(",")[0];
                    end = vals.split(",")[1];
                    initMap();
                    // fetch('http://localhost:8080/api/searchCarForTimeRange', {
                    //     method: 'POST',
                    //     headers: {
                    //         'Accept': 'application/json, text/plain, */*',
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({ id : selectedCarId, start: vals.split(",")[0], end: vals.split(",")[1] })
                    // })
                    //     .then(res => res.json())
                    //     .then(data => initMap(data,selectedCarId));
                        //.then(data => convertDataDetails(data))
                        //.then(data => addToMap(data));
                        
                }

                else{
                    initMap([]);
                }

            }
        });
    };
    window.onload = init;
})();