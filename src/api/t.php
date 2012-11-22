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
$var = <<<EOS
(A) Call Mom @Phone +Family
(A) Schedule annual checkup +Health
(B) Outline chapter 5 +Novel @Computer
(C) Add cover sheets @Office +TPSReports
Plan backyard herb garden @Home
Pick up milk @GroceryStore
Research self-publishing services +Novel @Computer
x Download Todo.txt mobile app @Phone
EOS;

    $response = array('data' => $var);
    print json_encode($response, JSON_FORCE_OBJECT);
});


$app->run();


?>