#include "EspMQTTClient.h"
#include "DHT.h"
#include <SPI.h>
#include <MFRC522.h>
#include <string.h>

#define RST_PIN         27
#define SDA_PIN         5

#define DHTPIN 26
#define DHTTYPE DHT11
float t;

DHT dht(DHTPIN, DHTTYPE);
MFRC522 mfrc522(SDA_PIN, RST_PIN);  // Create MFRC522 instance
EspMQTTClient client(
  "Orange-926C",
  "QTYRNYDBTL6",
  "test.mosquitto.org",  // MQTT Broker server ip
  "TestClient",     // Client name that uniquely identify your device
  1883              // The MQTT port, default to 1883. this line can be omitted
);

void setup() {
  Serial.begin(115200);    // Initialize serial communications with the PC

  Serial.println("Connecting to WIFI");
  if (!client.isWifiConnected());
 
  Serial.println("Connecting to MQTT Broker");
  if (!client.isMqttConnected());

  Serial.println("everything is connected");
  
  client.enableDebuggingMessages();
  client.enableHTTPWebUpdater();
  client.enableOTA(); 
  client.enableLastWillMessage("TestClient/lastwill", "I am going offline");
  
  SPI.begin();      // Init SPI bus
  mfrc522.PCD_Init();   // Init MFRC522
  
  dht.begin();
  
}

void onConnectionEstablished(){
    client.publish("mytopic/esp32/temp", "hello");
}

void loop() {
  delay(2000);
  t = dht.readTemperature();
  char buf[50];
  if (isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  gcvt(t, 6, buf);
  //Serial.println(buf);
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }
  
  Serial.print("UID tag :");
  String content= "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  Serial.println();
  Serial.print("Message : ");
  content.toUpperCase();
  if (content.substring(1) == "37 BF C2 4D") //change here the UID of the card/cards that you want to give access
  {
    Serial.println("Authorized access");
    Serial.println();
    if (!client.isConnected());
    
    Serial.println(buf);
    client.publish("mytopic/esp32/temp", buf);
    Serial.println();
    delay(3000);

    
  }
  else   {
    Serial.println(" Access denied");
    delay(3000);
  }
  
  client.loop();
}
