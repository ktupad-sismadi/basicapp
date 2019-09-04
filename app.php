<?php
  include('ktupad/ktupad.php');
  class app extends mod {
  public $local= array(
    's' => 'den1.mysql3.gear.host',
    'u' => 'basicapp',
    'p' => 'Yb489Pb-_2Gs',
    'n'=> 'basicapp'
    );
  }
  $app = new app();
  $app -> init();
?>
