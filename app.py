import cv2
import numpy as np
import serial
import serial.tools.list_ports
import threading
import time

from flask import Flask, Response, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/video_feed/*": {"origins": "*"}})
CORS(app)

my_serial = None

is_auto_mode = True

sensor_value = ""


def serial_read_thread():
    global sensor_value
    while True:
        read_data = my_serial.readline()
        if read_data :
            serial_receive_data = read_data.decode()
            print("serial_receive_data :", serial_receive_data)
            sensor_value = serial_receive_data

def generate():
    global is_auto_mode
    if cap.isOpened() :
        # delay = int(1000 / cap.get(cv2.CAP_PROP_FPS)) 
        while True:
            ret, frame = cap.read()  
            # frame = imutils.resize(frame, width=400)
            if ret :
                height, width, _ = frame.shape
                # Detecting objects
                blob = cv2.dnn.blobFromImage(frame, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
                net.setInput(blob)
                outs = net.forward(output_layers)
                # 정보를 화면에 표시
                class_ids = []
                confidences = []
                boxes = []
                for out in outs:
                    for detection in out:
                        scores = detection[5:]
                        class_id = np.argmax(scores)
                        confidence = scores[class_id]
                        if confidence > 0.7 :
                            if class_id in [cat_index, dog_index] :
                                # Object detected
                                center_x = int(detection[0] * width)
                                center_y = int(detection[1] * height)
                                w = int(detection[2] * width)
                                h = int(detection[3] * height)
                                # 좌표
                                x = int(center_x - w / 2)
                                y = int(center_y - h / 2)
                                boxes.append([x, y, w, h])
                                confidences.append(float(confidence))
                                class_ids.append(class_id)
                                break # 1회 검출 성공 시 검출 작업 종료
                    break # 1회 검출 성공 시 검출 작업 종료
                
                indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.7, 0.4)
                
                font = cv2.FONT_HERSHEY_PLAIN
                # for i in range(len(boxes)):
                    # if i in indexes:
                if len(boxes) > 0 :
                    x, y, w, h = boxes[0]
                    # label = str(classes[class_ids[i]])
                    label = "cat" if class_ids[0] == cat_index else "dog"
                    color = (255, 0, 0) if label == "cat" else (0, 0, 255)
                    # cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                    # cv2.putText(frame, label, (x, y + 30), font, 3, color, 3)
                    image_center_x = 320
                    image_center_min = 270
                    image_center_max = 370

                    if center_x < image_center_min:
                        image_msg = "Pet is on left"
                        serial_msg = "L\n"
                    elif center_x > image_center_max :
                        image_msg = "Pet is on right"
                        serial_msg = "R\n"
                    else:
                        image_msg = "Pet is on center"
                        serial_msg = "C\n"
                    
                    if is_auto_mode :
                        my_serial.write( serial_msg.encode() )
                        
                    # cv2.putText(frame, image_msg, (10, 30), font, 2, color, 2)
                _, buffer = cv2.imencode('.jpg', frame) 
                frame = buffer.tobytes()  
                yield (b'--frame\r\n'
                        b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/servo_control')
def servo_control():
    if not is_auto_mode :
        query = request.query_string.decode()
        serial_msg = query.split("=")[1] + "\n"
        print("serial_msg :", serial_msg)
        my_serial.write( serial_msg.encode() )
        return Response("Servo can get command")
    
    return Response("Servo cannot get command now!")

@app.route('/toggle_auto')
def toggle_auto():
    global is_auto_mode
    is_auto_mode = not is_auto_mode
    if not is_auto_mode :
        return Response("Servo can get command")
    else :
        return Response("Servo cannot get command now!")

@app.route('/get_sensor_value')
def get_sensor_value():
    global sensor_value
    return Response(sensor_value)

if __name__ == "__main__":
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        if 'Arduino Uno' in p.description:
            print(f"{p} 포트에 연결하였습니다.")
            my_serial = serial.Serial(p.device, baudrate=9600, timeout=1.0)
            time.sleep(2.0)

    cat_index = 15
    dog_index = 16

    #Load YOLO
    net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")
    classes = []

    with open("sample.names", "r") as f:
        classes = [line.strip() for line in f.readlines()]
        
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

    # 이미지 가져오기
    cap = cv2.VideoCapture(0)

    t1 = threading.Thread(target=serial_read_thread)
    t1.daemon = True
    t1.start()

    app.run(host="0.0.0.0", port="8001", debug=False)
    
    cap.release()

