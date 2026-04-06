import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

# 1. Dataset Generation
# We create a labelled dataset matching the categories
data = {
    'text': [
        "I am a farmer looking for help",
        "How can I get seeds for farming",
        "agriculture scheme for kisan",
        "need money for crops as a farmer",
        "I farm on a small piece of land",
        "நான் விவசாயி",
        "விவசாயம் செய்ய உதவி தேவை",
        "விவசாயிகளுக்கு என்ன திட்டம் உள்ளது",
        "நான் ஒரு விவசாயி எனக்கு பணம் தேவை",
        "Naan oru vivasayi",
        "Vivasayam seiyya udhavi thevai",
        
        "I need a scholarship for my education",
        "I am a student wanting to study in college",
        "funds for school students",
        "education grant for higher studies",
        "university student scholarship scheme",
        "நான் ஒரு மாணவன்",
        "எனக்கு கல்வி உதவித்தொகை தேவை",
        "பள்ளி மாணவர்களுக்கு என்ன திட்டம் உள்ளது",
        "கல்லூரி படிப்புக்கு பணம்",
        "Manavan",
        "Manavi",
        "Manavi Enakku Pannan Thevai",
        "Kalvi udhavi thogai",
        "நான் ஒரு மாணவி போன்று எனக்கு படிப்பதற்கு தொகை வேண்டும்",
        "நான் ஒரு மாணவி",
        "படிப்பதற்கு தொகை வேண்டும்",
        
        "I am pregnant and need nutritional support",
        "maternity benefits for expecting mothers",
        "scheme for pregnant women hospital delivery",
        "health support for pregnancy",
        "pregnant mother hospital fund",
        "நான் கர்ப்பிணி",
        "கர்ப்பிணி பெண்களுக்கு என்ன உதவி உள்ளது",
        "மகப்பேறு உதவி நிதி",
        "கர்ப்பமாக இருக்கும் பெண்களுக்கு அரசு உதவி",
        "Naan garppini",
        "Karpini pengalukku udhavi"
    ],
    'category': [
        "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer",
        "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student", "Student",
        "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant", "Pregnant"
    ]
}

df = pd.DataFrame(data)

# 2. NLP Processing & Bag-of-Words
print("Step 1: Extracting features using CountVectorizer (Bag-of-Words)...")
vectorizer = CountVectorizer(lowercase=True, stop_words='english')
X = vectorizer.fit_transform(df['text'])
y = df['category']

# 3. Evaluation: Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Machine Learning Model: Multinomial Naive Bayes
print("Step 2: Training Multinomial Naive Bayes model...")
model = MultinomialNB()
model.fit(X_train, y_train)

# Calculate accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Step 3: Model Evaluation")
print(f"--> Accuracy on testing set: {accuracy * 100:.2f}%")

# Save the model and vectorizer
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
    
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)

print("Step 4: Model saved successfully to 'model.pkl' and 'vectorizer.pkl'!")
