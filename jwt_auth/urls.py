from django.urls import path
from .views import RegisterView, LoginView, UserDetailView, UserListView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('users/', UserListView.as_view()),
    path('profile/<int:pk>/', UserDetailView.as_view()),
    path('myprofile/', UserProfileView.as_view())
]