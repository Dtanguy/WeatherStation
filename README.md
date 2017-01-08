# WeatherStation
<br>
A 3D printed weather station, based on rpi2 and nodeMCU.<br>
This is still a WIP,a lot of thin have to be improve. But it work.

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
- 5V 2A regulator
- Arduino (nano or minipro for small size). 
- The 3D file are in the STL floder or on my thingiverse account: https:// 

##Material used for the wireless sensor :
- NodeMCU
- Temperature sensor + resistor
- Solar powered batterie (https://www.amazon.fr/gp/product/B017W1MGMY/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)
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

- Install raspbian-jessie on the sd card of the rip2 (i use the .img from 2016-05-10)
- sudo apt-get update
- sudo apt-get upgrade
- sudo raspi-config => enable VNC, desktop, serial, change the nam and password and expand file system.
<br>
- sudo apt-get install apache2 -y
- sudo apt-get install php5 libapache2-mod-php5 -y
- sudo chown -R pi:www-data /var/www
<br>
- sudo iwlist wlan0 scan
- sudo nano /etc/wpa_supplicant/wpa_supplicant.conf
network={
    ssid="YourSSID"
    psk="YourPSK"
}
<br>
- sudo apt-get install unclutter
- sudo apt-get install git
<br>
- sudo apt-get install screen 
- sudo nano /boot/config.txt 
- change enable_uart=0 to enable_uart=1
<br>
- curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
- sudo apt-get install -y nodejs
- sudo apt-get install npm
<br>
- sudo npm install forever -g (You can try whitout the -g but it doesn't work for me)
- sudo apt-get install midori
- sudo apt-get install xplanet
<br>
- sudo nano /etc/lightdm/lightdm.conf
xserver-command=X -s 0 dpms
<br>
- sudo nano /home/pi/.config/lxsession/LXDE-pi/autostart (or just copy the autostart file i put on this git)
@point-rpi
@xset s off
@xset -dpms
@xset s noblank
@midori -e Fullscreen -a http://localhost
<br>
- Copy the server floder in your home directory
- Install it with npm install
- Make veille.sh and init.sh usable with sudo chmod +x veille.sh and sudo chmod +x init.sh
- Create Crontab with sudo crontab -e
@reboot     /home/pi/init.sh
0 22 * * *     /home/pi/veille.sh
0 7 * * *     /home/pi/veille.sh 
<br>

##Arduino :
Just upload the ArduinoReadSensors sketch, no library needed.

##NodeMCU :
- Install nodeMCU library for arduino.
- In the nodeMCUsendData skecth change SSID and PSK.
- Upload the sketch.