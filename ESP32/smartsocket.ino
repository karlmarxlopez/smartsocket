#include <FirebaseESP32.h>
#include <WiFi.h>

#define ON_BOARD_LED 2
#define RELAY_MASTER 4
#define RELAY_SLAVE 16
#define TURN_ON_RELAY HIGH
#define TURN_OFF_RELAY LOW
#define FB_RTDB_ON "ON"
#define FB_RTDB_OFF "OFF"

// Firebase RTDB fields
#define MASTER_RELAY_STATUS "MASTER_RELAY_STATUS"
#define SLAVE_RELAY_STATUS "SLAVE_RELAY_STATUS"
#define TIMER "TIMER"
#define TIMER_ACTION "TIMER_ACTION"

FirebaseData firebaseData;

// WiFi Credentials
//const char* WF_SSID = "AOS-Internal";
//const char* WF_PWD = "LSnE266k2wRk";
//const char* WF_SSID = "AOS-Guest";
//const char* WF_PWD  = "14m1r0nm4n";
const char* WF_SSID = "VALAR MORGHULIS";
const char* WF_PWD  = "6str1ng5att4ched";

// Firebase Credentials
const String FB_PROJ_ID = "https://smart-socket-32f13.firebaseio.com/";
const String FB_DB_SECRET = "8ZDghSspkvYoTNgrlW6cVvJAmvgFWrpsJVh3m4Is";

void setup() {
  Serial.begin(115200);
  connectToWiFi(WF_SSID, WF_PWD);
  initFirebase(FB_PROJ_ID, FB_DB_SECRET);
  
  // Set pin mode
  pinMode(ON_BOARD_LED, OUTPUT);
  pinMode(RELAY_MASTER, OUTPUT);
  pinMode(RELAY_SLAVE, OUTPUT);
}

void loop() {
  subscribePinToChange(RELAY_MASTER, MASTER_RELAY_STATUS, "ON",TURN_ON_RELAY, TURN_OFF_RELAY);
  subscribePinToChange(RELAY_SLAVE, SLAVE_RELAY_STATUS, "ON",TURN_ON_RELAY, TURN_OFF_RELAY);
}

void subscribePinToChange(int pin, String field, String status, int trueValue, int falseValue) {
  if(Firebase.getString(firebaseData, field)) {
     Serial.println(firebaseData.stringData());
     digitalWrite(pin, firebaseData.stringData() == status ? trueValue : falseValue);
  } else {
    Serial.println(firebaseData.errorReason());
  }
}

void initFirebase(const String projId, const String dbSecret) {
  Firebase.begin(projId, dbSecret);
  Firebase.reconnectWiFi(true);
  Firebase.setMaxRetry(firebaseData, 3);
  Firebase.setMaxErrorQueue(firebaseData, 30);
}

void connectToWiFi(const char* ssid, const char* pwd) {
  WiFi.begin(ssid, pwd);

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
