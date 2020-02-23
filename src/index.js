var encodeWav = require('./encodeWav');
var encodeMp3 = require('./encodeMp3');

var VALID_MP3_BITRATES = [32, 40, 48, 56, 64, 96, 128, 192, 256, 320];

module.exports = function encode (audioBuffer, encoding, onProgress, onComplete) {
	if (!encoding || encoding === 'WAV') {
		return encodeWav(audioBuffer, onComplete);
	}

	encoding = ~~encoding;
	if (VALID_MP3_BITRATES.indexOf(encoding) === -1) {
		throw new Error('Invalid encoding');
	}

	return encodeMp3(audioBuffer, { bitrate: encoding }, onProgress, onComplete);
};
