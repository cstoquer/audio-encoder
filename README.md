# audioEncoder

Encode audioBuffer to wave or mp3 using an unified API

## USAGE:

```js
audioEncoder(audioBuffer, encoding, onProgress, onComplete);
```

`encoding` is either:
- 'WAV' or `0` or null -> will encode to a wave file
- any valid mp3 bitrate: 320, 256, 192, 128, 96, 64, 56, 48, 40, 32

`onComplete` gets called with a `Blob` instance as result.

### NOTE:
Bitrate lower that 96 will force audio to be MONO. On top of that, the sample rate will be degraded following this table:
- 64 kBps and higher -> 44.1 kHz
- 56 kBps -> 32 kHz
- 48 kBps -> 32 kHz
- 40 kBps -> ?
- 32 kBps -> 22 kHz
