# CS6348Project

Data &amp; Applications Security Project

## Project Description

We are developing an extension that analyzes text and given URLs in messages on different platforms to detect and flag them as scams. We will be reviewing and assessing the text style, tone, and verbiage to determine the security of each message. We will also be checking the text in the URL to determine if the website could be malicious to the user if visited. After implementing the basic functionality, we would like to apply the extension to email, social media, and messaging platforms such as Instagram, Discord, LinkedIn, and Facebook.
Social engineering and phishing are common scams that occur on social media platforms and messaging sites. Each team member has experienced receiving fraudulent messages that relate to different vulnerabilities, including job openings, unpaid bills, package shipments, and more. The project is expected to be user-friendly and easily integrable in each application, so that users can protect themselves from these scams in every aspect of the Internet. We would like to test the functionality of our project with email, texts, and direct messages on social media.

## Group Members

Mansi Patel, Chelsea Heredia, Harshitha Devina Anto, Hemal Pathak, Nevin Gilday, Tithi Jana, Chinmayi Ramakrishna, Sahrudayi Caroline Parampogu

## Dataset Sources

[SMS Spam Collection Dataset](https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset)

[NLP Meets SMS: DistilBERT for Spam Detection](https://www.kaggle.com/code/shadymohammed205/nlp-meets-sms-distilbert-for-spam-detection/input)

The Kaggle datasets were modified by our team to include URLs in spam messages.

## How to run code

1. Clone project into local folder
   - In the terminal or command line on your computer, use command `cd "/file/path"` to navigate to folder of choice to clone project.
   - Click on the green dropdown button called "Code" and copy the HTTPS repository URL
   - To clone, use command `git clone [enter copied url here]`
2. Download Node.js to install npm modules - [Download Node.js](https://nodejs.org/en)

3. Navigate into the client folder and install npm modules
   - Use command `cd CS6348Project/client` to enter folder
   - Use command `npm install` to install npm modules
4. Navigate into the server folder and install npm modules
   - Use command `cd ..` to leave client folder
   - Use command `cd server` to enter folder
   - Use command `npm install` to install npm modules
5. In the `server` folder, install Flask dependencies to run back-end server

   - Make sure you have Python installed already
     - View this link to download Python if not already installed: [Download Python](https://www.python.org/downloads/)
   - Create a virtual environment
     - macOS/Linux: `python3 -m venv .venv`
     - Windows: `py -3 -m venv .venv`
   - Activate the virtual environment
     - macOS/Linux: `. .venv/bin/activate`
     - Windows: `.venv\Scripts\activate`
   - Install Flask
     - Use command `pip install Flask`

6. In the `server` folder, create a new file called `.env`

   - Open the `.env` file
   - Type this in the file: `IPQS_API_KEY=`

7. The application utilizes the IP Quality Score API, so you will generate an API key to use this service.

   - Visit IPQS and create a free account: [IPQS](https://www.ipqualityscore.com/create-account)
   - Once your account is created and you're logged in, navigate to the `Settings & Account Management` dropdown in the left side menu.
   - Within the dropdown, click on `API Keys`
   - Here you will find your API key, copy the key, and paste it after the `=` in your `.env` file
   - Make sure to save your file

8. Run the code to start the back-end server
   - Within the terminal in the `server` folder, make sure your virtual environment is running
   - Use command `python flask_api.py` to start Flask server
9. Navigate into the client folder to start front-end
   - If using the same terminal:
     - Use command `cd ..` to leave server folder
     - Use command `cd client` to enter folder
   - If using a a new terminal:
     - Use command `cd client` to enter folder
   - Use command `npm start` to start localhost
10. The web application will open in your broswer!
