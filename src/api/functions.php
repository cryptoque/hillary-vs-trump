<?php
function apiError($reason) {
  logIt($reason);
  header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
  echo json_encode(array('error' => $reason));
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
  if (!is_dir(dirname(LOGFILE))) {
    mkdir(dirname(LOGFILE), 0755);
  }

  $ip = $anonymous ? anonymizeIp(CLIENTIP) : CLIENTIP;
  file_put_contents(LOGFILE, date('d-m-Y H:i:s') . "\t" . $ip . "\t" . $_SERVER["SCRIPT_NAME"] . "\t" . $logline . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function getUrlContent($url){
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
  curl_setopt($ch, CURLOPT_TIMEOUT, 5);
  $data = curl_exec($ch);
  $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return ($httpcode>=200 && $httpcode<300) ? $data : false;
}
