from os import stat
from urllib import response
from django.shortcuts import render
from rest_framework import generics,status
from .models import GameEntry,List
from .serializers import GameSerializer,CreateGameSerializer,ListSerializer,CreateListSerializer,LoginSerializer,AddToListSerializer,RegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login,logout
from django.contrib.auth.models import User
from django.views import View
from django.utils.decorators import method_decorator


# Create your views here.

class GameView(generics.ListAPIView):
    queryset = GameEntry.objects.all()
    serializer_class = GameSerializer


class CreateGameView(APIView):
    serializer_class = CreateGameSerializer
    def post(self, request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                user = request.user
            else:
                return Response({'not authenticated': 'Please log in'}, status=status.HTTP_401_UNAUTHORIZED)
            title = serializer.data.get('title')
            genre = serializer.data.get('genre')
            console = serializer.data.get('console')
            service = serializer.data.get('service')
            description = serializer.data.get('description')
            Gamestatus = serializer.data.get('status')
            owned = serializer.data.get('owned')
            game = GameEntry(title=title, genre=genre, console=console,service=service, description=description, status=Gamestatus, owned=owned,user=user)
            game.save()
            return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request,id,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data.get('title')
            genre = serializer.data.get('genre')
            console = serializer.data.get('console')
            service = serializer.data.get('service')
            description = serializer.data.get('description')
            gameStatus = serializer.data.get('status')
            owned = serializer.data.get('owned')
            query = GameEntry.objects.filter(pk=id)
            if query.exists():
                game = query[0]
                game.title = title
                game.genre = genre
                game.console = console
                game.service = service
                game.description = description
                game.gameStatus = gameStatus
                game.owned = owned
                game.save()
                return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)
            else:
                return Response({'Bad Request': 'List not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request,id,format=None):
        print("id:",id)
        query = GameEntry.objects.filter(pk=id)
        if query.exists():
            game = query[0]
            game.delete()
            return Response({"message":"item deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Game not found'}, status=status.HTTP_400_BAD_REQUEST)

class UserGameView(APIView):
    serializer_class = GameSerializer
    def get(self, request,format=None):
        if request.user.is_authenticated:
            querySet = GameEntry.objects.filter(user=request.user)
            return Response(GameSerializer(querySet,many=True).data, status=status.HTTP_200_OK)
        else:
            return Response({'not authenticated': 'Please log in'}, status=status.HTTP_401_UNAUTHORIZED)

class ListView(generics.ListAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

class UserListView(APIView):
    serializer_class = ListSerializer
    def get(self, request,format=None):
        if request.user.is_authenticated:
            querySet = List.objects.filter(user=request.user)
            return Response(ListSerializer(querySet,many=True).data, status=status.HTTP_200_OK)
        else:
            return Response({'not authenticated': 'Please log in'}, status=status.HTTP_401_UNAUTHORIZED)

class CreateListView(APIView):
    serializer_class = CreateListSerializer
    def post(self, request,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                user = request.user
            else:
                return Response({'not authenticated': 'Please log in'}, status=status.HTTP_401_UNAUTHORIZED)
            title = serializer.data.get('title')
            list = List(title=title,user=user)
            list.save()
            return Response(ListSerializer(list).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request,id,format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data.get('title')
            print("title:",title)
            print("id:",id)
            query = List.objects.filter(pk=id)
            if query.exists():
                list = query[0]
                list.title = title
                list.save()
                return Response(ListSerializer(list).data, status=status.HTTP_201_CREATED)
            else:
                return Response({'Bad Request': 'List not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request,id,format=None):
        print("id:",id)
        query = List.objects.filter(pk=id)
        if query.exists():
            list = query[0]
            list.delete()
            return Response({"message":"item deleted successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'List not found'}, status=status.HTTP_400_BAD_REQUEST)
class AddToList(APIView):
    serializer_class = AddToListSerializer
    def get(self, request, id, format=None):
        query = List.objects.filter(pk=id)
        if query.exists():
            list = query[0]
            data = list.gameEntries.all()
            return Response(GameSerializer(data,many=True).data, status=status.HTTP_200_OK)
    def post(self, request, id, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            query = List.objects.filter(pk=id)
            if query.exists():
                list = query[0]
                game = serializer.data.get('game')
                list.gameEntries.add(game)
                return Response({'data':{
                                "message": 'Game added'
                                }}, status=status.HTTP_200_OK)
        return Response({'data':{
                        "message": 'data not valid'
                        }}, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, id, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            query = List.objects.filter(pk=id)
            if query.exists():
                list = query[0]
                game = serializer.data.get('game')
                list.gameEntries.remove(game)
                return Response({'data':{
                                "message": 'Game added'
                                }}, status=status.HTTP_200_OK)
        return Response({'data':{
                        "message": 'data not valid'
                        }}, status=status.HTTP_400_BAD_REQUEST)
        
#authentication views
class LoginView(APIView):
    serializer_class = LoginSerializer
    def post(self, request,format=None):
        print("request", request.data)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print('valid data')
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            print(username, password)
            user = authenticate(request, username=username, password=password)
            print(user)
            if user is not None:
                login(request,user)
                return Response({'data':{
                    "authorized": True
                }}, status=status.HTTP_202_ACCEPTED)
            return Response({'data':{
                    "authorized": False,
                    "message": "invalid user data"
                }}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'data':{
                    "authorized": False,
                    "message": 'data not valid'
                }}, status=status.HTTP_401_UNAUTHORIZED)
class RegisterView(APIView):
    serializer_class = RegisterSerializer
    def post(self, request,format=None):
        print("request", request.data)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print('valid data')
            fName = serializer.data.get('fName')
            lName = serializer.data.get('lName')
            email = serializer.data.get('email')
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            user = User.objects.create_user(username,email,password)
            user.last_name = lName
            user.first_name = fName
            user.save()
            if user is not None:
                login(request,user)
                return Response({'data':{
                    "authorized": True
                }}, status=status.HTTP_202_ACCEPTED)
            return Response({'data':{
                    "authorized": False,
                    "message": "error creating user"
                }}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'data':{
                    "authorized": False,
                    "message": 'data not valid'
                }}, status=status.HTTP_401_UNAUTHORIZED)
class LogoutView(APIView):
    def get(self, request,format=None):
        logout(request)
        return Response({"message":"Successfully logged out"})
class IsLoggedIn(APIView):
    def get(self,request,format=None):
        if request.user.is_authenticated:
            return Response({"authorized": True, "Message": "User logged in"},status=status.HTTP_200_OK)
        else:
            return Response({"authorized": False, "Message": "User not logged in"}, status=status.HTTP_401_UNAUTHORIZED)