from django.http import JsonResponse
from django.views import View
from random import sample
from mcq.models import Question




from random import sample

class RandomQuestionsAPIView(View):
    def get(self, request):
        questions = Question.objects.order_by('?')[:5]  # Fetch five random questions
        data = []
        for question in questions:
            choices = list(question.choices.values())
            shuffled_choices = sample(choices, len(choices))  # Shuffle the choices
            data.append({
                'id': question.id,
                'question_text': question.question_text,
                'choices': shuffled_choices
            })
        return JsonResponse(data, safe=False)



from django.http import HttpResponse

def test_cors(request):
    response = HttpResponse("CORS headers working")
    return response
