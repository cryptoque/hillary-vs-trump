<?php

define('ROOTPATH', __DIR__ . '/../../');
define('STAGING', gethostname() !== 'hillary-vs-trump');
define('LOGFILE', ROOTPATH . '/logs/votes.log');

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
$hashedIp = sha1($_CONFIG['general']['ip.salt'] . sha1(CLIENTIP));
$results = $db->query("SELECT `country`, `hash` FROM `country-lookup` WHERE `hash` = '" . $hashedIp . "' LIMIT 1");
if ($row = $results->fetch_array(MYSQLI_ASSOC)) {
  $countryCode = $row['country'];

} else {
  // Ip to country lookup is done using maxmind api service (https://www.maxmind.com/en/home)
  try {
    $geoIpClient = new Client($_CONFIG['general']['maxmind.userid'], $_CONFIG['general']['maxmind.key']);
    $record = $geoIpClient->country(CLIENTIP);
    $countryCode = $record->country->isoCode;
  } catch (Exception $e) {
    // Fallback for dev
    if (STAGING) {
      $countryCode = 'AU';
    }
  }

  if (strlen($countryCode) !== 2) {
    apiError('error.geoip');
  }

  // Insert country into db for caching purposes
  $db->query("INSERT INTO `country-lookup` (`hash`, `country`) VALUES ('" . $hashedIp . "', '" . $countryCode . "')")
     or apiError('error.geoip');
}


$token = sha1($hashedIp . $_CONFIG['general']['hash.secret'] . date('Y-m-d'));
echo json_encode(array('country' => $countryCode, 'token' => $token));
die;

