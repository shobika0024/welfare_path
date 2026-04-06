from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os
import subprocess

app = Flask(__name__)
CORS(app)

# Map predicted category to government schemes
SCHEME_MAP = {
    "Farmer": "PM-Kisan Scheme",
    "Student": "Scholarship Scheme",
    "Pregnant": "Maternity Benefit Scheme"
}

# Auto-train if model doesn't exist
if not os.path.exists('model.pkl'):
    print("Training ML model...")
    import train_core

try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_text = data.get('text', '')
    
    if not user_text:
        return jsonify({"error": "No text provided"}), 400
        
    # Transform text to vector
    user_vector = vectorizer.transform([user_text])
    
    # Predict category using Multinomial Naive Bayes
    prediction = model.predict(user_vector)[0]
    
    # Map to scheme
    scheme = SCHEME_MAP.get(prediction, "Please provide more details.")
    
    return jsonify({
        "category": prediction,
        "scheme": scheme,
        "query": user_text
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
