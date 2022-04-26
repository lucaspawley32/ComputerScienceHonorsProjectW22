import imp
from rest_framework import serializers
from .models import GameEntry,List
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameEntry
        fields = ('id', 'title','genre','console','service','description', 'status','owned','user')
class CreateGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameEntry
        fields = ('title','genre','console','description','service', 'status','owned')

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id', 'title','user')
class CreateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('id','title')
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
class RegisterSerializer(serializers.Serializer):
    fName = serializers.CharField(required=True)
    lName = serializers.CharField(required=True)
    email = serializers.CharField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
class AddToListSerializer(serializers.Serializer):
    game = serializers.IntegerField(required=True)
    