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
      echo "Connection Established! {$conn->resourceId}" . PHP_EOL;
   }

   public function onMessage(ConnectionInterface $from, $msg) {
      $data = json_decode($msg, true);

      if(isset($data["action"])) {
         switch($data["action"]) {
            case "registerUser":
               if(!isset($data["srcId"])) {
                  echo "srcId was not defined!";
                  exit(1);
               }

               $userId = $data["srcId"];

               $from->userId = $userId;
   
               $this->users->attach($from);

               echo $from->userId . "Established" . PHP_EOL;
            
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
                  echo "srcId was not defined!";
                  exit(1);
               }

               $stmt = $this->database->prepare("INSERT INTO chat(fromUserId, toUserId, messageUser) VALUES(:srcUser, :targetUser, :messageUser)");
               $stmt->bindParam(":srcUser", $data["srcId"], \PDO::PARAM_INT);
               $stmt->bindParam(":targetUser", $data["targetId"], \PDO::PARAM_INT);
               $stmt->bindParam(":messageUser", $data["message"], \PDO::PARAM_STR);
               $stmt->execute();
               
               $result = $stmt->fetch(\PDO::FETCH_ASSOC);

               if(!is_array($result)) {
                  echo "Error: Database Insert Message Failed";
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
      $this->users->detach($conn);

      echo "Client {$conn->userId} leaves the connection!" . PHP_EOL;
   }

   public function onError(ConnectionInterface $conn, \Exception $e) {
      echo "An error occurred: {$e->getMessage()}";

      $conn->close();
   }
}