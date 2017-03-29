import os
import glob
import time
import RPi.GPIO as GPIO

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')
base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'
def read_temp_raw():
	f = open(device_file, 'r')
	lines = f.readlines()
	f.close()
	return lines
def read_temp():
	lines = read_temp_raw()
	while lines[0].strip()[-3:] != 'YES':
		time.sleep(0.2)
		lines = read_temp_raw()
	equals_pos = lines[1].find('t=')
	if equals_pos != -1:
		temp_string = lines[1][equals_pos+2:]
		temp_c = float(temp_string) / 1000.0
		temp_f = temp_c * 9.0 / 5.0 + 32.0
		return temp_c
GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.OUT) # RED LED
GPIO.setup(12, GPIO.OUT) # GREEN LED(BLUE)
while True:
	print(read_temp())
	if read_temp()>=24 and read_temp()<25:
		GPIO.output(12, GPIO.HIGH)
		GPIO.output(11, GPIO.LOW)
	elif read_temp()>=28 and read_temp()<29:
		GPIO.output(11, GPIO.HIGH)
		GPIO.output(12, GPIO.LOW)
	else:
		GPIO.output(11, GPIO.LOW)
		GPIO.output(12, GPIO.LOW)
	time.sleep(1)
