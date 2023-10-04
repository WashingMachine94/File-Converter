const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(
	'./resources/app.asar.unpacked/node_modules/ffmpeg-static/ffmpeg.exe'
);
// ffmpeg.setFfmpegPath('./node_modules/ffmpeg-static/ffmpeg.exe');

// Function to convert image types
function convertVideo(inputPath, outputPath) {
	return new Promise(async (resolve, reject) => {
		ffmpeg(inputPath)
			.output(outputPath)
			.on('end', function () {
				return resolve('Successfully converted video');
			})
			.on('error', function (error) {
				return reject(error);
			})
			.run();
	});
}

module.exports = {
	convertVideo,
};
