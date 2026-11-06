
def analyze_performance(concept_scores):

    strong_concepts = []
    weak_concepts = []
    developing_concepts = []

    analysis = {}

    for concept, scores in concept_scores.items():

        correct = scores["correct"]
        total = scores["total"]

        if total <= 0 or correct < 0 or correct > total:
            raise ValueError(f"Invalid scores for {concept}")

        percentage = round((correct / total) * 100)

        if percentage >= 80:
            level = "Strong"
            strong_concepts.append(concept)

        elif percentage < 50:
            level = "Needs Practice"
            weak_concepts.append(concept)

        else:
            level = "Developing"
            developing_concepts.append(concept)

        analysis[concept] = {
            "correct": correct,
            "total": total,
            "percentage": percentage,
            "level": level
        }

    roadmap = weak_concepts + developing_concepts

    return {
        "concept_analysis": analysis,
        "strong_concepts": strong_concepts,
        "weak_concepts": weak_concepts,
        "developing_concepts": developing_concepts,
        "roadmap": roadmap
    }
