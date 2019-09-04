<?php
  include('ktupad/ktupad.php');
  class app extends mod {
  public $local= array(
    's' => 'localhost',
    'u' => 'ktupad',
    'p' => 'db@ktupad',
    'n'=> 'demo'
    );
  }

  $app = new app();
  $app -> init();

?>
