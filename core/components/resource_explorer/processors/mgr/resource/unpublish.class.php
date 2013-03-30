<?php
class ExplorerUnpublishProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'modResource';
    public $languageTopics = array('explorer:default');
    public $objectType = 'explorer.resource';

    public function saveObject()
    {
        $id = $this->getProperty('id', null);
        if (empty($id)) {
            return $this->failure($this->modx->lexicon('explorer.unpublish_failed_message'));
        }
        //unpublish this resource and its child
        $this->modx->runProcessor('resource/unpublish', array(
            'id' => $id,
        ));
        return $this->success();
    }
}

return 'ExplorerUnpublishProcessor';