import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

GPIO.setup(26, GPIO.IN)

while True:
	if GPIO.input(26)==0:
		print("press")
	else:
		print("unpress")
	time.sleep(1)
