
# LearnAdapt AI — Adaptive Engine Rules

## 1. Calculate Concept Scores
- Check each student's answer against the correct answer.
- Group questions by concept.
- Count correct answers and total questions for each concept.
- Calculate the percentage for each concept.

## 2. Classify Learning Levels
- Below 50%: Weak
- 50% to below 80%: Medium
- 80% to 100%: Strong

## 3. Generate the Personalized Roadmap
- Identify concepts that are weak.
- Add weak concepts to the roadmap first.
- Check whether each concept has prerequisites.
- Add non-strong prerequisites before the concept that depends on them.
- Avoid adding the same concept more than once.
- Skip strong concepts.
- Add medium-level concepts after weak concepts.

## 4. Test the Engine
- Student 1: Weak in Promise Basics and Promise States.
- Student 2: Weak in Then & Catch.
- Student 3: Strong in all five concepts.
- Verify that each student receives an appropriate roadmap.

## 5. Current Scope
- Subject: JavaScript
- Topics: Promise Basics, Promise States, Then & Catch, Async/Await, Error Handling.
- The current engine uses rule-based logic to analyze quiz scores and generate a roadmap.
