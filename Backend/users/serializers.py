from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['id'] = user.id
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['id'] = self.user.id
        data['username'] = self.user.username
        return data
