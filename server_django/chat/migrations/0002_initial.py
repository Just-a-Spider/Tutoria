# Generated by Django 5.1 on 2024-09-12 23:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('chat', '0001_initial'),
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats', to='profiles.studentprofile'),
        ),
        migrations.AddField(
            model_name='chat',
            name='tutor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats', to='profiles.tutorprofile'),
        ),
    ]
