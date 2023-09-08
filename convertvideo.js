const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('./resources/app.asar.unpacked/node_modules/ffmpeg-static/ffmpeg.exe');
//ffmpeg.setFfmpegPath('./node_modules/ffmpeg-static/ffmpeg.exe');

// Function to convert image types
function convertVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            ffmpeg(inputPath).output(outputPath).run();
            return resolve("Successfully converted video");
        } catch (error) {
            return reject(error);
        }
    });
}

module.exports = {
    convertVideo
}