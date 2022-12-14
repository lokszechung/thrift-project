from .common import UserSerializer
from listings.serializers.common import ListingSerializer

class PopulatedUserSerializer(UserSerializer):
  listings = ListingSerializer(many=True)