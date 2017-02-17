<?php
// 只做保存文件的操作
$data = file_get_contents("php://input"); 
$data = json_decode($data);
switch ( $data->type ) {
	case "catalog":
		echo "catalog";
	    $fp = fopen("./json/catalog.json", "w");//文件被清空后再写入 
		if($fp){ 
			$flag=fwrite($fp, $data->json); 
			if(!$flag) { 
				echo "写入文件失败<br>"; 
				break; 
			} 
	    	fopen("./json/api/".md5($data->name).".json", "w");//文件被清空后再写入 
		}else{ 
			echo "打开文件失败"; 
		}
		fclose($fp);
		echo "写入成功！";
		break;
	
	case "api":
	// echo $data->json;
    	$fp = fopen("./json/api/".md5($data->name).".json", "w");//文件被清空后再写入 
		if($fp){ 
			$flag=fwrite($fp, $data->json); 
			if(!$flag) { 
				echo "写入文件失败<br>"; 
				break; 
			} 
		}else{ 
			echo "打开文件失败"; 
		}
		fclose($fp);
		echo "写入成功！";
		break;
	
	default:
		echo "default";
		break;
}
