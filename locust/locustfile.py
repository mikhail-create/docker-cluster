from locust import HttpUser, task, between
import random

class CountUser(HttpUser):
    wait_time = between(0.5, 2.0)
    chars = ['a', 'b', 'c', 'd', 'e']

    @task
    def count_chars(self):
        char = random.choice(self.chars)
        self.client.get(f"/count?char={char}", name="/count")