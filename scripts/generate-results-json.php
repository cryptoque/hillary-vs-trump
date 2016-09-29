<?php
define('ROOTPATH', __DIR__ . '/../');
define('STAGING', gethostname() !== 'hillary-vs-trump');

if (!php_sapi_name() == 'cli') { die('Only through CLI'); }
$options = getopt('', array('scale:', 'file:'));
if (!isset($options['scale']) || !($options['scale'] === 'total' || $options['scale'] === 'day')) { die('Set scale to either day or total'); }
if (!isset($options['file'])) { die('Specify file'); }

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
if ($options['scale'] === 'total') {
  $query = "SELECT DISTINCT `hash`, `country`, `vote` FROM `votes` ORDER BY `ts` DESC";
} else {
  $query = "SELECT `hash`, `country`, `vote` FROM `votes` WHERE `ts` >= " . (time() - (24*60*60));
}
$results = $db->query($query);
if ($db->error) die ($db->error);

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
  $voteD = isset($votes['D'][$country]) ? $votes['D'][$country] : 0;
  $voteR = isset($votes['R'][$country]) ? $votes['R'][$country] : 0;
  $totalVotesForThisCountry = $voteD + $voteR;

  if ($totalVotesForThisCountry > 0) {
    $percentageD = $voteD ? round(100 / ($totalVotesForThisCountry / $voteD)) : 0;
    $percentageR = $voteR ? round(100 / ($totalVotesForThisCountry / $voteR)) : 0;

    if ($percentageD == 50) {
      $winner = 'S';
      $percentage = 50;
    } else {
      if ($voteD > $voteR) {
        $winner = 'D';
        $percentage = $percentageD;
      } else {
        $winner = 'R';
        $percentage = $percentageR;
      }
    }

    $countryVotes[$country] = array(
      'winner' => $winner,
      'votes' => $totalVotesForThisCountry,
      'percentage' => $percentage
    );
  }
}

$totalPercentageH = round(100 / (($totalVotes['D']+$totalVotes['R']) / $totalVotes['D']));
$totalPercentageT = round(100 / (($totalVotes['D']+$totalVotes['R']) / $totalVotes['R']));

if (!file_put_contents($options['file'], json_encode(array(
  'total' => $totalVotes,
  'D' => $totalPercentageH,
  'R' => $totalPercentageT,
  'countries' => array_orderby($countryVotes, 'votes', SORT_DESC)
), LOCK_EX))) {
  die('Saving failed: ' . $options['file']);
}


function array_orderby()
{
  $args = func_get_args();
  $data = array_shift($args);
  foreach ($args as $n => $field) {
    if (is_string($field)) {
      $tmp = array();
      foreach ($data as $key => $row)
        $tmp[$key] = $row[$field];
      $args[$n] = $tmp;
    }
  }
  $args[] = &$data;
  call_user_func_array('array_multisort', $args);
  return array_pop($args);
}
