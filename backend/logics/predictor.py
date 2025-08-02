import joblib
import os

# Path relative to this file
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "logreg_spam_model.joblib")

# Load model and vectorizer
vectorizer, model = joblib.load(model_path)
def predict(text):
    # Transform the text using the loaded vectorizer
    features = vectorizer.transform([text])
    
    # Predict class
    pred = model.predict(features)[0]
    
    # Get confidence
    prob = model.predict_proba(features)[0].max()
    
    label = 1 if pred == 1 else 0
    
    return label
