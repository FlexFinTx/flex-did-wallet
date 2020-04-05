FROM node:latest as base

FROM base as deps
WORKDIR /usr/api
COPY package.json package-lock.json ./
RUN npm install

FROM base as api
WORKDIR /usr/api
RUN npm install -g typescript
COPY --from=deps /usr/api/node_modules /usr/api/node_modules
COPY . ./

CMD npm run start