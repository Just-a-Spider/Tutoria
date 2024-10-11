from django.contrib.admin import SimpleListFilter

class PostTypeFilter(SimpleListFilter):
    title = 'Post Type'
    parameter_name = 'post_type'

    def lookups(self, request, model_admin):
        return (
            ('request_help', 'Request Help Post'),
            ('offer_help', 'Offer Help Post'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'request_help':
            return queryset.filter(content_type__model='requesthelppost')
        elif self.value() == 'offer_help':
            return queryset.filter(content_type__model='offerhelppost')
        return queryset