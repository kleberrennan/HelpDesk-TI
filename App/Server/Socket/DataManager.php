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
                  echo $YELLOW . "[Socket Server]: " . $RED . "srcId was not defined at registerUser!" . PHP_EOL . $NC;
                  return;
               }

               $userData = array();

               $userId = $data["srcId"];
               
               $userData["userId"] = $userId;

               if(isset($data["type"])) {
                  switch($data["type"]) {
                     case "order":
                        /*if(!isset($data["ownerId"])) {
                           echo $YELLOW . "[Socket Server]: " . $RED . "ownerId was not defined at register order!" . PHP_EOL . $NC;
                           return;
                        }*/
                        $orderId = $data["srcId"];
                        $userData["orderBoxId"] = $orderId;

                        echo $YELLOW . "[TI]: " . $GREEN . $userData["orderId"] . " order was set to " . $data["srcId"] . " user" . PHP_EOL . $NC;
                        break;
                     case "chat":
                        if(!isset($data["srcId"])) {
                           echo $YELLOW . "[Socket Server]: " . $RED . "idUser was not defined at register chat!" . PHP_EOL . $NC;
                           return;
                        }
                        $chatId = $data["targetId"];
                        $userData["chat"] = array();
                        $userData["chat"]["targetChat"] = $chatId;

                        echo $YELLOW . "[TI]: " . $GREEN . $userData["chatId"] . " chat was set to " . $data["srcId"] . " user" . PHP_EOL . $NC;
                        break;
                     }
               }

               $userObjId = "user_" . $from->resourceId;

               $from->userDataArr = [$userObjId => $userData]; 

               $this->users->attach($from);
               
               echo $YELLOW . "[Socket Server]: " . $GREEN . $userData["userId"] . " with Instance: " . $userData["userInstance"] . " Established a connection!" . PHP_EOL . $NC;
               
               var_dump($from->userDataArr);

               break;
            case "insertOrder":
               if(!isset($data["orderId"])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "orderId was not defined at insertOrder!" . PHP_EOL . $NC;
               }

               $sql = "SELECT * FROM orderSector WHERE idcall = :orderId";
               $stmt = $this->database->prepare($sql);
               $stmt->bindParam(":orderId", $data["orderId"], \PDO::PARAM_INT);
               $stmt->execute();

               if($stmt->rowCount() > 0) {
                  $result = $stmt->fetch(\PDO::FETCH_ASSOC);

                  $sqlOwner = "SELECT userName from users WHERE userid = :idcall";
                  $stmtOwner = $this->database->prepare($sqlOwner);
                  $stmtOwner->bindParam(":idcall", $result["authorcallid"], \PDO::PARAM_INT);
                  $stmtOwner->execute();
                  
                  $resultOwner = $stmtOwner->fetch(\PDO::FETCH_ASSOC);

                  if($stmtOwner->rowCount() > 0) {
                     $response = array(
                        "action" => $data["action"],
                        "userName" => $resultOwner["username"],
                        "authorcallid" => $result["authorcallid"],
                        "reasoncall" => $result["reasoncall"],
                        "calltimestamp" => $result["calltimestamp"],
                        "ownercall" => "SEM POSSE",
                        "idcall" => $result["idcall"]
                     );

                     foreach($this->users as $user) {
                        $fromIdObj = "user_" . $user->resourceId;

                        if(
                           isset($user->userDataArr[$fromIdObj]["orderBoxId"])
                           && $user->userDataArr[$fromIdObj]["orderBoxId"] == $data["targetBox"]
                           ) {
                           $user->send(json_encode($response));
                        }
                     }
                  }
               }

               break;
            case "callSector":
               if(isset($data["targetSector"])) {
                  $stmt = $this->database->prepare("INSERT INTO requestStatus(sectorId, isRequested) VALUES(:sectorId, :isRequested)");
                  $stmt->bindParam(":sectorId", $data["targetSector"], \PDO::PARAM_INT);
                  $stmt->bindParam(":isRequested", $data["isRequested"], \PDO::PARAM_BOOL);
                  $stmt->execute();
               }
               var_dump($data);
               foreach($this->users as $user) {
                  $fromIdObj = "user_" . $user->resourceId;
                  if(
                     isset($user->userDataArr[$fromIdObj]["chat"]) 
                     &&
                     $user->userDataArr[$fromIdObj]["userId"] == $data["fromChat"]) {
                        $response = array (
                           "action" => $data["action"]
                        );

                        $user->send(json_encode($response));
                  }
               }
               break;
            case "broadcastDeleteOrder":
               if(!isset($data["idSector"])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "idSector was not defined!" . PHP_EOL . $NC;
               }

               $stmt_chat = $this->database->prepare("DELETE FROM chat WHERE (fromuserid = :srcId AND touserid = :targetId) OR (fromuserid = :targetId AND touserid = :srcId)");
               $stmt_chat->bindParam(":srcId", $data["idSector"], \PDO::PARAM_INT);
               $stmt_chat->bindParam(":targetId", $data["targetId"], \PDO::PARAM_INT);
               $stmt_chat->execute();

               $stmt_request = $this->database->prepare("DELETE FROM requeststatus WHERE sectorid = :idSector");
               $stmt_request->bindParam(":idSector", $data["idSector"], \PDO::PARAM_INT);
               $stmt_request->execute();

               foreach($this->users as $user) {
                  $fromIdObj = "user_" . $user->resourceId;
                  echo "idSector: " . $data["idSector"];
                  if($user->userDataArr[$fromIdObj]["userId"] == $data["idSector"]) {
                     $response = array(
                        'action' => $data['action']
                     );
                     
                     $user->send(json_encode($response));
                  }

                  if(
                  isset($user->userDataArr[$fromIdObj]["orderBoxId"])
                     && 
                  $user->userDataArr[$fromIdObj]["orderBoxId"] == $data["targetId"]) {
                     $response = array(
                        'action' => $data['action'],
                        'idSector' => $data['idSector']
                     );
                     
                     echo $YELLOW . "[Socket Server]: " . $GREEN . "new Owner" . "(" . $data["ownerName"] .")" . " defined to " . $data["targetId"] . PHP_EOL . $NC;

                     $user->send(json_encode($response));
                  }
               }
               
               break;
            case "getOwnerOrder":
               if(!isset($data['ownerName'])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "ownerName was not defined at getOwnerOrder!" . PHP_EOL . $NC;
                  return;
               } else if(!isset($data['ownerTitleId'])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "ownerTitleId was not defined! at getOwnerOrder" . PHP_EOL . $NC;
                  return;
               }

               foreach($this->users as $user) {
                  $fromIdObj = "user_" . $user->resourceId;
                  if(
                     isset($user->userDataArr[$fromIdObj]["orderBoxId"])
                     && $user->userDataArr[$fromIdObj]["orderBoxId"] == $data["targetId"]) {
                     $response = array(
                        'action' => $data['action'],
                        'ownerName' => $data['ownerName'],
                        'idBox' => $data['ownerTitleId']
                     );
                     
                     echo $YELLOW . "[Socket Server]: " . $GREEN . "new Owner" . "(" . $data["ownerName"] .")" . " defined to " . $data["targetId"] . PHP_EOL . $NC;

                     $user->send(json_encode($response));
                  }
               }
               break;
            case "sendOrderMessage":
               if(!isset($data["srcId"])) {
                  echo $YELLOW . "[Socket Server]: " . $RED . "srcId was not defined to send a message!" . PHP_EOL . $NC;
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

               foreach($this->users as $user) {
                  $targetChat = $data['targetId'];
                  $srcChat = $data["srcId"];
                  $fromIdObj = "user_" . $user->resourceId;

                  $userArr = $user->userDataArr[$fromIdObj];
                  if(
                     isset($userArr["chat"])
                     && $userArr["chat"]["targetChat"] == $targetChat
                     && $userArr["userId"] == $srcChat) {
                     $data['currentUser'] = true;

                     $user->send(json_encode($data));
                  }
                  
                  if
                  (
                     isset($userArr["chat"])
                     && $userArr["chat"]["targetChat"] == $srcChat
                     && $userArr["userId"] == $targetChat
                  ) {
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