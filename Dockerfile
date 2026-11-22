FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY index.html vite.config.js ./
COPY src ./src
COPY server ./server
COPY db ./db

RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/index.js"]
