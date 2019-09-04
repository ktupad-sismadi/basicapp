<?php session_start();
date_default_timezone_set('Asia/Jakarta');

ini_set('display_errors', 1);
error_reporting(E_ALL);

$path='model.php';

$e = json_decode(file_get_contents('php://input'), true);
if(isset($e['path'])){$path=$e['path'];}
else {
$r=$_REQUEST;
if(isset($r['path'])){ $path=$r['path'];}
}
include($path);


class koneksi{
  public $local= array(
  's' => 'localhost',
  'u' => 'ktupad',
  'p' => 'db@ktupad',
  'n'=> 'pos2'
  );

  function connect(){
  $db=$this->local ;
  // $conn = new mysqli($this-> s, $this-> u, $this-> p, $this-> db);
  $conn = new mysqli($db['s'],$db['u'],$db['p'],$db['n'] );
  if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error);}
  return $conn;
  }
  }



class ktupad extends koneksi {
public $isTingkat=0;
public $isAkses=0;

public $uid = 1;
public $token = 1;

public $tb = 'data';
public $data='{"id":"7","nama":"bismillah"}';
public $sql = '';
public $cond='';
public $conds='';
public $sortir='ORDER BY id DESC';
public $limit=100;
public $offset=0;

public $filetype = 'images/*';
public $filedir = 'files/';

function init(){
$r=$_REQUEST;
if(isset($r)){ foreach ($r as $key=>$val) { $this->$key=$val; }	}
if(isset($r['mod'])){ $func=$r['mod'];	$this->$func();}
else {

$e = json_decode(file_get_contents('php://input'), true);
if(isset($e)){ foreach ($e as $key=>$val) { $this->$key=$val; }	}
if(isset($e['mod'])){ $func=$e['mod'];	$this->$func();}
else { $out=array('Info'=>'Hello Ktupad'); echo json_encode($out);  }

}
}

public function sql($tel,$act,$sql){
$tAkses=$this->akses();
$conn=$this->connect();
$conn->query("SET SESSION sql_mode = ''");

if(in_array($tel, $tAkses)) {

$result = $conn->query($sql);
$col=[];
$data=[];
$arr = array("Read", "Table");
if(in_array ($act,$arr)){
	$data=[];
	while($fld = $result->fetch_field()) { $col[] = $fld->name; }
	while($row = $result->fetch_assoc()) { $data[] = $row; }
}
$out=array('sql'=>$sql,'info'=>'Berhasil '.$act,'fld'=>$col,'data'=>$data,'akses'=>$tAkses );
}

else { $out=array('sql'=>$sql,'info'=>'Gagal '.$act,'akses'=>$tAkses );}

return $out;
$conn->close();
}

public function create(){
$tb=$this->tb;
$data=$this->data;
foreach($data as $key => $val) { $obj[]=$key."='".$val."'"; }
$row = implode(',',$obj);
$sql="INSERT INTO $tb SET $row";
$out=$this->sql('t','Create',$sql);
echo json_encode($out);
}
// end create

public function read(){
$id=$this->id;
$tb=$this->tb;
$sql = "SELECT * FROM $tb WHERE id=$id";
$out=$this->sql('l','Read',$sql);
echo json_encode($out);
}
// end read
public function update(){
$data=$this->data;
$id=$this->id;
$tb=$this->tb;
foreach($data as $key => $val) { $obj[]=$key."='".$val."'"; }
$row = implode(',',$obj);
$sql = "UPDATE $tb SET $row WHERE id=$id";
$out=$this->sql('e','Update',$sql);
echo json_encode($out);
}
// end update
public function delete(){
$id=$this->id;
$tb=$this->tb;
$sql="DELETE FROM $tb WHERE id IN ($id)";
$out=$this->sql('e','Delete',$sql);
echo json_encode($out);
} // end delete

public function filter(){
$id=$this->id;
$tb=$this->tb;
$cond=$this->cond;
$conds=$this->conds;
$offset=$this->offset;
$limit=$this->limit;;
$sortir=$this->sortir;

$sql = "SELECT * FROM $tb WHERE id IN (SELECT id FROM $tb $conds ) $cond $sortir LIMIT $offset, $limit  ";
$out=$this->sql('l','Filter',$sql);
echo json_encode($out);
}  // end filter


public function table(){
$tb=$this->tb;
$cond=$this->cond;
$conds=$this->conds;
$limit=$this->limit;
$offset=$this->offset;
$sortir=$this->sortir;

$cond1=$this->tingkat();
$sql="SELECT * FROM $tb WHERE id IN (SELECT id FROM $tb $conds)	$cond1 $cond $sortir LIMIT $offset, $limit ";
$out=$this->sql('l','Table',$sql);
echo json_encode($out);
}


function import(){
$tb=$this->tb;
$csv = file_get_contents($_FILES['afile']['tmp_name']);
echo $csv;
file_put_contents('data.csv', $csv);
$handle = fopen("data.csv", "r");
$data = fgetcsv($handle, 1000, ";");
$conn=$this->connect();
foreach ($data as $key) {$kolom[]=$key; }
while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
$datasecs=null;
for ($i=1 ;$i< count($kolom); ++$i){$datasecs[]=$kolom[$i]."='".$data[$i]."'" ; };
$datas=implode(",", $datasecs);
$sql = "INSERT INTO $tb set $datas";
$result = $conn->query($sql);
}
$conn->close();
fclose($handle);
echo $csv.$sql;

}

