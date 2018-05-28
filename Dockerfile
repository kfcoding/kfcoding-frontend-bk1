FROM node:10.0.0
COPY . /home/kfcoding-front
WORKDIR /home/kfcoding-front
EXPOSE 80
CMD ["node", "start"]
