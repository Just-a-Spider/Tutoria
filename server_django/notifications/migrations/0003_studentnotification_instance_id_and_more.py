# Generated by Django 5.1 on 2024-11-21 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0002_studentnotification_user_tutornotification_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentnotification',
            name='instance_id',
            field=models.UUIDField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='tutornotification',
            name='instance_id',
            field=models.UUIDField(default=None, null=True),
        ),
    ]
