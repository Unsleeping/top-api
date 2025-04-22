FROM node:20-alpine

WORKDIR /opt/app

COPY package*.json ./
RUN npm install

# Copy application code while excluding node_modules (see .dockerignore)
COPY . .

RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

CMD ["node", "./dist/main.js"]