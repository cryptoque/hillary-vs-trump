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
  $recaptcha = new \ReCaptcha\ReCaptcha($_CONFIG['google.recaptcha']);
  $resp = $recaptcha->verify($params['gRecaptchaResponse'], $clientIp);
  if (!$resp->isSuccess()) {
    $errors = $resp->getErrorCodes();
    invalidVote('Invalid captcha response');
  }
}

// Connect DB
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
  $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ? $_SERVER['HTTP_X_FORWARDED_FOR'] : $_SERVER['REMOTE_ADDR'];
  if(strpos($ip,',') !== false) {
    $ip = substr($ip,0,strpos($ip,','));
  }
  return $ip;
}