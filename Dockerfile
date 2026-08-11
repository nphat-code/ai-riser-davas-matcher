# Sử dụng node image bản nhẹ
FROM node:20-alpine as build
WORKDIR /app

# Copy các file cấu hình và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng Vite ra HTML tĩnh (thư mục dist)
RUN npm run build

# Giai đoạn 2: Phục vụ Web bằng Nginx siêu nhẹ
FROM nginx:alpine
# Copy file đã build từ Giai đoạn 1 sang Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Cấu hình để React Router hoạt động bình thường trên Nginx
RUN echo "server { listen 8080; location / { root /usr/share/nginx/html; index index.html index.htm; try_files \$uri \$uri/ /index.html =404; } }" > /etc/nginx/conf.d/default.conf

# Port bắt buộc của Cloud Run
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
