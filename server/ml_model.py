import pandas as pd
import numpy as np
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import SMOTE
from urllib.parse import urlparse

# This class is to pre-process text from the model's training and testing data
class TextPreprocessor:
    @staticmethod
    def clean_text(text):
        # If no text is available
        if text is None:
            return ""
        # Convert the text to lowercase
        text = text.lower()  
        # Remove numbers
        text = re.sub(r'\b\d+\b', '', text)
        # Remove special characters except common URL chars
        text = re.sub(r'[^a-zA-Z0-9\s.:/-]', '', text)  
        # Normalize words that appear spam-like (characters look funny)
        text = re.sub(r'\b(fr33|freee|f.r.e.e)\b', 'free', text)  
         # Normalize obfuscated words 
        text = re.sub(r'\b(winn3r|winnerz)\b', 'winner', text) 
        
        # Find all the URLs present in the message
        urls = re.findall(r'http\S+|www\S+', text)
        for url in urls:
          # Get domain of the URL
          parsed_url = urlparse(url)
          # Convert the domain to lowercase
          domain = parsed_url.netloc.lower()
          # Return spam for the message if it contains any of the keywords
          if any(keyword in domain for keyword in ['spam', 'scam', 'fraud', 'fake', 'phishing']):
                return 'spam'  
  
        # If the URLs do not contain the keywords, extract the domain names
        text = re.sub(r'http\S+|www\S+', lambda domain_match: urlparse(domain_match.group(0)).netloc, text)  
        return text
    
# This function is to pre-process text when given new inputs from the user
def preprocess_input(text):
        # Convert to lowercase
        text = text.lower()  
        # Remove numbers
        text = re.sub(r'\b\d+\b', '', text)  
        # Remove special characters except common URL chars
        text = re.sub(r'[^a-zA-Z0-9\s.:/-]', '', text)  
        # Normalize spam-like words (characters look funny)
        text = re.sub(r'\b(fr33|freee|f.r.e.e)\b', 'free', text) 
        # Normalize obfuscated words 
        text = re.sub(r'\b(winn3r|winnerz)\b', 'winner', text)  
        
        # Find all the URLs present in the message
        urls = re.findall(r'http\S+|www\S+', text)
        for url in urls:
          # Get domain of the URL
          parsed_url = urlparse(url)
          # Convert the domain to lowercase
          domain = parsed_url.netloc.lower()
          # print(domain)
          # Return spam for the message if it contains any of the keywords
          if any(keyword in domain for keyword in ['spam', 'scam', 'fraud', 'fake', 'phishing']):
                return 'spam'  # Directly return spam if a URL contains 'spam' or 'scam'
        
        # If the URLs do not contain the keywords, extract the domain names
        text = re.sub(r'http\S+|www\S+', lambda match: urlparse(match.group(0)).netloc, text)  
        return text

# For each message, this function sets 1 in the column of spam_words if any of the words 'spam', 'scam', 'fraud', 'fake', 'phishing' 
# are present in the message, otherwise it sets 0
def add_features(dataframe):
    dataframe['spam_words'] = dataframe['Message'].apply(lambda x: 1 if any(keyword in x for keyword in ['spam', 'scam', 'fraud', 'fake', 'phishing']) else 0)
    return dataframe

# Load dataset
def load_data():
  # Read the file manually, treating it as raw text
  with open("modified_spam.csv", "r", encoding="utf-8") as input_file:
    lines = input_file.readlines()

  # Process each line by splitting at the first comma
  dataset = []
  for line in lines:
    # Split at the first comma only
    parts = line.strip().split(",", 1)
    # Ensure valid split
    if len(parts) == 2:
        label = parts[0]
        message = parts[1].rstrip(',')
        dataset.append([label, message])
    else:
        # Handle missing messages
        dataset.append([parts[0], ""])

  # Create a dataframe with the dataset; create two columns for label and message
  dataframe = pd.DataFrame(dataset, columns=["Label", "Message"])

  # Drop null columns
  dataframe = dataframe.dropna()

  # Remove rows where label is not "ham" or "spam"
  dataframe = dataframe[dataframe["Label"].str.lower().isin(["spam", "ham"])]

  # Clean the messages in the Message column
  dataframe["Message"] = dataframe["Message"].apply(TextPreprocessor.clean_text)

  return dataframe

