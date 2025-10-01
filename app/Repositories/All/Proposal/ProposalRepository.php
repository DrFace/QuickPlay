<?php

namespace App\Repositories\All\Proposal;

use App\Models\Proposal;
use App\Repositories\Base\BaseRepository;

// repository Class
class ProposalRepository extends BaseRepository implements ProposalInterface
{
    /**
     * @var Proposal
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Proposal $model)
    {
        $this->model = $model;
    }
}
