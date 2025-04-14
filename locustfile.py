from locust import HttpUser, task, between
import random

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    @task(3)
    def count_chars(self):
        chars = ['a', 'e', 'i', 'o', 'u', 't', 's', 'n', 'r', 'd']
        char = random.choice(chars)
        self.client.get(f"/count?char={char}")

    @task(2)
    def get_info(self):
        self.client.get("/info")

    @task(1)
    def nlp_analysis(self):
        # Sample texts with different sentiments
        texts = [
            "I absolutely love this product! It's amazing and works perfectly!",
            "This is a terrible experience, I'm very disappointed with the service.",
            "The product is okay, it does what it's supposed to do.",
            "I'm not sure how I feel about this, it's neither good nor bad.",
            "This is the best thing that ever happened to me! Fantastic!"
        ]
        text = random.choice(texts)
        self.client.get(f"/nlp?text={text}")

    def on_start(self):
        self.client.get("/info") 