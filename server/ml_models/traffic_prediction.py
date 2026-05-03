import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import joblib
import os

class TrafficPredictor:
    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False

    def generate_dummy_data(self):
        """
        Generates dummy traffic data.
        Features: Hour of day, Day of week, Current congestion (0-1)
        Target: Congestion in 30 mins
        """
        n_samples = 1000
        hours = np.random.randint(0, 24, n_samples)
        days = np.random.randint(0, 7, n_samples)
        current_congestion = np.random.rand(n_samples)
        
        # Simple relationship: peak hours (8-10, 17-19) increase future congestion
        future_congestion = current_congestion + 0.2 * ((hours >= 8) & (hours <= 10) | (hours >= 17) & (hours <= 19))
        future_congestion = np.clip(future_congestion + np.random.normal(0, 0.05, n_samples), 0, 1)
        
        df = pd.DataFrame({
            'hour': hours,
            'day': days,
            'current_congestion': current_congestion,
            'future_congestion': future_congestion
        })
        return df

    def train(self):
        df = self.generate_dummy_data()
        X = df[['hour', 'day', 'current_congestion']]
        y = df['future_congestion']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        self.model.fit(X_train, y_train)
        self.is_trained = True
        return self.model.score(X_test, y_test)

    def predict(self, hour, day, current_congestion):
        if not self.is_trained:
            self.train()
        features = np.array([[hour, day, current_congestion]])
        return self.model.predict(features)[0]

traffic_predictor = TrafficPredictor()
