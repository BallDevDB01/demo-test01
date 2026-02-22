# backend/Dockerfile

FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend ./
RUN npm run build

# ✅ copy static web เข้าไป
COPY web ./web

EXPOSE 3001
CMD ["node", "dist/index.js"]