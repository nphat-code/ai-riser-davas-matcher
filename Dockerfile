# Sử dụng node image bản nhẹ
FROM node:20-alpine

# Thư mục làm việc
WORKDIR /app

# Copy các file cấu hình và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng Vite và API Server ra thư mục dist
RUN npm run build

# Thiết lập biến môi trường PORT cho Cloud Run
ENV PORT=8080
EXPOSE 8080

# Chạy backend server (chứa cả web tĩnh và API)
CMD ["npm", "start"]
