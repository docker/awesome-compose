<?php

function run_MySQL_queries($mysqlHost)
{
    /**
     * Connect to MySQL via PDO
     * 
     * PDO modules must be installed before using, moduels' name:
     *  pdo pdo_mysql
     */
    $pdo = new PDO("mysql:host=$mysqlHost", "root", "");

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);




    /**
     * Create a new database called `MyDatabase` if does not exist
     */
    $pdo->exec("CREATE DATABASE IF NOT EXISTS MyDatabase");




    /**
     * Use the database we created
     */
    $pdo->exec("USE MyDatabase");




    /**
     * Check if the `test` table exists before
     * If not, creates a new one
     */
    $stmt = $pdo->prepare("SHOW TABLES LIKE 'test'");
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        $stmt = $pdo->prepare("CREATE TABLE test (column1 VARCHAR (255) )");
        $stmt->execute();
    }




    /**
     * Insert a sample data `Hello world` into table
     */
    $stmt = $pdo->prepare("INSERT INTO test (column1) VALUES ('Hello world')");
    $stmt->execute();

    


    /**
     * Fetch the data we inserted
     */
    $stmt = $pdo->prepare("SELECT * FROM test LIMIT 1");
    $stmt->execute();

    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);




    /**
     * Show the data as string
     */
    echo $result[0]['column1'];
}