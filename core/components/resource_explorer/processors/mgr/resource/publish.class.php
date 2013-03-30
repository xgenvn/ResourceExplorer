<?php
class ExplorerPublishProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'modResource';
    public $languageTopics = array('explorer:default');
    public $objectType = 'explorer.resource';

    public function saveObject()
    {
        $id = $this->getProperty('id', null);
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('explorer.publish_failed_message'));
        }
        //publish this resource and its child
        $this->modx->runProcessor('resource/publish', array(
            'id' => $id,
        ));
        return $this->success();
    }
}

return 'ExplorerPublishProcessor';