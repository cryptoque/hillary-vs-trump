<?php
require __DIR__ . '/../vendor/autoload.php';

define('STAGING', $_SERVER['SERVER_NAME'] === 'localhost');

$_CONFIG = parse_ini_file(__DIR__ . '/../config/config.ini', true);
$_DB = STAGING ? $_CONFIG['staging'] : $_CONFIG['production'];

$clientIp = getIp();

$params = json_decode(file_get_contents('php://input'), true);
if (!count($params)) { invalidVote('Missing parameters'); }

// reCaptcha
if (!STAGING) {
  if (!isset($params['gRecaptchaResponse'])) { invalidVote('Missing captcha'); }
  $recaptcha = new \ReCaptcha\ReCaptcha($_CONFIG['general']['google.recaptcha']);
  $resp = $recaptcha->verify($params['gRecaptchaResponse'], $clientIp);
  if (!$resp->isSuccess()) {
    $errors = $resp->getErrorCodes();
    invalidVote('Invalid captcha response');
  }
}

// Connect DB
$db = new mysqli($_DB['database.host'], $_DB['database.username'], $_DB['database.password']);
if ($db->connect_errno) {
  invalidVote('DB Error');
}
$db->select_db($_DB['database.dbname']);

// Test if unique ip

// Get country from ip

// Insert vote into db

var_dump($params);
die('OK');



function invalidVote($reason) {
  header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
  echo $reason;
  die;
}

function getIp() {
  $ip = isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
  if(strpos($ip,',') !== false) {
    $ip = substr($ip,0,strpos($ip,','));
  }
  return $ip;
}
