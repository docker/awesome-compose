docker build --tag=db .\db    

docker run --name db -p 1433:1433 --volume sqlserver:/var/opt/sqlserver -d db