# stage1 as builder
FROM node:18-alpine as builder

WORKDIR /app

# copy the package.json to install dependencies
COPY package.json package-lock.json ./

# Install the  and make the folder
RUN yarn install

COPY . .

# Build the project and copy the files
RUN yarn run build

FROM alpine

# Copy from the stahg 1
COPY --from=builder /app/build /static