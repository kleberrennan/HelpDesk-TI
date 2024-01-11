<?php
namespace ITERMA\Socket;

error_reporting(0);

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
                  return;
               }

               $userId = $data["srcId"];
               
               $from->userId = $userId;
               $from->userInstance = 0;
               foreach($this->users as $storedClient) {
                  if($storedClient->userId == $userId) {
                     $userInstance = isset($storedClient->userInstance) ? $storedClient->userInstance + 1 : 1;
                     $from->userInstance = $userInstance;
                     break;
                  }
               }

               if(isset($data["type"]) && $data["type"] == "order") {
                  $orderId = $data["ownerId"];
                  $from->orderId = $orderId;
                  echo $YELLOW . "[TI]: " . $GREEN . $from->orderId . " order was set to " . $data["srcId"] . " user" . PHP_EOL . $NC;
               }

               $this->users->attach($from);
               
               echo $YELLOW . "[Socket Server]: " . $GREEN . $from->userId . " with Instance: " . $from->userInstance . " Established a connection!" . PHP_EOL . $NC;
            
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
            case "getOwnerOrder":
               if(!isset($data['ownerName'])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "ownerName was not defined!" . PHP_EOL . $NC;
                  return;
               } else if(!isset($data['userId'])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "userId was not defined!" . PHP_EOL . $NC;
                  return;
               }

               foreach($this->users as $client) {
                  if($client->userId == $from->userId) continue;
                  if($client->orderId == $data['ownerTitleId']) {
                     $response = array(
                        'action' => $data['action'],
                        'ownerName' => $data['ownerName'],
                        'idBox' => $data['ownerTitleId']
                     );
                     
                     echo $YELLOW . "[Socket Server]: " . $GREEN . "new Owner defined to " . $data["userId"] . PHP_EOL . $NC;

                     $client->send(json_encode($response));
                  }
               }
               break;
            case "sendOrderMessage":
               if(!isset($data["srcId"])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "srcId was not defined!" . PHP_EOL . $NC;
                  return;
               }

               $stmt = $this->database->prepare("INSERT INTO chat(fromUserId, toUserId, messageUser) VALUES(:srcUser, :targetUser, :messageUser)");
               $stmt->bindParam(":srcUser", $data["srcId"], \PDO::PARAM_INT);
               $stmt->bindParam(":targetUser", $data["targetId"], \PDO::PARAM_INT);
               $stmt->bindParam(":messageUser", $data["message"], \PDO::PARAM_STR);
               $stmt->execute();
               
               $result = $stmt->fetch(\PDO::FETCH_ASSOC);

               if(!is_array($result)) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "Database Insert Message Failed" . PHP_EOL . $NC;
                  return;
               }
               var_dump($data);
               foreach($this->users as $user) {
                  if($user->userId == $from->userId) {
                        if($from->userInstance == $user->userInstance) continue;
                        $data['currentUser'] = true;
                        $user->send(json_encode($data));
                     }

                  if($user->userId == $data['targetId']) {
                     $data['currentUser'] = false;
                     $user->send(json_encode($data));
                  }
               }      
                  break;
         };
      };
   }

   public function onClose(ConnectionInterface $conn) {
      $GREEN="\033[0;32m";
      $YELLOW="\033[0;33m";
      $NC="\033[0m";
      $connId = '';

      if($conn->userId != "") {
         $connId = $conn->userId;
      } else {
         $connId = $conn->resourceId;
      }

      echo $YELLOW . "[Socket Server]: " . $GREEN . "Client {$connId} leaves the connection!" . PHP_EOL . $NC;
   
      $this->users->detach($conn);
   }

   public function onError(ConnectionInterface $conn, \Exception $e) {
      $RED="\033[0;31m";
      $YELLOW="\033[0;33m";
      $NC="\033[0m";
      
      echo $YELLOW . "[Socket Server]: " . $RED . "An error occurred: {$e->getMessage()}" . PHP_EOL . $NC;

      $conn->close();
   }
}