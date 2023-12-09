<?php
namespace ITERMA\Agent;

use ITERMA\Agent\Database;

class Chat {
    private $srcId;
    private $targetId;
    private $dbConn;

    public function setSrcId($id) { $this->srcId = $id; }
    public function getSrcId() { return $this->srcId; }
    public function setTargetId($id) { $this->targetId = $id; }
    public function getTargetId() { return $this->targetId; }
    public function __construct() {
        $db = new Database();
        $this->dbConn = $db->connect();
    }

    public function getAllMessages() {
        $srcId = $this->getSrcId();
        $targetId = $this->getTargetId();

        $result = '';

        $sql = 
            "SELECT * FROM chat WHERE 
                (fromuserid = :srcId AND touserid = :targetId)
                OR
                (fromuserid = :targetId AND touserid = :srcId)";
        $stmt = $this->dbConn->prepare($sql);

        $stmt->bindParam(":srcId", $srcId, \PDO::PARAM_INT);
        $stmt->bindParam(":targetId", $targetId, \PDO::PARAM_INT);
        $stmt->execute();

        if($stmt->rowCount() <= 0) {
            $result = false;
        } else {
            while($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                $result .= $row['fromuserid'] . ':' . $row['messageuser'] . '#%SEP';
            };
        }

        return $result;
    }
}

?>