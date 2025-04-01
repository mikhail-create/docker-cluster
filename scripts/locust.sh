#!/bin/bash
locust -f ../locust/locustfile.py --headless --users 1000 --spawn-rate 60 --run-time 1m --host http://localhost:8080