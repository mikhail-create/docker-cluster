from locust import HttpUser, task, between
import random

class QuickstartUser(HttpUser):
    @task(1)
    def nlp_analysis(self):
        self.client.get(f"/nlp")