'use strict';

const firebase = require('./db');
const Car = require('./car');
const firestore = firebase.firestore();


const addLocation = async (req, res) => {    //    /api/car
    try {
        const data = req.body;
        await firestore.collection(data.carId.toString()).doc().set(data);
        res.send('Arac verileri kaydedildi.');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const searchCarForId = async (req, res) => {
    // burada ide ye göre son yarım saati dönderdim
    try {
        const carArray = [];
        const id = req.params.carId;
        const cars = await firestore.collection(id.toString());
        const data = await cars.orderBy('Date.day', 'desc')
            .orderBy('Date.hour', 'desc')
            .orderBy('Date.minute', 'desc').limit(1).get();
        let lastCar;
        if (data.empty) {
            res.status(404).send('Kayıtlı arac yok!');
        } else {
            data.forEach(doc => {
                const car = new Car(
                    doc.id,
                    doc.data().carId,
                    doc.data().Longitude,
                    doc.data().Latitude,
                    doc.data().Date
                );
                lastCar = car;
            });

            const lastCarMinute = parseInt(lastCar.Date.minute);
            const lastCarHour = parseInt(lastCar.Date.hour);
            const lastCarDay = parseInt(lastCar.Date.day);
            const cars2 = await firestore.collection(id.toString());
            const data2 = await cars2.orderBy('Date.day', 'desc')
                .orderBy('Date.hour', 'desc')
                .orderBy('Date.minute', 'desc').get();
            if (data2.empty) {
                res.status(404).send('Kayıtlı arac yok 2 !');
            } else {
                data2.forEach(doc => {
                    const car = new Car(
                        doc.id,
                        doc.data().carId,
                        doc.data().Longitude,
                        doc.data().Latitude,
                        doc.data().Date
                    );
                    let currentDay = parseInt(car.Date.day);
                    let currentHour = parseInt(car.Date.hour);
                    let currentMinute = parseInt(car.Date.minute);

                    if (lastCarHour === 0) {
                        //önceki güne gidecekmiyiz
                        if (lastCarMinute > 30) {
                            //aynı gündeyiz
                            if (lastCarDay === currentDay) {
                                if (lastCarHour === currentHour && (lastCarMinute - 30) < currentMinute) {
                                    carArray.push(car)
                                }
                            }
                        } else {
                            //önceki güne gideriz
                            if (lastCarDay === currentDay) {
                                //aynı günün
                                if (lastCarHour === currentHour) {
                                    carArray.push(car)
                                }
                            }
                            if (lastCarDay - 1 === currentDay) {
                                let tmpMinute = 60 - (30 - lastCarMinute);
                                if (currentHour === 23 && currentMinute > tmpMinute) {
                                    carArray.push(car)
                                }
                            }
                        }
                    } else {
                        if (lastCarDay === currentDay) {
                            //önceki saate gitmek gerekecekmi
                            if (lastCarMinute > 30) {
                                //önceki saate gitmeye gerek yok
                                if (lastCarHour === currentHour && (lastCarMinute - 30) < currentMinute) {
                                    carArray.push(car);
                                }
                            } else {
                                //önceki saate gitmeliyiz
                                if (lastCarHour === currentHour) {
                                    //bulunulan saati alır
                                    carArray.push(car)
                                }
                                let tmpMinute = 60 - (30 - lastCarMinute);
                                if (lastCarHour - 1 === currentHour && tmpMinute < currentMinute) {
                                    //önceki saati alır
                                    carArray.push(car)
                                }
                            }
                        }
                    }
                });
            }
            console.log(carArray.length);
            res.send(carArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const searchCarForTimeRange = async (req, res) => {
    //burada 0 ile 24 saat aralığını gösteriyor son saati 24. saat baz alarak
    try {
        const id = req.body.id;
        const start = parseInt(req.body.start);
        const end = parseInt(req.body.end);
        const carArray = [];
        const cars = await firestore.collection(id.toString());
        const data = await cars.orderBy('Date.day', 'desc')
            .orderBy('Date.hour', 'desc')
            .orderBy('Date.minute', 'desc').get();
        if (data.empty) {
            res.status(404).send('Kayıtlı arac yok!');
        } else {
            data.forEach(doc => {
                const car = new Car(
                    doc.id,
                    doc.data().carId,
                    doc.data().Longitude,
                    doc.data().Latitude,
                    doc.data().Date
                );
                carArray.push(car);
            });
            let lastMinuteForcar = parseInt(carArray[0].Date.minute);
            let lastDayForcar = parseInt(carArray[0].Date.day);
            let lastHourForcar = parseInt(carArray[0].Date.hour);
            let startHour = lastHourForcar + start;
            let endHour = lastHourForcar - (24 - end);
            const carArray2 = [];
            carArray.forEach((element) => {
                let currentDay = parseInt(element.Date.day);
                let currentHour = parseInt(element.Date.hour);
                if (currentDay === lastDayForcar) {
                    if (currentHour < endHour) {
                        carArray2.push(element);
                    }
                } else if (currentDay === lastDayForcar - 1) {
                    if (currentHour > startHour) {
                        carArray2.push(element);
                    }
                }
            })

            res.send(carArray2);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}



module.exports = {
    addLocation,
    searchCarForId,
    searchCarForTimeRange
}