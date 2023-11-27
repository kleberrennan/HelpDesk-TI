<?php
spl_autoload_register(function($className) {
    $className = strtolower($className);
    $path = "";
    switch($className) {
        case "api":
        case "rest":
            $path = __DIR__ . "/../app/" . $className . ".php";
            break;
        case "database":
            $path = __DIR__ . "/../agent/" . $className . ".php";
            break;
    };
    
    if(file_exists($path)) {
        require_once($path);
    } else {
        echo "Class: " . $className . " can't be found!";
    }
});
?>