#!/bin/bash

#use this script to turn DepthKit exports into DepthKitJS compatible WebM files
#	if you don't have FFMPEG, install homebrew
# 	$ brew install ffmpeg --with-libvorbis --with-libvpx --with-fdk-aac --with-theora


if [ "$#" -ne 6 ]; then 
    echo "Wrong number of parameters!"
    echo "$ ./depthkit_webm.sh <source_movie_path> <image_sequence_path> <start_frame> <end_frame> <framerate> <output_movie_name>"
    exit 1
fi

#user defined variables
INPUT_MOVIE_PATH=$1
SEQUENCE_PATH=$2
START_FRAME=$3
END_FRAME=$4
FRAME_RATE=$5
OUTPUT_MOVIE_PATH=$6

START_SECOND=$(bc <<< "scale=4;$START_FRAME / $FRAME_RATE")
END_SECOND=$(bc <<< "scale=4;$END_FRAME / $FRAME_RATE")
DURATION_IN_SECONDS=$(bc <<< "scale=4;$END_SECOND - $START_SECOND")

echo "Exporting DepthKit Video" 
echo "    Input Movie       $INPUT_MOVIE_PATH"
echo "    Input Sequence    $SEQUENCE_PATH"
echo "    Start Frame       $START_FRAME"
echo "    End Frame         $END_FRAME"
echo "    Frame Rate        $FRAME_RATE"
echo "    Duration (sec)    $DURATION_IN_SECONDS"
echo "    Output movie      $OUTPUT_MOVIE_PATH"

#Calculate start second by taking the start frame and dividing it by the frame rate
echo "EXTRACTING SOURCE AUDIO...."
ffmpeg -y -ss $START_SECOND -i "${INPUT_MOVIE_PATH}" -t $DURATION_IN_SECONDS -ac 2 -ar 44100 -vn "${INPUT_MOVIE_PATH}.WAV" 

echo "EXTRACTING BUILDING WEBM...."
ffmpeg -y -start_number $START_FRAME -f image2 -r ${FRAME_RATE} -i "${SEQUENCE_PATH}/save.%05d.png" -i "${INPUT_MOVIE_PATH}.WAV" -codec:v libvpx -crf 10 -b:v 1M -c:a libvorbis -r $FRAME_RATE "${OUTPUT_MOVIE_PATH}.webm"

echo "EXTRACTING POSTER FRAME...."
ffmpeg -y -i "${OUTPUT_MOVIE_PATH}.webm" -frames:v 1 "${OUTPUT_MOVIE_PATH}.png"
