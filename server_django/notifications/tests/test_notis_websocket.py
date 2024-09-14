import pytest
from channels.testing import WebsocketCommunicator
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from server.asgi import application
from notifications.models import StudentNotification, TutorNotification
from profiles.models import TutorProfile, StudentProfile

TEST_CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

WS_PREFIX = 'ws/notifications/'

@database_sync_to_async
def create_users_and_profiles(username, email, password, username_2, email_2, password_2):
    user = get_user_model().objects.create_user(
        username=username,
        email=email,
        password=password
    )
    tutor_profile = TutorProfile.objects.create(
        user=user,
        bio='Test bio'
    )
    user_2 = get_user_model().objects.create_user(
        username=username_2,
        email=email_2,
        password=password_2
    )
    student_profile = StudentProfile.objects.create(
        user=user_2
    )
    
    token = AccessToken.for_user(user)
    return user, token

@pytest.mark.asyncio
@pytest.mark.django_db(transaction=True) 
class TestWebSocket:
    async def test_can_connect_to_server(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        _, access = await create_users_and_profiles(
            'jonedoe', 'test.user@udh.edu.pe', 'Test0116p',
            'janedoe', 'test.user2@udh.edu.pe','Test0116p1'
        )
        communicator = WebsocketCommunicator(application, f'{WS_PREFIX}{_.id}/')
        communicator.scope['headers'].append(
            (b'cookie', f'access_token={access}'.encode())
        )
        
        connected, _ = await communicator.connect()
        assert connected is True
        await communicator.disconnect()

    async def test_can_receive_notifications(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_users_and_profiles(
            'jonedoe', 'test.user@udh.edu.pe', 'Test0116p',
            'janedoe', 'test.user2@udh.edu.pe','Test0116p1'
        )
        communicator = WebsocketCommunicator(application, f'{WS_PREFIX}{user.id}/')
        communicator.scope['headers'].append(
            (b'cookie', f'access_token={access}'.encode())
        )
        connected, _ = await communicator.connect()
        assert connected is True
        # Send a notification message to the group
        message = {
            'type': 'echo.notification',
            'data': 'This is a test notification.',
        }
        channel_layer = get_channel_layer()
        await channel_layer.group_send(f'user_{user.id}_channel', message)
        # Receive the message from the WebSocket
        response = await communicator.receive_json_from()
        assert response == message
        # Disconnect the WebSocket
        await communicator.disconnect()
        

    async def test_cannot_connect_to_server(self, settings):
        settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
        user, access = await create_users_and_profiles(
            'jonedoe', 'test.user@udh.edu.pe', 'Test0116p',
            'janedoe', 'test.user2@udh.edu.pe','Test0116p1'
        )
        communicator = WebsocketCommunicator(application, f'{WS_PREFIX}{user.id}/')
        connected, _ = await communicator.connect()
        assert connected is False
        await communicator.disconnect()

    # async def test_can_send_and_receive_broadcast_messages(self, settings):
    #     settings.CHANNEL_LAYERS = TEST_CHANNEL_LAYERS
    #     _, access, chat_id = await create_users_and_chat(
    #         'jonedoe', 'test.user@udh.edu.pe', 'Test0116p',
    #         'janedoe', 'test.user2@udh.edu.pe','Test0116p1'
    #     )
    #     communicator = WebsocketCommunicator(application, f'{WS_PREFIX}{chat_id}/')
    #     communicator.scope['headers'].append(
    #         (b'cookie', f'access_token={access}'.encode())
    #     )
        
    #     connected, _ = await communicator.connect()
    #     message = {
    #         'type': 'echo.message',
    #         'data': 'This is a test message.',
    #     }
    #     channel_layer = get_channel_layer()
    #     await channel_layer.group_send('test', message=message)
    #     response = await communicator.receive_json_from()
    #     assert response == message
    #     await communicator.disconnect()
