<?php
require_once dirname(__DIR__) . "/../../vendor/autoload.php";

$loop = \React\EventLoop\Factory::create();
$pusher = new \ITERMA\Socket\DataManager();

$context = new \React\ZMQ\Context($loop);
$pull = $context->getSocket(ZMQ::SOCKET_PULL);
$pull->bind('tcp://127.0.0.1:5555');
$pull->on('message', array($pusher, 'onOrder'));

$webSocket = new \React\Socket\Server('127.0.0.1:8080', $loop);

$server = 
    new \Ratchet\Server\IoServer(
        new \Ratchet\Http\HttpServer(
            new \Ratchet\WebSocket\WsServer(
                new \Ratchet\Wamp\WampServer(
                    $pusher
                )
            )
        ), $webSocket
    );

$loop->run();
?>