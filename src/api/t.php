<?php

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set('html_errors', 'On');

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

///////////////////////////////////////////////////////////////////////////
// Routes
///////////////////////////////////////////////////////////////////////////

// POST route
$app->post('/info', function () {
    print "Hello World!";
});

// POST route
$app->post('/getTodos', function () {

    // mysqli
    $mysqli = new mysqli("localhost", "todotxtjs", "todotxtjs", "todotxtjs");
    $result = $mysqli->query("SELECT data FROM data WHERE user = 'test'");
    $row = $result->fetch_assoc();
    $var = $row['data'];

    $response = array('data' => $var);
    print json_encode($response, JSON_FORCE_OBJECT);
});

// POST route
$app->post('/setTodos', function () {

    // mysqli
    //$mysqli = new mysqli("localhost", "todotxtjs", "todotxtjs", "todotxtjs");
    //$result = $mysqli->query("SELECT data FROM data WHERE user = 'test'");
    //$row = $result->fetch_assoc();
    //$var = $row['data'];

    //$response = array('data' => $var);
    //print json_encode($response, JSON_FORCE_OBJECT);
});


$app->run();


?>