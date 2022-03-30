
const { findRows } = require('../readFile/readCsv');
const { runPublisher, startPublisher } = require('../pub-sub/publisher');
const { runSubscirber, startSubscriber } = require('../pub-sub/subscriber');
//öncelikle pub ve sub başlatılıyor
startPublisher('9000');
startSubscriber('9000');

async function readCarInfo(carId) {
    let carArray=[];
    try {
        carArray=await findRows(carId);
        console.log(`bitti ${carId}`);
        //array gelince mesage brokere yazarak çekiyoruz
        runPublisher(`car${carId}Channel`,carArray);
        runSubscirber(`car${carId}Channel`);
    } catch (error) {
        console.log(error);
    }
}

//burada hangi id verirsek message brokerde bu adı barındıran bir 
//channel oluşturuluyor ve oraya ayazarak orada çekiyor

readCarInfo(1);
readCarInfo(2);
readCarInfo(3);
readCarInfo(5);
