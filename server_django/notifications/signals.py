from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from posts import models as p_models
from . import models as noti_models

def send_notfication_to_user(user, content):
    channel_layer = get_channel_layer()
    user_channel = f'user_{user.id}_channel'
    message = {
        'type': 'echo.notification',
        'data': content,
    }
    async_to_sync(channel_layer.group_send)(user_channel, message)

def create_and_send_notification(noti_model, user, title, content, instance_id, subinstance_id=None):
    # Create a new Notification according to the model
    noti_model.objects.create(
        title=title,
        content=content,
        instance_id=instance_id,
        subinstance_id=subinstance_id,
        user=user
    )
    # Send a notification to the user
    send_notfication_to_user(user, content)

# POSTS
# RequestHelpPost
@receiver(post_save, sender=p_models.RequestHelpPost)
def send_notification_to_tutors(sender, instance, created, **kwargs):
    if created:
        tutors = instance.course.tutors.all()
        try_out_tutors = instance.course.tutortryouts_set.all()
        content = f'Nueva petición de ayuda de {instance.student.user.username}'
        title = 'Nueva petición de ayuda'
        for tutor in tutors:
            create_and_send_notification(noti_models.TutorNotification, tutor.user, title, content, instance.id)
        for try_out_tutor in try_out_tutors:
            create_and_send_notification(
                noti_models.TutorNotification, 
                try_out_tutor.tutor.user, 
                title, 
                content, 
                instance.id
            )

# OfferHelpPost
@receiver(post_save, sender=p_models.OfferHelpPost)
def send_notification_to_students(sender, instance, created, **kwargs):
    if created:
        students = instance.course.students.all()
        content = f'Nuevo post del tutor {instance.tutor.user.username}'
        title = 'Nuevo post de tutor'
        for student in students:
            create_and_send_notification(
                noti_models.StudentNotification, 
                student.user, 
                title, 
                content, 
                instance.id
            )

#------------------------------------------------------------------------------

# COMMENTS
# For the Comment model
@receiver(post_save, sender=p_models.Comment)
def send_notification_new_comment(sender, instance, created, **kwargs):
    if created:
        content = f'Nuevo comentario de {instance.user.username} en tu post {instance.post.title}'
        title = 'Nuevo comentario'
        # If the commenter is the creator of the post, don't send a notification
        if instance.user == instance.post.student.user or instance.user == instance.post.tutor.user:
            return
        
        noti_model = noti_models.StudentNotification if isinstance(
            instance.post, p_models.RequestHelpPost
        ) else noti_models.TutorNotification
        create_and_send_notification(
            noti_model, 
            instance.post.student.user, 
            title, 
            content, 
            instance.post.course.id,
            instance.post.id
        )
