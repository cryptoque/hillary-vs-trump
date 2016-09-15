<?php
define('ROOTPATH', __DIR__ . '/../');
define('STAGING', gethostname() === 'hillary-vs-trump');
define('FILE', ROOTPATH . '/build/json/results.json');

if (!php_sapi_name() == "cli") { die('Only through CLI'); }

$_CONFIG = parse_ini_file(ROOTPATH . '/config/config.ini', true);
$_DB = STAGING ? $_CONFIG['staging'] : $_CONFIG['production'];

// Connect DB
$db = new mysqli($_DB['database.host'], $_DB['database.username'], $_DB['database.password']);
if ($db->connect_errno) { die('db.connect'); }
$db->select_db($_DB['database.dbname']);

// Read votes from DB
$countryCodes = array();
$votes = array('D' => array(), 'R' => array());
$totalVotes = array('D' => 0, 'R' => 0);
$results = $db->query("SELECT `country`, `vote` FROM `votes`");
while ($row = $results->fetch_array(MYSQLI_ASSOC)) {
  $countryCodes[] = $row['country'];

  if (isset($votes[$row['vote']][$row['country']])) {
    $votes[$row['vote']][$row['country']] += 1;
  } else {
    $votes[$row['vote']][$row['country']] = 1;
  }

  if ($row['vote'] === 'D') {
    $totalVotes['D']++;
  } else {
    $totalVotes['R']++;
  }
}

// Calculate percentages
$countryVotes = array();
foreach (array_unique($countryCodes) as $country) {
  $voteH = isset($votes['D'][$country]) ? $votes['D'][$country] : 0;
  $voteT = isset($votes['R'][$country]) ? $votes['R'][$country] : 0;
  $totalVotesForThisCountry = $voteH + $voteT;

  if ($voteH === $voteT) {
    $winner = '?';
    $percentage = 50;
  } else {
    if ($voteH > $voteT) {
      $winner = 'D';
      $percentage = 100 / ($totalVotesForThisCountry / $voteH);
    } else {
      $winner = 'R';
      $percentage = 100 / ($totalVotesForThisCountry / $voteT);
    }
  }

  $countryVotes[$country] = array(
    'winner' => $winner,
    'percentage' => round($percentage)
  );
}

$totalPercentageH = round(100 / (($totalVotes['D']+$totalVotes['R']) / $totalVotes['D']));
$totalPercentageT = round(100 / (($totalVotes['D']+$totalVotes['R']) / $totalVotes['R']));

file_put_contents(FILE, json_encode(array(
  'total' => $totalVotes,
  'D' => $totalPercentageH,
  'R' => $totalPercentageT,
  'countries' => $countryVotes
)), LOCK_EX);
