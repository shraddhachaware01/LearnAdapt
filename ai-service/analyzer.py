
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


def analyze_practice_gaps(practice_results):
    gap_statistics = {
        "conceptual": {"correct": 0, "total": 0, "time": 0},
        "logical": {"correct": 0, "total": 0, "time": 0},
        "application": {"correct": 0, "total": 0, "time": 0}
    }

    skill_statistics = {}

    total_attempts = 0
    total_time = 0

    for attempt in practice_results:
        answers = attempt.get("answers", [])

        for answer in answers:
            gap_type = answer.get("gapType")
            skill = answer.get("skill")
            correct = answer.get("correct")
            time_taken = answer.get("timeTakenSeconds", 0)

            if gap_type not in gap_statistics:
                continue

            if not isinstance(correct, bool):
                continue

            if (
                not isinstance(time_taken, (int, float))
                or isinstance(time_taken, bool)
                or time_taken < 0
            ):
                time_taken = 0

            stats = gap_statistics[gap_type]

            stats["total"] += 1
            stats["correct"] += int(correct)
            stats["time"] += time_taken

            total_attempts += 1
            total_time += time_taken

            if skill:
                if skill not in skill_statistics:
                    skill_statistics[skill] = {
                        "correct": 0,
                        "total": 0
                    }

                skill_statistics[skill]["total"] += 1
                skill_statistics[skill]["correct"] += int(correct)

    gap_analysis = {}
    weak_gaps = []
    recommendations = []

    recommendation_map = {
        "conceptual": (
            "Revise the fundamentals and study the concept "
            "using your learning notes and videos."
        ),
        "logical": (
            "Practice step-by-step reasoning and solve "
            "questions that test understanding."
        ),
        "application": (
            "Work on practical examples and coding exercises "
            "to improve application skills."
        )
    }

    for gap_type, stats in gap_statistics.items():
        total = stats["total"]
        correct = stats["correct"]

        if total == 0:
            continue

        accuracy = round((correct / total) * 100)

        average_time = round(stats["time"] / total, 2)

        if accuracy < 60:
            status = "Needs Improvement"
            weak_gaps.append(gap_type)

            recommendations.append({
                "gap_type": gap_type,
                "message": recommendation_map[gap_type]
            })

        elif accuracy < 80:
            status = "Developing"

        else:
            status = "Strong"

        gap_analysis[gap_type] = {
            "correct": correct,
            "total": total,
            "accuracy": accuracy,
            "average_time_seconds": average_time,
            "status": status
        }

    weak_skills = []

    skill_analysis = {}

    for skill, stats in skill_statistics.items():
        accuracy = round(
            (stats["correct"] / stats["total"]) * 100
        )

        skill_analysis[skill] = {
            "correct": stats["correct"],
            "total": stats["total"],
            "accuracy": accuracy
        }

        if accuracy < 60:
            weak_skills.append(skill)

    overall_accuracy = (
        round(
            sum(
                stats["correct"]
                for stats in gap_statistics.values()
            ) / total_attempts * 100
        )
        if total_attempts > 0
        else 0
    )

    average_answer_time = (
        round(total_time / total_attempts, 2)
        if total_attempts > 0
        else 0
    )

    return {
        "total_questions_analyzed": total_attempts,
        "overall_accuracy": overall_accuracy,
        "average_answer_time_seconds": average_answer_time,
        "gap_analysis": gap_analysis,
        "weak_gaps": weak_gaps,
        "skill_analysis": skill_analysis,
        "weak_skills": weak_skills,
        "recommendations": recommendations,
        "message": (
            "Practice performance analyzed successfully."
            if total_attempts > 0
            else "Complete practice questions to generate gap analysis."
        )
    }