# Train model
def train_model(df):
    # Add spam_words column based on messages in dataframe
    df = add_features(df)

    # Split data between training and testing
    X_train, X_test, y_train, y_test = train_test_split(df["Message"], df["Label"], test_size=0.2, random_state=42)

    # Align testing and training data
    y_train[X_train == 'spam'] = 'spam'
    y_test[X_test == 'spam'] = 'spam'

    # Apply tf-idf vectorization
    # N-gram range parameter sets the range of n-grams that are considered (unigrams & bigrams in this case)
    # Max features parameters allows us to keep just the top 7000 features across all the data
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english', max_features=7000)
    # Convert text to numerical data for SMOTE
    X_train_vec = vectorizer.fit_transform(X_train)  
    X_test_vec = vectorizer.transform(X_test)

    # Add the spam_words feature (as an extra column) to the training and testing vectors
    X_train_vec_with_spam = np.hstack([X_train_vec.toarray(), df.loc[X_train.index, 'spam_words'].values.reshape(-1, 1)])
    X_test_vec_with_spam = np.hstack([X_test_vec.toarray(), df.loc[X_test.index, 'spam_words'].values.reshape(-1, 1)])

    # Apply SMOTE AFTER vectorization
    # Random state parameter controls the randomness of the oversampling process
    # Sampling strategy allows the oversampler to sample the minority class (spam in our case)
    # until reaching 80% of majority class occurrences (not spam)
    smote = SMOTE(random_state=42, sampling_strategy=0.8)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train_vec, y_train)

    # Create Multinomial Naive Bayes classifer now that data is prepared
    # For better precision, lower the alpha (went from 0.1 to 0.05)
    model = MultinomialNB(alpha=0.05)  
    # Train the model
    model.fit(X_train_resampled, y_train_resampled)

    # Apply model to test data
    test_predictions = model.predict(X_test_vec)
    
    # Display evaluation metrics for test data
    print("Accuracy:", accuracy_score(y_test, test_predictions))
    print("Classification Report:\n", classification_report(y_test, test_predictions))

    # Keep vectorizer and model in a pipeline
    return make_pipeline(vectorizer, model)  

def predict_messages(model, messages):
  # Create a dictionary to store the classification result
  result = {}

  # Create an array for the messages that will be sent to the model for prediction
  model_messages = []

  # For each message, send it to preprocess_input function to clean and check
  # if it contains any of the keywords 'spam', 'scam', 'fraud', 'fake', 'phishing'
  for message in messages:
    cleaned_text = preprocess_input(message)
    if cleaned_text != "spam":
      # If the message did not contain the keyword, add it to the model_messages array
      model_messages.append(message)
    else:
      # If preprocess_input returns the word "spam" (meaning it contained one of the keywords),
      # add the message and the result
      result.update({"message": message, "prediction": cleaned_text})

  if (model_messages):
    # Now send the models that were not marked as spam to the model for prediction
    predictions = model.predict(model_messages)

    # Print the predictions from the model
    for message, label in zip(model_messages, predictions):
        if (label == "ham"):
          label = "not spam"
        result.update({"message": message, "prediction": label})
  
  return result



# Model Training and Predictions --------------------------------------------------------------------------
 
# Load the dataset and convert it into a usable dataframe
loaded_data = load_data()

# Create the model using the dataframe
model = train_model(loaded_data)

def classify_message(input_message):
  model_pred = predict_messages(model, input_message)
  return model_pred
