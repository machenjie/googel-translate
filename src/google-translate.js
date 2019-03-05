const https = require('https');

TTK='422388.3876711001';
function tq(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}

function sq(a) {
    return function() {
        return a
    }
}

function vq(a,uq='422388.3876711001') {
    if (null !== uq)
        var b = uq;
    else {
        b = sq('T');
        var c = sq('K');
        b = [b(), c()];
        b = (uq = window[b.join(c())] || "") || ""
    }
    var d = sq('t');
    c = sq('k');
    d = [d(), c()];
    c = "&" + d.join("") + "=";
    d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
            a = tq(a, "+-a^+6");
    a = tq(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1000000;
    return c + (a.toString() + "." + (a ^ b))
}


async function GoogleTranslate(txt, opts) {
    //https://translate.google.cn/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl=auto&tl=

    let sl = opts.from || "auto";
    let dl = opts.to || "en";
    let client = opts.client || "webapp";
    let hostname = 'translate.google.cn';
    let method = 'GET';
    let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36';
    let path = "";
    switch (client) {
        case "gtx":
            path = encodeURI('/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=zh-CN&sl='+sl+'&tl='+dl+'&q='+txt);
            break;
        case "webapp":
            path = encodeURI('/translate_a/single?client=webapp&sl='+sl+'&tl='+dl+'&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=4&kc=3&tk='+vq(txt)+'&q='+txt);
            break;
        default:
            break;
    }

    const options = {
        hostname,
        path,
        method,
        headers: {
            'User-Agent': userAgent,
        }
    };

    return new Promise(function (resolve, reject) {
        https.get(options, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error);
                reject(error);
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                let result = {
                    raw: "",
                    text: ""
                };
                if (opts.raw) {
                    result.raw = rawData;
                }
                result.text = "";
                let data = JSON.parse(rawData);
                switch (client) {
                    case "gtx":
                        if (data.sentences instanceof Array) {
                            for(let transItem of data.sentences) {
                                if (typeof(transItem.trans) === 'string') {
                                    result.text+=transItem.trans;
                                }
                            }
                        }
                        break;
                    case "webapp":
                        if (data instanceof Array) {
                            if (data[0] instanceof Array) {
                                for(let transItem of data[0]) {
                                    if (transItem instanceof Array && typeof(transItem[0]) === 'string') {
                                        result.text+=transItem[0];
                                    }
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
                resolve(result);
            });
        }).on('error', (e) => {
            reject(e);
        });
    })
}

module.exports = GoogleTranslate;