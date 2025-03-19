import pandas as pd
import numpy as np
import torch
import evaluate
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, ConfusionMatrixDisplay
from datasets import Dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    Trainer,
    TrainingArguments
)

# Read the file manually, treating it as raw text
with open("modified_spam.csv", "r", encoding="utf-8") as input_file:
    lines = input_file.readlines()

# Skip the header row
lines = lines[1:]

# Process each line by splitting at the first comma
dataset = []
for line in lines:
    # Split at the first comma only
    parts = line.strip().split(",", 1)  
    # Ensure valid split
    if len(parts) == 2:  
        dataset.append(parts)
    else:
        # Handle missing messages
        dataset.append([parts[0], ""])  

# Create a dataframe with the dataset; create two columns for label and message
dataframe = pd.DataFrame(dataset, columns=["label", "message"])
# Map ham = 0 and spam = 1in the label
dataframe['label'] = dataframe['label'].map({'ham': 0, 'spam': 1})

# Drop rows that have NaN or inf as labels
 # Remove NaN values
dataframe = dataframe[~dataframe['label'].isna()] 
# Remove inf laebls
dataframe = dataframe[~dataframe['label'].apply(np.isinf)] 

dataframe['label'] = dataframe['label'].astype(int)

# Print first 20 rows
# print(dataframe.head(20))

# Printing certain row of dataframe
# print(dataframe.loc[427])

# Train-Test Split
train_texts, test_texts, train_labels, test_labels = train_test_split(
    dataframe['message'].tolist(),
    dataframe['label'].tolist(),
    test_size=0.2,
    random_state=42
)

train_dataset = Dataset.from_dict({'text': train_texts, 'label': train_labels})
test_dataset = Dataset.from_dict({'text': test_texts, 'label': test_labels})

# Tokenizer and Model Initialization
tokenizer = AutoTokenizer.from_pretrained('distilbert-base-uncased')
model = AutoModelForSequenceClassification.from_pretrained('distilbert-base-uncased', num_labels=2)

# Preprocessing to Tokenizer
def preprocess_function(examples):
    return tokenizer(examples['text'], truncation=True, padding=True)

train_dataset = train_dataset.map(preprocess_function, batched=True)
test_dataset = test_dataset.map(preprocess_function, batched=True)

# Define Training Argument
training_args = TrainingArguments(
    output_dir='./results',
    eval_strategy="epoch", 
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,  
    load_best_model_at_end=True,
    report_to="none", 
)

# Define evaluation metrics
metric = evaluate.load("accuracy")
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = logits.argmax(-1)
    return metric.compute(predictions=predictions, references=labels)

# Initialize the Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

# Train the Model
trainer.train()
eval_results = trainer.evaluate()

print(f"Accuracy: {eval_results['eval_accuracy'] * 100:.2f}%")

# Make predictions on test portion
predictions = trainer.predict(test_dataset)

preds = np.argmax(predictions.predictions, axis=1)  
labels = predictions.label_ids  

# Prints metrics
print(classification_report(labels, preds, target_names=['Ham', 'Spam']))

def predict_on_input(model, tokenizer, text):
    # Tokenize the new text
    inputs = tokenizer(text, truncation=True, padding=True, return_tensors="pt")
    
    # Get the model's prediction (logits)
    with torch.no_grad():  # Disable gradient calculation for inference
        outputs = model(**inputs)
    
    # Get predicted label (0 for Ham, 1 for Spam)
    logits = outputs.logits
    predicted_label = torch.argmax(logits, dim=-1).item()  # Get the predicted class index
    
    # Map label to class name (Ham or Spam)
    label_map = {0: 'Ham', 1: 'Spam'}
    return label_map[predicted_label]

new_message = "Congratulations! You've won a free gift card. Claim now!"

# Call the prediction function
prediction = predict_on_input(model, tokenizer, new_message)
print(f"The message is classified as: {prediction}")