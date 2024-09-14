from channels.generic.websocket import AsyncJsonWebsocketConsumer, WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    user_channel = 'user_user.id_channel'
    
    async def connect(self): 
        user = self.scope['user']
        print('User:', user.id)
        user_id = self.scope['url_route']['kwargs']['user_id']
        print('User ID:', user_id)
        
        if user.is_anonymous or user.id != user_id:
            print('User is anonymous or user ID does not match')
            await self.close()
        else:
            self.user_channel = f'user_{user_id}_channel'
            print('User channel:', self.user_channel)
            await self.channel_layer.group_add(self.user_channel, self.channel_name)
            await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.user_channel, self.channel_name)
        await super().disconnect(code)

    async def receive(self, text_data):
        data = json.loads(text_data)

    async def echo_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'echo.notification',
            'data': event['data'],
        }))


# class NotificationConsumer(WebsocketConsumer):
    
#     def connect(self): 
#         user = self.scope['user']
#         user_id = self.scope['url_route']['kwargs']['user_id']
        
#         if user.is_anonymous or user.id != user_id:
#             self.close()
#         else:
#             self.user_channel = f'user_{user_id}_channel'
#             async_to_sync(self.channel_layer.group_add(self.user_channel, self.user_channel))            
#             self.accept()

#     def disconnect(self, code):
#         async_to_sync(self.channel_layer.group_discard(self.user_channel, self.user_channel))
#         super().disconnect(code)

#     def receive(self, text_data):
#         data = json.loads(text_data)
#         print('Data:', data)
#         self.send(text_data=json.dumps({
#             'type': 'echo.notification',
#             'data': data['data'],
#         }))

#     def echo_notification(self, event, **kwargs):
#         print('echo_notification called with event:', event)
#         self.send(text_data=json.dumps({
#             'type': 'echo.notification',
#             'data': event['data'],
#         }))
