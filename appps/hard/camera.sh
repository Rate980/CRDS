#!/bin/env bash

#URL=https://httpbin.org/post
URL=http://10.200.4.56:8000/upload

libcamera-jpeg -n -o /home/a/camera.jpg
curl -X POST -F "file=@/home/a/camera.jpg;type=image/jpeg" $URL
