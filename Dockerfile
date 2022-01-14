FROM node:12.2.0-alpine

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# copy package requirements
COPY ./package.json /app/package.json

RUN npm install

# copy server source code
COPY . /app

# to be able to run the shell scripts from the node.js process
RUN chmod -R 777 /app/shell-scripts

EXPOSE 5000

CMD ["ts-node", "/app/server.ts"]