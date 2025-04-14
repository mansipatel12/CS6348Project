# CS6348Project
Data &amp; Apps Security Project

## Project Description
We are developing an extension that analyzes text and given URLs in messages on different platforms to detect and flag them as scams. We will be reviewing and assessing the text style, tone, and verbiage to determine the security of each message. We will also be checking the text in the URL to determine if the website could be malicious to the user if visited. After implementing the basic functionality, we would like to apply the extension to email, social media, and messaging platforms such as Instagram, Discord, LinkedIn, and Facebook.
Social engineering and phishing are common scams that occur on social media platforms and messaging sites. Each team member has experienced receiving fraudulent messages that relate to different vulnerabilities, including job openings, unpaid bills, package shipments, and more. The project is expected to be user-friendly and easily integrable in each application, so that users can protect themselves from these scams in every aspect of the Internet. We would like to test the functionality of our project with email, texts, and direct messages on social media.

## Group Members
Mansi Patel, Chelsea Heredia, Harshitha Devina Anto, Hemal Pathak, Nevin Gilday, Tithi Jana, Chinmayi Ramakrishna, Sahrudayi Caroline Parampogu

## Dataset Sources
https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset
https://www.kaggle.com/code/shadymohammed205/nlp-meets-sms-distilbert-for-spam-detection/input

The datasets were modified by our team to include URLs in spam messages.

## How to run code
1. Clone project into local folder
    - In the terminal or command line on your computer, use command ```cd "/file/path"``` to navigate to folder of choice to clone project.
    - Click on the green dropdown button called "Code" and copy the repository URL
    - To clone, use command ```git clone [enter copied url here]```
2. Navigate into the client folder and install npm modules
    - Use command ```cd CS6348Project/client``` to enter folder
    - Use command ```npm install``` to install npm modules
3. Navigate into the server folder and install npm modules
   - Use command ```cd ..``` to leave client folder
   - Use command ```cd server``` to enter folder
   - Use command ```npm install``` to install npm modules
5. Run the code to start the server (back-end)
    - Use command ```node index.js``` to start server
6. Navigate into the client folder to start front-end
   - In same terminal:
       - Use command ```cd ..``` to leave server folder
       - Use command ```cd client``` to enter folder
   - In new terminal:
       -  Use command ```cd client``` to enter folder
   - Use command ```npm start``` to start localhost
