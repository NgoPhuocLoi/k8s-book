FROM node:21-alpine

WORKDIR /app

COPY ./package.json ./

RUN npm i

COPY . .

ENV PGUSER: ${PGUSER}
ENV PGPASSWORD: ${PGPASSWORD}
ENV PGHOST: ${PGHOST}
ENV PGPORT: ${PGPORT}
ENV PGDATABASE: ${PGDATABASE}

EXPOSE 5000

CMD ["node", "index.js"]