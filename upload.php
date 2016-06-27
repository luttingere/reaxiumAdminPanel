<?php
/**
 * Created by PhpStorm.
 * User: VladimirIlich
 * Date: 20/5/2016
 * Time: 08:31
 */

require_once(__DIR__ . '/Flow/Autoloader.php');


Flow\Autoloader::register();

$config = new \Flow\Config();
$config->setTempDir('./temp');
$file = new \Flow\File($config);
$request = new \Flow\Request();


//renombrando el archivo que se sube a servidor
$arrayName = explode('.', $request->getFileName());
$aux_rand = rand(1, 1000);
$name_new_file = $arrayName[0] . $aux_rand . '.' . $arrayName[1];

//si el archivo tiene extension .csv lo guardo en otra carpeta
if (strtolower($arrayName[1]) === 'csv') {

    $destination = __DIR__ . '../../reports_school/';
    saveFile($destination,$name_new_file,$config,$request);
}
else if($arrayName[1] === 'png' || $arrayName[1] === 'jpg' || $arrayName[1] === 'jpeg'){

    $destination = __DIR__ . '../../images/';

    if($request->getTotalSize() < 70000){
        saveFile($destination,$name_new_file,$config,$request);
    }
    else{
        echo json_encode([
            'success' => false,
            'files' => $request->getFile(),
            'flowTotalSize' => $request->getTotalSize(),
            'flowIdentifier' => $request->getIdentifier(),
            'flowRelativePath' => $request->getRelativePath(),
            'codeError'=>'1'
        ]);
    }

}else{
    // extension del archivo invalida

    echo json_encode([
        'success' => false,
        'files' => $request->getFile(),
        'flowTotalSize' => $request->getTotalSize(),
        'flowIdentifier' => $request->getIdentifier(),
        'flowRelativePath' => $request->getRelativePath(),
        'codeError'=>'2'
    ]);
}


/**
 * Save image
 * @param $destination
 * @param $name_new_file
 * @param $config
 * @param $request
 */
function saveFile($destination,$name_new_file,$config,$request){

    if (\Flow\Basic::save($destination . $name_new_file, $config, $request)) {

        echo json_encode([
            'success' => true,
            'files' => $request->getFile(),
            'flowTotalSize' => $request->getTotalSize(),
            'flowIdentifier' => $request->getIdentifier(),
            'flowFilename' => $name_new_file,
            'flowRelativePath' => $request->getRelativePath(),
            'codeError'=>'0'
        ]);
    } else {
        // This is not a final chunk or request is invalid, continue to upload.
        echo json_encode([
            'success' => false,
            'files' => $request->getFile(),
            'flowTotalSize' => $request->getTotalSize(),
            'flowIdentifier' => $request->getIdentifier(),
            'flowRelativePath' => $request->getRelativePath(),
            'codeError'=>'3'
        ]);
    }
}

