<?php
define('ROOTPATH', __DIR__ . '/../');
define('STAGING', gethostname() !== 'hillary-vs-trump');

require ROOTPATH . '/src/api/functions.php';

if (!php_sapi_name() == "cli") { die('Only through CLI'); }

$_CONFIG = parse_ini_file(ROOTPATH . '/config/config.ini', true);
$_DB = STAGING ? $_CONFIG['staging'] : $_CONFIG['production'];

// Get de-anonymized ip-list
$deAnonIps = array();
$csvFile = ROOTPATH . '/tmp/result.csv';
$csvFileHandle = fopen($csvFile, 'r');
if (!$csvFileHandle) { die("File not found: " . $csvFile); }
if ($csvFileHandle) {
  while (($line = fgets($csvFileHandle)) !== false)
  {
    $parts = explode(',', trim($line));
    $deAnonIps[$parts[1]] = $parts[0];
  }

  fclose($csvFileHandle);
} else {
  if (!$csvFileHandle) { die("Error opening file: " . $csvFile); }
}

// Connect DB
$db = new mysqli($_DB['database.host'], $_DB['database.username'], $_DB['database.password']);
if ($db->connect_errno) { die('db.connect'); }
$db->select_db($_DB['database.dbname']);

$counter=0;
$results = $db->query("SELECT * FROM `votes` INNER JOIN `country-lookup` ON `votes`.`hash` = `country-lookup`.`hash`");
while ($row = $results->fetch_array(MYSQLI_ASSOC)) {
  $ip = $row['ip'];
  if (strstr($row['ip'], '.xxx')) {
    $ip = $deAnonIps[$row['hash']];
  }

  try {
    $result = json_decode(getUrlContent('http://' . $_CONFIG['general']['getintel.sub'] . '.getipintel.net/check.php?format=json&contact=fili@fili.nl&flags=b&ip=' . $ip));
    if (!$result) {
      $anon = -1;
    } else {
      $anon = $result->result;
    }
  } catch(Exception $e) {
    $anon = -1;
  }

  echo $row['ip'] . "\t" . $anon . PHP_EOL;

  if ($anon > -1) {
    $db->query("UPDATE `votes` SET `anon` = '" . $anon . "' WHERE `votes`.`hash` = '" . $row['hash'] . "' LIMIT 1");
    if ($db->error) {
      die('Error ' . $db->error);
    }
  }

  $counter++;
  if ($counter > 10) die;
}
