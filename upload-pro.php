<?php
/**
 * This is the implementation of the server side part of
 * Flow.js client script, which sends/uploads files
 * to a server in several chunks.
 *
 * The script receives the files in a standard way as if
 * the files were uploaded using standard HTML form (multipart).
 *
 * This PHP script stores all the chunks of a file in a temporary
 * directory (`temp`) with the extension `_part<#ChunkN>`. Once all
 * the parts have been uploaded, a final destination file is
 * being created from all the stored parts (appending one by one).
 *
 * @author Gregory Chris (http://online-php.com)
 * @email www.online.php@gmail.com
 */


////////////////////////////////////////////////////////////////////
// THE SCRIPT
////////////////////////////////////////////////////////////////////

//check if request is GET and the requested chunk exists or not. this makes testChunks work
$tempDir = __DIR__ . DIRECTORY_SEPARATOR . '../reaxium_user_images';

if (!file_exists($tempDir)) {
	mkdir($tempDir,0777, true);
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	$chunkDir = $tempDir . DIRECTORY_SEPARATOR . $_GET['flowIdentifier'];
	$chunkFile = $chunkDir.'/chunk.part'.$_GET['flowChunkNumber'];
	if (file_exists($chunkFile)) {
		header("HTTP/1.0 200 Ok");
	} else {
		header("HTTP/1.1 204 No Content");
	}
}


// loop through files and move the chunks to a temporarily created directory
if (!empty($_FILES)) foreach ($_FILES as $file) {

	// check the error status
	if ($file['error'] != 0) {
		_log('error '.$file['error'].' in file '.$_POST['flowFilename']);
		continue;
	}

	// init the destination file (format <filename.ext>.part<#chunk>
	// the file is stored in a temporary directory
	$temp_dir = '../reaxium_user_images/'.$_POST['flowIdentifier'];
	$dest_file = $temp_dir.'/'.$_POST['flowFilename'].'.part'.$_POST['flowChunkNumber'];


	// create the temporary directory
	if (!is_dir($temp_dir)) {
		mkdir($temp_dir, 0777, true);
	}

	// move the temporary file
	if (!move_uploaded_file($file['tmp_name'], $dest_file)) {
		_log('Error saving (move_uploaded_file) chunk '.$_POST['flowChunkNumber'].' for file '.$_POST['flowFilename']);
	} else {

		// check if all the parts present, and create the final destination file
		$succesUpload = createFileFromChunks($temp_dir, $_POST['flowFilename'],$_POST['flowChunkSize'], $_POST['flowTotalSize']);


			echo json_encode([
					'success' => (!$succesUpload) ? false : true,
					'files' => $_FILES,
					'get' => $_GET,
					'post' => $_POST,

					'flowTotalSize' => isset($_FILES['file']) ? $_FILES['file']['size'] : $_GET['flowTotalSize'],
					'flowIdentifier' => isset($_FILES['file']) ? $_FILES['file']['name'] . '-' . $_FILES['file']['size']
							: $_GET['flowIdentifier'],
					'flowFilename' => isset($_FILES['file']) ? $_FILES['file']['name'] : $_GET['flowFilename'],
					'flowRelativePath' => isset($_FILES['file']) ? $_FILES['file']['tmp_name'] : $_GET['flowRelativePath']
			]);

	}

}


////////////////////////////////////////////////////////////////////
// THE FUNCTIONS
////////////////////////////////////////////////////////////////////

/**
 *
 * Logging operation - to a file (upload_log.txt) and to the stdout
 * @param string $str - the logging string
 */
function _log($str) {

	// log to the output
	$log_str = date('d.m.Y').": {$str}\r\n";
	//echo $log_str;

	// log to file
	if (($fp = fopen('upload_log.txt', 'a+')) !== false) {
		fputs($fp, $log_str);
		fclose($fp);
	}
}

/**
 *
 * Delete a directory RECURSIVELY
 * @param string $dir - directory path
 * @link http://php.net/manual/en/function.rmdir.php
 */
function rrmdir($dir) {
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object != "." && $object != "..") {
				if (filetype($dir . "/" . $object) == "dir") {
					rrmdir($dir . "/" . $object);
				} else {
					unlink($dir . "/" . $object);
				}
			}
		}
		reset($objects);
		rmdir($dir);
	}
}

/**
 *
 * Check if all the parts exist, and
 * gather all the parts of the file together
 * @param string $dir - the temporary directory holding all the parts of the file
 * @param string $fileName - the original file name
 * @param string $chunkSize - each chunk size (in bytes)
 * @param string $totalSize - original file size (in bytes)
 */
function createFileFromChunks($temp_dir, $fileName, $chunkSize, $totalSize) {

	$response = true;
	// count all the parts of this file
	$total_files = 0;
	foreach(scandir($temp_dir) as $file) {
		if (stripos($file, $fileName) !== false) {
			$total_files++;
		}
	}

	// check that all the parts are present
	// the size of the last part is between chunkSize and 2*$chunkSize
	if ($total_files * $chunkSize >=  ($totalSize - $chunkSize + 1)) {

		// create the final destination file
		if (($fp = fopen('../reaxium_user_images/'.$fileName, 'w')) !== false) {
			for ($i=1; $i<=$total_files; $i++) {
				fwrite($fp, file_get_contents($temp_dir.'/'.$fileName.'.part'.$i));
				_log('writing chunk '.$i);
			}
			fclose($fp);
		} else {
			_log('cannot create the destination file');
			$response = false;
		}

		// rename the temporary directory (to avoid access from other
		// concurrent chunks uploads) and than delete it
		if (rename($temp_dir, $temp_dir.'_UNUSED')) {
			rrmdir($temp_dir.'_UNUSED');
		} else {
			rrmdir($temp_dir);
		}
	}

	return $response;
}

