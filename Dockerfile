# Base image
FROM node:latest

# Tạo thư mục app
WORKDIR /app

# Copy package.json & install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start
CMD ["node", "index.js"]
