package com.example.androidquizapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
  private static final String TAG = "MainActivity";
  private static final String KEY_CURRENT_INDEX = "currentIndex";
  private static final int REQUEST_CODE_PROMPT = 0;
  public static final String KEY_EXTRA_ANSWER = "androidquizapp.correctAnswer";

  private final Question[] questions = new Question[] {
      new Question(R.string.q_bialowieza, false),
      new Question(R.string.q_c_high_level, true),
      new Question(R.string.q_deuter, true),
      new Question(R.string.q_jowisz, false),
      new Question(R.string.q_kosowo, false),
      new Question(R.string.q_java_js, true),
      new Question(R.string.q_krakow, false),
      new Question(R.string.q_krol, false)
  };

  private TextView questionTextView;
  private int currentIndex = 0;
  private boolean[] answers;
  private int correctAnswers = 0;
  private boolean wasAnswerShown = false;

  private void checkAnswerCorrectness(boolean userAnswer) {
    boolean correctAnswer = questions[currentIndex].isCorrectAnswer();
    int resultMessageId;

    if(wasAnswerShown) {
      resultMessageId = R.string.answer_was_shown;
    } else {
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
    wasAnswerShown = false;
  }

  @Override
  protected void onSaveInstanceState(@NonNull Bundle outState) {
    super.onSaveInstanceState(outState);
    Log.d(TAG, "Wywolana zostala metoda: onSaveInstanceState");
    outState.putInt(KEY_CURRENT_INDEX, currentIndex);
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (resultCode != RESULT_OK) return;

    if (requestCode == REQUEST_CODE_PROMPT) {
      if (data == null) return;
      wasAnswerShown = data.getBooleanExtra(PromptActivity.KEY_EXTRA_ANSWER_SHOWN, false);
    }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    Button trueButton = findViewById(R.id.true_button);
    Button falseButton = findViewById(R.id.false_button);
    Button nextButton = findViewById(R.id.next_button);
    Button promptButton = findViewById(R.id.prompt_button);
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

    promptButton.setOnClickListener(v -> {
      Intent intent = new Intent(MainActivity.this, PromptActivity.class);
      boolean correctAnswer = questions[currentIndex].isCorrectAnswer();
      intent.putExtra(KEY_EXTRA_ANSWER, correctAnswer);
      startActivityForResult(intent, REQUEST_CODE_PROMPT);
    });

    setNextQuestion();
  }

  @Override
  protected void onStart() {
    super.onStart();
    Log.d(TAG, "Wywołana została metoda cyklu życia: onStart");
  }

  @Override
  protected void onResume() {
    super.onResume();
    Log.d(TAG, "Wywołana została metoda cyklu życia: onResume");
  }

  @Override
  protected void onPause() {
    super.onPause();
    Log.d(TAG, "Wywołana została metoda cyklu życia: onPause");
  }

  @Override
  protected void onStop() {
    super.onStop();
    Log.d(TAG, "Wywołana została metoda cyklu życia: onStop");
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    Log.d(TAG, "Wywołana została metoda cyklu życia: onDestroy");
  }
}