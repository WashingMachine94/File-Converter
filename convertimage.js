const sharp = require('sharp');

// Function to convert image types
function convertImage(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        sharp(inputPath)
        .toFormat(outputFormat)
        .toFile(outputPath)
        .then(function(info) { 
            return resolve(info);
        })
        .catch(function(err) {
            return reject(err);
        });
    });
    
}

module.exports = {
    convertImage
}