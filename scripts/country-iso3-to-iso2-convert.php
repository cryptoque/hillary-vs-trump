<?php

define('ROOTPATH', __DIR__ . '/../');
$countriesTopo = file_get_contents(ROOTPATH . '/src/countries-iso3.topo.json');
$iso3to2 = array_flip(json_decode(file_get_contents(ROOTPATH . '/scripts/iso3.json'), true));

foreach($iso3to2 as $iso3 => $iso2) {
  $countriesTopo = str_replace('"id":"' .$iso3 . '"', '"id":"' .$iso2 . '"', $countriesTopo);
}

echo $countriesTopo;
