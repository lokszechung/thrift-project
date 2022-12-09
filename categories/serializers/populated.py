from .common import CategorySerializer
from subcategories.serializers.populated import PopulatedSubcategorySerializer

class PopulatedCategorySerializer(CategorySerializer):
  subcategories = PopulatedSubcategorySerializer(many=True)