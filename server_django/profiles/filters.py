from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _

class RatingRangeFilter(SimpleListFilter):
    title = _('rating range')
    parameter_name = 'rating_range'

    def lookups(self, request, model_admin):
        return (
            ('0-2', _('0.0 to 2.0')),
            ('2-4', _('2.0 to 4.0')),
            ('4-5', _('4.0 to 5.0')),
        )

    def queryset(self, request, queryset):
        if self.value() == '0-2':
            return queryset.filter(rating__gte=0.0, rating__lte=2.0)
        if self.value() == '2-4':
            return queryset.filter(rating__gte=2.0, rating__lte=4.0)
        if self.value() == '4-5':
            return queryset.filter(rating__gte=4.0, rating__lte=5.0)
        return queryset