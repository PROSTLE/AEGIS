#define MOTION_PIN    2
#define TRIG_PIN      3
#define ECHO_PIN      4
#define VIBRATION_PIN 6
#define SOIL_PIN      A0

void setup() {
  Serial.begin(9600);
  pinMode(MOTION_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(VIBRATION_PIN, INPUT);
  Serial.println("All sensors ready!");
  Serial.println("-------------------------");
}

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  Serial.print("Motion: ");
  Serial.println(digitalRead(MOTION_PIN) == HIGH ? "DETECTED" : "None");

  Serial.print("Distance: ");
  Serial.print(getDistance());
  Serial.println(" cm");

  Serial.print("Vibration: ");
  Serial.println(digitalRead(VIBRATION_PIN) == HIGH ? "VIBRATING" : "Stable");

  int soil = analogRead(SOIL_PIN);
  Serial.print("Soil: ");
  Serial.print(soil);
  if (soil < 300) Serial.println(" → WET");
  else if (soil < 700) Serial.println(" → MEDIUM");
  else Serial.println(" → DRY");

  Serial.println("-------------------------");
  delay(2000);
}
