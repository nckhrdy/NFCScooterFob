# NFC Scooter Key Fob

Authors: Marybel Boujaoude, Hassan Hijazi, Nicholas Hardy, Riya Deokar

Date: 2023-04-20

### Summary

NFC, near field communication, is a type of wireless communication protocol that operates within a short range of typically a few centimeters. We are using NFC for access control. For the purpose of an e-scooter key fob, an NFC chip could be embedded in the fob, which would communicate with the scooter's NFC reader to unlock it. This method of authentication is more secure than traditional methods such as using a physical key or a password, as the fob needs to be in close proximity to the scooter for it to work. This means that someone cannot simply copy the key fob's data and use it to unlock the scooter remotely. To prevent cloning of the key we will be implementing encryption and other security measures to protect the data stored on the key fob and the scooter's NFC reader. Using NFC for a secure key fob to unlock an e-scooter is a good way to improve security. 

We have designed an architecture that utilizes an NFC device, which is comprised of IR LEDs and IR receivers and hosted on an ESP. To solve the provisioning problem, we are using a Raspberry Pi (RPi) with a camera to decode a local QR code with the scooter ID (SID). The flow is initiated by a button press on the fob, which communicates to the scooter (and RPi) to start the process. The scooter then expects to receive a key from the Auth server. The RPi is triggered to decode the SID from the QR code and then send this along with its fob ID (FIB) to the Auth Server. The authentication server validates the FIB and SID pair and then creates a random key that is sent back to the fob and to the scooter via separate messages. Upon receiving the key, the fob indicates, via LED, that it is ready to communicate the key to the scooter. On button press, the FIB and key are sent to the scooter, which compares the keys sent via different paths. If they match, the scooter indicates success via LED.

### Self-Assessment 

| Objective Criterion | Rating | Max Value  | 
|---------------------------------------------|:-----------:|:---------:|
| Objective One | 1 |  1     | 
| Objective Two | 1 |  1     | 
| Objective Three | 1 |  1     | 
| Objective Four | 1 |  1     | 
| Objective Five | 1 |  1     | 
| Objective Six | 1 |  1     | 
| Objective Seven | 1 |  1     | 

### Solution Design

IR/TX
We created a secure key fob that utilizes near field communications (NFC) to unlock an e-scooter. These requirements include designing the fob to be the same as the transceiver in the IR TX/RX skill, with one device acting as a transmitter and the other as a receiver. Additionally, as we did in the first skill for this quest the code for each ESP32 device should be identical, except that one receives and the other transmits, and the code should be able to accept configuration data such as device ID, device type (scooter or fob), and IP address. The fob/scooter device should include R, G, B LEDs as indicators to help with user feedback.

Database
We have also implemented several security measures, including logging all transactions on the Auth Server, which includes FIB, SID, and timestamp information. The database can be accessed by fixed queries to show the last 10 entries of unlocking transaction data. Furthermore, we have provided a state machine to describe the behavior of the fob/scooter device, as well as shown out state machine drawings.


To approach this quest, we have been advised to follow a specific sequence. We have completed the IR-TX/RX skill, building fobs and bringing up the TX/RX code to demonstrate that it works. We have adapted the code to transmit the required data payload using IR. Additionally, we have set up UDP message passing on our local wireless network, ensuring that it works between entities in the data flow architecture.

We have also completed the Database Skill, setting up a database on our server for the logged data and being able to receive and save data from a client. We have then interconnected our node.js server to the DB and hosted queries for the unlocking transaction data on a web page. Finally, we have integrated the PI camera, PI node server, and the fobs into a single connected system. The rubric provides us with objective criteria to rate different components of our system, including the Fob Pi reading QR code on scooter and sending (WiFi) to Auth Server with SID, FID, the DB logging SID, FID, timestamp and sending (WiFi) key to fob and scooter, Fob sending (IR TX/RX) FID, key to scooter, Scooter comparing keys and indicating unlock or fail with LEDs, Web client accessing Auth Server to show logged data, and Auth Server being implemented on a separate Pi.

### Investigative Question 

How would you hack this system? Describe two ways, and how you would change the solution to combat the hack.

One way to potentially hack the system could be to intercept the messages being sent between the fob, the RPi, and the scooter. This could be done by using a device to capture and analyze the wireless communications. To combat this, the system could use encryption to secure the messages being transmitted.

Another way to potentially hack the system could be to clone a fob. This could allow an attacker to bypass the authentication process and gain access to the scooter. To combat this, the system could use a more secure method of validating the fob by having the fobID and the Key be one time codes that are generated randomly every time a flow starts. By making the keys randomly generate for each send this would mean that the fob and key could not be cloned as they key sent would be a stale value. 


### Sketches/Diagrams

<img width="1013" alt="Screen Shot 2023-04-21 at 5 26 27 PM" src="https://user-images.githubusercontent.com/47408944/233737248-e57c43f6-e787-4ec4-96a1-b9dd58a994c6.png">

<img width="569" alt="Screen Shot 2023-04-21 at 1 58 14 PM" src="https://user-images.githubusercontent.com/47408944/233703666-0de7d36f-2304-4e68-8250-3f12c54a250c.png">

<img width="958" alt="Screen Shot 2023-04-21 at 5 26 02 PM" src="https://user-images.githubusercontent.com/47408944/233737200-a85b6c09-60df-42e4-ac2d-0f6a35b3385e.png">

<img width="919" alt="Screen Shot 2023-04-21 at 5 53 15 PM" src="https://user-images.githubusercontent.com/47408944/233740334-5042d5d9-a3a1-49ab-ba86-1d31796a117a.png">

<img width="688" alt="Screen Shot 2023-04-21 at 5 53 53 PM" src="https://user-images.githubusercontent.com/47408944/233740399-c86042aa-0c10-4942-a4ec-5aa7e66ef1da.png">

<img width="1325" alt="Screen Shot 2023-04-21 at 12 34 25 PM" src="https://user-images.githubusercontent.com/47408944/233688773-ce4ff568-60c1-47a3-b56d-e845039cff52.png">

### Supporting Artifacts
- [Link to video technical presentation](https://drive.google.com/file/d/1wr9SW5AOvmGvePvcKLIu-ERTd6OCRgOA/view?usp=sharing). Not to exceed 120s
- [Link to video demo](https://drive.google.com/file/d/167HEl0m1cnsbCQHSr_LFSs0hiYsIl1-V/view?usp=sharing). Not to exceed 120s


### Modules, Tools, Source Used Including Attribution

HUZZAH32 ESP32 Feather Board, IR/TX, Raspberry Pi, IP Address and E1200 V2 Router and UDP, LED, ESC, Motion, Node.js, TingoDB


### References

IR/TX Design: https://github.com/BU-EC444/01-EBook/blob/main/docs/briefs/design-patterns/dp-irtxrx.md

IR/TX Code: https://github.com/BU-EC444/04-Code-Examples/tree/main/ir-txrx-example

TingoDB: http://www.tingodb.com/

Node.js and MongoDB Tutorial: https://www.w3schools.com/nodejs/nodejs_mongodb.asp

Txt File: https://github.com/BU-EC444/01-EBook/blob/main/docs/skills/docs/test-data/smoke.txt

State Model Code and Design: https://github.com/BU-EC444/01-EBook/blob/main/docs/briefs/design-patterns/dp-state-machine.md
