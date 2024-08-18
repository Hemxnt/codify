FROM ubuntu

# Install basic utilities and dependencies
RUN apt-get update && \
    apt-get install -y \
    curl \
    build-essential \
    python3

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY index.js index.js
COPY user/ user/

ENTRYPOINT [ "node", "index.js" ]