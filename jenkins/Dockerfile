FROM jenkins/jenkins:lts-jdk17

USER root

# Node.js is baked into the image so Jenkins can run npm/npx build steps
# directly, without the extra complexity of Docker-in-Docker build agents.
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

USER jenkins
