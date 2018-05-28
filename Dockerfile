FROM node:10.0.0
COPY . /home/kfcoding-front
WORKDIR /home/kfcoding-front
EXPOSE 8000
CMD npm start
