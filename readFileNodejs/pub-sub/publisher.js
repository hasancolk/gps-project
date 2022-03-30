// pubber.js
const zmq = require("zeromq"),
    sock = zmq.socket("pub");
let isBound = false;

exports.startPublisher= function startPublisher(portNo) {
    //publisher için port ayrlamasını yapar 
    //ayrı foksiyonda yazarak portların sadece bir defa ayarlanmasını sağladık
    sock.bindSync(`tcp://127.0.0.1:${portNo}`);
    console.log(`Publisher ${portNo} numaralı porttan hizmet vermeye başladı.`);
    isBound = true;
}
exports.runPublisher =  function runPublisher(channelName, messageArray) {
    if (!isBound) {
        console.log("öncelikle startPublisher metodunu çalıştırın.");
        return;
    }
    let i = 0;
    const myInterval = setInterval(() => {
        //burada interval ile sürekli olarak çalışmasını sağladık 
        if (messageArray.length <= i) {
            //yollancak mesaj kalmayınca intervalin içini boşaltıyoruz
            clearInterval(myInterval);
            return;
        }
        //mesajı kanal adına göre jsona çevirerek attık
        sock.send([channelName, JSON.stringify(messageArray[i])]);
        i++;
    },1500);
    
}