# Generated by Django 5.1 on 2024-08-28 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TutorProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='tutor_profile_pictures')),
                ('bio', models.TextField()),
                ('rating', models.FloatField(default=0.0)),
                ('helped', models.IntegerField(default=0)),
            ],
            options={
                'verbose_name': 'tutor profile',
                'verbose_name_plural': 'tutor profiles',
            },
        ),
        migrations.CreateModel(
            name='StudentProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='profile_pictures')),
                ('linked_courses', models.ManyToManyField(to='courses.course')),
            ],
            options={
                'verbose_name': 'profile',
                'verbose_name_plural': 'profiles',
            },
        ),
    ]
