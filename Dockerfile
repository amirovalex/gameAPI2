FROM node:17

#Working Dir
WORKDIR /usr/src/app

#COPY Package JSON file
COPY package*.json ./

#Install Files
RUN npm install

#Copy source files
COPY . .

#Expose the API port
EXPOSE ${PORT}

CMD ["node","index.js"]