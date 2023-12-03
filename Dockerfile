FROM node:20.10.0-bookworm-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . ./
CMD ["npm", "start"]
