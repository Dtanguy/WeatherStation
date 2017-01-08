# WeatherStation
A 3D printed weather station, based on rpi2 and nodeMCU.<br>
<p align="center">/!\ Still WIP</p>

<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/p1.jpg">
</p>
<br>

<!--<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/p2.png">
</p>
<br>-->

#Hardware :
Material used for the station :
<br>
- RPI2.
- Wifi dougle.
- Screen and screen controler with hdmi.
- HDMI cable.
- 5V 2A regulator
- Arduino (nano or minipro form small size). 
- The 3D file are in the STL floder or on my thingiverse account: https:// 
<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/StationSchematic.png">
</p>
<br>

Material used for the wireless sensor :
<br>
- NodeMCU
- Temperature sensor + resistor
- A solar powered batterie (i use this one : https://www.amazon.fr/gp/product/B017W1MGMY/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)
<br>
<p align="center">
	<img src="https://raw.githubusercontent.com/dtanguy/weatherstation/master/img/WirelessSensorSchematic.png">
</p>
<br>

#Installation :

Raspberry pi 2 :

Install raspbian-jessie on the sd card of the rip2 (i use the .img from 2016-05-10)
sudo apt-get update
sudo apt-get upgrade
sudo raspi-config => enable VNC, desktop, serial, change the nam and password and expand file system.
<br>
sudo apt-get install apache2 -y
sudo apt-get install php5 libapache2-mod-php5 -y
sudo chown -R pi:www-data /var/www
<br>
sudo iwlist wlan0 scan
sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
network={
    ssid="YourSSID"
    psk="YourPSK"
}
<br>
sudo apt-get install unclutter
sudo apt-get install git

sudo apt-get install screen 
sudo nano /boot/config.txt 
change enable_uart=0 to enable_uart=1

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install npm

sudo npm install forever -g (You can try whitout the -g but it doesn't work for me)
sudo apt-get install midori
sudo apt-get install xplanet

sudo nano /etc/lightdm/lightdm.conf
# add the following lines to the [SeatDefaults] section
# don't sleep the screen
xserver-command=X -s 0 dpms

sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart (or just copy the autostart file i put on this git)
@point-rpi
@xset s off
@xset -dpms
@xset s noblank
@midori -e Fullscreen -a http://localhost

Copy the server floder in your home directory
Install it with npm install
Make veille.sh and init.sh usable with sudo chmod +x veille.sh and sudo chmod +x init.sh
Create Crontab with sudo crontab -e
add this 3 lines
@reboot     /home/pi/init.sh
0 22 * * *     /home/pi/veille.sh
0 7 * * *     /home/pi/veille.sh 

<br>
Arduino :
<br>
Juste upload the ArduinoReadSensors sketch, no library needed.
<br>

<br>
NodeMCU :
Install nodeMCU library for arduino.
In the nodeMCUsendData skecth change SSID and PSK by your.
Upload the sketch.