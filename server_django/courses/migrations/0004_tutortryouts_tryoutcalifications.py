# Generated by Django 5.1 on 2024-09-23 14:37

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_coursestudents_student_course_students_and_more'),
        ('profiles', '0002_remove_studentprofile_linked_courses_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='TutorTryOuts',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('last_tryout', models.DateTimeField(auto_now=True)),
                ('tryouts_left', models.IntegerField(default=3)),
                ('calification', models.FloatField(default=0.0)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profiles.tutorprofile')),
            ],
            options={
                'verbose_name': 'tutor tryout',
                'verbose_name_plural': 'tutor tryouts',
                'db_table': 'tutor_tryouts',
            },
        ),
        migrations.CreateModel(
            name='TryOutCalifications',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('calification', models.FloatField()),
                ('feedback', models.TextField()),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='profiles.studentprofile')),
                ('tryout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.tutortryouts')),
            ],
            options={
                'verbose_name': 'tryout calification',
                'verbose_name_plural': 'tryout califications',
                'db_table': 'tryout_califications',
            },
        ),
    ]
