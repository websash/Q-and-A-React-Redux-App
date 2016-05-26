FROM node:6.2.0
COPY package.json /src/
RUN cd /src && npm install
COPY . /src/
WORKDIR /src
ENV NODE_ENV production
ENV API_ROOT http://q-and-a.loc/api/
RUN npm run build
EXPOSE 8080
CMD ["node", "app-server/index.js"]
