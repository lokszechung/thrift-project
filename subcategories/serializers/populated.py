from .common import SubcategorySerializer
from listings.serializers.common import ListingSerializer

class PopulatedSubcategorySerializer(SubcategorySerializer):
  listings = ListingSerializer(many=True)