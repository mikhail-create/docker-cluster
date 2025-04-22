from locust import HttpUser, task, between
import random

class QuickstartUser(HttpUser):
    def on_start(self):
        self.ip = f"192.168.{random.randint(0, 255)}.{random.randint(0, 255)}"

    @task(1)
    def nlp_analysis(self):
        headers = {"X-Forwarded-For": self.ip}
        self.client.get("/nlp", headers=headers)