# audioEncoder

Encode audioBuffer to wave or mp3 from the browser, using an unified API

[![Install with NPM](https://nodei.co/npm/audio-encoder.png?downloads=true&stars=true)](https://nodei.co/npm/audio-encoder/)

## USAGE:

Import the library as script:
(Copy the `dist/audioEncoder.js` file in your project)
```html
<script src="audioEncoder.js" type="text/javascript"></script>
```

Or require as a module:
```js
var audioEncoder = require('audio-encoder');
```

Encode an AudioBuffer instance:
```js
audioEncoder(audioBuffer, encoding, onProgress, onComplete);
```

`encoding` is either:
- 'WAV' or `0` or null -> will encode to a wave file
- any valid mp3 bitrate: 320, 256, 192, 128, 96, 64, 56, 48, 40, 32

`onComplete` gets called with a `Blob` instance as result.

### NOTE:
Bitrate lower that 96 will force audio to be MONO. On top of that, the sample rate will be degraded according to the following table:

| bitrate            | sample rate   | force to mono
| ------------------ | ------------- | -------------
| 96 kBps and higher | 44.1 kHz      | `false`
| 64 kBps            | 44.1 kHz      | `true`
| 56 kBps            | 32 kHz        | `true`
| 48 kBps            | 32 kHz        | `true`
| 40 kBps            | 24 kHz        | `true`
| 32 kBps            | 22 kHz        | `true`

## Example

```js
const audioEncoder = require('audio-encoder');
const fileSaver    = require('file-saver');

// create audioBuffer
const audioContext = new AudioContext();
const length = 44100; // one second @ 44.1KHz
const audioBuffer = audioContext.createBuffer(1, length, 44100);
const channelData = audioBuffer.getChannelData(0);

// fill some audio
for (let i = 0; i < length; i++) {
	channelData[i] = Math.sin(i * 0.03);
}

// convert as mp3 and save file using file-saver
audioEncoder(audioBuffer, 128, null, function onComplete(blob) {
	fileSaver.saveAs(blob, 'sound.mp3');
});
```
