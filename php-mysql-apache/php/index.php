<?php


/**
 * This is a sample code to show you how Docker containers work together.
 * DO NOT USE this source and pattern in production.
 * 
 * 
 * You can see the result by going to `localhost:8000`.
 * 8000-8080: 
 *      Host Apache port to run PHP index.php inside /var/www/html in the container.
 * 8001 : Refers to 3306 & 33060 of the MySQL port in the container
 * 8003 : Refers to 80 of the PhpMyAdmin [user=root, no password]
 * 
 */

require_once "query.php";


/**
 * IP of MySQL
 * We can add specific IPs in docker-compose.yaml file for each service(container)
 */
$mysqlHost = "172.17.0.3";

run_MySQL_queries($mysqlHost);
