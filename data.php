<?php
  	//include("conn.php");
  	// $query = 'INSERT INTO plan VALUES("1", "002281", "光讯科技", "2013-08-22 00:00:00", "1", "1")';
	// $result = mysql_query($query) or die('Query failed: ' . mysql_error());
	//验证权限
	$mysql = new SaeMysql();
	$type = $_REQUEST['type'];
	$act = $_GET['act'];
	$table = $mysql->escape($type);
	//$age = intval( $_REQUEST['age'] );
	
	if($act == "add"){
		$name = $_POST['name'];
		$owner = $_POST['owner'];
		if($table != "plan"){
			$sql = "INSERT  INTO `".$table. "` ( `name` , `owner` , `mdtime` ) VALUES ( '"  . $mysql->escape( $name ) . "' , '" . $mysql->escape( $owner ) . "' , NOW() ) ";
			$mysql->runSql( $sql );
			$getID = mysql_insert_id();
			$k=new SaeKV();
		    $k->init();
		    $k->set($table.$getID,$_POST['cond']);//建立一条字符串数据
		}else {
			$code = $_POST['stockcode'];
			$pid = $_POST['procid'];
			$remark = $_POST['remark'];
			$sql = "INSERT  INTO `".$table. "` ( `stockcode` , `stockname` , `procid` ,`owner` , `mdtime`, `remark` ) VALUES ( '"  . $mysql->escape( $code ) . "' , '". $mysql->escape( $name ) . "' , '" . $mysql->escape( $pid ) . "' , '" . $mysql->escape( $owner ) . "' , NOW() ,'". $mysql->escape( $remark )."') ";
			$mysql->runSql( $sql );
		}
	}
	if($act == "edit"){
		$uid = $_GET['uid'];
		$name = $_POST['name'];
		if($table != "plan"){
			$sql = "UPDATE `".$table. "` SET name='"  . $mysql->escape( $name ) . "' WHERE ".$table. "id = " . $mysql->escape($uid);
			$mysql->runSql( $sql );

			$k=new SaeKV();
		    $k->init();
		    $k->set($table.$uid,$_POST['cond']);//建立一条字符串数据
		}
	}
	if($act == "del"){
		$uid = $_GET['uid'];
		$sql = "DELETE FROM `". $table ."` WHERE " .$table. "id = " . $mysql->escape($uid);
		$mysql->runSql( $sql );
		$k=new SaeKV();
	    $k->init();
	    $k->delete($type.$uid);//删除a
	}
	if($act == "query"){
		$sql = "SELECT * FROM `". $table ."` LIMIT 10";
		$data = $mysql->getData( $sql );
		echo "var ".$table."rows= " . json_encode($data) . ";";
		//$k=new SaeKV();
	    //$k->init();
	    //$k->get($type.$uid);////获得b的值
	}	
	if($act == "kv"){
		$uid = $_GET['uid'];
		$k=new SaeKV();
	    $k->init();
	    error_reporting (E_ALL ^ E_NOTICE);
	    $ret=$k->get($type.$uid);//获得b的值
	    error_reporting (E_ALL);
	    echo "var ".$table."kv= " . json_encode($ret) . ";";
	}
	if( $mysql->errno() != 0 )
	{
	    die( "Error:" . $mysql->errmsg() );
	}
	//echo "{ok:'yes',act:'".$act."'}";
	$mysql->closeDb();
?>