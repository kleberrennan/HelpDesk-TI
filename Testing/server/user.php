<?php
class USER {
    private $idUser;

    function setId($id) {$this->idUser = $id;}
    function getId($id) {return $this->idUser;}

    public function __construct() {
        $db = new Database();
        $db->connect();
    }

    public function getUserType() {
        
    }
}
?>