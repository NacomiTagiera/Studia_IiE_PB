package com.example.androidquizapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

  private TextView questionTextView;

  private final Question[] questions = new Question[]{
      new Question(R.string.q_bialowieza, false),
      new Question(R.string.q_c_high_level, true),
      new Question(R.string.q_deuter, true),
      new Question(R.string.q_jowisz, false),
      new Question(R.string.q_kosowo, false),
      new Question(R.string.q_java_js, true),
      new Question(R.string.q_krakow, false),
      new Question(R.string.q_krol, false)
  };

  private int currentIndex = 0;
  private boolean[] answers;
  private int correctAnswers = 0;

  private void checkAnswerCorrectness(boolean userAnswer) {
    boolean correctAnswer = questions[currentIndex].isCorrectAnswer();
    int resultMessageId;

    if (correctAnswer == userAnswer) {
      resultMessageId = R.string.correct_answer;

      if (!answers[currentIndex]) {
        correctAnswers++;
        answers[currentIndex] = true;
      }
    } else {
      resultMessageId = R.string.incorrect_answer;

      if (answers[currentIndex]) {
        correctAnswers--;
        answers[currentIndex] = false;
      }
    }

    if (currentIndex != questions.length - 1) {
      Toast.makeText(this, resultMessageId, Toast.LENGTH_SHORT).show();
    } else {
      String finalResultMessage = getString(R.string.final_result_message, correctAnswers, questions.length);
      Toast.makeText(this, finalResultMessage, Toast.LENGTH_LONG).show();
    }
  }

  private void setNextQuestion() {
    questionTextView.setText(questions[currentIndex].getQuestionId());
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Button trueButton = findViewById(R.id.true_button);
    Button falseButton = findViewById(R.id.false_button);
    Button nextButton = findViewById(R.id.next_button);
    questionTextView = findViewById(R.id.question_text_view);

    answers = new boolean[questions.length];

    trueButton.setOnClickListener(v -> checkAnswerCorrectness(true));

    falseButton.setOnClickListener(v -> checkAnswerCorrectness(false));

    nextButton.setOnClickListener(v -> {
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        setNextQuestion();
      } else {
        nextButton.setEnabled(false);
        Toast.makeText(this, R.string.quiz_finished, Toast.LENGTH_SHORT).show();
      }
    });

    setNextQuestion();
  }
}