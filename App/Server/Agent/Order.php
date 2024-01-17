<?php
namespace ITERMA\Agent;

use ITERMA\Agent\Database;
class Order {
    private $userId;
    private $ownerName; 
    private $dbConn;

    public function setIdUser($userId) { $this->userId = $userId; }
    public function getIdUser() { return $this->userId; }
    public function setOwnerName($ownerName) { $this->ownerName = $ownerName; }
    public function getOwnerName() { return $this->ownerName; }

    public function __construct() {
        $dbConn = new Database();
        $this->dbConn = $dbConn->connect();
    }

    public function getOrderById() {
        try {
            $userId = $this->getIdUser();

            $sql = "SELECT * from orderSector WHERE authorcallid = :idUser";

            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(":idUser", $userId);
            $stmt->execute();

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            return $result;
        } catch(\Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    public function setOwnerById() {
        $ownerName = $this->getOwnerName();
        $orderId = $this->getIdUser();
        $response = '';
        $sql = "UPDATE orderSector 
                SET ownercall = :ownerName 
                WHERE authorcallid = :idUser";

        $stmt = $this->dbConn->prepare($sql);
        $stmt->bindParam(":ownerName", $ownerName, \PDO::PARAM_STR);
        $stmt->bindParam(":idUser", $orderId, \PDO::PARAM_INT);

        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $response = true;
        }
        return $response;
    }
    public function listAll() {
        try {
            $sql = "SELECT * FROM orderSector";
            $stmt = $this->dbConn->prepare($sql);

            $stmt->execute();

            $orders = array();

            $counter = 0;
            while($order = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                $userId = $order['authorcallid'];
                $sqlUser = "SELECT userName FROM users WHERE userId = :userId";
                $stmtUser = $this->dbConn->prepare($sqlUser);
                $stmtUser->bindParam(':userId', $userId, \PDO::PARAM_INT);
                $stmtUser->execute();

                $user = $stmtUser->fetch(\PDO::FETCH_ASSOC);
                $order['userName'] = $user['username'];

                $orders[$counter+=1] = $order;
            };

            return $orders;
        } catch(\PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    public function insert($reasonCall) {
        try {
            $userId = $this->getIdUser();
            $sql = "INSERT INTO orderSector(authorCallId, reasonCall) VALUES(:idUser, :reasonCall)";
            $stmt = $this->dbConn->prepare($sql);

            $stmt->bindParam(':idUser', $userId, \PDO::PARAM_INT);
            $stmt->bindParam(':reasonCall', $reasonCall, \PDO::PARAM_STR);

            $stmt->execute();

            $order = $stmt->fetch(\PDO::FETCH_ASSOC);

            return $order;
        } catch(\PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    public function checkOwnerById() {
        try {
            $userId = $this->getIdUser();
            $sql = "SELECT ownercall FROM orderSector WHERE sectorId = :idUser";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(':idUser', $userId, \PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            if($result['ownercall'] == null) {
                $result = false;
            }

            return $result;
        } catch(\PDOException $e) {
            echo "Error: " . $e->getMessage();
        } 
    }

    public function checkRequest() {
        try {
            $userId = $this->getIdUser();
            $result = false;
            $sql = "SELECT * FROM requestStatus WHERE sectorId = :idUser";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(':idUser', $userId, \PDO::PARAM_INT);
            $stmt->execute();

            $result = $stmt->fetch(\PDO::FETCH_ASSOC);

            if($stmt->rowCount() > 0) {
                $result = true;
            }

            return $result;
        } catch(\PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    public function check() {
        try {
            $userId = $this->getIdUser();
            $isOrder = false;
            $sql = "SELECT * FROM orderSector WHERE authorcallid = :idUser";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(':idUser', $userId, \PDO::PARAM_INT);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $isOrder = true;
            }

            return $isOrder;
        } catch(\PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    public function deleteById() {
        try {
            $userId = $this->getIdUser();
            $isDeleted = true;
            $sql = "DELETE FROM orderSector WHERE authorcallid = :idUser";
            $stmt = $this->dbConn->prepare($sql);
            $stmt->bindParam(":idUser", $userId, \PDO::PARAM_INT);
            $stmt->execute();

            if($stmt->rowCount() > 0) {
                $isDeleted = false;
            }

            return $isDeleted;
        } catch(\PDOException $e) {
            echo "Error:" . $e->getMessage();
        }
    }
}
?>