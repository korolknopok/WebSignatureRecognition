# Используем легковесный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json yarn.lock ./

# RUN npm install react-scripts@latest

RUN yarn upgrade react-scripts

# Устанавливаем зависимости (кэшируется, если файлы не изменены)
# RUN npm install --force

# Копируем весь проект в контейнер
COPY . .

# Сборка приложения
# RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

# Указываем порт
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
