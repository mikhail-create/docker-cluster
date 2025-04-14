#!/bin/bash
locust -f locust/locustfile.py --headless --users 1000 --spawn-rate 0.1 --run-time 3m --host http://localhost:8080