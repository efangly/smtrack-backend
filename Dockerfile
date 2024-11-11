FROM --platform=linux/amd64 node:22-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install 

RUN npx prisma generate

RUN npm run build

RUN rm -fR ./src tsconfig.json

RUN mkdir /usr/src/app/public

VOLUME /usr/src/app/public

ENV TZ=Asia/Bangkok

EXPOSE 8080

CMD ["node", "./dist/app.js"]
