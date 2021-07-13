# Prueba de Healthcheck

FROM nginx:1.17.7

RUN apt-get update && apt-get install -y wget curl

HEALTHCHECK CMD wget -q --method=HEAD localhost/system-status.txt
