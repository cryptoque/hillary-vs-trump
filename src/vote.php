<?php
require __DIR__ . '/../vendor/autoload.php';

define('STAGING', $_SERVER['SERVER_NAME'] === 'localhost');

$_CONFIG = parse_ini_file(__DIR__ . '/../config/config.ini', true);
$_DB = STAGING ? $_CONFIG['staging'] : $_CONFIG['production'];
$logFile = __DIR__ . '/../logs/votes.log';

// Validate client IP
$clientIp = getIp();
if (STAGING) { $clientIp = '1.0.0.0'; }
if (filter_var($clientIp, FILTER_VALIDATE_IP) === false) {
  invalidVote('Invalid IP');
}

$params = json_decode(file_get_contents('php://input'), true);
if (!count($params)) { invalidVote('Missing parameters'); }

// reCaptcha
if (!STAGING) {
  if (!isset($params['gRecaptchaResponse'])) { invalidVote('Missing Captcha'); }
  $recaptcha = new \ReCaptcha\ReCaptcha($_CONFIG['general']['google.recaptcha']);
  $resp = $recaptcha->verify($params['gRecaptchaResponse'], $clientIp);
  if (!$resp->isSuccess()) {
    $errors = $resp->getErrorCodes();
    invalidVote('Invalid Captcha Response');
  }
}

// Connect DB
$db = new mysqli($_DB['database.host'], $_DB['database.username'], $_DB['database.password']);
if ($db->connect_errno) {
  invalidVote('DB Connect Error');
}
$db->select_db($_DB['database.dbname']);

// Test if ip already voted
$results = $db->query("SELECT `hash` FROM `votes` WHERE `hash` = '" . sha1($clientIp) . "' LIMIT 1");
if ($results->num_rows) {
  invalidVote('Already voted');
}

// Get country from ip
use GeoIp2\WebService\Client;
$geoIpClient = new Client($_CONFIG['general']['maxmind.userid'], $_CONFIG['general']['maxmind.key']);
$record = $geoIpClient->country($clientIp);
$countryCode = $record->country->isoCode;

// Insert vote into db
$db->query("INSERT INTO `votes` (`ts`, `ip`, `hash`, `vote`, `country`)" .
    "VALUES ('" . time() . "', '" . anonymizeIp($clientIp) . "'," .
    "'" . sha1($clientIp) . "', '" . mysqli_escape_string($db, $params['vote']) . "', '" . $countryCode . "')")
    or invalidVote('DB Error ' . $db->errno);


logIt('Success. Vote = ' . $params['vote'] . ", Country = " . $countryCode);
die('OK');



function invalidVote($reason) {
  logIt($reason);
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

function anonymizeIp($ipv4Or6) {
  $separator = filter_var($ipv4Or6, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) ? '.' : ':';
  return substr($ipv4Or6, 0, strrpos($ipv4Or6, $separator)) . $separator . 'xxx';
}

function logIt($logline, $anonymous = true) {
  global $logFile, $clientIp;

  if (!is_dir(dirname($logFile))) {
    mkdir(dirname($logFile), 0755);
  }

  $ip = $anonymous ? anonymizeIp($clientIp) : $clientIp;
  file_put_contents($logFile, date('d-m-Y H:i:s') . "\t" . $ip . "\t" . $logline . PHP_EOL, FILE_APPEND | LOCK_EX);
}
