# билдим фронт
FROM node as build

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходники и билдим
COPY . .
RUN npm run build

# Финальный контейнер — только билд
FROM node
WORKDIR /app

# Копируем готовый билд
COPY --from=build /app/dist ./dist

# Открываем порт Vite (если нужен для dev) или просто placeholder
EXPOSE 5173

# Чтобы контейнер жил, пока Nginx отдаёт статику
CMD ["sleep", "infinity"]