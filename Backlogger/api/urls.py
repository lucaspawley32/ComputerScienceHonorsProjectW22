from django.contrib import admin
from django.urls import path,include
from django.views.decorators.csrf import csrf_exempt
from .views import GameView,CreateGameView, ListView, CreateListView,LoginView,UserListView,UserGameView,LogoutView,IsLoggedIn,AddToList,RegisterView

urlpatterns = [
    path('games', GameView.as_view()),
    path('create-game',CreateGameView.as_view()),
    path('update-game/<int:id>', CreateGameView.as_view()),
    path('delete-game/<int:id>', CreateGameView.as_view()),
    path('get-games-by-user',UserGameView.as_view()),
    path('lists', ListView.as_view()),
    path('create-list',csrf_exempt(CreateListView.as_view())),
    path('get-list-by-user',UserListView.as_view()),
    path('update-list/<int:id>', CreateListView.as_view()),
    path('delete-list/<int:id>', CreateListView.as_view()),
    path('login',LoginView.as_view()),
    path('register',RegisterView.as_view()),
    path('logout',LogoutView.as_view()),
    path('check-auth',IsLoggedIn.as_view()),
    path('add-to-list/<int:id>',AddToList.as_view())
]