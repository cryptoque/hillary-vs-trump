<?php

define('ROOTPATH', __DIR__ . '/../../');
define('STAGING', $_SERVER['SERVER_NAME'] === 'localhost');
define('LOGFILE', __DIR__ . '/../logs/votes.log');
define('SECRET', 'Z6i7nNLAo7Xi');

require ROOTPATH . '/vendor/autoload.php';
require __DIR__ . '/functions.php';
use GeoIp2\WebService\Client;

define('CLIENTIP', STAGING ? '1.0.0.0' : getIp());

$_CONFIG = parse_ini_file(ROOTPATH . '/config/config.ini', true);
$_DB = STAGING ? $_CONFIG['staging'] : $_CONFIG['production'];

// Validate client IP
if (filter_var(CLIENTIP, FILTER_VALIDATE_IP) === false) {
  apiError('request.invalid.ip');
}

// Connect DB
$db = new mysqli($_DB['database.host'], $_DB['database.username'], $_DB['database.password']);
if ($db->connect_errno) {
  apiError('db.connect');
}
$db->select_db($_DB['database.dbname']);


// Test if IP already looked up
$results = $db->query("SELECT `country`, `hash` FROM `country-lookup` WHERE `hash` = '" . sha1(CLIENTIP) . "' LIMIT 1");
if ($row = $results->fetch_array(MYSQLI_ASSOC)) {
  $countryCode = $row['country'];

} else {
  // Get country from IP using maxmind api service
  $geoIpClient = new Client($_CONFIG['general']['maxmind.userid'], $_CONFIG['general']['maxmind.key']);
  $record = $geoIpClient->country(CLIENTIP);
  $countryCode = $record->country->isoCode;

  // Insert country into db for caching purposes
  $db->query("INSERT INTO `country-lookup` (`ip`, `hash`, `country`)" .
    "VALUES ('" . anonymizeIp(CLIENTIP) . "', '" . sha1(CLIENTIP) . "', '" . $countryCode . "')")
     or apiError('db.error');
}
$token = sha1($row['hash'] . SECRET . date('Y-m-d'));
echo json_encode(array('country' => $countryCode, 'token' => $token));
die;

