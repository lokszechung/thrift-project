from django.urls import path
from .views import ListingListView, ListingDetailView

urlpatterns = [
    path('', ListingListView.as_view()),
    path('<int:pk>/', ListingDetailView.as_view())
]