// Motor pins - Left side (L298N #1)
int IN1 = 5;
int IN2 = 6;
int IN3 = 7;
int IN4 = 8;

// Motor pins - Right side (L298N #2)
int IN5 = 9;
int IN6 = 10;
int IN7 = 11;
int IN8 = 12;

void setup() {
  Serial.begin(9600);  // Start serial communication with laptop
  
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  pinMode(IN5, OUTPUT);
  pinMode(IN6, OUTPUT);
  pinMode(IN7, OUTPUT);
  pinMode(IN8, OUTPUT);

  Serial.println("Car Ready!");
  Serial.println("W = Forward | S = Backward | D = Stop");
}

void moveForward() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH);
  digitalWrite(IN4, LOW);
  digitalWrite(IN5, HIGH);
  digitalWrite(IN6, LOW);
  digitalWrite(IN7, HIGH);
  digitalWrite(IN8, LOW);
  Serial.println("Moving Forward...");
}

void moveBackward() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
  digitalWrite(IN5, LOW);
  digitalWrite(IN6, HIGH);
  digitalWrite(IN7, LOW);
  digitalWrite(IN8, HIGH);
  Serial.println("Moving Backward...");
}

void stopMotors() {
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
  digitalWrite(IN5, LOW);
  digitalWrite(IN6, LOW);
  digitalWrite(IN7, LOW);
  digitalWrite(IN8, LOW);
  Serial.println("Stopped.");
}

void loop() {
  if (Serial.available() > 0) {       // Check if laptop sent a key
    char key = Serial.read();         // Read the key pressed

    if (key == 'w' || key == 'W') {
      moveForward();
    } 
    else if (key == 's' || key == 'S') {
      moveBackward();
    } 
    else if (key == 'd' || key == 'D') {
      stopMotors();
    }
  }
}
