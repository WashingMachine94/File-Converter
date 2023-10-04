const { convertImage } = require('./convertImage.js');
const { convertVideo } = require('./convertvideo.js');


function convertHandler(filepath, exportPath, finalfiletype, convertTypeGroup) {
    return new Promise((resolve, reject) => {
        if(convertTypeGroup == "Images") {
            convertImage(filepath, exportPath, finalfiletype).then((result) => {
                return resolve(result);
            }).catch((error) => {
                return reject(error)
            });
        }
        if(convertTypeGroup == "Videos") {
            convertVideo(filepath, exportPath).then((result) => {
                return resolve(result);
            }).catch((error) => {
                return reject(error)
            });
        }


    });

}


module.exports = {
    convertHandler
}