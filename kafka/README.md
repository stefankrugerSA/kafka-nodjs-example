#### DOCKER file for local kafka developement

This uses kafka version 2.1.0

[Apcahe KAFKA](https://kafka.apache.org/downloads)


- ###### Build Script (Docker image locally)
   ```bash
   docker build -t kafka:latest .
   ```

- ###### Run Docker container
    ```bash
    docker run -p 9092:9092 -p 2181:2181 kafka:latest
    ```
