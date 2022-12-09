from .common import ListingSerializer
from jwt_auth.serializers.common import UserSerializer

class PopulatedListingSerializer(ListingSerializer):
    owner = UserSerializer()