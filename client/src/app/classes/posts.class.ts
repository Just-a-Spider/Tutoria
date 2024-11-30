export class Post {
    id?: string;
    title?: string;
    description?: string;
    subject?: string;
    created_at?: string;
    updated_at?: string;
    pfp_url?: string;
}

export class RequestHelpPost extends Post {
    student?: string;
}

export class OfferHelpPost extends Post {
    tutor?: string;
}