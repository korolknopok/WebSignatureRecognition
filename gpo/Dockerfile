# Используем легковесный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости (кэшируется, если файлы не изменены)
RUN npm install --silent

# Копируем весь проект в контейнер
COPY . .

# Сборка приложения
RUN npm run build

# Указываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
