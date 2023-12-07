<?php

require dirname(__DIR__) . "/../../vendor/autoload.php";

use \ITERMA\Socket\DataManager;
use \Ratchet\Server\IoServer;
use \Ratchet\Http\HttpServer;
use \Ratchet\WebSocket\WsServer;

$server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new DataManager()
                )
            ), 8080);

$server->run();
?>