public function upload(){
$target_dir = $this->filedir;
// $target_dir = $_REQUEST['dir'];
$target_file = $target_dir . basename($_FILES["afile"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

$fileName = $_FILES['afile']['name'];
$fileType = $_FILES['afile']['type'];
$fileContent = file_get_contents($_FILES['afile']['tmp_name']);


if(isset($_POST["submit"])) {
$check = getimagesize($_FILES["afile"]["tmp_name"]);
if($check !== false) {
echo "File is an image - " . $check["mime"] . ".";
$uploadOk = 1;
} else {
echo "File is not an image.";
$uploadOk = 0;
}
}
// Check if file already exists
if (file_exists($target_file)) {
echo "Sorry, file already exists.";
$uploadOk = 0;
}
// Check file size
if ($_FILES["afile"]["size"] > 500000) {
echo "Sorry, your file is too large.";
$uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
$uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {

if (move_uploaded_file($_FILES["afile"]["tmp_name"], $target_file)) {
$out=array(
'file'=>	$target_dir.basename( $_FILES["afile"]["name"]),
'mod'=>'Upload');
echo json_encode($out);
}
else { echo "Sorry, there was an error uploading your file.";	}
}
}


public function token(){
$token=$this->token;
echo $sql = "SELECT * FROM master_users where token='$token'";
$conn=$this->connect();
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$conn->close();
if($row){$uid=$row['id'];$aid=$row['akses'];} else {
	$uid=0;
	$aid=0; }
$out=array(
'uid'=>$uid,
'aid'=>$aid);
return $out;
}

public function tingkat(){
	if(!$this->isTingkat){$cond1='';} else {
	$token=$this->token();
	$induk=$token['uid'];
	$cond1="AND uid IN (
	SELECT  id FROM (SELECT * FROM master_users ORDER BY induk, id) sa,
	(SELECT @p := $induk ) init
	WHERE   find_in_set(induk, @p) > 0
	AND     @p := concat(@p, ',', id)
	UNION
	SELECT $induk
	)";
}
	return $cond1;
}


public function akses(){
if(!$this->isAkses){ $tel=["t","e","l"]; }
else{
$conn=$this->connect();
 $token=$this->token();
echo $aksesid=$token['aid'];
$mn=$this->mn;
$result =$conn->query("select id from master_menu where nama='$mn'");
$row = $result->fetch_array();
$mnid=$row[0];
$conn->query("set @p='$mn',@aksesid='$aksesid';");
$result = $conn->query("SELECT lihat,tambah,edit FROM master_akses WHERE id=@aksesid");
$row = $result->fetch_assoc();
$conn->close();
$row['tambah'];

 $lihat=explode(",",$row['lihat']);
$tambah=explode(",",$row['tambah']);
$edit=explode(",",$row['edit']);

$tel=[];
if(in_array($mnid, $tambah)) { array_push($tel, 't'); }
if(in_array($mnid, $edit)) { array_push($tel, 'e'); }
if(in_array($mnid, $lihat)) { array_push($tel, 'l'); }
}
return $tel;
}
} // end crud

?>
