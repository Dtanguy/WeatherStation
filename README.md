#Weather Station
<br>
This project is a 3D printed weather station, based on rpi2 and nodeMCU. 
The weather data come from the openweathermap API and the temperature data from 3 sensor. 
The first sensor is embeded in the station, the second is in the garden connected in wifi using a nodeMCU and the last is a 3D printer headsensor thanks to Octoprint API. 
It's mostly writen in javascript, node.js for the server side and materialize framerwork for the front.
<br>
This is still a WIP, a lot of think have to be improve.

<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/p1.jpg">
</p>

<!--<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/p2.png">
</p>
<br>-->

#Hardware :
##Material used for the station :
- RPI2.
- Wifi dougle.
- Screen and screen controler with hdmi.
- HDMI cable.
- 5V 2A regulator.
- Arduino (nano or minipro for small size). 
- The 3D files are in the STL floder or on my thingiverse account: http://www.thingiverse.com/Dtanguy/designs
<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/p2.png" style="height: 400px;">
</p>


##Material used for the wireless sensor :
- NodeMCU.
- Temperature sensor + resistor.
- Solar powered batterie (http://amzn.com/B017W1MGMY).
<br><br>

#Wiring :
##Station :
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/StationSchematic.png">
</p>

##Sensor :
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/WirelessSensorSchematic.png">
</p>


#Installation :
##Raspberry pi 2 :
###From fullpageos (easyer):

- get .img here : https://guysoft.wordpress.com/2015/10/17/fullpageos-out-of-the-box-kiosk-mode-for-the-raspberrypi/
- Install fullpageos on sd card
- In /boot change fullpageos.txt
- In /boot change fullpageos-network.txt
<br><br>

- sudo apt-get purge chromium-browser
- sudo apt-get install midori
- sudo nano ~/scripts/run_onepageos
- remplace the line with chrome by "midori -e Fullscreen -a $(head -n 1 /boot/fullpageos.txt)"
<br><br>

- sudo raspi-config => enable VNC, desktop, serial, change the name, password, expand the file system.
- sudo apt-get update
- sudo apt-get upgrade
<br><br>

- sudo iwlist wlan0 scan
- sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
<br>network={
<br>&emsp;&emsp;ssid="YourSSID"
<br>&emsp;&emsp;psk="YourPSK"
<br>}
<br><br>

- sudo apt-get install screen 
- sudo nano /boot/config.txt
- change enable_uart=0 to enable_uart=1
<br><br>

- curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash
- sudo apt-get install -y nodejs
- sudo apt-get install npm
- sudo npm install forever -g (You can try whitout the -g but it doesn't work for me)
<br><br>

- sudo apt-get install xplanet
<br><br>

- Copy the server floder in your home directory
- Install it with npm install
- Make veille.sh and init.sh usable with sudo chmod +x veille.sh and sudo chmod +x init.sh
- Create Crontab with sudo crontab -e
<br>@reboot     /home/pi/init.sh
<br>@reboot     forever start /home/pi/weatherServer/app.js
<br>0 22 * * *     /home/pi/veille.sh
<br>0 7 * * *     /home/pi/reveil.sh 
<br><br>


###From raspbian:

- Install raspbian-jessie on the sd card of the rip2 (i use the .img from 2016-05-10)
- sudo apt-get update
- sudo apt-get upgrade
- sudo raspi-config => enable VNC, desktop, serial, change the name and password and expand file system.
<br><br>

- sudo apt-get install apache2 -y
- sudo apt-get install php5 libapache2-mod-php5 -y
- sudo chown -R pi:www-data /var/www
<br><br>

- sudo iwlist wlan0 scan
- sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
<br>network={
<br>&emsp;&emsp;ssid="YourSSID"
<br>&emsp;&emsp;psk="YourPSK"
<br>}
<br><br>

- sudo apt-get install unclutter
- sudo apt-get install git
<br><br>

- sudo apt-get install screen 
- sudo nano /boot/config.txt
- change enable_uart=0 to enable_uart=1
<br><br>

- curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash
- sudo apt-get install -y nodejs
- sudo apt-get install npm
<br><br>

- sudo npm install forever -g (You can try whitout the -g but it doesn't work for me)
- sudo apt-get install midori
- sudo apt-get install xplanet
<br><br>

- sudo nano /etc/lightdm/lightdm.conf
<br>xserver-command=X -s 0 dpms
<br><br>

- sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart (or just copy the autostart file i put on this git)
<br>@point-rpi
<br>@xset s off
<br>@xset -dpms
<br>@xset s noblank
<br>@lxpanel --profile LXDE-pi
<br>@pcmanfm --desktop --profile LXDE-pi
<br>@xscreensaver -no-splash
<br>@forever start /home/pi/weatherServer/app.js
<br>@midori -e Fullscreen -a http://localhost
<br><br>

- Copy the server floder in your home directory
- Install it with npm install
- Make veille.sh and init.sh usable with sudo chmod +x veille.sh and sudo chmod +x init.sh
- Create Crontab with sudo crontab -e
<br>@reboot     /home/pi/init.sh
<br>0 22 * * *     /home/pi/veille.sh
<br>0 7 * * *     /home/pi/veille.sh 
<br><br>

- Put your API key in app.js.

##Arduino :
Simply upload the ArduinoReadSensors sketch, no modification or library needed.

##NodeMCU :
- Install nodeMCU library for arduino.
- In the nodeMCUsendData skecth change SSID and PSK.
- Upload the sketch.


##Usefull link :
- Cron like for node.js: https://github.com/kelektiv/node-cron
- Serial port for node.js: https://github.com/EmergingTechnologyAdvisors/node-serialport
- Enable UART on RPI: http://spellfoundry.com/2016/05/29/configuring-gpio-serial-port-raspbian-jessie-including-pi-3/
- An other projet of RPI dashbord: http://www.magdiblog.fr/boa-pi-homedashscreen/1-raspberry-pi-home-dash-screen/
- Usage of Forever: https://blog.nodejitsu.com/keep-a-nodejs-server-up-with-forever/
- Nice: backgroundhttps://www.calm.com/ 