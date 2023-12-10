<?php
namespace ITERMA\Socket;

use \Ratchet\ConnectionInterface;
use \Ratchet\MessageComponentInterface;
use \ITERMA\Agent\Database;
class DataManager implements MessageComponentInterface {
   protected $users;
   protected $database;

   public function __construct() {
      $this->users = new \SplObjectStorage();
      $db = new Database();
      $this->database = $db->connect();
   }

   public function onOpen(ConnectionInterface $conn) {
      $GREEN="\033[0;32m";
      $YELLOW="\033[0;33m";
      $NC="\033[0m";

      echo $YELLOW . "[Socket Server]: " . $GREEN . "Connection Established! ID: {$conn->resourceId}" . PHP_EOL . $NC;
   }

   public function onMessage(ConnectionInterface $from, $msg) {
      $data = json_decode($msg, true);

      if(isset($data["action"])) {
         $RED="\033[0;31m";
         $GREEN="\033[0;32m";
         $YELLOW="\033[0;33m";
         $NC="\033[0m";
         switch($data["action"]) {
            case "registerUser":
               if(!isset($data["srcId"])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "srcId was not defined!" . PHP_EOL . $NC;
                  exit(1);
               }

               $userId = $data["srcId"];

               $from->userId = $userId;
   
               $this->users->attach($from);

               echo $YELLOW . "[Socket Server]: " . $GREEN . $from->userId . " Established a connection!" . PHP_EOL . $NC;
            
               break;

            case "callSector":
               if(isset($data["targetSector"])) {
                  $stmt = $this->database->prepare("INSERT INTO requestStatus(sectorId, isRequested) VALUES(:sectorId, :isRequested)");
                  $stmt->bindParam(":sectorId", $data["targetSector"], \PDO::PARAM_INT);
                  $stmt->bindParam(":isRequested", $data["isRequested"], \PDO::PARAM_BOOL);
                  $stmt->execute();
               }
               
               foreach($this->users as $user) {
                  if($user->userId == $data["targetSector"]) {
                     $user->send(json_encode($data));
                  }
               }
               break;
            case "sendOrderMessage":
               if(!isset($data["srcId"])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "srcId was not defined!" . PHP_EOL . $NC;
                  exit(1);
               }

               $stmt = $this->database->prepare("INSERT INTO chat(fromUserId, toUserId, messageUser) VALUES(:srcUser, :targetUser, :messageUser)");
               $stmt->bindParam(":srcUser", $data["srcId"], \PDO::PARAM_INT);
               $stmt->bindParam(":targetUser", $data["targetId"], \PDO::PARAM_INT);
               $stmt->bindParam(":messageUser", $data["message"], \PDO::PARAM_STR);
               $stmt->execute();
               
               $result = $stmt->fetch(\PDO::FETCH_ASSOC);

               if(!is_array($result)) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "Database Insert Message Failed" . PHP_EOL . $NC;
                  exit(1);
               }
               foreach($this->users as $user) {
                  if($user->userId == $from->userId) continue;
                  if($user->userId == $data['targetId']) {
                     $user->send(json_encode($data));
                  }      
               };
               break;
         };
      };
   }

   public function onClose(ConnectionInterface $conn) {
      $GREEN="\033[0;32m";
      $YELLOW="\033[0;33m";
      $NC="\033[0m";

      $this->users->detach($conn);

      echo $YELLOW . "[Socket Server]: " . $GREEN . "Client {$conn->userId} leaves the connection!" . PHP_EOL . $NC;
   }

   public function onError(ConnectionInterface $conn, \Exception $e) {
      $RED="\033[0;31m";
      $YELLOW="\033[0;33m";
      $NC="\033[0m";
      
      echo $YELLOW . "[Socket Server]: " . $RED . "An error occurred: {$e->getMessage()}" . PHP_EOL . $NC;

      $conn->close();
   }
}