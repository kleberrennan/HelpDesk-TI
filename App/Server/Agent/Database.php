<?php
namespace ITERMA\Agent;

class Database {
    private $host = 'localhost';
    private $port = '5432';
    private $dbName = 'ci_iterma';
    private $userDb = 'postgres';

    public function connect() {
        try {
            $strConn = "pgsql:host=$this->host;port=$this->port;dbname=$this->dbName;user=$this->userDb";

            $conn = new \PDO($strConn);
            $conn->setAttribute(\PDO::ERRMODE_EXCEPTION, \PDO::ATTR_ERRMODE);
            return $conn;
        } catch (\PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }
}
?>