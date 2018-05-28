FROM node:10.0.0

COPY . /kfcoding-frontend
WORKDIR /kfcoding-frontend

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 8000

CMD ["npm", "start"]
