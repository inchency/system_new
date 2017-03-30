import random
import time
import RPi.GPIO as GPIO

pin=[3,5,8,11,13,15,19,21,23,10]

GPIO.setmode(GPIO.BOARD)
for i in range(0, 10):
	GPIO.setup(pin[i], GPIO.OUT)
	GPIO.output(pin[i], GPIO.LOW)
GPIO.setup(26, GPIO.IN)
flag = 0
print("If turn on third LED, you click button")
while True:
	a=random.randint(0,9)
	GPIO.output(pin[a],GPIO.HIGH)
	time.sleep(0.5)
	if a==2 and GPIO.input(26)==0:
		print("You are Win!!")
		break
	elif a!=2 and GPIO.input(26)==0:
		print("Not turn on third LED!! Wrong!!")
	GPIO.output(pin[a],GPIO.LOW)
	time.sleep(1)
for i in range(0,10):
	GPIO.output(pin[i], GPIO.LOW)

GPIO.cleanup()


