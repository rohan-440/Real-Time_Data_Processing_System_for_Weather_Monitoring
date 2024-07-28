# Problem Statement
Go Backend engine for ETL pipeline for open weather. It also exposes endpoints to consume the data for the frontend


# Assumption & implementation
1. All the functionality are supported & tested 
2. This read me provides with sample curls to test out the all service endpoints 
3. Server is running on port 8080 
4. Go server created using gin framework 
5. We are using sqllite disk based storage for db (Note: data is retained when app is restarted)

# Setup, Build and un
1. Install go "brew install go"
2. Cd into the folder
3. Run below command to build the binary
```
make build
```
4. Run below command to run the gobackend http server
```
make run
```
5. Run below command to auto test the code.
```
make test
```

# ref for lib & other helpful methods for golang

https://gorm.io/docs/update.html

https://blog.logrocket.com/rest-api-golang-gin-gorm/

https://semaphoreci.com/community/tutorials/building-go-web-applications-and-microservices-using-gin
