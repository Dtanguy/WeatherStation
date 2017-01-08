#include <ESP8266WiFi.h>
extern "C" {
  #include "user_interface.h"
}

const char* ssid = "Bbox-A50A7EFB";
const char* password = "FE7D44DF3D2D3717DA1C2D1214AE11";
const char* host = "192.168.1.9";

int nb_try = 0;

void Dodo(int sec){
  Serial.println();
  Serial.println("Going to sleep...");
  delay(1000);
  // go to deepsleep for 10 minutes
  system_deep_sleep_set_option(0);
  system_deep_sleep(1000000 * sec);
  delay(1000);
}

void setup() {  
  
  Serial.begin(9600); 
  delay(10);  

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  nb_try = 0;
  while (WiFi.status() != WL_CONNECTED) {
    if (nb_try > 10){
       nb_try = 0;
       Dodo(60*10);
    }
    delay(500);
    Serial.print(".");
    nb_try++;
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("forece : ");
  Serial.println(WiFi.RSSI());

  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 8085;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }

  String url = "/update?temp=";
  url += random(10, 30);
  url += "&wifi=";
  url += WiFi.RSSI();
  
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Connection: close\r\n\r\n");
  delay(10);  
  
  // Read all the lines of the reply from server and print them to Serial
  /*while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }*/
  
  Dodo(60*10);  
}


void loop() {   
}



