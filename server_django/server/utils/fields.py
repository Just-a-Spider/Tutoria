import uuid
from django.db import models
from django import forms

def short_uuid():
    custom_uuid = str(uuid.uuid4())[:16]
    return custom_uuid

class ShortUUIDField(models.UUIDField):
    def __init__(self, *args, **kwargs):
        kwargs['default'] = short_uuid
        kwargs['editable'] = False
        kwargs['unique'] = True
        kwargs['max_length'] = 16
        super().__init__(*args, **kwargs)

    def formfield(self, **kwargs):
        return super().formfield(**{
            'form_class': forms.CharField,
            **kwargs,
        })

    def get_internal_type(self):
        return 'CharField'

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        del kwargs['default']
        del kwargs['editable']
        del kwargs['unique']
        del kwargs['max_length']
        return name, path, args, kwargs