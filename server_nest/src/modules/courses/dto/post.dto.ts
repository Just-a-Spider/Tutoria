export class PostDto {
  id?: string;
  title?: string;
  description?: string;
  subject?: string;
  created_at?: string;
  updated_at?: string;
  pfp_url?: string;
  student?: string;
  tutor?: string;
}

export class MyPostDto extends PostDto {
  post_type?: string;
}
