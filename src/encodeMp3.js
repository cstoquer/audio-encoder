var lamejs = require('lamejs');

var MAX_AMPLITUDE = 0x7FFF;

function encodeMp3(audioBuffer, params, onProgress, cb) {
	if (audioBuffer.sampleRate !== 44100) {
		// TODO: generalize encoder for different sample rates
		throw new Error('Expecting 44100 Hz sample rate');
	}

	var nChannels = audioBuffer.numberOfChannels;

	if (nChannels !== 1 && nChannels !== 2) {
		throw new Error('Expecting mono or stereo audioBuffer');
	}

	var bitrate = params.bitrate || 128;
	if (bitrate < 96) {
		// lame fails to encode stereo audio if bitrate is lower than 96.
		// in which case, we force sound to be mono (use only channel 0)
		nChannels = 1;
	}

	var bufferLength = audioBuffer.length;

	// convert audioBuffer to sample buffers
	var buffers = [];

	for (var channel = 0; channel < nChannels; channel++) {
		var buffer = audioBuffer.getChannelData(channel);
		var samples = new Int16Array(bufferLength);

		for (var i = 0; i < bufferLength; ++i) {
			var sample = buffer[i];

			// clamp and convert to 16bit number
			sample = Math.min(1, Math.max(-1, sample));
			sample = Math.round(sample * MAX_AMPLITUDE);

			samples[i] = sample;
		}

		buffers.push(samples);
	}


	// can be anything but make it a multiple of 576 to make encoders life easier
	BLOCK_SIZE = 1152;
	mp3encoder = new lamejs.Mp3Encoder(nChannels, 44100, bitrate);
	var mp3Data = [];

	var blockIndex = 0;

	function encodeChunk() {
		var mp3buf;
		if (nChannels === 1) {
			var chunk = buffers[0].subarray(blockIndex, blockIndex + BLOCK_SIZE);
			mp3buf = mp3encoder.encodeBuffer(chunk);
		} else {
			chunkL = buffers[0].subarray(blockIndex, blockIndex + BLOCK_SIZE);
			chunkR = buffers[1].subarray(blockIndex, blockIndex + BLOCK_SIZE);
			var mp3buf = mp3encoder.encodeBuffer(chunkL, chunkR);
		}

		if (mp3buf.length > 0) {
			mp3Data.push(mp3buf);
		}

		blockIndex += BLOCK_SIZE;
	}

	function update() {
		if (blockIndex >= bufferLength) {
			// finish writing mp3
			var mp3buf = mp3encoder.flush();

			if (mp3buf.length > 0) {
				mp3Data.push(mp3buf);
			}

			return cb(new Blob(mp3Data, { type: 'audio/mp3' }));
		}

		var start = performance.now();

		while (blockIndex < bufferLength && performance.now() - start < 15) {
			encodeChunk();
		}

		onProgress && onProgress(blockIndex / bufferLength);
		setTimeout(update, 16.7);
	}

	update();
}

module.exports = encodeMp3;
