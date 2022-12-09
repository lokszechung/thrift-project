from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Category
from .serializers.populated import PopulatedCategorySerializer

# Create your views here.

class CategoryListView(APIView):

    def get(self, _request):
        categories = Category.objects.all()
        serialized_categories = PopulatedCategorySerializer(categories, many=True)
        print(serialized_categories.data)
        return Response(serialized_categories.data)