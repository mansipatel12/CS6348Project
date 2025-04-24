# CS6348Project

Data &amp; Applications Security Project

## Project Description

FraudFilter is a web application and broswer extension that analyzes text and given URLs in messages on different platforms to detect and flag them as scams. We will be reviewing and assessing the text style, tone, and verbiage to determine the security of each message. We will also be checking the text in the URL to determine if the website could be malicious to the user if visited. After implementing the basic functionality, we would like to apply the extension to email, social media, and messaging platforms such as Instagram, Discord, LinkedIn, and Facebook.
Social engineering and phishing are common scams that occur on social media platforms and messaging sites. Each team member has experienced receiving fraudulent messages that relate to different vulnerabilities, including job openings, unpaid bills, package shipments, and more. The project is expected to be user-friendly and easily integrable in each application, so that users can protect themselves from these scams in every aspect of the Internet. We would like to test the functionality of our project with email, texts, and direct messages on social media.

## Group Members

Mansi Patel, Chelsea Heredia, Harshitha Devina Anto, Hemal Pathak, Nevin Gilday, Tithi Jana, Chinmayi Ramakrishna, Sahrudayi Caroline Parampogu

## Dataset Sources

[SMS Spam Collection Dataset](https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset)

[NLP Meets SMS: DistilBERT for Spam Detection](https://www.kaggle.com/code/shadymohammed205/nlp-meets-sms-distilbert-for-spam-detection/input)

The Kaggle datasets were modified by our team to include URLs in spam messages.

## FraudFilter Web Application - How to run code

1. Clone project into local folder
   - In the terminal or command line on your computer, use command `cd "/file/path"` to navigate to folder of choice to clone project.
   - Click on the green dropdown button called "Code" and copy the HTTPS repository URL
   - To clone, use command:
     ```bash
     git clone [enter copied url here]
     ```
2. Download Node.js to install npm modules - [Download Node.js](https://nodejs.org/en)

3. Navigate into the client folder and install npm modules
   - Use command `cd CS6348Project/client` to enter folder
   - Use command below to install npm modules:
     ```bash
     npm install
     ```
4. Navigate into the server folder and install npm modules
   - Use command `cd ..` to leave client folder
   - Use command `cd server` to enter folder
   - Use command below to install npm modules:
     ```bash
     npm install
     ```
5. In the `server` folder, install Flask dependencies to run back-end server

   - Make sure you have Python installed already
     - View this link to download Python if not already installed: [Download Python](https://www.python.org/downloads/)
   - Create a virtual environment
     - macOS/Linux:
       ```bash
       python3 -m venv .venv
       ```
     - Windows:
       ```bash
       py -3 -m venv .venv
       ```
   - Activate the virtual environment
     - macOS/Linux:
       ```bash
       . .venv/bin/activate
       ```
     - Windows:
       ```bash
       .venv\Scripts\activate
       ```
   - Install Install the required Python dependencies:

     ```bash
     pip install -r requirements.txt
     ```

6. In the `server` folder, create a new file called `.env`

   - Open the `.env` file
   - Type this in the file:
     ```bash
     IPQS_API_KEY=
     ```

7. The application utilizes the IP Quality Score API, so you will generate an API key to use this service.

   - Visit IPQS and create a free account: [IPQS](https://www.ipqualityscore.com/create-account)
   - Once your account is created and you're logged in, navigate to the `Settings & Account Management` dropdown in the left side menu.
   - Within the dropdown, click on `API Keys`
   - Here you will find your API key, copy the key, and paste it after the `=` in your `.env` file
   - Make sure to save your file
     ```bash
     IPQS_API_KEY=<Your IP Quality Score API Key>
     ```

8. Run the code to start the back-end server

   - Within the terminal in the `server` folder, make sure your virtual environment is running

   - Use command below to start Flask server
     ```bash
     python flask_api.py
     ```

9. Navigate into the client folder to start front-end
   - If using the same terminal:
     - Use command `cd ..` to leave server folder
     - Use command `cd client` to enter folder
   - If using a a new terminal:
     - Use command `cd client` to enter folder
   - Use command below to start localhost
     ```bash
     npm start
     ```
10. The web application will open in your broswer!

## FraudFilter Chrome Extension - How to run code

FraudFilter can also be used as a Chrome extension that helps detect spam messages and evaluate the safety of URLs using machine learning and external APIs.

### Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (required for the React client).
2. **Python**: Install [Python](https://www.python.org/) (required for the Flask server).
3. **Google Chrome**: Ensure you have Google Chrome installed.

### Setup Instructions

Steps 1-3 can be skipped if the web application setup is complete.

#### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <repository-url>
cd CS6348Project
```

#### 2. Set Up the Flask API

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install the required Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the `server` directory and add your API keys:

   ```bash
   IPQS_API_KEY=<Your IP Quality Score API Key>
   ```

4. Start the Flask server:

   ```bash
   python flask_api.py
   ```

   The Flask server will run on `http://127.0.0.1:5000`.

#### 3. Set Up the React Client

1. Navigate to the `client` directory:

   ```bash
   cd ../client
   ```

2. Install the required Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   The React client will run on `http://localhost:3000`.

#### 4. Set Up the Chrome Extension

1. Navigate to the `chrome-extension` directory:

   ```bash
   cd ../chrome-extension
   ```

2. Open Google Chrome and go to `chrome://extensions/`.

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **Load unpacked** and select the `chrome-extension` directory.

5. The FraudFilter extension will now be available in your browser.

#### 5. Test the Extension

1. Open any webpage in Google Chrome.
2. Click on the FraudFilter extension icon in the toolbar.
3. Use the dropdown to select a link or enter a link/message in the input box.
4. Click the **Test** button to evaluate the link/message.

---

## Summary of Components

1. **Flask API**: Handles requests for spam detection and URL safety evaluation.
2. **React Client**: Provides a user interface for testing links/messages.
3. **Chrome Extension**: Allows users to test links/messages directly from their browser.

---

## Troubleshooting

- Ensure the Flask server is running on `http://127.0.0.1:5000`.
- Ensure the React client is running on `http://localhost:3000`.
- Check the browser console for any errors related to the extension.
