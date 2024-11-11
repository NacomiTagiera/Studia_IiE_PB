package com.example.androidquizapp;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.os.Handler;


import androidx.appcompat.app.AppCompatActivity;

public class PromptActivity extends AppCompatActivity {
  public static final String KEY_EXTRA_ANSWER_SHOWN = "androidquizapp.answerShown";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_prompt);

    boolean correctAnswer = getIntent().getBooleanExtra(MainActivity.KEY_EXTRA_ANSWER,true);

    TextView answerTextView = findViewById(R.id.answer_text_view);
    Button showCorrectAnswerButton = findViewById(R.id.hint_button);

    showCorrectAnswerButton.setOnClickListener(v -> {
      int answer = correctAnswer ? R.string.button_true : R.string.button_false;
      answerTextView.setText(answer);
      setAnswerShownResult(true);

      new Handler().postDelayed(() -> {
        finish();
      }, 2000);
    });
  }

  private void setAnswerShownResult(boolean answerWasShown) {
    Intent resultIntent = new Intent();
    resultIntent.putExtra (KEY_EXTRA_ANSWER_SHOWN, answerWasShown);
    setResult(RESULT_OK, resultIntent);
  }
}