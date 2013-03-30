<?php
/**
 * Explorer Connector
 *
 * @package resource_explorer
 * @subpackage connector
 */
require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';

if (!defined('DEV_FLAG'))  //DEV_FLAG is defined in config.core.php yet?
    $corePath = $modx->getOption('resource_explorer.core_path',null,$modx->getOption('core_path').'components/resource_explorer/');
else
    $corePath = $modx->getOption('dev_path').'ResourceExplorer/core/components/resource_explorer/';
require_once $corePath.'models/explorer.class.php';
$modx->explorer = new Explorer($modx);

$modx->lexicon->load('explorer:default');

/* handle request */
$path = $modx->getOption('processorsPath',$modx->explorer->config,$corePath.'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));