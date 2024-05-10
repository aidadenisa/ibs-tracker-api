docker pull mongo:latest
docker run -d -e MONGO_INITDB_DATABASE=ibs-tracker-test -p 27017:27017 --name=mongodb-ibs-test mongo:latest 