import { Config } from 'ziggy-js';

export interface Category {
    id: number;
    name: string;
    slug: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Skill {
    id: number;
    name: string;
    slug: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Job {
    data: Job;
    id: string;
    title: string;
    category_id: number;
    skills : string;
    scope_size : string;
    scope_duration : string;
    scope_experience : string;
    budget : string;
    attachments : string;
    user_id : string;
    status : string;
    description: string;
    created_at: string;
    updated_at: string;
    created_at_human: string;
    updated_at_human: string;
    created_at_human_ago: string;
    proposal_count: number;
    chat_count: number;
    public_url: string;
    client: User;

}
export interface User {
    status: string;
    image: any;
    meta_data: any;
    country: string;
    user_id: string;
    time_zone: string;
    phone: string;
    address_line3: string;
    address_line2: string;
    address_line1: string;
    last_name: any;
    first_name: any;
    id: string;
    name: string;
    email: string;
    avatar: string;
    full_name: string;
    email_verified_at: string;
    created_at: string;
    created_at_human: string;
    two_factor_authentication: boolean;
    available_connects: number;
    active_status: string;
    hire_rate: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };

    flash: {
        error: any;
        success: any;
        message: string;
        type: string;
    };
};
