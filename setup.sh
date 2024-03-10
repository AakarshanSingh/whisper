#!/bin/bash

clientIp () {
  frontend_ip=$(sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$(sudo docker compose ps -q client)")
  echo "Client side is accessible at: http://$frontend_ip:8080"
}

if [ "$1" = "stop" ];
then
	sudo docker compose down
elif [ "$1" = "build" ]
then 
  sudo docker compose up -d --build
  clientIp
else
	sudo docker compose up -d
  clientIp
fi