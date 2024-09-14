from channels.generic.websocket import AsyncJsonWebsocketConsumer

class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self): 
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            chat_id = self.scope['url_route']['kwargs']['chat_id']
            await self.channel_layer.group_add(
                group=f'chat_{chat_id}',
                channel=self.channel_name
            )
            await self.accept()

    async def disconnect(self, code):
        await super().disconnect(code)

    async def echo_message(self, message): # new
        await self.send_json({
            'type': message.get('type'),
            'data': message.get('data'),
        })

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'echo.message':
            await self.echo_message(content)
