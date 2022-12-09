from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Condition
from .serializers.populated import PopulatedConditionSerializer

# Create your views here.

class ConditionListView(APIView):

    def get(self, _request):
        conditions = Condition.objects.all()
        serialized_conditions = PopulatedConditionSerializer(conditions, many=True)
        print(serialized_conditions.data)
        return Response(serialized_conditions.data)