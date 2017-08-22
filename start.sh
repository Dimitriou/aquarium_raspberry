#!/bin/bash
cd pi-blaster && ./pi-blaster 17 && echo "0=0.1" > /dev/pi-blaster
cd .. && node server.js
