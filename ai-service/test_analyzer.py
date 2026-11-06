from analyzer import analyze_performance

student_scores = {
    "Promise Basics": {"correct": 9, "total": 10},
    "Promise States": {"correct": 8, "total": 10},
   "Then & Catch": {"correct": 4, "total": 10},
    "Async / Await": {"correct": 3, "total": 10},
    "Error Handling": {"correct": 7, "total": 10}
}

result = analyze_performance(student_scores)

print(result)