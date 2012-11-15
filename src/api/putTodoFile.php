<?php

/**
 * Upload a file to the authenticated user's Dropbox
 * @link https://www.dropbox.com/developers/reference/api#files-POST
 * @link https://github.com/BenTheDesigner/Dropbox/blob/master/Dropbox/API.php#L80-110
 */

// Require the bootstrap
require_once('bootstrap.php');

// Create a temporary file and write some data to it
$tmp = tempnam('/tmp', 'dropbox');
$postdata = file_get_contents("php://input");
$json = json_decode($postdata);
$data = $json->text;

file_put_contents($tmp, $data);

// Upload the file with an alternative filename
$put = $dropbox->putFile($tmp, 'todo.txt');

// Unlink the temporary file
unlink($tmp);

// Dump the output

var_dump($put);