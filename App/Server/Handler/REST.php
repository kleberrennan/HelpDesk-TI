<?php
namespace ITERMA\Handler;

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once(__DIR__ . "/../Define/constants.php");

use ITERMA\Handler\API;
use ITERMA\Agent\Database;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class REST {
    protected $request;
    protected $serviceName;
    protected $param;
    protected $dbConn;
    protected $userId;

    public function __construct() {
        if($_SERVER['REQUEST_METHOD'] !== "POST") {
            $this->throwError(REQUEST_METHOD_NOT_VALID, 
            "REQUEST METHOD is not valid!");
        };
        $handler = fopen('php://input', 'r');
        $this->request = stream_get_contents($handler);
        $this->validateRequest();

        $db = new Database();
        $this->dbConn = $db->connect();

        if('generatetoken' != strtolower($this->serviceName)) {
            $this->validateToken();
        }
    }

    public function validateRequest() {
        if(isset($_SERVER['CONTENT-TYPE']) && $_SERVER["CONTENT-TYPE"] != 'application/json') {
            $this->throwError(REQUEST_CONTENTTYPE_NOT_VALID, 
            "Content Type is not valid!" . $_SERVER["Content-Type"]);
        }

        $data = json_decode($this->request, true);

        if(!isset($data["name"]) || $data["name"] == "") {
            $this->throwError(API_NAME_REQUIRED, 
            "API Name Required!");
        }

        $this->serviceName = $data['name'];
        
        if(!isset($data['param']) || $data['param'] == "") {
            $this->throwError(API_PARAM_REQUIRED,
            "API Parameters Required!");
        }

        $this->param = $data['param']; 
    }

    public function validateParam($fieldName, $value, $dataType, $required = true) {
        if($required == true && empty($value) == true) {
            $this->throwError(VALIDATE_PARAM_REQUIRED,
            "$fieldName Parameter is required!");
        }

        switch($dataType) {
            case BOOLEAN:
                if(!is_bool($dataType)) {
                    $this->throwError(VALIDATE_PARAM_DATATYPE, "$dataType isn't a bool value valid!");
                }
                break;
            case INTEGER:
                if(!is_int($dataType)) {
                    $this->throwError(VALIDATE_PARAM_DATATYPE, "$dataType isn't a integer value valid!");
                }
                break;
            case STRING:
                if(!is_string($dataType)) {
                    $this->throwError(VALIDATE_PARAM_DATATYPE, "$dataType isn't a string value valid!");
                }
                break;
            default:
                $this->throwError(VALIDATE_PARAM_DATATYPE, "DataType isn't valid type!");
                break;
        }

        return $value;
    }

    public function validateToken() {
        try {
            $token = $this->getBearerToken();
            $payload = JWT::decode
                ($token, new Key(SECRET_KEY, 'HS256'));

            $stmt = $this->dbConn->prepare("SELECT * FROM users WHERE userId=:idUser");
            $stmt->bindParam(":idUser", $payload->userId, \PDO::PARAM_INT);
            $stmt->execute();
            $user = $stmt->fetch(\PDO::FETCH_ASSOC);
            if(!is_array($user)) {
                $this->returnResponse(INVALID_USER_PASS, 
                "This user is not found!");
            }

            /*if($user['active'] == 0) {
                $this->returnResponse(USER_NOT_ACTIVE, 
                "User is not active! Contact the admin, please!");
            }*/

            $this->userId = $payload->userId;
        } catch(\Exception $e) {
            $this->throwError(ACCESS_TOKEN_ERRORS, 
                $e->getMessage());
        }
    }

    public function getAuthorizationHeader() {
        $headers = null;
        
        if(isset($_SERVER["Authorization"])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if(isset($_SERVER["HTTP_AUTHORIZATION"])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } else if(function_exists("apache_request_headers")) {
            $requestHeaders = apache_request_headers();

            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            
            if(isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        return $headers;
    }

    public function getBearerToken() {
        $headers = $this->getAuthorizationHeader();

        if(!empty($headers)) {
            if(preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }

        $this->throwError(AUTHORIZATION_HEADER_NOT_FOUND,
        "Access Token not found!");
    }

    public function processAPI() {
        try {
            $api = new API();
            $rMethod = new \ReflectionMethod($api, $this->serviceName);
            if(!method_exists($api, $this->serviceName)) {
                $this->throwError(API_NO_EXISTS, "API doesn't exists!");
            }

            $rMethod->invoke($api);
        } catch(\Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    public function throwError($codeErr, $msg) {
        header("Content-Type: application/json");
        $response = json_encode(['error' => ['status' => $codeErr, 'message' => $msg]]);
        echo $response; exit;
    }

    public function returnResponse($codeErr, $msg) {
        header("Content-Type: application/json");
        $response = json_encode(['response' => ['status' => $codeErr, 'message' => $msg]]);
        echo $response; exit;
    }
}
?>