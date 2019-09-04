<?php
  include('ktupad/ktupad.php');
  class app extends mod {
  public $local= array(
    's' => 'den1.mysql2.gear.host',
    'u' => 'basicktupad',
    'p' => 'Wc9If!80_3TF',
    'n'=> 'basicktupad'
    );
  }

  $app = new app();
  $app -> init();

?>
