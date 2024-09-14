from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from posts import models

def send_notfication_to_user(user, content):
    channel_layer = get_channel_layer()
    user_channel = f'user_{user.id}_channel'
    message = {
        'type': 'echo.notification',
        'data': content,
    }
    async_to_sync(channel_layer.group_send)(user_channel, message)

# For the RequestHelpPost model
@receiver(post_save, sender=models.RequestHelpPost)
def send_notification_to_tutors(sender, instance, created, **kwargs):
    if created:
        content = f'New help request by {instance.student.user.username}'
        # Send a notification to the user
        send_notfication_to_user(instance.student.user, content)

# For the Comment model
@receiver(post_save, sender=models.Comment)
def send_notification_new_comment(sender, instance, created, **kwargs):
    if created:
        content = f'New comment by {instance.user.username} in post'
        # Send a notification to the user
        send_notfication_to_user(instance.user, content)

# For the OfferHelpPost model
@receiver(post_save, sender=models.OfferHelpPost)
def send_notification_to_students(sender, instance, created, **kwargs):
    if created:
        content = f'New offer help by {instance.tutor.user.username}'
        # Send a notification to the user
        send_notfication_to_user(instance.tutor.user, content)

# For the Comment model
@receiver(post_save, sender=models.Comment)
def send_notification_new_comment(sender, instance, created, **kwargs):
    if created:
        content = f'New comment by {instance.user.username} in post'
        # Send a notification to the user
        send_notfication_to_user(instance.user, content)
