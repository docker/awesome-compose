FROM mcr.microsoft.com/mssql/server:2019-GDR1-ubuntu-16.04

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=SQL_password123
ENV MSSQL_PID=Express

USER root
 
RUN mkdir /var/opt/sqlserver
 
RUN chown mssql /var/opt/sqlserver
 
ENV MSSQL_BACKUP_DIR="/var/opt/sqlserver"
ENV MSSQL_DATA_DIR="/var/opt/sqlserver"
ENV MSSQL_LOG_DIR="/var/opt/sqlserver"

EXPOSE 1433/tcp

COPY setup.sql /
COPY startup.sh /

COPY Umbraco.mdf /var/opt/sqlserver
COPY Umbraco_log.ldf /var/opt/sqlserver

ENTRYPOINT [ "/bin/bash", "startup.sh" ]
CMD [ "/opt/mssql/bin/sqlservr" ]