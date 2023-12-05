<?php
namespace ITERMA\Agent;

use ITERMA\Agent\Database;
class User {
    private $userId;
    private $dbConn;

    public function setIdUser($userId) { $this->userId = $userId; }
    public function getUserId() { return $this->userId; }

    public function __construct() {
        $dbConn = new Database();
        $this->dbConn = $dbConn->connect();
    }

    public function getUserDetails() {
        $userId = $this->getUserId();
        $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE userid = :idUser");
        $stmt->bindParam(':idUser', $userId, \PDO::PARAM_INT);
        $stmt->execute();
        $user = $stmt->fetch(\PDO::FETCH_ASSOC);
        $this->dbConn = null;
        return $user;
    }
}
?>