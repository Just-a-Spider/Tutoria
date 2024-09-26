from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json

class NotificationConsumer(AsyncJsonWebsocketConsumer):
    user_channel = 'user_user.id_channel'
    
    async def connect(self): 
        user = self.scope['user']
        user_id = self.scope['url_route']['kwargs']['user_id']
        
        if user.is_anonymous or user.id != user_id:
            await self.close()
        else:
            self.user_channel = f'user_{user_id}_channel'
            await self.channel_layer.group_add(self.user_channel, self.channel_name)
            await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.user_channel, self.channel_name)
        await super().disconnect(code)

    async def receive(self, text_data):
        data = json.loads(text_data)

    async def echo_notification(self, event):
        await self.send(text_data=json.dumps(event))