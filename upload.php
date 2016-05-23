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
} else {
    $destination = __DIR__ . '../../images/';
}

if (\Flow\Basic::save($destination . $name_new_file, $config, $request)) {

    echo json_encode([
        'success' => true,
        'files' => $request->getFile(),
        'flowTotalSize' => $request->getTotalSize(),
        'flowIdentifier' => $request->getIdentifier(),
        'flowFilename' => $name_new_file,
        'flowRelativePath' => $request->getRelativePath()
    ]);
} else {
    // This is not a final chunk or request is invalid, continue to upload.
    echo json_encode([
        'success' => false,
        'files' => $request->getFile(),
        'flowTotalSize' => $request->getTotalSize(),
        'flowIdentifier' => $request->getIdentifier(),
        'flowRelativePath' => $request->getRelativePath()
    ]);
}
