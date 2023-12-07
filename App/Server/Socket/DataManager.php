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
            
               $from->send("User Registered: $userId" . PHP_EOL);
               break;

            case "sendOrderMessage":
               if(!isset($data["srcId"])) {
                  echo "srcId was not defined!";
                  exit(1);
               }
               $stmt = $this->database->prepare("SELECT * FROM orderSector WHERE idcall = :idOrder");
               $stmt->bindParam(":idOrder", $data["targetId"], \PDO::PARAM_INT);
               $stmt->execute();

               $resultOrder = $stmt->fetch(\PDO::FETCH_ASSOC);
               if(isset($resultOrder["authorcallid"])) {
                  $authorCall = $resultOrder["authorcallid"];
                  $stmt = $this->database->prepare("INSERT INTO chat(fromUserId, toUserId, messageUser) VALUES(:srcUser, :targetUser, :messageUser)");
                  $stmt->bindParam(":srcUser", $data["srcId"], \PDO::PARAM_INT);
                  $stmt->bindParam(":targetUser", $authorCall, \PDO::PARAM_INT);
                  $stmt->bindParam(":messageUser", $data["message"], \PDO::PARAM_STR);
                  $stmt->execute();
                  
                  $result = $stmt->fetch(\PDO::FETCH_ASSOC);

                  if(!is_array($result)) {
                     echo "Error: Database Insert Message Failed";
                     exit(1);
                  }
               } else {
                  echo "Error: AuthorCallId wasn't found!";
                  exit(1);
               }

               foreach($this->users as $user) {
                  $user->send($data["message"]);
               }
               break;
         }
      }
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