<?php
namespace ITERMA\Handler;

error_reporting(E_ALL);
ini_set("display_errors", 1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use ZMQContext;
use ITERMA\Handler\REST;
use ITERMA\Agent\User;
use ITERMA\Agent\Order;

class API extends REST {
    private $ISSUER = 'localhost';

    public function __construct() {
        parent::__construct();
    }

    public function generateToken() {
        try {
            $sectorName = $this->validateParam("userName", $this->param['userName'], STRING);
            $passwSector = $this->validateParam('passwUser', $this->param['userPassw'], STRING);

            $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE 
            userPassw = :passwUser AND userName = :nameUser");

            $stmt->bindParam(":nameUser", $sectorName);
            $stmt->bindParam(":passwUser", $passwSector);

            $stmt->execute();
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);

            if(!is_array($user)) {
                $this->returnResponse(INVALID_USER_PASS, "Invalid user or pass!");
            }

            if(isset($user['useractive']) && $user['useractive'] == 0) {
                $this->returnResponse(USER_NOT_ACTIVE, "User isn't active! Please contact to admin.");
            }

            $payload = [
                'iat' => time(),
                'iss' => $this->ISSUER,
                'exp' => time() + (15*60),
                'userId' => $user['userid']
            ];

            $token = JWT::encode($payload, SECRET_KEY, 'HS256');

            setcookie('tokenUser', $token, [
                'expires' => $payload['exp'], 
                'path' => '/', 
                'domain' => '', 
                'secure' => false, 
                'httponly' => true,
                'samesite' => 'Strict',
            ]);

            $data = ['token' => $token];

            $this->returnResponse(SUCCESSFULL_RESPONSE, $data);

        } catch(\Exception $e) {
            $this->throwError(JWT_PROCESSING_ERROR, $e->getMessage());
        }
    }

    public function getUserDetails() {
        $this->validateParam('userToken', $this->param['userToken'], STRING);
        $this->validateParam('typeUser', $this->param['typeUser'], STRING);

        $userToken = JWT::decode($this->param['userToken'], new Key(SECRET_KEY, 'HS256'));
        $user = new User();
        $user->setIdUser($userToken->userId);
        $result = $user->getUserDetails();
        
        if(!is_array($result)) {
            $this->returnResponse(USER_DETAILS_DONT_FOUND,
        "User Details Data can't be found!");
        }

        if($result['usertype'] != $this->param['typeUser']) {
            $this->returnResponse(USER_TYPE_IS_NOT_EQUAL, 
            "User Type is not equal!");
        }

        $response['userName'] = $result['username'];
        $response['userType'] = $result['usertype'];
        $response['userId'] = $userToken->userId;

        $this->returnResponse(SUCCESSFULL_RESPONSE, $response);
    }

    public function insertOrderSector() {
        $this->validateParam('userToken', $this->param['userToken'], STRING);
        $this->validateParam('reasonCall', $this->param['reasonCall'], STRING);

        $userToken = JWT::decode($this->param['userToken'], new Key(SECRET_KEY, 'HS256'));
        
        $order = new Order();
        $order->setIdUser($userToken->userId);

        $result = $order->insert($this->param['reasonCall']);

        if(!is_array($result)) {
            $this->returnResponse(REASON_CALL_IS_INVALID, 
            "Reason Call is invalid!");
        }
        $orderData = $order->getOrderById(); 
        
        if(!is_array($orderData) && !isset($orderData["idcall"])) {
            $this->returnResponse(ORDER_ID_NOT_FOUND, "Order Id Not found!" . $orderData);
        }

        $response['idCall'] = $orderData['idcall'];

        /*$context = new ZMQContext();
        $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'orderSector');
        $socket->connect("tcp://127.0.0.1:5555");

        $socket->send(json_encode($response));*/

        $this->returnResponse(SUCCESSFULL_RESPONSE, $response);
        
    }

    public function checkOrderSector() {
        $this->validateParam('userToken', $this->param['userToken'], STRING);

        $userToken = JWT::decode($this->param['userToken'], new Key(SECRET_KEY, 'HS256'));

        $order = new Order();
        $order->setIdUser($userToken->userId);
        $result = $order->check();

        if(!is_bool($result)) {
            $this->returnResponse
                (CHECK_ORDER_ISNT_BOOL, "Check Variable isn't bool!");
        }

        $this->returnResponse(SUCCESSFULL_RESPONSE, $result);
    }

    public function listAllOrders() {
        $this->validateParam('userToken', $this->param["userToken"], STRING);

        $userToken = JWT::decode($this->param['userToken'], new Key(SECRET_KEY, 'HS256'));

        $order = new Order();
        $order->setIdUser($userToken->userId);
        $result = $order->listAll();

        if(!is_array($result)) {
            $this->returnResponse(ORDER_IS_NOT_ARRAY, "Order is not array!");
        }

        $this->returnResponse(SUCCESSFULL_RESPONSE, $result);
    } 

    public function getRequestStatusTI() {
        $this->validateParam('userToken', $this->param["userToken"], STRING);

        $userToken = JWT::decode($this->param['userToken'], new Key(SECRET_KEY, 'HS256'));
        
        $order = new Order();
        $order->setIdUser($this->param['targetSector']);
        $result = $order->checkRequest();

        if(!is_bool($result)) {
            $this->returnResponse(ORDER_IS_NOT_ARRAY, "getRequestStatusTI Order is not a bool!");
        }

        $this->returnResponse(SUCCESSFULL_RESPONSE, $result);
    }

    public function logout() {
        $this->returnResponse(LOGOUT_SUCCESSFULLY,
            "Logout Sucessfully");
    }
}
?>