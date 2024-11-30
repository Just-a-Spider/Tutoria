class Authenticator:
    def __init__(self, strategy):
        self.strategy = strategy

    def authenticate(self, headers):
        return self.strategy.authenticate(headers)