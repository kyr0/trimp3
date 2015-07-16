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