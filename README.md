# tile_puzzle

Steps to run:
1. Install Docker CE (https://www.docker.com/get-docker),
2. Clone this github repo by running
3. Add the following to the docker-compose.yml file in Florian's host repo:

```
     tilepuzzle:
    build: ../puzzle18-tilepuzzle
    depends_on:
      - db
    ports:
      - "3002:4002"
    environment:
      - "VIRTUAL_HOST=puzzle18-tilepuzzle.example.com"
    volumes:
      - ../puzzle18-tilepuzzle:/usr/src/app
      - /usr/src/app/node_modules
      - /usr/src/app/data
```

4. Run ```docker-compose up``` to start up the host, which will allow you to cycle through the puzzles. 

