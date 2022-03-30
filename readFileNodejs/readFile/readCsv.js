const fs = require('fs');
const path = require('path');
const { parse } = require('fast-csv');
const stream = require("stream");


exports.findRows = function findRows(selectedCarId) {
    let rows = [];
    //burada metin okumak uzun bir işlem olduğundan metin okuma işlemini bir 
    //promise yapısına dönüştürtük bu şekilde çağırdığımız yerde await ile bekletebiliriz
    return new Promise(((resolve, reject) => {
        fs.createReadStream(path.resolve('../allCars.csv'))
            .pipe(parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => {
                if (row.carId == selectedCarId) {
                    //tarih içinde ayrı bir obje oluşturduk
                    let DateYear = row.Date.toString().split(" ")[0].
                        split("-")[0];
                    let DateMounth = row.Date.toString().split(" ")[0].
                        split("-")[1];
                    let DateDay = row.Date.toString().split(" ")[0].
                        split("-")[2];
                    let DateHour=row.Date.toString().split(" ")[1].
                    split(":")[0];
                    let DateMinute=row.Date.toString().split(" ")[1].
                    split(":")[1];
                    let DateObj = {
                        year: DateYear,
                        mounth: DateMounth,
                        day: DateDay,
                        hour: DateHour,
                        minute: DateMinute,
                    }
                    row.Date=DateObj;
                    //güncellenmiş tarih objesi ile listeye ekletik
                    rows.push(row);
                }
            })
            .on('end', rowCount => {
                console.log(`Parsed ${rowCount} rows`);
                //burada resolve bir promise yapısı içi,n return görevi görmekte
                //rows listesini return ediyor
                resolve(rows);
                reject(new Error('hata var'));
            });
    }));
}
