#!/bin/bash
xset s off         # don't activate screensaver
xset -dpms         # disable DPMS (Energy Star) features.
xset s noblank     # don't blank the video device

echo "21" > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio21/direction
echo "1" > /sys/class/gpio/gpio21/value

sudo forever -o /var/www/html/log/out.log -e /var/www/html/log/err.log /home/pi/weatherServer/app.js &

while true
do
   # if [ $(curl -sL -w "%{http_code}\\n" "http://localhost/FullPageDashboard" -o /dev/null) == "200" ]; then
      #(sleep 15 ; /home/pi/scripts/fullscreen) &
      xdotool mousemove 9000 9000
      midori -e Fullscreen -a http://localhost
   # fi
    sleep 1
done
