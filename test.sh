#!/usr/bin/env bash

    export LATEST_TAG=v1.0.1
    export VERSION=master

    
    echo 'Generando imagenes de docker snapshot si aplica'

    
    echo $VERSION
    echo $LATEST_TAG
    
    if  [ "$VERSION"  == "master" ] || [ "$LATEST_TAG" == "snapshot" ]; then
        export VERSION=snapshot
        echo VERSION=$VERSION
        docker-compose -f docker-compose.yml build web
        docker-compose -f docker-compose.yml push web
    fi