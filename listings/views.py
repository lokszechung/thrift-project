from django.shortcuts import render
from .models import Listing
from .serializers.common import ListingSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

# Create your views here.

class ListingListView(APIView):

    # endpoint: /listings/
    # description: return all listings to the user
    def get(self, _request):
        listings = Listing.objects.all()
        print('listings -> ', listings)
        serialized_listings = ListingSerializer(listings, many=True)
        print('serialized_listings.data -> ', serialized_listings.data)
        return Response(serialized_listings.data)

    # endpoint: /listings/
    # description: using request body, add new listing to listing table
    def post(self, request):
        print(request.data)
        listing_to_add = ListingSerializer(data=request.data)
        try:
            if listing_to_add.is_valid():
                print(listing_to_add)
                listing_to_add.save()
                return Response(listing_to_add.data, status.HTTP_201_CREATED)
            print(listing_to_add.errors)
            return Response(listing_to_add.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)



class ListingDetailView(APIView):

    # custom generic get funciton for 1 listing
    def get_listing(self, pk):
        print('pk -> ', pk)
        try:
          return Listing.objects.get(pk=pk)
        except Listing.DoesNotExist as e:
            raise NotFound(str(e))
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    # endpoint: /listings/:pk
    # description: capture pk passed in url of request and use it to return specific listing
    def get(self, _request, pk):
        listing = self.get_listing(pk)
        serialized_listing = ListingSerializer(listing)
        return Response(serialized_listing.data)

    # endpoint: /listings/:pk
    # description: take user data in the instance and validate updates before saving
    def put(self, request, pk):
        listing = self.get_listing(pk)
        try:
            serialized_listing_to_update = ListingSerializer(listing, request.data, partial=True)
            if serialized_listing_to_update.is_valid(): 
                serialized_listing_to_update.save()
                return Response(serialized_listing_to_update.data, status.HTTP_202_ACCEPTED)
            print(serialized_listing_to_update.errors)
            return Response(serialized_listing_to_update.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

    # endpoint: /listings/:pk
    # description: delete a listing
    def delete(self, _request, pk):
        listing_to_delete = self.get_listing(pk)
        try:
            listing_to_delete.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Listing.DoesNotExist as e:
            raise NotFound(str(e))   
        except Exception as e:
            return Response(str(e), status.HTTP_500_INTERNAL_SERVER_ERROR)

