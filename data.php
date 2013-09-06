<?php
  	//include("conn.php");
  	// $query = 'INSERT INTO plan VALUES("1", "002281", "光讯科技", "2013-08-22 00:00:00", "1", "1")';
	// $result = mysql_query($query) or die('Query failed: ' . mysql_error());
	//验证权限
	$mysql = new SaeMysql();
	$type = $_REQUEST['type'];
	$act = $_GET['act'];

	//$age = intval( $_REQUEST['age'] );
	
	if($act == "add"){
		$name = $_POST['name'];
		$owner = $_POST['owner'];
		if($type == "item"){
			$sql = "INSERT  INTO `item` ( `name` , `owner` , `mdtime` ) VALUES ( '"  . $mysql->escape( $name ) . "' , '" . $mysql->escape( $owner ) . "' , NOW() ) ";
			$mysql->runSql( $sql );
			$getID = mysql_insert_id();
			$k=new SaeKV();
		    $k->init();
		    $k->set($type.$getID,$_POST['cond']);//建立一条字符串数据
		}
	}
	if($act == "del"){
		$uid = $_GET['uid'];
		$table = $mysql->escape($type);
		$sql = "DELETE FROM `". $table ."` WHERE " .$table. "id = " . $mysql->escape($uid);
		$mysql->runSql( $sql );
		$k=new SaeKV();
	    $k->init();
	    $k->delete($type.$uid);//删除a
	}
	if($act == "query"){
		$table = $mysql->escape($type);
		$sql = "SELECT * FROM `". $table ."` LIMIT 10";
		$data = $mysql->getData( $sql );
		echo "var ".$table."rows= " . json_encode($data) . ";";
		//$k=new SaeKV();
	    //$k->init();
	    //$k->get($type.$uid);////获得b的值
	}	
	
	if( $mysql->errno() != 0 )
	{
	    die( "Error:" . $mysql->errmsg() );
	}
	//echo "{ok:'yes',act:'".$act."'}";
	$mysql->closeDb();
?>