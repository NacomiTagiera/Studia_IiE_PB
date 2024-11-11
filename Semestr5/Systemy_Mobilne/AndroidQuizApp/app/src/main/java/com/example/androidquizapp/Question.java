package com.example.androidquizapp;

public class Question {
  private final int questionId;
  private final boolean correctAnswer;

  public Question(int questionId, boolean correctAnswer) {
    this.questionId = questionId;
    this.correctAnswer = correctAnswer;
  }

  public int getQuestionId() {
    return questionId;
  }

  public boolean isCorrectAnswer() {
    return correctAnswer;
  }
}

