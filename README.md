trimp3
======

trimp3 is a simple command line interface (CLI) to "trim" single mp3 files. 
The beginning and end of an mp3 file can simply be cropped by providing the
begin and end time wished, like:

Example:
```

    trimp3 input.mp3 output.mp3 22 3:00 

```

The output.mp3 file will contain audio from [00h 00m 22s - 00h 03m 00s] of the input.mp3.
This is useful to cut away audio content which shouldn't be part of an audio file.


## Prerequisites

Make sure:
- node.js is installed (>= 0.8.*)
- npm is installed
- ffmpeg binary is installed 

## Installing

```

    [sudo] npm install -g trimp3

```