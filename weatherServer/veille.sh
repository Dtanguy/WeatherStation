#! /bin/bash

echo "0" > /sys/class/gpio/gpio21/value
sleep 2
echo "1" > /sys/class/gpio/gpio21/value