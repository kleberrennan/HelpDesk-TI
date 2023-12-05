<?php
namespace ITERMA\Socket;

use ITERMA\Define;

use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;

class DataManager extends \ITERMA\Handler\REST implements WampServerInterface {
   protected $clients;

   public function __construct() {
      $this->clients = new \SplObjectStorage();
   }

   public function onOpen(ConnectionInterface $conn) {
      $this->clients->attach($conn);
   }

   public function onClose(ConnectionInterface $conn) {
      $this->clients->detach($conn);
   }

   public function onCall(ConnectionInterface $conn, $cmd, $topic, array $args) {
  }

  public function onSubscribe(ConnectionInterface $conn, $topic) {
  }

  public function onUnsubscribe(ConnectionInterface $conn, $topic) {
  }

  public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible) {
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {

  }
   public function onOrder($entry) {
      $data = json_decode($entry, true);

      if(isset($entry['idCall'])) {
         $this->returnResponse(ORDER_ID_NOT_FOUND,
         "ID Order not found! Data: " . $data);
      } else {
         $this->returnResponse(156, "onOrderMethodTest" . $data);
      }
   }
}