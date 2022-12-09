from .common import ConditionSerializer
from listings.serializers.common import ListingSerializer

class PopulatedConditionSerializer(ConditionSerializer):
  listings = ListingSerializer(many=True)