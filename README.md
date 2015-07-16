trimp3
======

trimp3 is a simple command line interface (CLI) to "trim" single mp3 files. 
The beginning and end of an mp3 file can simply be cropped by providing the
begin and end time wished, like:

Example:
```

    trimp3 input.mp3 output.mp3 22 3:00 

```

The output.mp3 file will contain audio from [22s - 3m 0s] of the input.mp3.
This is useful to cut away audio content which shouldn't be part of an audio file.

## High speed and absolutely no loss in sound quality

This program triggers the ffmpeg tools to *NOT* decode and encode the mp3 files
while copying the audio data from input.mp3 to output.mp3.

trimp3 trims/copies a 1.13 GiB mp3 file in less than 30 sec. on a SSD / Mac OS X 10.10.

## Prerequisites

Make sure:
- node.js is installed (>= 0.10.*)
- npm is installed
- ffmpeg binary is installed 
  - you *DON'T* need lame etc. pp.

Please note that the ffmpeg binary must be found in the OS path.
Check your system for compatibility by opening a CLI and execute:

```

    ffmpeg
    
```

Make sure this command outputs something like:

```

    ffmpeg version 2.6.1 Copyright (c) 2000-2015 the FFmpeg developers
    [... lot more output ...]

```

If you face any issues, install ffmpeg properly:

https://www.ffmpeg.org/download.html

## Installing

After installing node.js from https://nodejs.org/, open a CLI and execute:

```

    [sudo] npm install -g trimp3
    

```

## Usage

Schema:

```
    trimp3  $mp3In  $mp3Out  $beginTime  [$endTime]
    
```

Please note:
End time is optional.
If you don't provide an end time, end will not be trimmed.

## Time formats supported

```

  00       - seconds
  00:00    - minutes and seconds
  00:00:00 - hours, minutes and seconds

  EXAMPLE:  trimp3  in.mp3  out.mp3  01:35       7:58:55
  EXAMPLE:  trimp3  in.mp3  out.mp3  20:31       05:40

```