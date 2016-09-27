<?php
define('ROOTPATH', __DIR__ . '/../');
define('STAGING', gethostname() !== 'hillary-vs-trump');

if (!php_sapi_name() == 'cli') { die('Only through CLI'); }
$options = getopt('', array('scale:'));
if (!isset($options['scale']) || !($options['scale'] === 'total' || $options['scale'] === 'day')) { die('Set scale to either day or total'); }

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
$tsThreshold = ($options['scale'] === 'total' ? 0 : time() - (24*60*60));
$results = $db->query("SELECT `country`, `vote` FROM `votes` WHERE `ts` >= " . $tsThreshold);
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
    if ($voteD === $voteR) {
      $winner = 'S';
      $percentage = 50;
    } else {
      if ($voteD > $voteR) {
        $winner = 'D';
        $percentage = 100 / ($totalVotesForThisCountry / $voteD);
      } else {
        $winner = 'R';
        $percentage = 100 / ($totalVotesForThisCountry / $voteR);
      }
    }

    $countryVotes[$country] = array(
      'winner' => $winner,
      'votes' => $totalVotesForThisCountry,
      'percentage' => round($percentage)
    );
  }
}

$totalPercentageH = round(100 / (($totalVotes['D']+$totalVotes['R']) / $totalVotes['D']));
$totalPercentageT = round(100 / (($totalVotes['D']+$totalVotes['R']) / $totalVotes['R']));

echo json_encode(array(
  'total' => $totalVotes,
  'D' => $totalPercentageH,
  'R' => $totalPercentageT,
  'countries' => array_orderby($countryVotes, 'votes', SORT_DESC)
));



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
