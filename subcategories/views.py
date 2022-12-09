from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Subcategory
from .serializers.populated import PopulatedSubcategorySerializer

# Create your views here.

class SubcategoryListView(APIView):

    def get(self, _request):
        subcategories = Subcategory.objects.all()
        serialized_subcategories = PopulatedSubcategorySerializer(subcategories, many=True)
        print(serialized_subcategories.data)
        return Response(serialized_subcategories.data)