# Umbraco CMS Docker compose file

This sample project will start up the [Umbraco CMS](https://github.com/umbraco/Umbraco-CMS/) in a Docker container, with an attached database container running SQL Server. 

## Project Structure




## Credentials

hello@umbraco.com
1234567890



## crap below

docker build --tag=umbraco .\umbraco

docker run --name umbraco -p 8000:80 -v media:/app/wwwroot/media -v logs:/app/umbraco/Logs -e -d umbraco

docker run --name umbraco -p 8000:80 -d umbraco