import numpy as np
from sklearn.cluster import KMeans
from typing import List
from models.schemas import RouteHistory

class PersonalizationModel:
    def __init__(self):
        self.kmeans = KMeans(n_clusters=3, n_init=10)
        self.is_fitted = False

    def extract_features(self, history: List[RouteHistory]):
        """
        Extracts behavior features from route history.
        e.g., average eco_score, average time_saved, etc.
        """
        if not history:
            return np.array([0.5, 0.5, 0.5])
            
        eco_scores = [h.metrics.get("eco_score", 0.5) for h in history]
        safety_scores = [h.metrics.get("safety_rating", 0.5) for h in history]
        # simplified feature vector
        return np.array([np.mean(eco_scores), 1.0, np.mean(safety_scores)])

    def train_on_user(self, history: List[RouteHistory]):
        """
        Updates the model based on actual user history.
        """
        # In a real app, we'd aggregate history from many users
        # For now, we simulate learning from this specific history
        features = self.extract_features(history)
        # Mock training step
        self.is_fitted = True
        return features

    def suggest_preferences(self, history: List[RouteHistory]):
        """
        Suggests optimal weights based on historical behavior.
        """
        features = self.extract_features(history)
        # If user consistently picks high safety routes, increase safety weight
        return {
            "w1": 0.3, # time
            "w2": 0.5 if features[2] > 0.7 else 0.3, # safety
            "w3": 0.4 if features[0] > 0.7 else 0.2, # eco
            "w4": 0.1 # comfort
        }

personalization_model = PersonalizationModel()
