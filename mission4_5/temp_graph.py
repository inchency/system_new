import os
import glob
import time
import urllib.request

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
    return temp_c

while True:
  t = read_temp()
  req = urllib.request.Request("http://10.42.0.124:8080/temperature?temperature="+ str(t))
  f = urllib.request.urlopen(req).read()
  d = urllib.request.urlopen('http://api.thingspeak.com/update?api_key=UVVG8SHGQWN9E50G&field1='+ str(t))
  html = int(d.read())
  print(t)
  time.sleep(10)
