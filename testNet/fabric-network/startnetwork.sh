# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=docker-compose.yaml
#this can be configured for docker or podman
CONTAINER_CLI_COMPOSE="docker-compose"


# Get docker sock path from environment variable
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"
# export the docker sock location 
export DOCKER_SOCK=${DOCKER_HOST:-/var/run/docker.sock}

CONTAINER_CLI="docker"


COMPOSE_FILES="-f compose/${COMPOSE_FILE_BASE} "

DOCKER_SOCK="${DOCKER_SOCK}" ${CONTAINER_CLI_COMPOSE} ${COMPOSE_FILES} up --build -d 2>&1

$CONTAINER_CLI ps -a
if [ $? -ne 0 ]; then
fatalln "Unable to start network"
fi
