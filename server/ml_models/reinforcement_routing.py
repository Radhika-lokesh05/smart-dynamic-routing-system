import numpy as np
import random

class QRoutingAgent:
    def __init__(self, states_count=10, actions_count=4):
        self.q_table = np.zeros((states_count, actions_count))
        self.learning_rate = 0.1
        self.discount_factor = 0.9
        self.epsilon = 0.1

    def get_state(self, traffic_level, safety_score):
        """Discretize continuous inputs into state index."""
        # Simplified: traffic (0-1) and safety (0-1) mapped to 0-9 index
        return int((traffic_level * 0.7 + (1 - safety_score) * 0.3) * 9)

    def choose_action(self, state):
        if random.uniform(0, 1) < self.epsilon:
            return random.randint(0, self.q_table.shape[1] - 1)
        else:
            return np.argmax(self.q_table[state])

    def learn(self, state, action, reward, next_state):
        predict = self.q_table[state, action]
        target = reward + self.discount_factor * np.max(self.q_table[next_state])
        self.q_table[state, action] += self.learning_rate * (target - predict)

    def calculate_reward(self, time_taken, safety_level):
        """Reward: minimize time + maximize safety."""
        return -(time_taken) + (safety_level * 10)

    def train_dummy(self, episodes=100):
        for _ in range(episodes):
            state = random.randint(0, 9)
            action = self.choose_action(state)
            # Dummy transition
            reward = random.uniform(-10, 10)
            next_state = random.randint(0, 9)
            self.learn(state, action, reward, next_state)

    def get_best_route_index(self, traffic_level, safety_score):
        state = self.get_state(traffic_level, safety_score)
        return self.choose_action(state)

routing_agent = QRoutingAgent()
