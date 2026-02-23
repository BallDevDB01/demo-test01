# --- build frontend ---
    FROM node:20-alpine AS fe_build
    WORKDIR /fe
    COPY frontend/package*.json ./
    RUN npm ci
    COPY frontend .
    RUN ./node_modules/.bin/ng build --configuration production --output-path /fe/dist
    
    # --- build backend ---
    FROM node:20-alpine AS be_build
    WORKDIR /app
    COPY backend/package*.json ./
    RUN npm ci
    COPY backend .
    RUN npm run build
    
    # --- runtime ---
    FROM node:20-alpine
    WORKDIR /app
    ENV NODE_ENV=production
    
    COPY backend/package*.json ./
    RUN npm ci --omit=dev
    
    COPY --from=be_build /app/dist ./dist
    
    # เอาไฟล์ FE ไปไว้ที่ /web ให้ตรงกับที่ backend หา
    COPY --from=fe_build /fe/dist /web
    
    EXPOSE 3001
    CMD ["node", "dist/index.js"]