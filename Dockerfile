FROM node:18-bullseye

# Instalar dependências do sistema para o Chrome
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libnspr4 \
  libnss3 \
  libxss1 \
  lsb-release \
  xdg-utils \
  libgbm-dev \
  && rm -rf /var/lib/apt/lists/*

# Instalar o Chrome
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install

WORKDIR /app
COPY . .

RUN npm install

CMD ["node", "index.js"]
