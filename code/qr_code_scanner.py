GNU nano 5.4                                                                                                                          qr_code_scanner.py                                                                                                                                    
import io
import time
from picamera import PiCamera
from PIL import Image
from zbarlight import scan_codes
import socket

# Initialize the camera
camera = PiCamera()

# Set camera resolution
camera.resolution = (640, 480)

# Set camera framerate
camera.framerate = 30

# Create a stream to capture video frames
stream = io.BytesIO()

# Start video preview
camera.start_preview()

# Create a UDP socket for sending QR code data
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind(("192.168.1.25",8081))
# Loop to continuously capture and process video frames
while True:

    # Capture an image from the camera and store it in the stream
    camera.capture(stream, format='jpeg', use_video_port=True)

    # Convert the image to grayscale

    stream.seek(0)
    image = Image.open(stream)
    gray_image = image.convert('L')

    # Scan for QR codes in the image
    codes = scan_codes('qrcode', gray_image)

    # Check if QR codes are found
    if codes is not None:
        qr_code_data = codes[0].decode('utf-8')
        print('QR code scanned:', qr_code_data)

        # Encode the QR code data as bytes
        data = qr_code_data.encode('utf-8')

        # Send the data over UDP to the specified IP address and port number
        sock.sendto(data, ('192.168.1.24', 8081))

        # Print a message indicating that the data was sent over UDP
        print('QR code data sent over UDP to 127.0.0.1:8081')

    else:
        print('No QR code detected.')

    # Reset the stream for the next capture
    stream.seek(0)
    stream.truncate()

    # Sleep for a short duration to control frame rate
    time.sleep(0.1)

# Clean up
camera.stop_preview()
camera.close()
sock.close()
