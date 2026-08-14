# Stage 1 — build the app
FROM dhi.io/node:26-dev AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

# Install vite explicitly if not already in package.json
RUN npm list vite > /dev/null 2>&1 || npm install --no-save vite@5.4.11

COPY . .

RUN npm run build
RUN npm prune --omit=dev --legacy-peer-deps

RUN npm prune --omit=dev --legacy-peer-deps && \
    npm install --no-save --legacy-peer-deps "vite@$(node -p "require('./package.json').devDependencies.vite")"
# Stage 2 — distroless runtime (minimal, secure) 
# Stage 2 — distroless runtime (minimal, secure)
FROM dhi.io/node:26

WORKDIR /app

# Copy built files from builder
COPY --from=build /app/dist ./dist

# Copy all node_modules from builder (includes vite)
COPY --from=build /app/node_modules ./node_modules

# vite.config.js already has the correct preview.proxy target — no
# separate vite.preview.config.js needed; that file was silently
# overwriting this one and shipping a stale proxy target.
COPY --from=build /app/vite.config.js ./vite.config.js

EXPOSE 4173

ENTRYPOINT ["node", "--no-warnings"]
CMD ["./node_modules/.bin/vite", "preview", "--host", "0.0.0.0", "--port", "4173"]