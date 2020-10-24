FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN mkdir database
RUN touch database/schedule-document.json
RUN touch database/schedule-weeks.json
RUN echo "{}" > database/schedule-document.json
RUN echo "{}" > database/schedule-weeks.json
RUN npm install -g nodemon
RUN npm install

COPY . .

CMD [ "npm", "start" ]