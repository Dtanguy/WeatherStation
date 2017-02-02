#! /bin/bash

echo "21" > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio21/direction
echo "1" > /sys/class/gpio/gpio21/value

echo "0" > /sys/class/gpio/gpio21/value
sleep 2
echo "1" > /sys/class/gpio/gpio21/value
