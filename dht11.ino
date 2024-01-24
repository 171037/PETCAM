#include <Wire.h>
#include "PCA9685.h"
#include "DHT.h"

#define DHTPIN A0
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
PCA9685 driver;
PCA9685_ServoEval pwmServo(102, 470); // (-90deg, +90deg)

String cmd;
unsigned long lastMsg = 0;
int currentAngle = 0;
int targetAngle = 0;
int step = 5; // Step size for smooth movement

void tempPrint(long h, long t) {
  Serial.print(F("Humi: "));
  Serial.print(h);
  Serial.print(F("%  Temp: "));
  Serial.print(t);
  Serial.println(F("°C "));
}

void moveServoToTarget() {
  if (currentAngle < targetAngle) {
    currentAngle += step;
  } else if (currentAngle > targetAngle) {
    currentAngle -= step;
  }
  driver.setChannelPWM(0, pwmServo.pwmForAngle(currentAngle));
}

void setup() {
  Wire.begin();
  Wire.setClock(400000);
  driver.resetDevices();
  driver.init();
  driver.setPWMFrequency(50);

  Serial.begin(9600);
  dht.begin();
}

void loop() {
  unsigned long now = millis();

  if (now - lastMsg > 60 * 1000) {
    lastMsg = now;
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    tempPrint(h, t);
  }

  if (Serial.available()) {
    cmd = Serial.readStringUntil('\n');
    if (cmd.charAt(0) == 'R') {
      targetAngle -= 5; // Adjust the target angle accordingly
    } else if (cmd.charAt(0) == 'L') {
      targetAngle += 5; // Adjust the target angle accordingly
    }
  }

  moveServoToTarget();
  delay(20); // Adjust the delay for smoother movement
}