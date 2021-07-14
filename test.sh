#!/usr/bin/env bash

    export LATEST_TAG=v0.1.1
    export VERSION=${{ matrix.ref }}
    # Si estamos en el branch de desarrollo
    [ "$VERSION" == "v0.1" ] && export VERSION=snapshot
    echo VERSION=$VERSION

    docker-compose -f docker-compose.yml build web
    docker-compose -f docker-compose.yml push web
    # Dejo levantado el entorno para pruebas automatizadas en CI
#    docker-compose -f docker-compose.yml up -d

    # tag and push version latest
    if echo "$VERSION" | grep -E '^\w+\.\w+\.\w+$' && [ "$LATEST_TAG" == "$VERSION" ]; then
    for VERSION in latest; do
        export VERSION
        echo VERSION=$VERSION
        docker-compose -f docker-compose.yml build web
        docker-compose -f docker-compose.yml push web
    done
    fi