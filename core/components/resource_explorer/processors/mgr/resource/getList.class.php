<?php
/**
 * Get a list of Explorer
 *
 * @package explorer
 * @subpackage processors
 */
class ExplorerGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'modResource';
    public $languageTopics = array('explorer:default');
    public $defaultSortField = 'pagetitle';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'explorer.resource';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');
        $pid = intval($this->getProperty('pid'));
        $context_key = $this->getProperty('context_key');
        $search_all_flag = $this->getProperty('search_all_flag');
        if (!empty($query)) {
            $c->where(array(
                'pagetitle:LIKE' => '%' . $query . '%',
                'OR:uri:LIKE' => '%' . $query . '%',
                'OR:id:=' => $query
            ));
            if (!$search_all_flag)
                $c->andCondition(array('parent:=' => $pid));
        } else {
            $c->where(array(
                'parent:=' => $pid
            ));
        }
        if (!empty($context_key))
            $c->andCondition(array('context_key:='=>$context_key));

        $c->sortby('isfolder', 'DESC');
        return $c;
    }
}

return 'ExplorerGetListProcessor';