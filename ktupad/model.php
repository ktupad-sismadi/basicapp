<?php
class mod extends ktupad {
  public $mn='data';
  public $tb='data';
  public $data='{"id":"1","nama":"Satu"}';
  public function hi() { echo 'Hi, ktupad'; }
  public function install(){
  $tb=$this->tb;
  $conn=$this->connect();
  $result=$conn->query("DROP TABLE IF EXISTS data");
  $result=$conn->query("CREATE TABLE data (id int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,nama varchar(50) NOT NULL)");
  $result=$conn->query("INSERT INTO data (nama) VALUES ('dua')");
  if(!$result){$result=$conn->error;}
  $conn->close();
  echo json_encode($result);
  }
}

?>
