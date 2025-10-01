<?php

namespace App\Repositories\All\Pages;

use App\Models\Page;
use App\Repositories\Base\BaseRepository;

// repository Class
class PageRepository extends BaseRepository implements PageInterface
{
    /**
     * @var Page
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Page $model)
    {
        $this->model = $model;
    }
}
