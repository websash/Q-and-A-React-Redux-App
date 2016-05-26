FROM node:6.2.0
COPY package.json /src/
RUN cd /src && npm install
COPY . /src/
WORKDIR /src
EXPOSE 4000
CMD ["node", "./main.js"]
