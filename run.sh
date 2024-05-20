#!/bin/bash

ENV_FILE="server/.env"

if [ "$1" = "start" ];
then
  sed -i '1s|.*|MONGO_DB_URI=mongodb://localhost:27017/whisper|' $ENV_FILE
  npm run start
elif [ "$1" = "docker" ]
then 
  sed -i '1s|.*|MONGO_DB_URI=mongodb://mongodb:27017/whisper|' $ENV_FILE
  sudo docker compose up -d
elif [ "$1" = "build" ]
then 
  sed -i '1s|.*|MONGO_DB_URI=mongodb://mongodb:27017/whisper|' $ENV_FILE
  sudo docker compose up -d --build
elif [ "$1" = "stop" ]
then 
  sudo docker compose down
else
	printf "Please use the following commands:\n"
	printf "\nstart: To start react and node app"
	printf "\ndocker: To start docker container"
	printf "\nbuild: To rebuild docker container"
	printf "\nstop: To stop docker container\n"
fi