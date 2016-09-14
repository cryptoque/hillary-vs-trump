<?php
define('ROOTPATH', __DIR__ . '/../');
define('STAGING', true);
define('FILE', ROOTPATH . '/build/results.json');

if (!php_sapi_name() == "cli") { die('Only through CLI'); }

$_CONFIG = parse_ini_file(ROOTPATH . '/config/config.ini', true);
$_DB = STAGING ? $_CONFIG['staging'] : $_CONFIG['production'];

// Connect DB
$db = new mysqli($_DB['database.host'], $_DB['database.username'], $_DB['database.password']);
if ($db->connect_errno) { die('db.connect'); }
$db->select_db($_DB['database.dbname']);

// Read votes from DB
$countryCodes = array();
$votes = array('H' => array(), 'T' => array());
$totalVotes = array('H' => 0, 'T' => 0);
$results = $db->query("SELECT `country`, `vote` FROM `votes`");
while ($row = $results->fetch_array(MYSQLI_ASSOC)) {
  $countryCodes[] = $row['country'];

  if (isset($votes[$row['vote']][$row['country']])) {
    $votes[$row['vote']][$row['country']] += 1;
  } else {
    $votes[$row['vote']][$row['country']] = 1;
  }

  if ($row['vote'] === 'H') {
    $totalVotes['H']++;
  } else {
    $totalVotes['T']++;
  }
}

// Calculate percentages
$countryVotes = array();
foreach (array_unique($countryCodes) as $country) {
  $voteH = isset($votes['H'][$country]) ? $votes['H'][$country] : 0;
  $voteT = isset($votes['T'][$country]) ? $votes['T'][$country] : 0;
  $totalVotesForThisCountry = $voteH + $voteT;

  if ($voteH === $voteT) {
    $winner = '?';
    $percentage = 50;
  } else {
    if ($voteH > $voteT) {
      $winner = 'H';
      $percentage = 100 / ($totalVotesForThisCountry / $voteH);
    } else {
      $winner = 'T';
      $percentage = 100 / ($totalVotesForThisCountry / $voteT);
    }
  }

  $countryVotes[$country] = array(
    'winner' => $winner,
    'percentage' => round($percentage)
  );
}

$totalPercentageH = round(100 / (($totalVotes['H']+$totalVotes['T']) / $totalVotes['H']));
$totalPercentageT = round(100 / (($totalVotes['H']+$totalVotes['T']) / $totalVotes['T']));

file_put_contents(FILE, json_encode(array(
  'total' => $totalVotes,
  'H' => $totalPercentageH,
  'T' => $totalPercentageT,
  'countries' => $countryVotes
)), LOCK_EX);
