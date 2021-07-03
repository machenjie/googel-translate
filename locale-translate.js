const translate = require("./src/translate");
const fs = require('fs');

let srcLang = "en";
let srcLangFile = srcLang+'.json';
let srcLangData = fs.readFileSync(srcLangFile);
let storeDir = "locale/";
let langList = ["ar", "ko", "de", "ru", "fr", "bn", "pt-br", "ja", "es", "hi", "zh-cn", "zh-tw", "zh-hk"];

if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir);
}
translate.translateObj(JSON.parse(srcLangData), langList, function (transResults) {
    for(let result of transResults) {
        fs.writeFile(storeDir + result[0] +'.json', JSON.stringify(result[1]), (err) => {
        });
        console.log("\""+ result[0]+"\":", JSON.stringify(result[1]), ",");
    }
    fs.writeFile(storeDir + srcLangFile, srcLangData, (err) => {
    });
    console.log("\""+srcLang+"\":", srcLangData.toString());
});
