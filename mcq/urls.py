from django.urls import path
from mcq.views import RandomQuestionsAPIView, test_cors

urlpatterns = [
    path('test-cors/', test_cors, name='test_cors'),
    
    path('random-questions/', RandomQuestionsAPIView.as_view(), name='random-questions'),
]

from django.urls import path



