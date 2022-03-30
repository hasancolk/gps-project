const { default: axios } = require("axios");

// subber.js
const zmq = require("zeromq"),
    sock = zmq.socket("sub");
let isConnected = false;
exports.startSubscriber = function startSubscriber(portNo) {
    //sybscriber için port ayrlamasını yapar 
    //ayrı foksiyonda yazarak portların sadece bir defa ayarlanmasını sağladık
    //subscribe olma işlemi run metodunda yapıldı
    sock.connect(`tcp://127.0.0.1:${portNo}`);
    console.log(`socket Subscriber için ${portNo} numaralı porttan hizmet vermeye başladı.`);
    isConnected = true;
    return;
}

exports.runSubscirber = async function runSubscirber(channelName) {
    if (!isConnected) {
        console.log("öncelikle startPublisher metodunu çalıştırın.");
        return;
    }
    //burada kanal adına göre subscribe oluyoruz
    sock.subscribe(channelName);
    console.log("subscriber 9000 numaralı porta bağlandı");
    sock.on("message", async function (topic, message) {

        if (message) {
            //burada aldığımız buffer içerisinde olan  mesajı convert ettik
            let tmp = JSON.parse(message.toString());
            // console.log(tmp);
            // await ekranaBasAsnc(topic, tmp);
            // axios({
            //     method:'POST',
            //     url:'http://localhost:8080/'
                
            // })
            console.log(tmp);
            await axios.post('http://localhost:8080/api/car',tmp,{
                Headers:{
                    'Content-Type': 'application/json'
                }
            });
        }
    });
}
